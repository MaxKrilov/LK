import { Vue, Component } from 'vue-property-decorator'

const components = {}
const props = {
  title: String,
  price: String,
  value: Boolean,
  isLoading: {
    type: Boolean,
    default: false
  },
  isWaitOrder: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconName: String,
  infoLink: String
}

@Component({ components, props })
export default class ProductItem extends Vue {
  subkey: string = ''

  get active () {
    return this.$props.value
  }

  onInput () {
    this.updateKey()
    this.$emit('input', !this.$props.value)
  }

  mounted () {
    this.updateKey()
  }

  updateKey () {
    this.subkey = `${this.$props.iconName}-${parseInt(Math.random() * 999, 10)}`
  }
}
