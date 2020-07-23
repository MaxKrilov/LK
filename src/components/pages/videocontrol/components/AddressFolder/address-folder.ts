import { Vue, Component } from 'vue-property-decorator'

const components = {}

const props = {
  title: String,
  price: String,
  active: Boolean
}

@Component({
  components,
  props
})
export default class AddressFolder extends Vue {
  isOpened = false

  mounted () {
    this.isOpened = this.$props.active
  }

  onClick () {
    this.isOpened = !this.isOpened
  }
}
