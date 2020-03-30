export default {
  props: {
    items: Array,
    selected: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      selected$: this.selected
    }
  },
  methods: {
    onClickType (itemId) {
      this.$emit('change', itemId)
      this.selected$ = itemId
    }
  }
}
