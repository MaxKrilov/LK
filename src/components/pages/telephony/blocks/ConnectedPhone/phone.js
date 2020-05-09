import BreakpointMixin from '@/mixins/BreakpointMixin'

export default {
  name: 'connected-phone',
  mixins: [BreakpointMixin],
  props: {
    phone: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      pre: 'connected-phone',
      isOpen: false
    }
  },
  computed: {
    number () {
      return this.phone?.number || ''
    },
    price () {
      return this.phone?.price || ''
    }
  }
}
