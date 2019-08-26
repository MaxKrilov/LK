export default {
  name: 'bootable',
  data: () => ({
    isBooted: false
  }),
  props: {
    lazy: Boolean
  },
  computed: {
    hasContent () {
      return this.isBooted || !this.lazy || this.isActive
    }
  },
  watch: {
    isActive () {
      this.isBooted = true
    }
  },
  methods: {
    showLazyContent (content) {
      return this.hasContent ? content : undefined
    }
  }
}
