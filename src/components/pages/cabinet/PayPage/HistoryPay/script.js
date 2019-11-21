import FiltersPay from '../components/FiltersPay/index.vue'
import ActionMonth from '../components/ActionMonth/index.vue'

export default {
  name: 'pay-page',
  components: {
    ActionMonth,
    FiltersPay
  },
  data: () => ({
    pre: 'history-pay',
    openLeftMenu: false,
  }),
  methods: {
    paypage () {
      this.$router.push('/lk/pay')
    },
  }

}
