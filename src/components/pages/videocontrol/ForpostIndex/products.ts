import { Component } from 'vue-property-decorator'
import ProductFolder from '../components/ProductFolder/index.vue'
import VCDomain from '../components/Domain/index.vue'
import VCPromo from '../promo/index.vue'
import ErTotalPrice from '@/components/blocks/ErTotalPrice/index.vue'

import { IDomainRegistry, IDomain, IDomainService } from '@/interfaces/videocontrol'
import { VC_TYPES, CHARS, VC_DOMAIN_STATUSES } from '@/constants/videocontrol'
import { logInfo } from '@/functions/logging'
import { mapState, mapGetters } from 'vuex'
import { ILocationOfferInfo } from '@/tbapi'
import { ErtPageWithDialogsMixin } from '@/mixins2/ErtPageWithDialogsMixin'
import { STATUS_DISCONNECTED } from '@/constants/status'
import { SERVICE_URLS } from '@/constants/url'

const components = {
  'vc-domain': VCDomain,
  ProductFolder,
  VCPromo,
  ErTotalPrice
}

const MIN_USER_COUNT = 0
const USER_COST = '60'

const computed = {
  ...mapState({
    isDomainsLoaded: (state: any) => state.videocontrol.isDomainRegistryLoaded,
    domains: (state: any) => state.videocontrol.domainRegistry
  }),
  ...mapGetters({
    domainByKey: 'videocontrol/domainByKey',
    pointById: 'videocontrol/pointById'
  })
}

@Component({
  components,
  computed
})
export default class VideocontrolProductPage extends ErtPageWithDialogsMixin {
  /* === Config === */
  isPlugVideocontrolPossible: boolean = false

  /* === mapState === */
  isDomainsLoaded!: boolean
  domains!: IDomainRegistry

  /* === mapGetters === */
  domainByKey!: (key: string) => IDomain
  pointById!: (id: string) => ILocationOfferInfo

  get totalPrice (): number {
    return this.domainsCost
  }

  get isVideocontrolPlugged () {
    return Object.keys(this.domains).length > 0
  }

  get isPromoPage () {
    return this.isDomainsLoaded && !this.isVideocontrolPlugged
  }

  get domainsCost () {
    return Object.keys(this.domains)
      .map(el => this.getDomainPrice(el))
      .reduce((total, el): number => total + el, 0)
  }

  getDomainUsers (domainKey: string) {
    const domain = this.domainByKey(domainKey)

    const services = domain?.services

    const isUserType = (el: IDomainService) => el.offer.code === VC_TYPES.USERS
    const notDisconnectedStatus = (el: IDomainService) => el.status !== STATUS_DISCONNECTED

    return services ? Object.values(services).filter(notDisconnectedStatus).find(isUserType) : null
  }

  getDomainUserProductId (domainKey: string) {
    return this.getDomainUsers(domainKey)?.id
  }

  getDomainUserCount (domainKey: string): number {
    const domainUsers = this.getDomainUsers(domainKey)

    if (domainUsers?.chars?.[CHARS.USER_COUNT]) {
      return parseInt(domainUsers.chars[CHARS.USER_COUNT], 10)
    }

    return MIN_USER_COUNT
  }

  getDomainUserPrice (domainKey: string): string {
    const userFullPrice = this.getDomainUsers(domainKey)
      ?.purchasedPrices?.recurrentTotal?.value

    return userFullPrice || USER_COST
  }

  getDomainPrice (domainKey: string): number {
    const videocontrol = this.domains[domainKey]?.videocontrols || []

    const price = Object.values(videocontrol)
      // @ts-ignore
      .map(el => el?.purchasedPrices?.recurrentTotal?.value || 0)
      .reduce((total, el): number => total + parseFloat(el), 0)

    return parseFloat(price) + parseFloat(this.getDomainUserPrice(domainKey))
  }

  isDomainActive (domain: IDomain) {
    const ActiveStatuses = [
      VC_DOMAIN_STATUSES.ACTIVE,
      VC_DOMAIN_STATUSES.MODIFICATION
    ]
    return ActiveStatuses.includes(domain.status)
  }

  onChangeDomain (data: any) {
    logInfo('change domain data', data)
  }

  onClickPlug () {
    window.open(SERVICE_URLS.VIDEOCONTROL)
  }
}
