import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import PromiseOn from '../components/PromiseOn/index.vue'
import PromiseOff from '../components/PromiseOff/index.vue'
import PromiseExpired from '../components/PromiseExpired/index.vue'
import Confirm from '../components/Confirm/index.vue'
import moment from 'moment'

export default {
  name: 'promise-pay',
  components: {
    PromiseOn,
    PromiseOff,
    PromiseExpired,
    Confirm
  },
  data: () => ({
    pre: 'promise-pay',
    openConfirmPromise: false,
    visInfo: null,
    visExpired: false,
    success: true,
    active: true,
    date: '',
    dateWithDot: '',
    errText: '',
    err: ''
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    ...mapState({
      marketingBrandId: state => state.user.paymentInfo.marketingBrandId,
      errPromisePay: state => state.payments.errPromisePay,
      isExpired: state => state.payments.isExpired
    })
  },
  created () {
    const date = moment().add(3, 'days')
    this.date = date.format('YYYYMMDD')
    this.dateWithDot = date.format('DD.MM.YYYY')
    const isPromisePay = this.$store.state.payments.isPromisePay
    const expired = this.$store.state.payments.isExpired
    if (isPromisePay) {
      this.visInfo = true
    } else {
      if (expired) {
        this.visExpired = true
        this.active = false
      } else {
        this.success = false
        this.active = true
      }
    }
    this.dateAll = 'до ' + this.dateWithDot
  },
  watch: {
    errPromisePay () {
      this.$store.dispatch('payments/isLoadingClean')
    }
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    },
    paymentConfirm () {
      this.openConfirmPromise = true
      if (this.$store.state.payments.isDebt) {
        this.$store.dispatch('payments/isLoadingClean')
        this.err = 'По счету нет дебиторской задолженности. Услуга активирована быть не может.'
      } else {
        this.err = 'Произошла ошибка. Попробуйте позднее или обратитесь в техническую поддержку'
        const payload = {
          date: this.date,
          marketingBrandId: this.marketingBrandId
        }
        this.$store.dispatch('payments/appCreation', { api: this.$api, payload })
      }
    },
    promiseOn () {
      this.$store.dispatch('payments/appSend', { api: this.$api, date: this.date })
      this.visInfo = false
      this.success = true
    },
    promiseOff () {
      if (!this.$store.state.payments.isDebt) {
        this.$store.dispatch('payments/appCancel', { api: this.$api })
      }
      this.openConfirmPromise = false
    },
    closeConfirm () {
      this.openConfirmPromise = false
    },
    promiseExpired () {
      this.openConfirmPromise = false
      this.visExpired = true
      this.visInfo = false
      this.active = false
    }
  }
}
