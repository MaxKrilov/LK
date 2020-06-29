import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import mixins from '../../mixins'
import { AUTH_TYPE } from '../../mock'
import { COLORS_LIST } from '../../chart-colors'

export default {
  name: 'AuthTypeChart',
  mixins: [mixins],
  data: () => ({
    pre: 'auth-type-chart',
    chart: null,
    chartHolder: null,
    legendHolder: null,
    legend: [],
    currentChartType: '',
    data: AUTH_TYPE
  }),
  mounted () {
    this.$nextTick(() => {
      this.chartHolder = this.$refs.chartholder
      this.legendHolder = this.$refs.chartlegend

      if (this.chartHolder) {
        const chartSeries = this.buildChart()
        this.chart.events.on('ready', (event) => {
          this.$emit('chartready', event)
          this.makeLegend(chartSeries)
        })
      }
    })
  },
  methods: {
    buildChart () {
      this.destroyChart()
      let chartSeries = null

      switch (this.getChartType) {
        case 'pie':
          chartSeries = this.makePieChart()
          break
        case 'bar':
          chartSeries = this.makeBarChart()
          break
      }

      return chartSeries
    },
    makeBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.data = this.data

      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'label'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.minGridDistance = 30
      categoryAxis.renderer.labels.template.hidden = true

      this.chart.yAxes.push(new am4charts.ValueAxis())
      this.chart.colors.list = COLORS_LIST
      let series = this.chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'data'
      series.dataFields.categoryX = 'label'
      series.dataFields.icon = 'icon'
      series.name = 'data'
      series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'
      series.columns.template.width = am4core.percent(50)
      series.columns.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })

      let columnTemplate = series.columns.template
      columnTemplate.strokeWidth = 0

      return series
    },
    makePieChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.PieChart)
      this.chart.data = this.data
      this.chart.colors.list = COLORS_LIST
      this.chart.innerRadius = am4core.percent(50)
      let pieSeries = this.chart.series.push(new am4charts.PieSeries())
      pieSeries.dataFields.value = 'data'
      pieSeries.dataFields.category = 'label'
      pieSeries.dataFields.icon = 'icon'
      pieSeries.slices.template.strokeWidth = 0
      pieSeries.labels.template.text = '{value}'
      pieSeries.slices.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })

      return pieSeries
    },
    makeLegend (series) {
      this.chart.customLegend = this.legendHolder
      series.dataItems.each((row, i) => {
        const color = this.chart.colors.getIndex(i)
        const value = row.value || row.valueY
        const label = row.category || row.categoryX
        this.legend.push({
          color,
          label,
          value,
          icon: row.icon
        })
      })
    }
  }
}
