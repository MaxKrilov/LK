import ButtonPay from './components/ButtonPay/index.vue'
import InfoScore from './components/InfoScore/index.vue'
import ActionMonth from './components/ActionMonth/index.vue'
import HistoryPay from './HistoryPay/index.vue'

export default {
  name: 'pay-page',
  components: {
    ButtonPay,
    InfoScore,
    ActionMonth,
    HistoryPay
  },
  data: () => ({
    pre: 'pay-page'
  }),
  methods: {
    history () {
      this.$router.push('/history-pay')
    }
  }
}
