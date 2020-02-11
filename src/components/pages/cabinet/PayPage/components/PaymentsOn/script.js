import {mapGetters, mapState} from "vuex";

export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on'
  }),
  created: {
    status () {
      this.$store.dispatch('payments/status', { cvc: this.cvc[this.index - 1] })
    }
  },
  computed: {
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccount,
    }),
  },
  methods: {
    tryAgain () {
      this.$emit('try')
    }
  }
}
