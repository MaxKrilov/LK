import { mapState } from 'vuex'
import moment from 'moment/moment'
import { leadingZero } from '../../../../../../functions/filters'

export default {
  name: 'promise-on',
  data: () => ({
    pre: 'promise-on',
    day: '',
    hour: '',
    minute: '',
    trackerIntervalPromisePay: 1,
    idIntervalPromisePay: 0
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
      // Информация об ОП
      isPromisePay: state => state.user.isHasPromisePayment,
      promisePayStart: state => state.user.promisePayStart,
      promisePayEnd: state => state.user.promisePayEnd
    }),
    getToDatePromisePay () {
      if (!this.isPromisePay) return { day: '', hour: '', minute: '' }
      const current = this.$moment()
      const diff = this.promisePayEnd.diff(current)
      const duration = this.$moment.duration(diff)
      return {
        day: this.trackerIntervalPromisePay ? leadingZero(duration.days(), 2) : '0',
        hour: this.trackerIntervalPromisePay ? leadingZero(duration.hours(), 2) : '0',
        minute: this.trackerIntervalPromisePay ? leadingZero(duration.minutes(), 2) : '0'
      }
    }
  },
  watch: {
    id () {
      this.$store.dispatch('payments/promisePayInfo', { api: this.$api, id: this.id })
    },
    promisePayInterval () {
      this.infoPromisePay()
    },
    isPromisePay (val) {
      if (val) {
        this.idIntervalPromisePay = setInterval(() => {
          this.trackerIntervalPromisePay === 1
            ? this.trackerIntervalPromisePay++
            : this.trackerIntervalPromisePay--
          const current = this.$moment().unix()
          const end = this.promisePayEnd.unix()
          if (current >= end) {
            clearInterval(this.idIntervalPromisePay)
          }
        }, 1000)
      }
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
