export default {
  name: 'ItemState',
  data: () => ({
    pre: 'item-state'
  }),
  props: {
    state: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: ''
    },
    left: {
      type: [String, Number],
      default: 0
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    styleLeft () {
      return this.isMobile ? 0 : `calc(${this.left}px + 24px)`
    },
    deleteIco () {
      return this.isMobile ? 'close' : 'cancel'
    },
    changeIco () {
      return this.isMobile ? 'ok' : 'circle_ok'
    }
  }
}
