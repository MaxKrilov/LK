import PayCard from '../components/PayCard/index.vue'
import PaymentsOn from '../components/PaymentsOn/index.vue'
import PaymentsOff from '../components/PaymentsOff/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'add-funds',
  components: {
    PayCard,
    PaymentsOn,
    PaymentsOff
  },
  data: () => ({
    pre: 'add-funds',
    sumPay: '100500,00',
    screenW: '320',
    bottom: 'bottom',
    valSelect: 'Январь',
    visFilter: '__vis-filter',
    widthContainer: '108% !important',
    openСonfirmPay: false,
    openСonfirmDel: false,
    visInfo: true,
    success: false,
    direct: 'row',
    selected: false,
    visButtConf: false,
    checkAutoPay: 'Подключить автоплатёж',
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] < 960 ? 'row' : 'column'
      this.visButtConf = this[SCREEN_WIDTH] < 1200
    }
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
  },
  methods: {
    autopay () {
      this.checkAutoPay = this.selected ? 'Подключить автоплатёж' : 'Автоплатёж'
    },
    paypage () {
      this.$router.push('/lk/payments')
    },
    typeFind (select) {
      if (select === 'По услуге') {
        this.valSelect = 'Январь'
      } else {
        this.valSelect = 'Адрес'
      }
    },
    topOperation (payload) {
      this.visFilter = payload ? '__vis-filter' : ''
    },
    paymentConfirm () {
      this.openСonfirmPay = true
    },
    openDelConfirm () {
      this.openСonfirmDel = true
    },
    closeConfirm () {
      this.openСonfirmPay = false
      this.openСonfirmDel = false
    },
    delCard () {
      this.openСonfirmDel = false
      this.$emit('update')
    },
    paymentsOn () {
      this.openСonfirmPay = false
      this.visInfo = false
      this.success = true
    },
    paymentsOff () {
      this.openСonfirmPay = false
      this.visInfo = false
      this.success = false
    },
    tryAgain () {
      this.visInfo = true
    }
  }
}
