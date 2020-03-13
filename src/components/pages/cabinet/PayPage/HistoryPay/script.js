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
    // widthContainer: '108%'
  }),
/*
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    }
  },
*/
  methods: {
/*
    changeWidth () {
      let width
      if (this[SCREEN_WIDTH] <= 800) width = '108'
      if (this[SCREEN_WIDTH] > 800 && this[SCREEN_WIDTH] < 900) width = '107'
      if (this[SCREEN_WIDTH] >= 900 && this[SCREEN_WIDTH] < 960) width = '106'
      if (this[SCREEN_WIDTH] >= 960) width = '100'
      if (this[SCREEN_WIDTH] >= 1200) width = '104'
      if (this[SCREEN_WIDTH] >= 1400) width = '111'
      this.widthContainer = `${width}%`
    },
*/
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
