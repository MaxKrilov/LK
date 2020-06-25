import { Vue, Component } from 'vue-property-decorator'
import VIDEO_ANALYTICS from '@/constants/videoanalytics'

const components = {}
const props = {
  title: String,
  price: String,
  code: String,
  value: Boolean,
  isLoading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
}

@Component({ components, props })
export default class AnalyticItem extends Vue {
  get iconName (): string {
    return VIDEO_ANALYTICS[this.$props.code].iconName || 'question'
  }

  get active () {
    return this.$props.value
  }

  get linkToDetailPage () {
    return `/lk/videocontrol/analytics/${this.$props.code}`
  }

  onInput () {
    this.$emit('input', !this.$props.value)
  }
}
