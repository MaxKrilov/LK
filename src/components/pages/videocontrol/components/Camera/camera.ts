import { Vue, Component } from 'vue-property-decorator'
import { CHARS } from '@/constants/videocontrol'

const components = {}

const props = {
  id: String,
  data: {}, // ICamera
  price: String,
  count: Number,
  services: {},
  showPrice: {
    type: Boolean,
    default: false
  }
}

@Component({ components, props })
export default class Camera extends Vue {
  isForpostPortalWorking: boolean = false

  get title () {
    return this.$props.data.name
  }

  get deviceName () {
    return this.$props.data.chars[CHARS.DEVICE_NAME]
  }

  get linkToEdit () {
    return `/lk/videocontrol/forpost/camera/${this.$props.data.id}`
  }

  onPlay () {
    // pass
  }
}
