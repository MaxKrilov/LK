import {mapGetters, mapState} from "vuex"

export default {
  name: 'button-pay',
  props: ['timer', 'billingAccount'],
  data: () => ({
    pre: 'button-pay'
  }),
  created () {
    const billingAccount = '111111111111'
    this.$store.dispatch('payments/listCard', {
      api: this.$api,
      billingAccount: billingAccount
    })
  },
  computed: {
/*
    ...mapGetters({
      cards: 'payments/getListCard',
    }),
*/
    ...mapState({
      cards: state => state.payments.listCard,
    }),
  },
  methods: {
    aa () {
      // alert(4)
      console.log('!! -> ',this.cards)
    }
  }
}
