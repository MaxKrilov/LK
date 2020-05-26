import { mapState } from 'vuex'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer/index'
import moment from 'moment'

export default {
  name: 'button-pay',
  components: {
    ErDocumentViewer
  },
  props: ['timer'],
  data: () => ({
    pre: 'button-pay',
    day: '',
    hour: '',
    minute: '',
    widthPgsBar: '',
    isOpenViewer: false,
    isExpired: true
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
      isPromisePay: state => state.payments.isPromisePay
    })
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
    isExpired () {
    }
  },
  methods: {
    invPayment () {
      this.$store.dispatch('payments/invPayment', { api: this.$api })
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
    }
  }
}
