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
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import { dataLayerPush } from '@/functions/analytics'

import Touch from '@/directives/touch'
import { TouchWrapper } from '@/types'
import { API } from '@/functions/api'
import { head, last } from 'lodash'
import { ucfirst } from '@/functions/helper'
import { typeClosedNotification } from '@/constants/closed_notification'

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
  directives: {
    Touch
  },
  components: {
    PaymentHistoryItem,
    ErDocumentViewer,
    ErActivationModal
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
      loadingPaymentHistoryBill: 'loading/loadingPaymentHistoryBill',
      activeBillingAccount: 'payments/getActiveBillingAccount'
    })
  },
  watch: {
    isHasPromisePayment (val) {
      val && (this.trackerInterval = window.setInterval(() => {
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
      val &&
      this.activeBillingAccount &&
      !(this.activeBillingAccount in this.listInvoicePayment) &&
      this.getInvoicePayment()
    }
  },
  methods: {
    ...mapActions({
      getPaymentHistory: 'payments/getPaymentHistory',
      getInvoicePayment: 'payments/getInvoicePayment',
      downloadFile: 'fileinfo/downloadFile',
      createClosedRequest: 'request2/createClosedRequest'
    })
  }
})
export default class PaymentIndexPage extends Vue {
  /// Options
  $refs!: {
    'button-content': HTMLDivElement,
    'button-slider': HTMLDivElement
  }

  // Vuex state
  readonly billingInfo!: object | IBillingInfo
  readonly isHasPromisePayment!: boolean
  readonly promisePayStart!: null | moment.Moment
  readonly promisePayEnd!: null | moment.Moment
  readonly listInvoicePayment!: Record<string, Partial<IDocumentViewerDocument>>

  // Vuex getters
  readonly isLoadingBalance!: boolean
  readonly isEnabledAutoPay!: boolean
  readonly loadingPaymentHistoryBill!: boolean
  readonly activeBillingAccount!: string

  // Vuex actions
  getPaymentHistory!: ({ dateFrom, dateTo }: { dateFrom: moment.Moment, dateTo: moment.Moment }) => Promise<IPaymentHistoryBill[][]>
  getInvoicePayment!: () => Promise<IInfoBillAccount>
  downloadFile!: (payload: { api: API, bucket: string, key: string, ext: string, asPdf?: number }) => Promise<Blob>
  createClosedRequest!: (type: typeClosedNotification) => Promise<string | false>

  // Data
  trackerValue: number = 2
  trackerInterval: number = 0
  paymentHistory: IPaymentHistoryBill[][] = []

  isNotAccessInvoicePayment: boolean = false
  isShowInvoicePayment: boolean = false

  emptyDocument: Partial<IDocumentViewerDocument> = {
    id: '',
    bucket: '',
    fileName: '',
    filePath: '',
    type: { id: '', name: '' }
  }

  isSliderLongerContent: boolean = false
  transformValue: number = 0

  isEndScrollbar: boolean = false
  isStartScrollbar: boolean = true

  isLoadingInvoicePayment: boolean = false

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
  payType = this.listPayType[0]

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

  get sliderStyle () {
    return {
      'transform': `translateX(${this.transformValue}px)`
    }
  }

  get formatFilterPeriod () {
    return `${head(this.period)!.format('DD.MM.YYYY')}-${last(this.period)?.format('DD.MM.YYYY')}`
  }

  get datePickerModel () {
    return [
      new Date(head(this.period)!.format('YYYY-MM-DD 00:00:00')),
      new Date(last(this.period)!.format('YYYY-MM-DD 23:59:59'))
    ]
  }
  set datePickerModel (val) {
    this.period = [
      moment(head(val)!),
      moment(last(val)!)
    ]
    this.$nextTick(() => {
      this.onSaveDatePicker()
    })
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

  async onGetInvoicePaymentHandler () {
    if (this.balance >= 0) {
      this.isNotAccessInvoicePayment = true
      return
    }

    this.isLoadingInvoicePayment = true

    // Получаем информацию об информационном счёте
    try {
      const invoicePaymentResponse = await this.getInvoicePayment()
      const fileResponse = await this.downloadFile({
        api: this.$api,
        bucket: invoicePaymentResponse.bucket,
        key: invoicePaymentResponse.filePath,
        ext: invoicePaymentResponse.fileName.split('.').pop()!
      })

      const filePDF = fileResponse.slice(0, fileResponse.size, 'application/pdf')
      const fileObjectURL = URL.createObjectURL(filePDF)
      const windowOpen = window.open(fileObjectURL)

      if (windowOpen) {
        windowOpen.focus()
      } else {
        /* Всплывающие окна заблокированы - скачиваем файл */
        const link = document.createElement('a')
        link.href = fileObjectURL
        link.download = invoicePaymentResponse.fileName
        document.body.appendChild(link)
        link.click()
      }
      this.createClosedRequest('CN_INVOICE_FOR_PAYMENT')
    } catch (ex) {
      console.error(ex)
    } finally {
      this.isLoadingInvoicePayment = false
    }
  }

  dataLayerPush = dataLayerPush

  onResizeHandler () {
    this.isSliderLongerContent = this.$refs['button-content'].offsetWidth < this.$refs['button-slider'].scrollWidth
    this.transformValue = 0
  }

  onLeftHandler (e: TouchWrapper | number) {
    if (this.isEndScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.transformValue = this.$refs['button-slider'].scrollWidth > this.$refs['button-slider'].offsetWidth + Math.abs(this.transformValue) + Math.abs(offsetX)
      ? this.transformValue - Math.abs(offsetX)
      : -(this.$refs['button-slider'].scrollWidth - this.$refs['button-slider'].offsetWidth)
    this.isStartScrollbar = false
    this.isEndScrollbar = this.$refs['button-slider'].scrollWidth <=
      this.$refs['button-slider'].offsetWidth +
      Math.abs(this.transformValue)
  }

  onRightHandler (e: TouchWrapper | number) {
    if (this.isStartScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.transformValue = Math.abs(this.transformValue) < Math.abs(offsetX)
      ? 0
      : this.transformValue + Math.abs(offsetX)
    this.isEndScrollbar = false
    this.isStartScrollbar = this.transformValue === 0
  }

  onScrollEvent (e: WheelEvent) {
    e.preventDefault()

    if (e.deltaY < 0) {
      // Прокрутка вверх - листаем вправо
      this.onRightHandler(50)
    } else if (e.deltaY > 0) {
      this.onLeftHandler(50)
    }
  }

  onSaveDatePicker () {
    this.getPaymentHistory({ dateFrom: head(this.period)!, dateTo: last(this.period)! })
      .then(response => {
        this.paymentHistory = response
      })
  }

  disabledDateCallback (date: Date) {
    const _date = moment(date)
    return _date > moment() || _date < moment().subtract(6, 'months')
  }

  getMonthByTimestamp (timestamp: number) {
    return ucfirst(moment(timestamp).format('MMMM'))
  }

  getYearByTimestamp (timestamp: number) {
    return moment(timestamp).format('YY')
  }

  mounted () {
    this.isHasPromisePayment && (this.trackerInterval = window.setInterval(() => {
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

    window.addEventListener('resize', this.onResizeHandler)

    this.$nextTick(() => {
      this.onResizeHandler()
    })
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeHandler)
  }
}
