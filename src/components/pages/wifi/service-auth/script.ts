import Component, { mixins } from 'vue-class-component'

// Helpers
import Page, { iPageComponent } from '@/components/helpers/Page'

// Components
import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import ErtWifiServiceAuthItem from './components/service-auth-item/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

// Utils
import { SERVICES_AUTH } from '@/components/pages/wifi/index/constants'
import { head } from 'lodash'
import { ServiceStatus, STATUS_DISCONNECTED } from '@/constants/status'
import { price as priceFormatted } from '@/functions/filters'
import { mapActions } from 'vuex'
import { IAvailableFunds } from '@/tbapi'

@Component<InstanceType<typeof ErtWifiServiceAuth>>({
  components: {
    ErListPoints,
    ErtWifiServiceAuthItem,
    ErPlugProduct,
    ErDisconnectProduct,
    ErActivationModal
  },
  filters: {
    priceFormatted
  },
  watch: {
    listPoint () {
      this.$nextTick(() => {
        this.isLoadingListPoint = false
      })
    },
    customerProduct (val) {
      val && this.$nextTick(() => {
        this.isLoadingCustomerProduct = false
        this.$store.dispatch('wifi/getResource', {
          bpi: this.activePoint!.bpi
        })
      })
    },
    activePoint (newVal, oldVal) {
      if (!newVal || !oldVal) return
      this.isLoadingCustomerProduct = true
      Page.options.watch.activePoint.call(this, newVal, oldVal)
    }
  },
  methods: {
    ...mapActions({
      getAvailableFunds: 'salesOrder/getAvailableFunds'
    })
  }
})
export default class ErtWifiServiceAuth extends mixins(Page) implements iPageComponent {
  productType = 'Wi-Fi'

  // Data
  /// Loading Data
  isLoadingListPoint: boolean = true
  isLoadingCustomerProduct: boolean = true

  /// Model Data
  isShowPlugProductPlugin: boolean = false
  isShowDisconnectProductPlugin: boolean = false
  isShowPlugProductPluginManager: boolean = false
  isSuccessUpdate: boolean = false
  isErrorUpdate: boolean = false
  isShowMoneyModal: boolean = false
  isErrorMoney: boolean = false

  /// Order Data
  productCode: string = ''
  chars: Record<string, string | number> | null = null
  title: string = ''
  productId: string = ''

  availableFundsAmt: number = 0

  // Computed
  get getListServiceAuth () {
    if (this.customerProduct === null) return []
    return this.customerProduct.slo.filter(sloItem => SERVICES_AUTH.includes(sloItem.code))
  }

  get getSLOPrice () {
    return (slo: any) => {
      return head(slo.prices as any[])?.amount || 0
    }
  }

  get getOrderTitleNPrice () {
    if (!this.productCode) return null
    const slo = this.customerProduct?.slo.find(sloItem => sloItem.code === this.productCode)
    if (!slo) return null
    return {
      name: slo.name,
      price: head(slo.prices)!.amount
    }
  }

  get getOrderData () {
    return {
      locationId: this.activePoint?.id,
      bpi: this.isActiveCurrentSLO
        ? this.currentSLOByCode?.productId
        : this.activePoint?.bpi,
      productCode: this.productCode,
      chars: this.chars,
      offer: this.isActiveCurrentSLO
        ? null
        : 'wifi',
      title: this.getOrderTitleNPrice
        ? this.isActiveCurrentSLO
          ? `Вы уверены, что хотите изменить характеристику (-и) услуги «${this.getOrderTitleNPrice.name}»?`
          : `Вы уверены, что хотите подключить «${this.getOrderTitleNPrice.name}»?`
        : '',
      marketId: this.activePoint?.marketId
    }
  }

  get getDisconnectData () {
    return {
      bpi: this.activePoint?.bpi,
      locationId: this.activePoint?.id,
      productId: this.productId,
      marketId: this.activePoint?.marketId,
      title: this.getOrderTitleNPrice
        ? `Вы уверены, что хотите отключить «${this.getOrderTitleNPrice.name}»?`
        : ''
    }
  }

  get getRequestData () {
    const parameters = this.chars
      ? Object.keys(this.chars).map(key => {
        return this.chars!.hasOwnProperty(key) && `${key}: ${this.chars![key]}`
      }).join('; ')
      : ''
    const descriptionModal = this.isActiveCurrentSLO
      ? this.chars
        ? 'изменения характеристик'
        : 'отключения'
      : 'подключения'
    return {
      descriptionModal: `
        Для ${descriptionModal} услуги
        «Закрытая сеть (HS)» нужно сформировать заявку на вашего персонального менеджера
      `,
      addressId: this.activePoint?.addressId,
      services: `
        ${this.isActiveCurrentSLO ? this.chars ? 'Изменение характеристик' : 'Отключение' : 'Подключение'} услуги «Закрытая сеть (HS)»
        ${this.isActiveCurrentSLO ? this.chars ? `(${parameters})` : '' : `(${parameters})`}
      `,
      fulladdress: this.activePoint?.fulladdress,
      type: this.isActiveCurrentSLO
        ? this.chars
          ? 'change'
          : 'disconnect'
        : 'connect'
    }
  }

  get currentSLOByCode () {
    return this.customerProduct?.slo.find(sloItem => sloItem.code === this.productCode)
  }

  get isActiveCurrentSLO () {
    return this.currentSLOByCode?.status === ServiceStatus.STATUS_ACTIVE
  }

  get isStopped () {
    return this.activePoint?.status === ServiceStatus.STATUS_SUSPENDED
  }

  /// Vuex Methods
  getAvailableFunds!: <T = Promise<IAvailableFunds>>() => T

  // Methods
  async onConnect (code: string, e: any) {
    this.productCode = code

    const openPlugin = () => {
      this.chars = typeof e !== 'undefined' ? e : null

      if (code === 'WIFIHSCLONET') {
        this.isShowPlugProductPluginManager = true
      } else {
        this.isShowPlugProductPlugin = true
      }
    }

    // Услуга не подключена - следует проверить доступные денежные средства
    if (!this.isActiveCurrentSLO) {
      try {
        const getAvailableFundsResponse = await this.getAvailableFunds()
        const availableFunds = Number(getAvailableFundsResponse.availableFundsAmt)
        this.availableFundsAmt = availableFunds

        if (
          this.getOrderTitleNPrice !== null &&
          availableFunds - Number(this.getOrderTitleNPrice.price) >= 0
        ) {
          openPlugin()
        } else {
          this.isShowMoneyModal = true
          this.resetOrderData()
        }
      } catch (e) {
        this.isErrorMoney = true
        this.resetOrderData()
      }
    } else {
      openPlugin()
    }

    // this.getAvailableFunds()
    //   .then(response => {
    //     const availableFunds = Number(response.availableFundsAmt)
    //     this.availableFundsAmt = availableFunds
    //     if (
    //       this.getOrderTitleNPrice !== null &&
    //       availableFunds - Number(this.getOrderTitleNPrice.price) > 0
    //     ) {
    //       this.chars = typeof e !== 'undefined' ? e : null
    //
    //       if (code === 'WIFIHSCLONET') {
    //         this.isShowPlugProductPluginManager = true
    //       } else {
    //         this.isShowPlugProductPlugin = true
    //       }
    //     } else {
    //       this.isShowMoneyModal = true
    //       this.resetOrderData()
    //     }
    //   })
    //   .catch(() => {
    //     this.isErrorMoney = true
    //     this.resetOrderData()
    //   })
  }

  resetOrderData () {
    const ref = head((this.$refs as any)[`service-auth__${this.productCode.toLowerCase()}`]) as any
    if (!ref) return
    ref.lazyStatus = ref.status || STATUS_DISCONNECTED
    ref.loadingServiceWithParams = false

    this.$nextTick(() => {
      this.productCode = ''
      this.chars = null
      this.title = ''
    })
  }

  onCancelOrder () {
    this.resetOrderData()
  }

  onErrorOrder () {
    this.resetOrderData()
  }

  onSuccessOrder () {
    this.isLoadingCustomerProduct = true
    setTimeout(() => {
      this.getCustomerProduct()
        .then(() => {
          this.isLoadingCustomerProduct = false
          this.resetOrderData()
        })
    }, 1000)
  }

  onDisconnect (code: string, productId: string) {
    if (!productId) return

    this.productCode = code
    this.productId = productId
    this.chars = null

    this.$nextTick(() => {
      if (code === 'WIFIHSCLONET') {
        // todo Отключение через менеджера. Убрать после исправления на стороне TBAPI
        this.isShowPlugProductPluginManager = true
      } else {
        this.isShowDisconnectProductPlugin = true
      }
    })
  }

  getListPoint () {
    return new Promise((resolve, reject) => {
      Page.options.methods.getListPoint.call(this)
        .then(() => {
          this.listPoint = this.listPoint.filter((point: any) => ~point.offerName.toLowerCase().indexOf('mono'))
          if (this.$route.params.hasOwnProperty('bpi')) {
            this.activePoint = this.listPoint.find(point => point.bpi === this.$route.params.bpi) || null
          } else {
            this.activePoint = head(this.listPoint) || null
          }
          resolve(this.listPoint)
        })
        .catch((error: any) => reject(error))
    })
  }

  onUpdateChars () {
    if (!this.productCode) return null
    const slo = this.customerProduct?.slo.find(sloItem => sloItem.code === this.productCode)
    if (!slo) return null
    this.$store.dispatch('salesOrder/createModifyOrder', {
      locationId: this.activePoint?.id,
      bpi: slo.productId,
      chars: this.chars
    })
      .then(() => {
        this.$store.dispatch('salesOrder/send', {
          offerAcceptedOn: this.$moment().toISOString()
        })
          .then(() => {
            this.isSuccessUpdate = true
            this.onSuccessOrder()
          })
          .catch(() => {
            this.isErrorUpdate = true
            this.onErrorOrder()
          })
      })
      .catch(() => {
        this.isErrorUpdate = true
        this.onErrorOrder()
      })
  }

  onToPayment () {
    this.$router.push({
      name: 'add-funds',
      params: {
        total_amount: this.getOrderTitleNPrice
          ? String(Number(this.getOrderTitleNPrice.price) - this.availableFundsAmt)
          : '0'
      }
    })
  }
}
