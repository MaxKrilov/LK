import ButtonPay from './components/ButtonPay/index.vue'
import InfoScore from './components/InfoScore/index.vue'
import ActionMonth from './components/ActionMonth/index.vue'
import PaymentsOn from './components/PaymentsOn/index.vue'
import HistoryPay from './HistoryPay/index.vue'
import PromisePay from './PromisePay/index.vue'

export default {
  name: 'pay-page',
  components: {
    ButtonPay,
    InfoScore,
    ActionMonth,
    HistoryPay,
    PromisePay,
    PaymentsOn
  },
  data: () => ({
    pre: 'pay-page',
    isOpenViewer: false,
    invPaymentsForViewer: [],
    showPanel: false
  }),
  methods: {
    history () {
      this.$router.push('history-pay')
    },
    main () {
      this.$router.push('/')
    },
    isOpenView (e) {
      this.invPaymentsForViewer = e
      this.showPanel = true
      this.isOpenViewer = true
    }
  }
}
