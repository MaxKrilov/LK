export default {
  name: 'additional-services-component',
  props: {
    servicesList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      pre: 'additional-services'
    }
  }
}
