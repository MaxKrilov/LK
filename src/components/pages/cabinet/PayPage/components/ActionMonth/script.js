import Operations from '../Operations/index.vue'

export default {
  name: 'action-month',
  components: {
    Operations
  },
  props: ['month', 'posMonth', 'year', 'page', 'listPayments'],
  data: () => ({
    pre: 'action-month',
    number: 0
  }),
  created () {
    if (this.listPayments !== undefined) {
      this.number = this.listPayments.length
    }
  },
  watch: {
    listPayments () {
      this.number = this.listPayments.length
    }
  }
}
