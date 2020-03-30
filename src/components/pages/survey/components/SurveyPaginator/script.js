export default {
  name: 'quiz-paginator',
  props: {
    value: Number,
    maxPage: Number
  },
  methods: {
    updatePage (val) {
      this.$emit('input', val)
    },
    onNextPage () {
      if (this.value < this.maxPage - 1) {
        this.updatePage(this.value + 1)
      }
    },
    onPrevPage () {
      if (this.value > 0) {
        this.updatePage(this.value - 1)
      }
    }
  }
}
