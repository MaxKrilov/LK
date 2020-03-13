import Operations from '../Operations/index.vue'

export default {
  name: 'action-month',
  components: {
    Operations
  },
  props: ['month', 'page'],
  data: () => ({
    pre: 'action-month',
    height: '',
    year: '17'
  }),
  updated () {
    if (this.month === 'Адрес') {
      this.height = '__address'
    } else {
      this.height = ''
    }
  }
}
