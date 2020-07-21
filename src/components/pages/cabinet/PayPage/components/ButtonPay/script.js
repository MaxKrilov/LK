import { mapState, mapGetters } from 'vuex'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer/index'
import moment from 'moment'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'
import { leadingZero } from '../../../../../../functions/filters'

export default {
  name: 'button-pay',
  components: {
    ErDocumentViewer,
    ErActivationModal
  },
  props: ['timer'],
  data: () => ({
    pre: 'button-pay',
    day: '',
    hour: '',
    minute: '',
    widthPgsBar: '',
    isOpenViewer: false,
    isExpired: true,
    isNotAccessInvPayment: false,
    trackerIntervalPromisePay: 1,
    idIntervalPromisePay: 0
  }),
  created () {
    if (this.isLoading === false) this.$store.dispatch('payments/isLoadingTrue')
    const billingAccount = this.$store.state.user.activeBillingAccount
    if (billingAccount !== '') {
      this.$store.dispatch('payments/promisePayInfo', { api: this.$api })
    }

    const ll = this.$store.state.payments.isLoadedList
    if (!ll && billingAccount) {
      const payload = [ moment().subtract('months', 6), +new Date() ]
      this.$store.dispatch('payments/history', { api: this.$api, payload })
    }
    this.infoPromisePay()
  },
  computed: {
    ...mapState({
      id: state => state.user.activeBillingAccount,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer,
      isLoading: state => state.payments.isLoading,
      visAutoPay: state => state.payments.visAutoPay,
      listPayments: state => state.payments.listPayments,
      balanceInfo: state => state.user.paymentInfo,
      // Информация об ОП
      isPromisePay: state => state.user.isHasPromisePayment,
      isCanActivatePromisePayment: state => state.user.isCanActivatePromisePayment,
      promisePayStart: state => state.user.promisePayStart,
      promisePayEnd: state => state.user.promisePayEnd
    }),
    ...mapGetters({
      loadingPromisedPayment: 'loading/loadingPromisedPayment'
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
    },

    getWidthPromisePayLine () {
      if (!this.isPromisePay) return 0
      const current = this.$moment()
      return this.trackerIntervalPromisePay
        ? (1 - (current - this.promisePayStart) / (this.promisePayEnd - this.promisePayStart)) * 100
        : 0
    }
  },
  watch: {
    invPaymentsForViewer () {
      this.$emit('isOpenView', this.invPaymentsForViewer)
    },
    id () {
      this.$store.dispatch('payments/promisePayInfo', { api: this.$api })
      const payload = [ +new Date(new Date().setDate(1)), +new Date() ]
      this.$store.dispatch('payments/history', { api: this.$api, payload })
    },
    promisePayInterval () {
      this.infoPromisePay()
    },
    isOpenViewer (val) {
      if (Number(this.balanceInfo.balance) >= 0) {
        this.isNotAccessInvPayment = true
      } else if (val && this.invPaymentsForViewer[0].filePath === '') {
        this.$store.dispatch(`payments/invPayment`, { api: this.$api })
      }
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
    invPayment () {
      if (Number(this.balanceInfo.balance) >= 0) {
        this.isNotAccessInvPayment = true
      } else {
        this.$store.dispatch('payments/invPayment', { api: this.$api })
      }
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
        this.isExpired = interval > 0
        this.$store.dispatch('payments/isExpired', { payload: !this.isExpired })
      }
    },
    getEventsForInvPayments (on) {
      if (Number(this.balanceInfo.balance) >= 0) {
        return {
          click: (e) => {
            e.preventDefault()
            this.isNotAccessInvPayment = true
          }
        }
      }
      return on
    }
  }
}
