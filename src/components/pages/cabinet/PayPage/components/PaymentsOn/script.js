import { mapState } from 'vuex'

export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on',
    isStatus: null,
    color: '',
    height: '',
    email: '',
    infoPay: 'Платёж в обработке',
    pay: false,
    isVisible: false,
    oneLoad: false,
    time: 10
  }),
  created () {
    setTimeout(() => {
      this.oneLoad = true
    }, 10000)
    this.currentStatus()
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
    },
    currentStatus () {
      this.time = 10
      this.isVisible = false
      let timerId = setInterval(() => {
        this.time--
        if (this.time === 0) {
          clearInterval(timerId)
          this.isVisible = true
        }
      }, 1000)
      const payload = {
        transaction: this.$route.query.transaction,
        billingAccount: this.$route.query.billing_account
      }
      this.$store.dispatch('payments/status', { api: this.$api, payload })
    }
  }
}
