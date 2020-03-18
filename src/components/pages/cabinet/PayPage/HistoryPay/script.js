import FiltersPay from '../components/FiltersPay/index.vue'
import ActionMonth from '../components/ActionMonth/index.vue'

export default {
  name: 'pay-page',
  components: {
    ActionMonth,
    FiltersPay
  },
  data: () => ({
    pre: 'history-pay',
    valSelect: 'Январь',
    visFilter: '__vis-filter'
  }),
  methods: {
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
