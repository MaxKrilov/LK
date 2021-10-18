import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { IPaymentStatus } from '@/tbapi/payments'
import { BroadcastChannel as BroadcastChannelPolyfill } from 'broadcast-channel'

@Component<InstanceType<typeof PaymentResultPage>>({
  computed: {
    ...mapGetters({
      activeBillingAccount: 'payments/getActiveBillingAccount',
      activeBillingAccountNumber: 'payments/getActiveBillingAccountNumber'
    })
  },
  methods: {
    ...mapActions({
      checkPaymentStatus: 'payments/checkPaymentStatus',
      getBillingInfo: 'payments/getBillingInfo'
    }),
    ...mapMutations('chat', [
      'openChat'
    ])
  },
  watch: {
    activeBillingAccount (val) {
      val && this.checkStatus()
    }
  }
})
export default class PaymentResultPage extends Vue {
  // Vuex getters
  readonly activeBillingAccount!: string
  readonly activeBillingAccountNumber!: string

  // Vuex actions
  readonly checkPaymentStatus!: ({ transaction }: { transaction: string }) => Promise<IPaymentStatus>
  readonly getBillingInfo!: () => Promise<void>

  // Vuex mutations
  readonly openChat!: () => void

  // Data
  status: 0 | 1 | 2 = 2
  interval: number = 5
  broadcastChannel: null | BroadcastChannel | BroadcastChannelPolyfill<any> = null

  get defineIcon () {
    return this.status === 0
      ? 'cancel'
      : this.status === 1
        ? 'circle_ok'
        : 'reload'
  }

  get defineIconClass () {
    return this.status === 0
      ? 'error'
      : this.status === 1
        ? 'success'
        : 'check'
  }

  get defineTitleText () {
    return this.status === 0
      ? 'Оплата не прошла'
      : this.status === 1
        ? 'Оплата прошла успешно'
        : 'Платёж в обработке'
  }

  get email () {
    return localStorage.getItem('email')
  }

  get issetBroadcastChannel () {
    return !!window.BroadcastChannel
  }

  sendData () {
    this.broadcastChannel!.postMessage({ eventType: 'ertPayments', state: 'success' })
  }

  closeWindow () {
    this.broadcastChannel!.postMessage({ eventType: 'ertPayments', state: 'close' })
  }

  backToPayment () {
    const paymentAmount = localStorage.getItem('ecommerce-popup__amount')
    const activeBillingAccountNumber = localStorage.getItem('ecommerce-popup__billing-account-number')

    location.href = `${location.origin}/ecommerce/payment?total_amount=${paymentAmount}&billing_account=${activeBillingAccountNumber}`
  }

  resetLocalStorage () {
    localStorage.removeItem('ecommerce-popup__amount')
    localStorage.removeItem('ecommerce-popup__billing-account-number')
  }

  checkStatus () {
    const transaction = this.$route.query.transaction || localStorage.getItem('ecommerce__transaction')
    typeof transaction === 'string' && this.checkPaymentStatus({ transaction })
      .then(response => {
        if (Number(response.pay_status) === 2) {
          setTimeout(() => {
            this.checkStatus()
          }, this.interval * 1000)
        } else {
          this.status = Number(response.pay_status) as 0 | 1 | 2
          if (this.status === 1) {
            this.sendData()
            this.resetLocalStorage()
          }
        }
      })
      .catch(() => { this.status = 0 })
  }

  mounted () {
    this.activeBillingAccount && this.checkStatus()
    this.broadcastChannel = this.issetBroadcastChannel
      ? new BroadcastChannel('erth-payment')
      : new BroadcastChannelPolyfill('erth-payment')
  }
}
