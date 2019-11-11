import Operations from './components/Operations/index.vue'
import ButtonPay from './components/ButtonPay/index.vue'
import InfoScore from './components/InfoScore/index.vue'
import ActionMonth from './components/ActionMonth/index.vue'

export default {
  name: 'pay-page',
  components: {
    Operations,
    ButtonPay,
    InfoScore,
    ActionMonth
  },
  data: () => ({
    pre: 'pay-page'
  })
}
