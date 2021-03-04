import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'
import { IBillingInfo, IDocumentViewerDocument, IInfoBillAccount } from '@/tbapi/payments'

import { price as priceFormatted, leadingZero } from '@/functions/filters'
import moment from 'moment'
import { IPaymentHistoryBill } from '@/store/modules/payments'
import { upperFirst } from '@/functions/helper2'

import PaymentHistoryItem from '../components/PaymentHistoryItem/index.vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'

import { head } from 'lodash'

interface IInvoicePayment {
  id: string,
  bucket: string,
  fileName: string,
  filePath: string,
  type: {
    id: string,
    name: string
  }
}

@Component<InstanceType<typeof PaymentIndexPage>>({
  components: {
    PaymentHistoryItem,
    ErDocumentViewer
  },
  filters: {
    priceFormatted,
    leadingZero
  },
  computed: {
    ...mapState({
      billingInfo: (state: any) => state.payments.billingInfo,
      isHasPromisePayment: (state: any) => state.payments.isHasPromisePayment,
      promisePayStart: (state: any) => state.payments.promisePayStart,
      promisePayEnd: (state: any) => state.payments.promisePayEnd,
      listInvoicePayment: (state: any) => state.payments.listInvoicePayment
    }),
    ...mapGetters({
      isLoadingBalance: 'loading/menuComponentBalance',
      isEnabledAutoPay: 'payments/isEnabledAutoPay',
      loadingPaymentHistoryBill: 'loading/loadingPaymentHistoryBill'
    })
  },
  watch: {
    isHasPromisePayment (val) {
      val && (this.trackerInterval = setInterval(() => {
        this.trackerValue = this.trackerValue === 1 ? 2 : 1
      }, 1000 * 60))
    },
    billingInfo () {
      const now = moment()
      const start = moment().startOf('month')
      this.getPaymentHistory({ dateFrom: start, dateTo: now })
        .then(response => {
          this.paymentHistory = response
        })
    },
    isShowInvoicePayment (val) {
      if (val && head(this.listInvoicePayment)!.id === '') {
        this.getInvoicePayment()
      }
    }
  },
  methods: {
    ...mapActions({
      getPaymentHistory: 'payments/getPaymentHistory',
      getInvoicePayment: 'payments/getInvoicePayment'
    })
  }
})
export default class PaymentIndexPage extends Vue {
  // Vuex state
  readonly billingInfo!: object | IBillingInfo
  readonly isHasPromisePayment!: boolean
  readonly promisePayStart!: null | moment.Moment
  readonly promisePayEnd!: null | moment.Moment
  readonly listInvoicePayment!: IDocumentViewerDocument[]

  // Vuex getters
  readonly isLoadingBalance!: boolean
  readonly isEnabledAutoPay!: boolean
  readonly loadingPaymentHistoryBill!: boolean

  // Vuex actions
  getPaymentHistory!: ({ dateFrom, dateTo }: { dateFrom: moment.Moment, dateTo: moment.Moment }) => Promise<IPaymentHistoryBill[][]>
  getInvoicePayment!: () => Promise<IInfoBillAccount>

  // Data
  trackerValue: number = 2
  trackerInterval: number = 0
  paymentHistory: IPaymentHistoryBill[][] = []

  isNotAccessInvoicePayment: boolean = false
  isShowInvoicePayment: boolean = false

  // Computed
  get balance () {
    return this.billingInfo.hasOwnProperty('balance')
      ? 0 - Number((this.billingInfo as IBillingInfo).balance)
      : 0
  }

  get sumToPay () {
    return this.balance < 0
      ? Math.abs(this.balance)
      : 0
  }

  get nextDate () {
    return this.billingInfo.hasOwnProperty('nextDate')
      ? (this.billingInfo as IBillingInfo).nextDate
      : ''
  }

  get beforePromisedPayEnd () {
    if (!this.isHasPromisePayment || !this.promisePayEnd) return { d: 0, h: 0, m: 0 }
    const now = moment()
    const end = this.promisePayEnd
    const duration = moment.duration(end.diff(now))
    return this.trackerValue
      ? { d: duration.days(), h: duration.hours(), m: duration.minutes() }
      : { d: 0, h: 0, m: 0 }
  }

  get beforePromisedPayEndLine () {
    if (!this.isHasPromisePayment || !this.promisePayEnd || !this.promisePayStart) return 0
    const now = moment()
    const start = this.promisePayStart
    const end = this.promisePayEnd
    return this.trackerValue
      ? (now.unix() - start.unix()) / (end.unix() - start.unix()) * 100
      : 0
  }

  get currentMonthYear () {
    return {
      m: upperFirst(moment().format('MMMM')),
      y: moment().format('YY')
    }
  }

  getInvoicePaymentsEvents (on: Record<string, (e: Event) => void>) {
    if (this.balance >= 0) {
      return {
        click: (e: Event) => {
          e.preventDefault()
          this.isNotAccessInvoicePayment = true
        }
      }
    }

    return on
  }

  mounted () {
    this.isHasPromisePayment && (this.trackerInterval = setInterval(() => {
      this.trackerValue = this.trackerValue === 1 ? 2 : 1
    }, 1000 * 60))

    if (Object.keys(this.billingInfo).length !== 0) {
      const now = moment()
      const start = moment().startOf('month')
      this.getPaymentHistory({ dateFrom: start, dateTo: now })
        .then(response => {
          this.paymentHistory = response
        })
    }
  }
}
