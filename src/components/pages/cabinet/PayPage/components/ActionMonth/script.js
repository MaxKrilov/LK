import Operations from '../Operations/index.vue'

export default {
  name: 'action-month',
  components: {
    Operations
  },
  props: ['month'],
  data: () => ({
    pre: 'action-month',

  }),
}
