import { Component, Prop, Vue } from 'vue-property-decorator'
import { ILocationOfferInfo } from '@/tbapi'
import { uniq } from '@/functions/helper'

import { IPointItem } from '@/interfaces/point'

const STATUSES = {
  SUSPENSION_PONR: 'Suspension passed PONR',
  SUSPENDED: 'Suspended'
}

export interface iPointItem extends IPointItem {}

export const transformListPoint = (listPoint: ILocationOfferInfo[]): IPointItem[] => uniq(listPoint.map(item => ({
  id: item.id,
  fulladdress: item.fulladdress,
  bpi: item.bpi,
  offerName: item.offer.name,
  status: item?.status
})), 'bpi')

@Component
export default class ListPointComponent extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: IPointItem[]
  @Prop({ type: Object }) readonly value!: IPointItem
  @Prop({ type: Boolean }) readonly isLoading!: boolean
  @Prop({ type: Boolean, default: false }) readonly showSuspendedStatus!: boolean

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

  get currentIsSuspendedStatus () {
    return this.isSuspendedStatus(this?.value?.status || '')
  }

  setActivePoint (point: IPointItem) {
    this.$emit('input', point)
    this.isOpenModal = false
  }

  isSuspendedStatus (status: string) {
    return Object.values(STATUSES).includes(status)
  }
}
