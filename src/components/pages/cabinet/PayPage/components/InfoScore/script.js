import { mapState } from 'vuex'
import { price } from '../../../../../../functions/filters'

export default {
  name: 'info-score',
  data: () => ({
    pre: 'info-score',
    balance: 0,
    summToPay: 0,
    nextDate: '',
    isLoading: true,
    info: true
  }),
  filters: {
    price
  },
  created () {
    this.getValuesAccount()
  },
  watch: {
    paymentInfo () {
      this.getValuesAccount()
    }
  },
  computed: {
    ...mapState({
      paymentInfo: state => state.user.paymentInfo
    })
  },
  methods: {
    getValuesAccount () {
      if (this.paymentInfo.nextDate !== undefined) {
        this.summToPay = Number(this.paymentInfo.summToPay)
        this.balance = Number(this.paymentInfo.balance)
        const d = this.paymentInfo.nextDate
        this.nextDate = d.slice(0, -4) + d.slice(-2)
        this.isLoading = false
      }
    }
  }
}
