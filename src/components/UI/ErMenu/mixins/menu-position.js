export default {
  data: () => ({
    calculatedTopAuto: 0
  }),
  methods: {
    calcScrollPosition () {
      const $el = this.$refs.content
      const activeTile = $el.querySelector('.er-list__tile--active')
      const maxScrollTop = $el.scrollHeight - $el.offsetHeight
      return activeTile
        ? Math.min(
          maxScrollTop,
          Math.max(0, activeTile - $el.offsetHeight / 2 + activeTile.offsetHeight / 2))
        : $el.scrollTop
    },
    calcLeftAuto () {
      if (this.isAttached) {
        return 0
      }
      return parseInt(this.dimensions.activator.left - this.defaultOffset * 2)
    },
    calcTopAuto () {
      const $el = this.$refs.content
      const activeTile = $el.querySelector('.er-list__tile--active')
      if (!activeTile) {
        this.selectedIndex = null
      }
      if (this.offsetY || !activeTile) {
        return this.computedTop
      }
      this.selectedIndex = Array.from(this.tiles).indexOf(activeTile)
      const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition()
      const firstTileOffsetTop = $el.querySelector('.er-list__tile').offsetTop
      return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop
    }
  }
}
