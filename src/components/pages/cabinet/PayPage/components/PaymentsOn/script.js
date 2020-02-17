import {mapGetters, mapState} from "vuex";

export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on'
  }),
  created () {
    this.$store.dispatch('payments/status', { api: this.$api, billingAccount: this.activeBillingAccountId })
  },
  computed: {
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccount,
    }),
    ...mapGetters({
      pay_status: 'payments/getPayStatus',
    }),
    mounted () {
      console.log('<-->',this.pay_status)
    }
  },
  methods: {
    addfunds () {
      this.$router.push('/add-funds')
    },
    paypage () {
      this.$router.push('/lk/payments')
    },
  }
}
