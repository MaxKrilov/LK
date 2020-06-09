import { Vue, Component, Prop } from 'vue-property-decorator'
import { ILocationOfferInfo } from '@/tbapi'
import { uniq } from '@/functions/helper'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string
}

export const transformListPoint = (listPoint: ILocationOfferInfo[]): iPointItem[] => uniq(listPoint.map(item => ({
  id: item.id,
  fulladdress: item.fulladdress,
  bpi: item.bpi,
  offerName: item.offer.name
})), 'bpi')

@Component
export default class ListPointComponent extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: iPointItem[]
  @Prop({ type: Object }) readonly value!: iPointItem
  @Prop({ type: Boolean }) readonly isLoading!: boolean

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
    return this.isLoading
  }

  setActivePoint (point: iPointItem) {
    this.$emit('input', point)
    this.isOpenModal = false
  }
}
