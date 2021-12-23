import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { IPaymentStatus } from '@/tbapi/payments'
import { dataLayerPush } from '@/functions/analytics'

@Component<InstanceType<typeof PaymentResultPage>>({
  computed: {
    ...mapGetters({
      activeBillingAccount: 'payments/getActiveBillingAccount'
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

  // Vuex actions
  readonly checkPaymentStatus!: ({ transaction }: { transaction: string }) => Promise<IPaymentStatus>
  readonly getBillingInfo!: () => Promise<void>

  // Vuex mutations
  readonly openChat!: () => void

  // Data
  status: 0 | 1 | 2 = 2
  interval: number = 5

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

  checkStatus () {
    const transaction = this.$route.query.transaction
    typeof transaction === 'string' && this.checkPaymentStatus({ transaction })
      .then(response => {
        if (Number(response.pay_status) === 0) {
          dataLayerPush({ action: 'failed', category: 'payment', label: '' })
        } else if (Number(response.pay_status) === 1) {
          dataLayerPush({ action: 'success', category: 'payment', label: '' })
        }
        if (Number(response.pay_status) === 2) {
          setTimeout(() => {
            this.checkStatus()
          }, this.interval * 1000)
        } else {
          this.status = Number(response.pay_status) as 0 | 1 | 2
          if (this.status === 1) {
            setTimeout(() => {
              this.getBillingInfo()
            }, 1000)
          }
        }
      })
      .catch(() => { this.status = 0 })
  }

  mounted () {
    this.activeBillingAccount && this.checkStatus()
  }
}
