import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'
import moment from 'moment'
import { leadingZero } from '@/functions/filters'
import { getNoun } from '@/functions/helper'

import ErPromo from '@/components/blocks/ErPromo/index.vue'

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
      promisePayEnd: (state: any) => state.payments.promisePayEnd
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
      sendOrderPromisePayment: 'payments/sendOrderPromisePayment'
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

  // Vuex getters
  readonly loadingPromisedPayment!: boolean
  readonly getManagerInfo!: { name: string, phone: string, email: string }

  // Vuex actions
  readonly createOrderPromisePayment!: () => Promise<void>
  readonly cancelOrderPromisePayment!: () => Promise<void>
  readonly sendOrderPromisePayment!: () => Promise<void>

  // Data
  infoText = 'Вы можете активировать сервис <b>«обещанный платеж»</b>, который позволит вам <b>получить доступ к услугам на 3 дня</b>. Дополнительная плата за пользование не взымается.'
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
    this.createOrderPromisePayment()
      .then(() => {
        this.isShowConfirmDialog = true
      })
      .catch(() => { this.errorText = 'Произошла ошибка! Повторите попытку позже или обратитесь к Вашему персональному менеджеру' })
      .finally(() => { this.isActivatingPromisePayment = false })
  }

  onCancelPromisePayment () {
    this.isShowConfirmDialog = false
    // Отменяем заказ в фоне
    this.cancelOrderPromisePayment()
  }

  onConfirmPromisePayment () {
    this.isConfirmingPromisePayment = true
    this.sendOrderPromisePayment()
      .then(() => {
        this.isShowSuccessDialog = true
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
