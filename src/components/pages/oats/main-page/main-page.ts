import { Vue, Component, Watch } from 'vue-property-decorator'
import TotalBlock from '../components/total-block.vue'
import Point from '../components/Point/index.vue'
import PointContent from '../components/PointContent/index.vue'
import OATSPromo from '../components/promo.vue'

import { StoreGetter } from '@/functions/store'
import { ICloudPhone, ICloudPhoneService, IOATSDomain } from '@/interfaces/oats'
import { CHAR_VALUES, CHARS as OATS_CHARS, CODES } from '@/constants/oats'

const isOatsPhoneNumber = (el: ICloudPhoneService) => {
  // Запасной вариант нахождения номера телефона:
  // el.chars[OATS_CHARS.NAME_IN_INVOICE] === CHAR_VALUES.PHONE_NUMBER

  const CLOUD_PHONE_NUMBERS = [
    CODES.CLOUD_PHONE_NUMBER,
    CODES.CLOUD_PHONE_NUMBER_LIGHT
  ]
  return CLOUD_PHONE_NUMBERS.includes(el?.offer?.code || '')
}

const isCloudPhone = (el: ICloudPhone) => {
  // отделяем сервис от облачной телефонии в объекте IOATSDomain.cloudPhones

  // запасной вариант
  // el.chars[OATS_CHARS.NAME_IN_INVOICE].startsWith(CHAR_VALUES.CLOUD_TELEPHONY)
  const CLOUD_TELEPHONY_CODES = [
    CODES.CLOUD_TELEPHONY,
    CODES.CLOUD_TELEPHONY_LIGHT
  ]

  return CLOUD_TELEPHONY_CODES.includes(el?.offer?.code || '')
}

const expandServices = (acc: any[], el: ICloudPhone) => {
  return [...acc, ...el?.services || []]
}

const oatsPhoneMap = (el: ICloudPhone) => {
  const categoryName = el.chars[OATS_CHARS.NUMBER_CATEGORY]
  const category = categoryName === CHAR_VALUES.NO_CATEGORY ? '' : categoryName
  return {
    number: el.chars[OATS_CHARS.PHONE_NUMBER],
    price: el?.purchasedPrices?.recurrentTotal?.value,
    category: category,
    id: el.id
  }
}

const components = {
  TotalBlock,
  Point,
  PointContent,
  OATSPromo
}
@Component({ components })
export default class OATSMainPage extends Vue {
  isPointsLoaded: boolean = false

  @StoreGetter('payments/getActiveBillingAccount')
  billingAccountId!: any

  @StoreGetter('oats/domainList')
  domainList!: any[]

  @StoreGetter('oats/pointBpiList')
  pointBpiList!: string[]

  get totalValue () {
    return this.domainList.reduce((acc, item) => {
      return acc + this.getDomainPrice(item)
    }, 0)
  }

  get isDomainsLoaded () {
    return this.$store.state.oats.isDomainsLoaded
  }

  pullPoints () {
    return this.$store.dispatch('oats/pullPoints')
  }

  mounted () {
    if (this.billingAccountId) {
      this.fetchData()
    }
  }

  fetchData () {
    this.isPointsLoaded = false
    this.pullPoints()
      .then(points => {
        this.isPointsLoaded = true
        if (points.length) {
          this.$store.dispatch('oats/pullDomains', this.pointBpiList)
        }
      })
  }

  @Watch('billingAccountId')
  onBillingAccountIdChange (value: any) {
    if (value) {
      this.fetchData()
    }
  }

  getServicesFromCloudPhones (domain: IOATSDomain) {
    return Object.values(domain?.cloudPhones || {})
      .filter(el => !isCloudPhone(el))
  }

  getServiceList (domain: IOATSDomain) {
    return [
      ...Object.values(domain?.services || {}),
      ...this.getServicesFromCloudPhones(domain)
    ].filter(this.isServiceWithNonZeroPrice)
  }

  getServiceCount (domain: IOATSDomain) {
    return this.getServiceList(domain)
      .filter(this.isServiceWithNonZeroPrice)
      .length
  }

  getDomainPoint (locationId: string) {
    return this.$store.state.oats.pointList.find(
      (el: any) => el.id === locationId
    )
  }

  getDomainPointFulladdress (locationId: string) {
    const point = this.getDomainPoint(locationId)
    return point.fulladdress
  }

  isServiceWithNonZeroPrice (service: any): boolean {
    const price = parseInt(service?.purchasedPrices?.recurrentTotal?.value || 0, 10)
    return price > 0
  }

  getPhoneList (domain: IOATSDomain) {
    return Object.values(domain?.cloudPhones || [])
      .reduce(expandServices, [])
      .filter(isOatsPhoneNumber)
      .map(oatsPhoneMap)
  }

  getDomainPrice (domain: IOATSDomain) {
    const domainPrice = parseInt(domain?.purchasedPrices?.recurrentTotal?.value || '0', 10)

    const cloudPhonePriceSum = Object.values(domain?.cloudPhones || []).reduce(
      (acc: number, item: ICloudPhone): number => {
        const cloudPrice = item.purchasedPrices?.recurrentTotal?.value || 0
        return acc + parseInt(cloudPrice, 10)
      },
      0
    )

    return domainPrice + cloudPhonePriceSum
  }

  onSuspendProduct () {
    this.$router.push({
      name: 'support',
      query: { form: 'suspension_of_a_contract_or_service' }
    })
  }
}
