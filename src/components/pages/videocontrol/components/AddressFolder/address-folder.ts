import { Vue, Component, Watch } from 'vue-property-decorator'

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
  isOpened: boolean = false

  @Watch('active')
  onChangeActiveProp (value: boolean) {
    this.isOpened = value
  }

  mounted () {
    this.isOpened = this.$props.active
  }

  onClick () {
    this.isOpened = !this.isOpened
  }
}
