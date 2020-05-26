import FiltersPay from '../components/FiltersPay/index.vue'
import ActionMonth from '../components/ActionMonth/index.vue'
import { mapState } from 'vuex'

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
  created () {
    const payload = [ +new Date(new Date().setDate(1)), +new Date() ]
    this.$store.dispatch('payments/history', { api: this.$api, payload })
  },
  computed: {
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccountId,
      isLoading: state => state.payments.isLoading
    })
  },

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
