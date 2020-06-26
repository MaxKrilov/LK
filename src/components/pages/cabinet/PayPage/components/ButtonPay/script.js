import { mapState } from 'vuex'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer/index'
import moment from 'moment'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'

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
    isNotAccessInvPayment: false
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
      promisePayInterval: state => state.payments.promisePayInterval,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer,
      isLoading: state => state.payments.isLoading,
      isPromisePay: state => state.payments.isPromisePay,
      visAutoPay: state => state.payments.visAutoPay,
      listPayments: state => state.payments.listPayments
    })
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
    isPromisePay () {
      this.infoPromisePay()
    },
    isOpenViewer (val) {
      if (Number(this.balanceInfo.balance) >= 0) {
        this.isNotAccessInvPayment = true
      } else if (val && this.invPaymentsForViewer[0].filePath === '') {
        this.$store.dispatch(`payments/invPayment`, { api: this.$api })
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
