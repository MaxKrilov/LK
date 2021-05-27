import { Vue, Component, Watch } from 'vue-property-decorator'

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

  @Watch('value')
  onValueChanged (value: boolean) {
    if (value) {
      this.$emit('open')
    } else {
      this.$emit('close')
    }
  }
}
