import { Vue, Component } from 'vue-property-decorator'
import ErBundleInfo from '@/components/blocks/ErBundleInfo/index.vue'
import { getServicePageLink, getIconNameByCode } from '@/functions/services'
import { IBundle } from '@/interfaces/bundle'
import { dataLayerPush } from '@/functions/analytics'

const components = {
  ErBundleInfo
}

const props = {
  addressId: String,
  list: Array
}

@Component({ components, props })
export default class OfficeItem extends Vue {
  serviceList: any[] = []
  isLoading: boolean = true

  getAnalyticsLabel (code: string) {
    switch (this.getIconNameByCode(code)) {
      case 'telephone':
        return 'gototelephony'
      case 'wifi':
        return 'gotowifi'
      case 'internet':
        return 'gotointernet'
      case 'tv':
        return 'gototv'
      case 'watch_right':
        return 'gotoforpost'
      default:
        return 'gotomoreservices'
    }
  }

  getIconNameByCode (code: string) {
    return getIconNameByCode(code)
  }

  getServiceLink = getServicePageLink

  getBundleName (bundleId: string) {
    return this.$store.state.bundles.activeBundleList.find((el: IBundle) => {
      return el.bundle.id === bundleId
    })?.bundle?.name || null
  }

  dataLayerPush = dataLayerPush
}
