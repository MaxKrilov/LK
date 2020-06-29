export default {
  computed: {
    getChartType () {
      return this.$parent.currentChartType
    }
  },
  methods: {
    destroyChart () {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = null
    }
  },
  watch: {
    getChartType (val, prevVal) {
      if (val && val !== prevVal) {
        this.buildChart()
      }
    }
  },
  beforeDestroy () {
    this.destroyChart()
  }
}
