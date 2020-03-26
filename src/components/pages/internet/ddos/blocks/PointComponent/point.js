
export default {
  name: 'point-component',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      pre: 'point-ddos',
      isOpen: false
    }
  }
}
