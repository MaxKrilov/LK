import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import PromiseOn from '../components/PromiseOn/index.vue'
import PromiseOff from '../components/PromiseOff/index.vue'
import PromiseExpired from '../components/PromiseExpired/index.vue'
import Confirm from '../components/Confirm/index.vue'

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
    visInfo: true,
    visExpired: false,
    success: false,
    active: true,
    date: '29.01.2019'
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  created () {
    this.dateAll = 'до ' + this.date
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    },
    paymentConfirm () {
      this.openConfirmPromise = true
    },
    promiseOn () {
      this.openConfirmPromise = false
      this.visInfo = false
      this.success = true
    },
    promiseOff () {
      this.openConfirmPromise = false
      this.visInfo = false
      this.success = false
    },
    promiseExpired () {
      this.openConfirmPromise = false
      this.visExpired = true
      this.visInfo = false
      this.active = false
    }
  }
}
