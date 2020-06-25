import { Vue, Component } from 'vue-property-decorator'

const components = {}

const props = {
  id: String,
  title: String,
  price: String,
  count: Number,
  services: {}
}

@Component({ components, props })
export default class Camera extends Vue {
  isForpostProtalWorking: boolean = false

  onPlay () {
    // pass
  }
}
