import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { COLORS_LIST } from '../../chart-colors'
import chartMixin from '../../chart-mixin'
import { tickSettings } from '../../chart-axis-settings'

export default {
  name: 'SimpleChart',
  mixins: [chartMixin],
  props: {
    data: {
      type: Array,
      default: () => ([]),
      requeired: true
    },
    showLegend: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    pre: 'simple-chart',
    chart: null,
    chartHolder: null
  }),
  mounted () {
    this.$nextTick(() => {
      this.chartHolder = this.$refs.chartholder

      if (this.chartHolder) {
        const chartSeries = this.buildChart()
        this.chart.events.on('ready', (event) => {
          this.$emit('chartready', event)
          if (chartSeries && this.showLegend) {
            this.makeLegend(chartSeries)
          }
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
        case 'cluster-bar':
          this.makeClusterBarChart()
          break
      }

      this.chart.numberFormatter.numberFormat = {
        'style': 'decimal'
      }
      this.chart.nodePadding = 0
      return chartSeries
    },
    makeBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.step = 2
      this.chart.data = this.data
      this.chart.colors.list = COLORS_LIST
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'label'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.minGridDistance = 30
      categoryAxis = tickSettings(categoryAxis)
      if (this.showLegend) {
        categoryAxis.renderer.labels.template.hidden = true
      }

      let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      yAxis.renderer.opposite = true
      yAxis = tickSettings(yAxis)
      let series = this.chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'data'
      series.dataFields.categoryX = 'label'
      series.columns.template.width = am4core.percent(60)
      series.calculatePercent = true
      series.name = 'data'
      series.columns.template.tooltipText = '[font-size:14px]{categoryX}: [bold]{valueY}[/]'
      series.columns.template.tooltipHTML = `<div class="am-tooltip"><div class="am-tooltip__label">{categoryX}<div><div class="am-tooltip__val">{valueY}</div></div>`
      series.columns.template.strokeWidth = 0
      series.columns.template.width = am4core.percent(50)
      series.columns.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })

      series.tooltip.getFillFromObject = false

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
      pieSeries.slices.template.strokeWidth = 0
      pieSeries.ticks.template.disabled = true
      pieSeries.labels.template.text = "[font-size: 14px #D5D5D5]{category}[/] [bold]{value.percent.formatNumber('#.0')}%[/]"
      pieSeries.slices.template.tooltipHTML = `<div class="am-tooltip"><div class="am-tooltip__label">{category}<div><div class="am-tooltip__val">{value}</div></div>`
      pieSeries.alignLabels = false
      pieSeries.labels.template.dy = 25
      pieSeries.labels.template.dx = 25
      pieSeries.slices.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })

      pieSeries.tooltip.getFillFromObject = false

      return pieSeries
    },
    makeClusterBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.step = 2
      this.chart.colors.list = COLORS_LIST

      let xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'label'
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0
      xAxis = tickSettings(xAxis)

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.renderer.opposite = true
      valueAxis.min = 0
      valueAxis = tickSettings(valueAxis)
      const createSeries = (value, name) => {
        let series = this.chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'label'
        series.name = name
        series.columns.template.tooltipText = '[font-size:14px]{categoryX}: [bold]{valueY}[/]'
        series.columns.template.tooltipHTML = `<div class="am-tooltip"><div class="am-tooltip__label">{categoryX}<div><div class="am-tooltip__val">{valueY}</div></div>`
        series.tooltip.getFillFromObject = false

        let bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dy = 15
        bullet.label.text = '{name}'
        bullet.label.fill = am4core.color('#ffffff')

        return series
      }

      this.chart.data = this.data
      createSeries('data1', 'M')
      createSeries('data2', 'Ж')
    }
  }
}
