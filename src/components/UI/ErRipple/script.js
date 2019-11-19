export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    active: Boolean,
    duration: {
      type: Number,
      default: undefined,
      description: 'Время эффекта в миллисекундах'
    }
  },
  mounted () {
    if (this.duration !== undefined) {
      this.$refs.background.style.setProperty('transition-duration', `${this.duration}ms`)
    }
  },
  computed: {
    styleObject () {
      let styles = {}

      if (this.y) {
        styles['padding-top'] = `${this.y}px`
      }

      if (this.x) {
        styles['padding-left'] = `${this.x}px`
      }

      return styles
    }
  }
}
