export default {
  name: 'contact-methods-list',
  data: () => ({
    pre: 'contact-methods-list'
  }),
  props: {
    item: { type: Object },
    prefer: {
      type: String,
      default: null
    }
  },
  computed: {
    isPrefer () {
      return this.prefer === this.item.id
    }
  },
  methods: {
    onRemove () {
      this.$emit('onRemove')
    },
    onPrefer (id) {
      this.$emit('onPrefer', id)
    }
  }
}
