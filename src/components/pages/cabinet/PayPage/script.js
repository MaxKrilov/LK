import ButtonPay from './components/ButtonPay/index.vue'
import InfoScore from './components/InfoScore/index.vue'
import ActionMonth from './components/ActionMonth/index.vue'
import PaymentsOn from './components/PaymentsOn/index.vue'
import HistoryPay from './HistoryPay/index.vue'
import PromisePay from './PromisePay/index.vue'
import { mapState } from 'vuex'
import moment from 'moment'
import { getFirstElement } from '../../../../functions/helper'

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
    showPanel: false,
    currentMonth: '',
    defaultMonth: 1,
    listPayCurrMonth: [],
    isVisEmpty: true
  }),
  created () {
    this.currentYear = moment().locale('ru').format('YY')
    if (this.listPayments.length > 0) this.operationsLastMonth()
  },
  watch: {
    listPayments () {
      this.operationsLastMonth()
    }
  },
  computed: {
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccountId,
      isLoadingList: state => state.payments.isLoadingList,
      listPayments: state => state.payments.listPayments
    }),
    getListHistoryPaymentByCurrentMonth () {
      const currentMonth = moment().format('M')
      return this.listPayments.filter(listPaymentsItem => {
        return getFirstElement(listPaymentsItem) &&
          moment(getFirstElement(listPaymentsItem).timestamp).format('M') === currentMonth
      })
    },
    isEmptyListHistory () {
      return !!this.getListHistoryPaymentByCurrentMonth.length
    }
  },
  methods: {
    operationsLastMonth () {
      this.currentMonth = []
      for (let i = 0; i < this.listPayments.length; i++) {
        let lp = this.listPayments[i]
        const str = moment().locale('ru').format('MMMM')
        let month = str[0].toUpperCase() + str.slice(1)
        if (lp[0].month === month) {
          this.currentMonth = lp[0].month
          this.listPayCurrMonth[0] = lp
        }
      }
      if (!this.isLoadingList) this.isVisEmpty = this.listPayCurrMonth.length !== 0
    },
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
