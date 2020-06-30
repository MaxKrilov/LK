export default {
  computed: {
    getChartType () {
      return this.$parent.currentChartType
    }
  },
  data: () => ({
    chart: null,
    chartHolder: null,
    legendHolder: null,
    legend: [],
    currentChartType: ''
  }),
  mounted () {
    this.$nextTick(() => {
      this.chartHolder = this.$refs.chartholder
      this.legendHolder = this.$refs.chartlegend
    })
  },
  methods: {
    destroyChart () {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = null
    },
    makeLegend (series) {
      this.chart.customLegend = this.legendHolder
      series.dataItems.each((row, i) => {
        const color = this.chart.colors.getIndex(i)
        const value = row.value || row.valueY
        const rowValue = row.values.value.percent || row.values.valueY.percent
        const percent = Math.round(rowValue * 100) / 100
        const label = row.category || row.categoryX
        this.legend.push({
          color,
          label,
          value,
          percent,
          icon: row?.icon
        })
      })
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
