export default {
  name: 'edit-field',
  data: () => ({
    pre: 'edit-field'
  }),
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    prefer: {
      type: Boolean,
      default: false
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
