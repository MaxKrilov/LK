import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import PromiseOn from '../components/PromiseOn/index.vue'
import PromiseOff from '../components/PromiseOff/index.vue'
import PromiseExpired from '../components/PromiseExpired/index.vue'


export default {
  name: 'promise-pay',
  components: {
    PromiseOn,
    PromiseOff,
    PromiseExpired
  },
  data: () => ({
    pre: 'promise-pay',
    openConfirmPromise: false,
    visButtConf: false,
    visInfo: true,
    visExpired: false,
    success: false,
    active: true
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    },
    paymentConfirm () {
      this.openConfirmPromise = true
      this.visButtConf = this[SCREEN_WIDTH] < 1200
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
    },
  }
}
