import { Component, Vue } from 'vue-property-decorator'
import AddonCard from '../components/AddonCard/index.vue'
import { promisedStoreValue } from '@/functions/store_utils'
import { IOffer, IVideocontrol } from '@/interfaces/videocontrol'
import { ANALYTIC_NAME } from '@/constants/videocontrol'

const components = {
  AddonCard
}

const isActiveOffering = (item: IOffer) =>
  ['Активный', 'Active', 'Выпущено'].includes(item.status)

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
    const hasBaseFunctionality = (videocontrol: IVideocontrol) => videocontrol?.bf

    const vcWithBF: IVideocontrol = Object.values(domains)
      .reduce((acc: any[], domain: any) => {
        const vc = domain?.videocontrols || {}
        return [...acc, ...Object.values(vc)]
      }, [])
      .find(hasBaseFunctionality) || {}

    return Object.values(vcWithBF.bf)?.[0]?.offer?.id// '2546'
  }

  fetchAllowedOfferList (offerId: string) {
    const marketId = this.$store.getters['videocontrol/domainList']?.[0]?.market?.id

    const payload = {
      api: this.$api,
      id: offerId,
      marketId
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
                ?.filter(isActiveOffering)

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
