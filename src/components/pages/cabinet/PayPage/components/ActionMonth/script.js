import Operations from '../Operations/index.vue'

export default {
  name: 'action-month',
  components: {
    Operations
  },
  props: ['month'],
  data: () => ({
    pre: 'action-month',
    height: ''
  }),
  updated() {
      if (this.month === 'Адрес') {
        this.height = '__address'
      } else {
        this.height = ''
      }
  }
}
