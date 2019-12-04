import FiltersPay from '../components/FiltersPay/index.vue'
import ActionMonth from '../components/ActionMonth/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'pay-page',
  components: {
    ActionMonth,
    FiltersPay
  },
  data: () => ({
    pre: 'history-pay',
    valSelect: 'Январь',
    visFilter: '__vis-filter',
    widthContainer: '108% !important'
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
  },
  watch: {
    SCREEN_WIDTH () {
      if(this[SCREEN_WIDTH] <= 800) {
        this.widthContainer = '108% !important'
      }
      if(this[SCREEN_WIDTH] > 800 && this[SCREEN_WIDTH] < 900) {
        this.widthContainer = '107% !important'
      }
      if(this[SCREEN_WIDTH] >= 900 && this[SCREEN_WIDTH] < 960) {
        this.widthContainer = '106% !important'
      }
      if(this[SCREEN_WIDTH] >= 960) {
        this.widthContainer = '100% !important'
      }

    }
  },
  methods: {
    paypage () {
      this.$router.push('/lk/pay')
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
    }
  }
}
