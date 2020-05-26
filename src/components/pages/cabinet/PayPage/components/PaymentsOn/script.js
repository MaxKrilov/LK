import { mapState } from 'vuex'

export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on',
    isStatus: null,
    color: '',
    height: '',
    email: '',
    infoPay: 'Идет проверка статуса платежа...',
    pay: false
  }),
  created () {
    const payload = {
      transaction: this.$route.query.transaction,
      billingAccount: this.$route.query.billing_account
    }
    this.$store.dispatch('payments/status', { api: this.$api, payload: payload })
  },
  watch: {
    statusPay () {
      this.pay = true
      if (this.statusPay === '1') {
        this.isStatus = true
        this.color = 'green'
        this.height = ''
      } else {
        this.isStatus = false
        this.color = 'red'
        this.height = '__height'
        this.infoPay = 'Оплата не прошла'
      }
      this.email = localStorage.getItem('email')
      return this.statusPay
    }
  },
  computed: {
    ...mapState({
      statusPay: state => state.payments.pay_status,
      activeBillingAccountId: state => state.user.activeBillingAccountNumber
    })
  },
  methods: {
    addfunds () {
      this.$router.push('/lk/add-funds')
    },
    paypage () {
      this.$router.push('/lk/payments')
    }
  }
}
