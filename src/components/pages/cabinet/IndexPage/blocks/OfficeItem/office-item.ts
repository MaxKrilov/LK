import { Vue, Component } from 'vue-property-decorator'
import ErBundleInfo from '@/components/blocks/ErBundleInfo/index.vue'
import { getServicePageLink, getIconNameByCode } from '@/functions/services'
import { IBundle } from '@/interfaces/bundle'

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

  getIconNameByCode (code: string) {
    return getIconNameByCode(code)
  }

  getServiceLink = getServicePageLink

  getBundleName (bundleId: string) {
    return this.$store.state.bundles.activeBundleList.find((el: IBundle) => {
      return el.bundle.id === bundleId
    })?.bundle?.name || null
  }
}
