import { mapState } from 'vuex'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer/index'
import moment from 'moment'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'

const IS_ENABLED_AUTOPAY = '9149184122213604836'

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
    this.$store.dispatch('payments/promisePayInfo', { api: this.$api })
    this.infoPromisePay()
  },
  computed: {
    ...mapState({
      id: state => state.user.activeBillingAccount,
      promisePayInterval: state => state.payments.promisePayInterval,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer,
      isLoading: state => state.payments.isLoading,
      isPromisePay: state => state.payments.isPromisePay,
      balanceInfo: state => state.user.paymentInfo
    }),
    isAutopay () {
      return this.balanceInfo?.paymentMethod?.id === IS_ENABLED_AUTOPAY
    }
  },
  watch: {
    invPaymentsForViewer () {
      this.$emit('isOpenView', this.invPaymentsForViewer)
    },
    id () {
      this.$store.dispatch('payments/promisePayInfo', { api: this.$api })
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
