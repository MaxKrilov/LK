import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PhoneFolder extends Vue {
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean
  @Prop(String) readonly phone!: string
  @Prop(String) readonly id!: string

  pre = 'phone-folder-oats'
  isOpened = false

  getCSSClass () {
    return this.disabled
      ? `${this.pre}--disabled`
      : this.isOpened
        ? `${this.pre}--active`
        : ''
  }

  onToggle () {
    this.isOpened = this.disabled
      ? false
      : !this.isOpened
  }

  mounted () {
    this.isOpened = this.$route.params.id === this.$props.id
  }
}
