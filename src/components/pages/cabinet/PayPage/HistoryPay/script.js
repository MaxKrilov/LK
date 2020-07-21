import Vue from 'vue'
import FiltersPay from '../components/FiltersPay/index.vue'
import ActionMonth from '../components/ActionMonth/index.vue'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'pay-page',
  components: {
    ActionMonth,
    FiltersPay
  },
  data: () => ({
    pre: 'history-pay',
    currentMonth: [],
    listPaymentsFilter: [],
    periodFilter: [],
    typePay: 'Все платежи',
    typeDefault: 'Все платежи',
    posMonth: 0,
    isVisEmpty: true
  }),
  created () {
    this.currentYear = moment().locale('ru').format('YY')
    this.setPeriodDate('currentMonth')
  },
  watch: {
    activeBillingAccount () {
      this.setPeriodDate('select')
    },
    listPayments () {
      this.setPeriodDate('currentMonth')
    }
  },
  computed: {
    ...mapState({
      activeBillingAccount: state => state.user.activeBillingAccount,
      isLoadingList: state => state.payments.isLoadingList,
      listPayments: state => state.payments.listPayments
    })
  },
  methods: {
    setPeriodDate (select) {
      const payload = [
        +new Date(moment().startOf('month')),
        +new Date()
      ]
      if (select === 'currentMonth') {
        this.createFilteredData(payload)
      } else {
        this.$store.dispatch('payments/history', { api: this.$api, payload })
      }
    },
    setPeriodFilter (select) {
      this.typeDefault = select[0]
      this.periodFilter = select[1]
      this.createFilteredData(this.periodFilter)
    },
    setTypePayFilter (select) {
      this.typeDefault = select[0]
      this.periodFilter = select[1]
      this.createFilteredData(this.periodFilter)
    },
    createFilteredData (period) {
      this.listPaymentsFilter = []
      const dateFrom = +new Date(period[0])
      const dateTo = +new Date(period[1])
      let isFilterType, listPay
      let monthPay = 0
      let m = 0
      let len = 0
      for (let i = 0; i < this.listPayments.length; i++) {
        listPay = this.listPayments[i]
        monthPay = m
        for (let j = 0; j < listPay.length; j++) {
          let dateLine = listPay[j].timestamp
          let selTypePay = listPay[j].title === 'Пополнение счёта' ? 'Начисление' : 'Списание'
          if (this.typeDefault === 'Все платежи') {
            isFilterType = true
          } else {
            isFilterType = this.typeDefault === selTypePay
          }
          if (dateLine >= dateFrom && dateLine <= dateTo && isFilterType) {
            if (j === 0) {
              Vue.set(this.listPaymentsFilter, m, [])
              Vue.set(this.currentMonth, m, listPay[0].month)
              m++
            }
            let lpf = this.listPaymentsFilter[monthPay]
            if (lpf === undefined) lpf = []
            len = lpf.length
            lpf[len] = []
            Vue.set(lpf, len, listPay[j])
          }
        }
      }
      if (!this.isLoadingList) this.isVisEmpty = this.listPaymentsFilter.length !== 0
    },
    toPayments () {
      this.$router.push('/lk/payments')
    }
  }
}
