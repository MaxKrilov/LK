import Vue from 'vue'
import Component from 'vue-class-component'
import { ICustomerProduct, IAvailableFunds } from '@/tbapi'
import * as d3 from 'd3'
import moment from 'moment'
import { tweenText } from '@/components/pages/internet/functions/animation'
import { price } from '@/functions/filters'
import InfolistViewer from './components/InfolistViewer/index.vue'
import { getLastElement, uniq } from '@/functions/helper'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { OFFER_LINKS } from '@/constants/url'
import { mapActions } from 'vuex'

const SPEED_N_LIMIT_WIDTH = 104
const STROKE_WIDTH = 2

const CURRENT_SPEED_IN_CHARS = 'Скорость доступа, до (Мбит/с)'
const CURRENT_SPEED_IN_CHARS_2 = 'Скорость доступа, входящая, до (Мбит/с)'
const OFFER_CODE_SPEED_INCREASE = 'INTBEZLIM'
const OFFER_CODE_TEMP_SPEED_INCREASE = 'SPEEDUP'

const CHARS_SPEED_INCREASE = CURRENT_SPEED_IN_CHARS
const CHARS_TURBO_SPEED_INCREASE = 'Увеличение скорости ДО (Мбит/с)'

const CHARS_TOTAL_TRAFFIC = 'Объем включенного трафика, Гб'

const CHARS_AUTH_TYPE = 'Тип авторизации'

const CHAR_START_DATE_TURBO = 'Дата активации'
const CHAR_STOP_DATE_TURBO = 'Дата окончания'

const arc = d3.arc()
  .startAngle(0)
  .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
  .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof TariffComponent>>({
  components: {
    InfolistViewer,
    SpeedComponent,
    ErActivationModal,
    ErDisconnectProduct,
    ErPlugProduct
  },
  filters: {
    price
  },
  props: {
    customerProduct: {
      type: Object,
      default: null
    },
    isLoadingCustomerProduct: Boolean,
    locationId: [String, Number],
    addressId: [String, Number],
    fullAddress: String,
    marketId: String
  },
  watch: {
    customerProduct (val) {
      if (val) {
        this.generateSpeedChart()
        this.getBillingPacket()
        this.initSpeedComponent()
      }
    },
    isShowOfferDialog (val) {
      !val && this.isOffering && this.cancelSailOrder()
    }
  },
  methods: {
    ...mapActions({
      getAvailableFunds: 'salesOrder/getAvailableFunds'
    })
  }
})
export default class TariffComponent extends Vue {
  $refs!: {
    'speed-component': InstanceType<typeof SpeedComponent>
  }
  // Props
  readonly customerProduct!: ICustomerProduct | null
  readonly isLoadingCustomerProduct!: boolean
  readonly locationId!: number | string
  readonly addressId!: number | string
  readonly fullAddress!: string
  readonly marketId!: string

  // Vuex Methods
  getAvailableFunds!: <R = Promise<IAvailableFunds>>() => R

  // Data
  isBlur = false
  isShowInfolistViewer = false
  internetSpeed = this.currentSpeed
  isTurboActivation = false
  turboPeriod: Date[] = []
  isInfinity = false

  packetInfo: Record<string, any> = {}

  isLoadingConnect = false
  isShowOfferDialog = false
  isShowErrorDialog = false
  isShowSuccessDialog = false

  isDisconnectionTurbo = false

  isOffering = false
  isOffer = false
  isOfferAccepting = false

  offerLink = OFFER_LINKS.internet

  errorText = ''

  availableFundsAmt: number = 0
  isShowMoneyModal: boolean = false
  isErrorMoney: boolean = false
  lazyPriceIncrease: number = 0

  isShowModalForChangeAuthType: boolean = false

  // Computed
  /**
   * Дата активации тарифа
   */
  get actualStartDate () {
    return this.customerProduct && this.customerProduct.tlo && this.customerProduct.tlo.actualStartDate
      ? moment(this.customerProduct.tlo.actualStartDate).format('D MMMM YYYY')
      : null
  }

  /**
   * Имя тарифного плана
   */
  get offerOriginalName () {
    return this.customerProduct?.tlo?.offer?.originalName || null
  }

  /**
   * Текущая скорость
   */
  get currentSpeed () {
    return this.customerProduct
      ? Number((this.customerProduct.tlo.chars[CURRENT_SPEED_IN_CHARS] || this.customerProduct.tlo.chars[CURRENT_SPEED_IN_CHARS_2]).replace(/[\D]+/g, ''))
      : null
  }

  /**
   * Максимальная доступная скорость для смены
   */
  get maxAvailableSpeedIncrease () {
    return this.customerProduct
      ? getLastElement(this.listAvailableSpeedIncrease)?.speed
      : null
  }

  /**
   * Проверка - доступен ли турбо-режим для подключения
   * Возвращает элемент SLO, если доступен или false в противном случае
   */
  get isAvailableTurbo () {
    return this.customerProduct?.slo?.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE) || false
  }

  /**
   * Возвращает продуктовые предложения по смене скорости в случае их наличия
   * или false в противном случае
   */
  get isAvailableSpeedIncrease () {
    return this.customerProduct?.tlo?.offer?.prices || false
  }

  /**
   * Список доступных скоростей
   */
  get listAvailableSpeedIncrease () {
    if (!this.customerProduct) return []
    if (this.isTurboActivation && this.isAvailableTurbo) {
      return this.isAvailableTurbo.prices
        .map(price => this.__mapAvailableSpeed(price, CHARS_TURBO_SPEED_INCREASE))
        .sort((a, b) => a.speed - b.speed)
    } else if (!this.isTurboActivation && this.isAvailableSpeedIncrease) {
      return uniq(
        this.isAvailableSpeedIncrease
          .map(price => this.__mapAvailableSpeed(price, CHARS_SPEED_INCREASE))
          .sort((a, b) => a.speed - b.speed)
          .filter(price => price.speed > (this.currentSpeed || 0)),
        'speed'
      ) as Array<{ id: string, amount: number, speed: number }>
    } else {
      return [] as Array<{ id: string, amount: number, speed: number }>
    }
  }

  /**
   * Проверка - подключен ли Турбо-режим
   */
  get isOnTurbo () {
    return this.customerProduct
      ? this.customerProduct.slo.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE)?.activated
      : false
  }

  /**
   * Валюта для расчётов
   */
  get currencyCode () {
    return this.customerProduct
      ? this.customerProduct.tlo.purchasedPrices.recurrentTotal.currency.currencyCode
      : '₽'
  }

  /**
   * Абонентская плата за Интернет
   */
  get recurrentTotal () {
    return this.customerProduct
      ? Number(this.customerProduct.tlo.purchasedPrices.recurrentTotal.value)
      : 0
  }

  get parentId () {
    return this.customerProduct
      ? this.customerProduct.tlo.id
      : ''
  }

  get turboPrice () {
    return this.isOnTurbo
      ? this.customerProduct!.slo.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE)!
        .purchasedPrices?.recurrentTotal?.value || 0
      : 0
  }

  get priceAfterIncrease () {
    if (!this.customerProduct) return 0
    if (!this.internetSpeed || this.internetSpeed === this.currentSpeed) return this.recurrentTotal
    return this.listAvailableSpeedIncrease.find((speed: any) => speed.speed === this.internetSpeed)!.amount
  }

  get connectTitle () {
    return this.isTurboActivation
      ? `Вы уверены, что хотите временно увеличить скорость до ${this.internetSpeed} Мбит/с`
      : `Вы уверены, что хотите увеличить скорость до ${this.internetSpeed} Мбит/с`
  }

  get connectActionButtonText () {
    return this.isTurboActivation
      ? `Подключить`
      : `Изменить`
  }

  get turboPriceAfterIncrease () {
    if (!this.customerProduct || !this.isTurboActivation) return 0
    if (this.isInfinity) {
      return this.priceAfterIncrease
    }
    const [from, to] = this.turboPeriod
    const diff = Math.ceil(Math.abs(to.getTime() - from.getTime()) / (1000 * 3600 * 24))
    const daysInMonth = (new Date(from.getFullYear(), from.getMonth() + 1, 0)).getDate()

    return this.priceAfterIncrease / daysInMonth * diff
  }

  get offerIdTLO () {
    return this.customerProduct?.tlo?.offer.id || ''
  }

  get offerIdTurbo () {
    return this.isAvailableTurbo
      ? this.isAvailableTurbo.id
      : ''
  }

  get turboDetails (): Record<string, string> {
    if (!this.isOnTurbo || !this.isAvailableTurbo) return {}
    return {
      locationId: this.locationId as string,
      bpi: this.parentId,
      productId: this.isAvailableTurbo.productId,
      title: 'Вы уверены, что хотите отключить Турбо-режим?',
      marketId: this.marketId
    }
  }

  get getTurboPeriod () {
    if (this.isAvailableTurbo && this.isAvailableTurbo.status?.toLowerCase() === 'active') {
      const { startDate, endDate } = this.isAvailableTurbo
      if (startDate && endDate) {
        return `${moment(startDate).format('DD.MM.YYYY')} - ${moment(endDate).format('DD.MM.YYYY')}`
      } else {
        return 'Бессрочно'
      }
    }
    return ''
  }

  get getAuthType () {
    return this.customerProduct == null
      ? ''
      : this.customerProduct.tlo.chars[CHARS_AUTH_TYPE]
  }

  get getAuthTypeForChange () {
    return this.customerProduct == null
      ? ''
      : this.customerProduct.tlo.chars[CHARS_AUTH_TYPE] === 'PPPoE' ? 'IPoE' : 'PPPoE'
  }

  get getRequestDataForChangeAuthType () {
    return {
      descriptionModal: 'Для смены Интернет-протокола нужно сформировать заявку на вашего персонального менеджера',
      addressId: this.addressId,
      services: this.customerProduct ? this.customerProduct.tlo.name : '',
      fulladdress: this.fullAddress,
      type: 'change-auth-type',
      authType: this.customerProduct?.tlo.chars[CHARS_AUTH_TYPE]
    }
  }

  // Methods
  generateLoadingDonut (selector: string) {
    const svg = d3.select(selector)
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)
  }

  getBillingPacket () {
    if (!this.customerProduct) return
    this.$store.dispatch('productnservices/billingPacket', {
      api: this.$api,
      product: this.customerProduct.tlo.id
    })
      .then(response => {
        this.packetInfo = response
        this.generateLimitChart()
      })
  }

  getInfoList () {
    this.isShowInfolistViewer = true
  }

  generateSpeedChart () {
    // Текущая скорость
    const speed = this.currentSpeed!
    // Скорость турбо-режима
    const turboSpeed = this.isOnTurbo && this.isAvailableTurbo
      ? Number(this.isAvailableTurbo.chars[CHARS_TURBO_SPEED_INCREASE].replace(/[\D]+/, ''))
      : 0
    // Время отрисовки текста
    const textDuration = 1000
    // Время отрисовки скорости
    const speedDuration = !this.isAvailableTurbo
      ? 1000
      : speed / turboSpeed * 1000
    // Время отрисовки Турбо-режима
    const turboDuration = !this.isAvailableTurbo
      ? 0
      : 1000 - speedDuration
    let speedPercentage = speed * 0.875 / (this.maxAvailableSpeedIncrease || speed)
    speedPercentage = speedPercentage > 0.875 ? 0.875 : speedPercentage
    // // Следует очистить предыдущий график
    document.querySelector('.tariff-component__speed .chart')!.innerHTML = ''
    const svg = d3.select('.tariff-component__speed .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)
    const foreground = svg.append('path')
      .datum({ endAngle: speedPercentage * 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', '#FFDD00')
      // @ts-ignore
      .attr('d', arc)
    foreground
      .transition()
      .duration(speedDuration)
      .attrTween('d', function (d: any) {
        const start = { startAngle: 0, endAngle: speedPercentage * 2 * Math.PI }
        const interpolate = d3.interpolate(start, d)
        return function (t: number) {
          return arc(interpolate(t))
        }
      })

    if (this.isOnTurbo) {
      if (!this.isAvailableTurbo) return
      let turboSpeedPercentage = turboSpeed * 0.875 / (this.maxAvailableSpeedIncrease || turboSpeed)
      turboSpeedPercentage = turboSpeedPercentage > 0.875 ? 0.875 : turboSpeedPercentage

      const tArc = d3.arc()
        .startAngle(speedPercentage * 2 * Math.PI)
        .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
        .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)

      const turboForeground = svg.append('path')
        .datum({ endAngle: turboSpeedPercentage * 2 * Math.PI })
        .attr('fill', 'none')
        .attr('stroke-width', STROKE_WIDTH)
        .attr('stroke', '#69BE28')
        // @ts-ignore
        .attr('d', tArc)

      turboForeground
        .transition()
        .delay(speedDuration)
        .duration(turboDuration)
        .attrTween('d', function (d: any) {
          const start = { startAngle: 0, endAngle: 0 }
          const interpolate = d3.interpolate(start, d)
          return function (t: number) {
            return tArc(interpolate(t))
          }
        })
    }

    const text = svg.append('g')
      .classed('text', true)

    text.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .classed('top', true)
      .text('0')

    text.select('.top')
      .transition()
      // .delay(300)
      .duration(textDuration)
      .tween('text', tweenText(
        this.isOnTurbo && this.isAvailableTurbo
          ? Number(this.isAvailableTurbo.chars[CHARS_TURBO_SPEED_INCREASE].replace(/[\D]+/, ''))
          : speed
      ))

    text.append('text')
      .attr('x', 0)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .classed('bottom', true)
      .text('Мбит/с')
  }

  generateLimitChart () {
    const isLimit = this.customerProduct?.tlo.chars?.hasOwnProperty(CHARS_TOTAL_TRAFFIC) || false
    const limit = isLimit ? Number(this.customerProduct!.tlo.chars[CHARS_TOTAL_TRAFFIC]) : 0
    const spentTraffic = isLimit ? Number(this.packetInfo?.spent) : 0
    const wastedPercentage = isLimit
      ? (limit - spentTraffic) * 0.875 / limit
      : 0
    // Следует очистить предыдущий график
    document.querySelector('.tariff-component__limit .chart')!.innerHTML = ''
    const svg = d3.select('.tariff-component__limit .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)
    const foreground = svg.append('path')
      .datum({ endAngle: wastedPercentage * 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', '#FFDD00')
      // @ts-ignore
      .attr('d', arc)
    foreground
      .transition()
      .delay(300)
      .duration(1000)
      .attrTween('d', function (d: any) {
        const start = { startAngle: 0, endAngle: 0 }
        const interpolate = d3.interpolate(start, d)
        return function (t: number) {
          return arc(interpolate(t))
        }
      })
    // todo Сделать зависимость от того, безлимитный ли у нас трафик
    // eslint-disable-next-line no-constant-condition
    if (!isLimit) {
      const text = svg.append('g')
        .classed('text', true)
      text.append('text')
        .attr('x', 0)
        .attr('y', 6)
        .attr('text-anchor', 'middle')
        .classed('infinite', true)
        .text('∞')
    } else {
      const text = svg.append('g')
        .classed('text', true)
      text.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .classed('top', true)
        .text('0')
      text.select('.top')
        .transition()
        .delay(300)
        .duration(1000)
        .tween('text', tweenText(limit - spentTraffic))
      text.append('text')
        .attr('x', 0)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .classed('dash', true)
        .text('—')

      text.append('text')
        .attr('x', 0)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .classed('bottom', true)
        .text(limit)
        .append('tspan')
        .text(' Гб')
    }
  }

  openBlur (isTurbo = false) {
    if (isTurbo) {
      this.isTurboActivation = true
      this.internetSpeed = getLastElement(this.listAvailableSpeedIncrease).speed
      this.initSpeedComponent()
      // Устанавливаем период в 1 день
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.turboPeriod = [
        today,
        tomorrow
      ]
    }
    this.$nextTick(() => { this.isBlur = true })
  }

  closeBlur () {
    this.isBlur = false
    this.isTurboActivation = false
    this.internetSpeed = this.currentSpeed
    this.initSpeedComponent()
  }

  initSpeedComponent () {
    this.$nextTick(() => {
      (this.$refs['speed-component'] as any).init()
    })
  }

  createSaleOrder () {
    if (!this.locationId || !this.customerProduct) return

    const locationId = this.locationId
    const bpi = this.customerProduct.tlo.id

    if (!bpi) return

    const offerId = this.isTurboActivation
      ? this.offerIdTurbo
      : this.offerIdTLO

    if (!offerId) return

    const choosingInternetSpeed = this.internetSpeed
    let char: Record<string, string> | Record<string, string>[] = {}
    let _price: number = 0
    if (this.isTurboActivation) {
      if (!this.isAvailableTurbo) return

      const price = this.isAvailableTurbo.prices
        .find(price => price.chars && price.chars.hasOwnProperty(CHARS_TURBO_SPEED_INCREASE) &&
          Number(price.chars[CHARS_TURBO_SPEED_INCREASE].replace(/[\D]+/g, '')) === choosingInternetSpeed)
      if (!price) return
      char = {
        [CHARS_TURBO_SPEED_INCREASE]: price.chars[CHARS_TURBO_SPEED_INCREASE]
      }
      if (!this.isInfinity) {
        const [from, to] = this.turboPeriod
        char[CHAR_START_DATE_TURBO] = moment(from).utcOffset(180).format()
        char[CHAR_STOP_DATE_TURBO] = moment(to).utcOffset(180).format()
      }
      _price = Number(price.amount)
    } else {
      if (!this.isAvailableSpeedIncrease) return

      const price = this.isAvailableSpeedIncrease
        .find(price => price.chars && price.chars.hasOwnProperty(CHARS_SPEED_INCREASE) &&
          Number(price.chars[CHARS_SPEED_INCREASE].replace(/[\D]+/g, '')) === choosingInternetSpeed)
      if (!price) return
      char[CHARS_SPEED_INCREASE] = price.chars[CHARS_SPEED_INCREASE]
      _price = Number(price.amount)
    }

    this.lazyPriceIncrease = _price

    this.isLoadingConnect = true

    if (this.isTurboActivation) {
      this.$store.dispatch('salesOrder/createSaleOrder', {
        locationId,
        bpi,
        offerId,
        chars: char,
        productCode: OFFER_CODE_TEMP_SPEED_INCREASE,
        marketId: this.marketId
      })
        .then(() => {
          this.isShowOfferDialog = true
          this.isOffering = true
        })
        .catch(() => {
          this.isShowErrorDialog = true
        })
        .finally(() => {
          this.isLoadingConnect = false
        })
    } else {
      this.getAvailableFunds()
        .then(response => {
          const availableFunds = Number(response.availableFundsAmt)
          this.availableFundsAmt = availableFunds

          if (availableFunds - _price > 0) {
            this.$store.dispatch(
              `salesOrder/createModifyOrder`,
              {
                locationId,
                bpi,
                offerId,
                chars: char,
                productCode: OFFER_CODE_SPEED_INCREASE,
                marketId: this.marketId
              })
              .then(() => {
                this.isShowOfferDialog = true
                this.isOffering = true
              })
              .catch(() => {
                this.isShowErrorDialog = true
              })
              .finally(() => {
                this.isLoadingConnect = false
              })
          } else {
            this.isShowMoneyModal = true
          }
        })
        .catch(() => {
          this.isShowErrorDialog = true
          this.isLoadingConnect = false
        })
    }
  }

  sendSailOrder () {
    if (!this.isOffer) return
    const offerAcceptedOn = moment().format()
    this.isOfferAccepting = true
    this.$store.dispatch('salesOrder/send', { offerAcceptedOn })
      .then((response) => {
        const result = response.submit_statuses[0]
        if (result.submitStatus.toLowerCase() === 'success') {
          this.isShowSuccessDialog = true
          setTimeout(() => {
            this.$emit('update')
            this.isBlur = false
          }, 1000)
        } else if (result.submitStatus.toLowerCase() === 'failed') {
          this.errorText = result.submitError?.replace(/<\/?[^>]+>/g, '')
          this.isShowErrorDialog = true
        }
      })
      .catch(() => {
        this.isShowErrorDialog = true
      })
      .finally(() => {
        this.isOfferAccepting = false
        this.isOffering = false
        this.$nextTick(() => {
          this.isShowOfferDialog = false
        })
      })
  }

  cancelSailOrder () {
    this.$store.dispatch('salesOrder/cancel')
      .finally(() => {
        this.isOffering = false
        this.isOffer = false
      })
  }

  __mapAvailableSpeed (elementPrice: any, chars: string) {
    return {
      id: elementPrice.id,
      amount: Number(elementPrice.amount),
      speed: elementPrice.chars && elementPrice.chars.hasOwnProperty(chars)
        ? Number(elementPrice.chars[chars].replace(/[\D]+/g, ''))
        : 0
    }
  }

  onToPayment () {
    this.$router.push({
      name: 'add-funds',
      params: {
        total_amount: this.lazyPriceIncrease
          ? String(this.lazyPriceIncrease - this.availableFundsAmt)
          : '0'
      }
    })
  }

  // Hooks
  mounted () {
    this.generateLoadingDonut('.tariff-component__speed .chart-loading')
    this.generateLoadingDonut('.tariff-component__limit .chart-loading')
  }
}
