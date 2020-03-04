import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
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
    widthContainer: '108% !important',
    widthContButt: '108% !important'
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    }
  },
  mounted () {
    this.changeWidth()
  },
  methods: {
    // todo-er Перенести в css
    changeWidth () {
      if (this[SCREEN_WIDTH] <= 337) {
        this.widthContainer = '108% !important'
        this.widthContButt = '100% !important'
      }
      if (this[SCREEN_WIDTH] > 337 && this[SCREEN_WIDTH] <= 480) {
        this.widthContainer = '108% !important'
        this.widthContButt = '108% !important'
      }
      if (this[SCREEN_WIDTH] > 480 && this[SCREEN_WIDTH] <= 800) {
        this.widthContainer = '108% !important'
        this.widthContButt = '108% !important'
      }
      if (this[SCREEN_WIDTH] > 800 && this[SCREEN_WIDTH] < 900) {
        this.widthContainer = '107% !important'
        this.widthContButt = '107% !important'
      }
      if (this[SCREEN_WIDTH] >= 900 && this[SCREEN_WIDTH] < 960) {
        this.widthContainer = '106% !important'
        this.widthContButt = '107% !important'
      }
      if (this[SCREEN_WIDTH] >= 960) {
        this.widthContainer = '100% !important'
        this.widthContButt = '100% !important'
      }
      if (this[SCREEN_WIDTH] >= 1200) {
        this.widthContainer = '104% !important'
        this.widthContButt = '104% !important'
      }
      if (this[SCREEN_WIDTH] >= 1400) {
        this.widthContainer = '111% !important'
        this.widthContButt = '111% !important'
      }
    },
    history () {
      this.$router.push('/history-pay')
    },
    main () {
      this.$router.push('/')
    }
  }
}
