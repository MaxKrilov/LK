import { mapState } from 'vuex'

export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on',
    isStatus: null,
    color: '',
    height: '',
    infoPay: 'Идет проверка статуса платежа...',
    pay: false
  }),
  created () {
    const q = window.location.search.replace('?', '')
    const payload = {
      transaction: q.substr(q.indexOf('transaction') + 12, 11),
      billingAccount: q.substr(q.indexOf('billing_account') + 16, 19)
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
      return this.statusPay
    }
  },
  computed: {
    ...mapState({
      statusPay: state => state.payments.pay_status
    })
  },
  methods: {
    status () {
      if (this.status === 1) {
        this.isStatus = true
        this.color = 'green'
        this.height = ''
      } else {
        this.isStatus = false
        this.color = 'red'
        this.height = '__height'
      }
    },
    addfunds () {
      this.$router.push('/add-funds')
    },
    paypage () {
      this.$router.push('/lk/payments')
    }
  }
}
