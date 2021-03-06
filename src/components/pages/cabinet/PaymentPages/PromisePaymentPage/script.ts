import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'
import moment from 'moment'
import { leadingZero } from '@/functions/filters'
import { getNoun } from '@/functions/helper'

import ErPromo from '@/components/blocks/ErPromo/index.vue'
import { IBillingInfo } from '@/tbapi/payments'
import { typeClosedNotification } from '@/constants/closed_notification'

const promo = require('./promo.json')

@Component<InstanceType<typeof PromisePaymentPage>>({
  components: {
    ErPromo
  },
  filters: {
    leadingZero
  },
  computed: {
    ...mapState({
      isCanActivatePromisePayment: (state: any) => state.payments.isCanActivatePromisePayment,
      reasonCanntActivatePromisePayment: (state: any) => state.payments.reasonCanntActivatePromisePayment,
      isHasPromisePayment: (state: any) => state.payments.isHasPromisePayment,
      promisePayStart: (state: any) => state.payments.promisePayStart,
      promisePayEnd: (state: any) => state.payments.promisePayEnd,
      branchId: (state: any) => (state.payments.billingInfo as IBillingInfo).branchId
    }),
    ...mapGetters({
      loadingPromisedPayment: 'loading/loadingPromisedPayment',
      getManagerInfo: 'user/getManagerInfo'
    })
  },
  watch: {
    isHasPromisePayment (val) {
      val && (this.trackerInterval = setInterval(() => {
        this.trackerValue = this.trackerValue === 1 ? 2 : 1
      }, 1000 * 60))
    }
  },
  methods: {
    ...mapActions({
      createOrderPromisePayment: 'payments/createOrderPromisePayment',
      cancelOrderPromisePayment: 'payments/cancelOrderPromisePayment',
      sendOrderPromisePayment: 'payments/sendOrderPromisePayment',
      createClosedPayment: 'request2/createClosedRequest',
      createOpenedRequest: 'request2/createOpenedRequest'
    })
  }
})
export default class PromisePaymentPage extends Vue {
  // Vuex state
  readonly isCanActivatePromisePayment!: boolean
  readonly reasonCanntActivatePromisePayment!: string
  readonly isHasPromisePayment!: boolean
  readonly promisePayStart!: null | moment.Moment
  readonly promisePayEnd!: null | moment.Moment
  readonly branchId!: string

  // Vuex getters
  readonly loadingPromisedPayment!: boolean
  readonly getManagerInfo!: { name: string, phone: string, email: string }

  // Vuex actions
  readonly createOrderPromisePayment!: ({ marketId }: { marketId: string }) => Promise<void>
  readonly cancelOrderPromisePayment!: () => Promise<void>
  readonly sendOrderPromisePayment!: () => Promise<void>
  readonly createClosedPayment!: (type: typeClosedNotification) => Promise<string | false>
  readonly createOpenedRequest!: (type: typeClosedNotification) => Promise<string | false>

  // Data
  infoText = '???? ???????????? ???????????????????????? ???????????? <b>???????????????????? ??????????????</b>, ?????????????? ???????????????? ?????? <b>???????????????? ???????????? ?? ?????????????? ???? 3 ??????</b>. ???????????????????????????? ?????????? ???? ?????????????????????? ???? ??????????????????.'
  promo = promo

  isActivatingPromisePayment: boolean = false
  isConfirmingPromisePayment: boolean = false

  isShowConfirmDialog: boolean = false
  isShowSuccessDialog: boolean = false
  isShowErrorDialog: boolean = false

  errorText = ''

  trackerValue: number = 1
  trackerInterval: number = 0

  // Computed
  get beforePromisedPayEnd () {
    if (!this.isHasPromisePayment || !this.promisePayEnd) return { d: 0, h: 0, m: 0 }
    const now = moment()
    const end = this.promisePayEnd
    const duration = moment.duration(end.diff(now))
    return this.trackerValue
      ? { d: duration.days(), h: duration.hours(), m: duration.minutes() }
      : { d: 0, h: 0, m: 0 }
  }

  get isExpiredPromisePay () {
    if (!this.isHasPromisePayment || this.promisePayEnd == null) return false

    return moment().valueOf() > this.promisePayEnd.valueOf()
  }

  // Methods
  onActivatePromisePayment () {
    this.isActivatingPromisePayment = true
    this.createOrderPromisePayment({ marketId: this.branchId })
      .then(() => {
        this.isShowConfirmDialog = true
      })
      .catch(() => { this.errorText = '?????????????????? ????????????! ?????????????????? ?????????????? ?????????? ?????? ???????????????????? ?? ???????????? ?????????????????????????? ??????????????????' })
      .finally(() => { this.isActivatingPromisePayment = false })
  }

  onCancelPromisePayment () {
    this.isShowConfirmDialog = false
    // ???????????????? ?????????? ?? ????????
    this.cancelOrderPromisePayment()
  }

  onConfirmPromisePayment () {
    this.isConfirmingPromisePayment = true
    this.sendOrderPromisePayment()
      .then(() => {
        this.isShowSuccessDialog = true
        this.createClosedPayment('CN_PROMISED_PAYMENT')
      })
      .catch(() => {
        this.isShowErrorDialog = true
      })
      .finally(() => {
        this.isConfirmingPromisePayment = false
        this.isShowConfirmDialog = false
      })
  }

  getNoun (number: number, one: string, two: string, five: string) {
    return getNoun(number, one, two, five)
  }

  mounted () {
    this.isHasPromisePayment && (this.trackerInterval = setInterval(() => {
      this.trackerValue = this.trackerValue === 1 ? 2 : 1
    }, 1000 * 60))
  }
}
