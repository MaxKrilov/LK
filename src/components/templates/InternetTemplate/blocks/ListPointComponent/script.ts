import { Vue, Component, Prop } from 'vue-property-decorator'
import { iPointItem } from '@/components/pages/internet/IndexPage/script'

@Component
export default class ListPointComponent extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: iPointItem[]
  @Prop({ type: Object }) readonly value!: iPointItem

  isOpen: boolean = false
  isOpenModal: boolean = false

  closeModal () {
    this.isOpenModal = false
  }

  toggleList () {
    this.isOpen = !this.isOpen
  }

  get countList (): number {
    return this.list.length
  }

  get getActiveFulladdress (): string {
    return this.value?.fulladdress
  }

  get getIsLoadingListPoint (): boolean {
    return this.$parent && (this.$parent as any).isLoadingListPoint
  }

  setActivePoint (point: iPointItem) {
    this.$emit('input', point)
    this.isOpenModal = false
  }
}
