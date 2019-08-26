export default {
  name: 'delayable',
  data: () => ({
    openTimeout: undefined,
    closeTimeout: undefined
  }),
  props: {
    openDelay: {
      type: [Number, String],
      default: 0
    },
    closeDelay: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    clearDelay () {
      clearTimeout(this.openTimeout)
      clearTimeout(this.closeTimeout)
    },
    runDelay (type, cb) {
      this.clearDelay()
      const delay = parseInt(this[`${type}Delay`], 10)
      this[`${type}Timeout`] = setTimeout(cb || (() => {
        this.isActive = { open: true, close: false }[type]
      }), delay)
    }
  }
}
