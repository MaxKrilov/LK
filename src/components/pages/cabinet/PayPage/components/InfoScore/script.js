import { mapState } from 'vuex'

export default {
  name: 'info-score',
  data: () => ({
    pre: 'info-score',
    balance: '',
    summToPay: '',
    nextDate: '',
    isLoading: true,
    info: true
  }),
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
        this.summToPay = Number(this.paymentInfo.summToPay).toLocaleString('ru-RU')
        this.balance = -this.paymentInfo.balance
        if (this.balance > 0) this.info = false
        this.balance = Number(this.balance).toLocaleString('ru-RU')
        const d = this.paymentInfo.nextDate
        this.nextDate = d.slice(0, -4) + d.slice(-2)
        this.isLoading = false
      }
    }
  }
}
