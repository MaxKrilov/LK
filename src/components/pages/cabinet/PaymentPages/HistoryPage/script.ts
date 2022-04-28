import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'

import { head, last } from 'lodash'
import ErtMenu from '@/components/UI2/ErtMenu'
import { mapActions, mapGetters, mapState } from 'vuex'
import { IBillingInfo } from '@/tbapi/payments'
import { IPaymentHistoryBill } from '@/store/modules/payments'

import PaymentHistoryItem from '../components/PaymentHistoryItem/index.vue'
import { ucfirst } from '@/functions/helper'

@Component<InstanceType<typeof PaymentHistoryPage>>({
  components: {
    PaymentHistoryItem
  },
  computed: {
    ...mapState({
      billingInfo: (state: any) => state.payments.billingInfo
    }),
    ...mapGetters({
      loadingPaymentHistoryBill: 'loading/loadingPaymentHistoryBill'
    })
  },
  methods: {
    ...mapActions({
      getPaymentHistory: 'payments/getPaymentHistory'
    })
  },
  watch: {
    billingInfo (val) {
      Object.keys(val).length !== 0 && this.getPaymentHistory({ dateFrom: head(this.period)!, dateTo: last(this.period)! })
        .then(response => {
          this.listHistoryBill = response
        })
    }
  }
})
export default class PaymentHistoryPage extends Vue {
  // Options
  $refs!: Vue & {
    'picker-menu': InstanceType<typeof ErtMenu>
  }

  // Vuex state
  readonly billingInfo!: object | IBillingInfo

  // Vuex getters
  readonly loadingPaymentHistoryBill!: boolean

  // Vuex actions
  getPaymentHistory!: ({ dateFrom, dateTo }: { dateFrom: moment.Moment, dateTo: moment.Moment }) => Promise<IPaymentHistoryBill[][]>

  // Data
  isVisibleFilter: boolean = false
  period: moment.Moment[] = [
    moment().startOf('month'),
    moment()
  ]

  listPayType = [
    { id: 'all', text: 'Все' },
    { id: 'replenishment', text: 'Пополнения' },
    { id: 'write_off', text: 'Списания' }
  ]
  payType = head(this.listPayType)!

  modelDatePicker: boolean = false

  listHistoryBill: IPaymentHistoryBill[][] = []

  get formatFilterPeriod () {
    return `${head(this.period)!.format('DD.MM.YYYY')}-${last(this.period)?.format('DD.MM.YYYY')}`
  }

  get datePickerModel () {
    return [
      new Date(head(this.period)!.format('YYYY-MM-DD 00:00:00')),
      new Date(last(this.period)!.format('YYYY-MM-DD 23:59:59'))
    ]
    // return this.period.length === 1
    //   ? [new Date(head(this.period)!.format('YYYY-MM-DD'))]
    //   : [
    //     new Date(head(this.period)!.format('YYYY-MM-DD')),
    //     new Date(last(this.period)!.format('YYYY-MM-DD'))
    //   ]
  }
  set datePickerModel (val) {
    this.period = [
      moment(head(val)!),
      moment(last(val)!)
    ]
    this.$nextTick(() => {
      this.onSaveDatePicker()
    })
    // if (val.length === 1) {
    //   this.period = [moment(head(val)!)]
    // } else {
    //   this.period = [
    //     moment(head(val)!),
    //     moment(last(val)!)
    //   ]
    // }
  }

  get maxDatePicker () {
    return moment().format('YYYY-MM-DD')
  }

  get minDatePicker () {
    return moment().subtract(6, 'months').format('YYYY-MM-DD')
  }

  // Methods
  onSaveDatePicker () {
    // this.$refs['picker-menu'].save(this.datePickerModel)
    this.getPaymentHistory({ dateFrom: head(this.period)!, dateTo: last(this.period)! })
      .then(response => {
        this.listHistoryBill = response
      })
  }

  getMonthByTimestamp (timestamp: number) {
    return ucfirst(moment(timestamp).format('MMMM'))
  }

  getYearByTimestamp (timestamp: number) {
    return moment(timestamp).format('YY')
  }

  disabledDateCallback (date: Date) {
    const _date = moment(date)
    return _date > moment() || _date < moment().subtract(6, 'months')
  }

  mounted () {
    this.$router.push('/lk/payments')
    Object.keys(this.billingInfo).length !== 0 &&
    this.getPaymentHistory({ dateFrom: head(this.period)!, dateTo: last(this.period)! })
      .then(response => {
        this.listHistoryBill = response
      })
  }
}
