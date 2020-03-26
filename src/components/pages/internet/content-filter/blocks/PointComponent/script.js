export default {
  name: 'content-filter-point-component',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      pre: 'content-filter-point',
      isOpen: false
    }
  }
}
