import { Vue, Component } from 'vue-property-decorator'
import AddonCard from '../components/AddonCard/index.vue'
import { promisedStoreValue } from '@/functions/store_utils'
import { IDomain } from '@/interfaces/videocontrol'
import { ANALYTIC_NAME } from '@/constants/videocontrol'
const components = {
  AddonCard
}

@Component({ components, name: 'VCAddonListPage' })
export default class VCAddonListPage extends Vue {
  availableAnalyticsList = []
  isLoaded: boolean = false
  isEmpty: boolean = false

  getFirstOfObject (obj: any): any {
    return Object.values(obj)?.[0]
  }

  /*
    ID первой попавшейся базовой функциональности
    для получения доступной видеоаналитики
  */
  get bfOfferId () {
    const domains = this.$store.state.videocontrol.domainRegistry
    const firstDomain: IDomain = this.getFirstOfObject(domains)
    const videocontrols = firstDomain?.videocontrols || {}
    const firstVC = this.getFirstOfObject(videocontrols)
    const bf = firstVC?.bf || {}
    const firstBF = this.getFirstOfObject(bf) || {}
    return firstBF?.offer?.id // '2546'
  }

  fetchAllowedOfferList (offerId: string) {
    const payload = {
      api: this.$api,
      id: offerId
    }

    return this.$store.dispatch(
      'videocontrol/pullAllowedOffers',
      payload
    )
  }

  mounted () {
    promisedStoreValue(this.$store, 'videocontrol', 'isDomainRegistryLoaded')
      .then(() => {
        if (this.bfOfferId) {
          this.fetchAllowedOfferList(this.bfOfferId)
            .then(data => {
              const offeringRel = data?.[0]?.offeringRelationships

              const availOfferingList = offeringRel
                .find((el: any) => el.name === ANALYTIC_NAME)?.offerings

              const filteredList = availOfferingList
                ?.filter((el:any) => ['Активный', 'Active'].includes(el.status))

              this.availableAnalyticsList = filteredList || []
              this.isLoaded = true
            })
        } else {
          this.isLoaded = true
          this.isEmpty = true
        }
      })
  }
}
