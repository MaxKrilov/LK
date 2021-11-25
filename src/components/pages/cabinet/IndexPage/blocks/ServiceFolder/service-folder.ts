import { Vue, Component, Watch } from 'vue-property-decorator'
import { dataLayerPush } from '@/functions/analytics'

const components = {}
const props = {
  title: String,
  iconName: {
    type: String,
    default: 'question'
  },
  price: String,
  description: String
}

@Component({ components, props })
export default class ServiceFolder extends Vue {
  value: boolean = false

  get getAnalyticsLabel () {
    switch (this.$props.iconName) {
      case 'telephone':
        return 'detailedtelephony'
      case 'wifi':
        return 'detailedwifi'
      case 'internet':
        return 'detailedinternet'
      case 'tv':
        return 'detailedtv'
      case 'watch_right':
        return 'detailedforpost'
      default:
        return 'detailedmoreservices'
    }
  }

  @Watch('value')
  onValueChanged (value: boolean) {
    if (value) {
      this.$emit('open')
      dataLayerPush({ category: 'mainpage', action: 'click', label: this.getAnalyticsLabel })
    } else {
      this.$emit('close')
    }
  }
}
