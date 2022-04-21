import { Vue, Component, Watch } from 'vue-property-decorator'
import TotalBlock from '../components/total-block.vue'
import Point from '../components/Point/index.vue'
import PointContent from '../components/PointContent/index.vue'
import OATSPromo from '../components/promo.vue'

import { StoreGetter } from '@/functions/store'
import { ICloudPhone, ICloudPhoneService, IOATSDomain } from '@/interfaces/oats'

import { CHAR_VALUES, CHARS as OATS_CHARS, TOMS_IDS, PACKAGE_MINUTES_TOMS_IDS, CHARS } from '@/constants/oats'

const isOatsPhoneNumber = (el: ICloudPhoneService) => {
  const CLOUD_PHONE_NUMBERS = [
    TOMS_IDS.CLOUD_PHONE_NUMBER,
    TOMS_IDS.CLOUD_PHONE_NUMBER_LIGHT,
    TOMS_IDS.CLOUD_PHONE_NUMBER_2_0
  ]

  return CLOUD_PHONE_NUMBERS.includes(el?.offer?.tomsId || '')
}

const isCloudPhone = (el: ICloudPhone) => {
  // отделяем сервис от облачной телефонии
  const CLOUD_TELEPHONY_CODES = [
    TOMS_IDS.CLOUD_TELEPHONY,
    TOMS_IDS.CLOUD_TELEPHONY_LIGHT
  ]

  return CLOUD_TELEPHONY_CODES.includes(el?.offer?.tomsId || '')
}

const expandServices = (acc: any[], el: ICloudPhone) => {
  let services: ICloudPhoneService[] = []
  if (el.services) {
    services = Object.values(el.services)
  }
  return [...acc, ...services]
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
  @StoreGetter('payments/getActiveBillingAccount')
  billingAccountId!: any

  @StoreGetter('oats/domainList')
  domainList!: any[]

  @StoreGetter('oats/pointBpiList')
  pointBpiList!: string[]

  @StoreGetter('oats/errorMessage')
  errorMessage!: string

  get totalValue () {
    return this.domainList.reduce((acc, item) => {
      return acc + this.getDomainPrice(item)
    }, 0)
  }
  get isDomainsLoaded () {
    return this.$store.state.oats.isDomainsLoaded
  }

  mounted () {
    if (this.billingAccountId) {
      this.fetchData()
    }
  }

  fetchData () {
    this.$store.dispatch('oats/pullDomains', this.pointBpiList)
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
    ]
  }

  getPackagesMinutes (domain: IOATSDomain) {
    const services = this.getCloudPhoneServices(domain)

    return services?.filter(service => PACKAGE_MINUTES_TOMS_IDS.includes(service?.offer?.tomsId || ''))
  }

  getCloudPhoneServices (domain: IOATSDomain) {
    const cloudPhones = Object.values(domain?.cloudPhones || {})
      .filter(el => isCloudPhone(el))

    const services:ICloudPhoneService[] = []
    cloudPhones.forEach(cloudPhone => { if (cloudPhone.services) services.push(...Object.values(cloudPhone.services)) })

    return services
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

  getTariffName (domain: IOATSDomain) {
    return domain?.chars?.[CHARS.NAME_IN_INVOICE]
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
