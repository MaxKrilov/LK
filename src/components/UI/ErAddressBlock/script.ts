import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ErAddressBlock extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: string[]
  @Prop({ type: Number, default: 0 }) readonly value!: number

  current = 0
  isOpened = false

  get currentItem () {
    return this.list[this.value]
  }

  get totalCount () {
    return this.list.length
  }

  onItemClick (argh: any): void {
    this.$emit('input', argh)
  }

  onShowConnections () {
    this.$emit('show')
    this.isOpened = true
  }

  onHideConnections () {
    this.$emit('hide')
    this.isOpened = false
  }

  onToggleConnections () {
    this.$emit('toggle')
    this.isOpened = !this.isOpened
  }
}
