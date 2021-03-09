import Vue from 'vue'
import Component from 'vue-class-component'

import { price as priceFormatted } from '@/functions/filters'
import { IPaymentHistoryBill } from '@/store/modules/payments'
import moment from 'moment'

@Component({
  filters: { priceFormatted },
  props: {
    loading: Boolean,
    data: Object,
    type: {
      type: String,
      default: 'replenishment'
    }
  }
})
export default class PaymentHistoryItem extends Vue {
  // Props
  readonly loading!: boolean
  readonly data!: IPaymentHistoryBill
  readonly type!: string

  get dateMonth () {
    return this.data.hasOwnProperty('timestamp')
      ? moment(Number(this.data.timestamp)).format('DD.MM')
      : ''
  }

  get year () {
    return this.data.hasOwnProperty('timestamp')
      ? moment(Number(this.data.timestamp)).format('.YY')
      : ''
  }

  get title () {
    return this.data.hasOwnProperty('title')
      ? this.data.title
      : ''
  }

  get description () {
    return this.data.hasOwnProperty('description')
      ? this.data.description
      : ''
  }

  get amount () {
    return this.data.hasOwnProperty('value')
      ? this.data.value
      : 0
  }

  get fiscal () {
    return this.data.hasOwnProperty('fiscalCheck')
      ? this.data.fiscalCheck
      : false
  }

  get chargePeriod () {
    return this.data.hasOwnProperty('chargePeriod')
      ? this.data.chargePeriod
      : ''
  }
}
