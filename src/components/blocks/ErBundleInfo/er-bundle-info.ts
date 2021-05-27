import { Component, Vue } from 'vue-property-decorator'
import { IBundle } from '@/interfaces/bundle'
import { getServicePageLink } from '@/functions/services'

const props = {
  name: String,
  id: {
    type: String,
    description: 'Bundle.id'
  },
  showInfo: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showMembers: {
    type: Boolean,
    default: true
  }
}

const sameOfferId = (offerId: string) => (el: any) => el.offer.id === offerId

@Component({ props })
export default class ErBundleInfo extends Vue {
  get members () {
    return this.$store.state.bundles.activeBundleList.filter(
      (el: IBundle) => el.bundle.id === this.$props.id
    ).map((el: IBundle) => {
      const serviceName = this.$store.state.user.listProductByService.find(
        sameOfferId(el.offer.id)
      )?.offeringCategory?.name || el.offer.name
      return {
        ...el,
        serviceName
      }
    })
  }

  getLinkToProductPage = getServicePageLink
}
