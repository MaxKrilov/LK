import { mapState, mapMutations } from 'vuex'
import { SCREEN_WIDTH } from '../../../../../../store/actions/variables'
import {
  BREAKPOINT_LG,
  BREAKPOINT_SM,
  BREAKPOINT_XL
} from '../../../../../../constants/breakpoint'

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
      activeBillingAccountId: state => state.user.activeBillingAccountNumber,
      screenWidth: state => state.variables[SCREEN_WIDTH]
    }),
    computedProgressCircular () {
      if (this.screenWidth < BREAKPOINT_SM) {
        return 64
      } else if (this.screenWidth < BREAKPOINT_LG) {
        return 80
      } else if (this.screenWidth < BREAKPOINT_XL) {
        return 96
      } else {
        return 128
      }
    }
  },
  methods: {
    ...mapMutations('chat', [
      'openChat'
    ]),
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
