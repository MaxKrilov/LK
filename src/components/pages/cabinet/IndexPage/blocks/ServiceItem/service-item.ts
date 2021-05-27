import { Vue, Component } from 'vue-property-decorator'
import ErBundleInfo from '@/components/blocks/ErBundleInfo/index.vue'
import { IBundle } from '@/interfaces/bundle'
import { getServicePageLink } from '@/functions/services'

const components = {
  ErBundleInfo
}

const props = {
  list: Array,
  name: String
}

@Component({ components, props })
export default class ServiceItem extends Vue {
  get serviceList () {
    return this.$props.list
  }

  getServiceLink = getServicePageLink

  getBundleName (bundleId: string) {
    return this.$store.state.bundles.activeBundleList.find((el: IBundle) => {
      return el.bundle.id === bundleId
    })?.bundle?.name || null
  }
}
