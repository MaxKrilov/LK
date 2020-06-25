import { Vue, Component } from 'vue-property-decorator'
import VIDEO_ANALYTICS from '@/constants/videoanalytics'

const components = {
}

const props = {
  title: String,
  code: String,
  price: String,
  isLoaded: {
    type: Boolean,
    default: true
  }
}

@Component({ components, props })
export default class VCAddonCard extends Vue {
  get coverPath () {
    const thumbName = VIDEO_ANALYTICS[this.$props.code].thumb || ''
    return `/videocontrol/${thumbName}`
  }

  onClick () {
    this.$router.push(`/lk/videocontrol/analytics/${this.$props.code}`)
  }
}
