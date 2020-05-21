import { mapState } from 'vuex'
import moment from 'moment/moment'

export default {
  name: 'promise-on',
  data: () => ({
    pre: 'promise-on',
    day: '',
    hour: '',
    minute: ''
  }),
  created () {
    this.infoPromisePay()
  },
  computed: {
    ...mapState({
      id: state => state.user.activeBillingAccount,
      promisePayInterval: state => state.payments.promisePayInterval,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer,
      isLoading: state => state.payments.isLoading,
      isPromisePay: state => state.payments.isPromisePay
    })
  },
  watch: {
    id () {
      this.$store.dispatch('payments/promisePayInfo', { api: this.$api, id: this.id })
    },
    promisePayInterval () {
      this.infoPromisePay()
    }
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    },
    infoPromisePay () {
      if (!this.isPromisePay) {
        const MLSECDAY = 86400000
        const t = this.promisePayInterval
        const dateTo = new Date(Date.parse(moment(t).format('YYYY-MM-DDT23:59')))
        const interval = dateTo - new Date() > 0 ? dateTo - new Date() : 0
        const diff = new Date(interval)
        this.day = diff.getUTCDate() - 1
        this.hour = ('0' + diff.getUTCHours()).slice(-2)
        this.minute = ('0' + diff.getUTCMinutes()).slice(-2)
        this.widthPgsBar = Math.round(interval * 100 / (3 * MLSECDAY))
      }
    }
  }
}
