import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { COLORS_LIST } from '../../chart-colors'
import mixins from '../../mixins'

export default {
  name: 'SimpleChart',
  mixins: [mixins],
  props: {
    data: {
      type: Array,
      default: () => ([])
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
        this.buildChart()
        this.chart.events.on('ready', (event) => {
          this.$emit('chartready', event)
        })
      }
    })
  },
  methods: {
    buildChart () {
      this.destroyChart()

      switch (this.getChartType) {
        case 'pie':
          this.makePieChart()
          break
        case 'bar':
          this.makeBarChart()
          break
        case 'cluster-bar':
          this.makeClusterBarChart()
          break
      }

      this.chart.numberFormatter.numberFormat = {
        'style': 'decimal'
      }
    },
    makeBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.step = 2
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
      series.columns.template.width = am4core.percent(60)
      series.name = 'data'
      series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'

      let columnTemplate = series.columns.template
      columnTemplate.strokeWidth = 0
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
      pieSeries.labels.template.text = "{category} {value.percent.formatNumber('#.0')}%"
      pieSeries.alignLabels = false
      pieSeries.labels.template.dy = 25
      pieSeries.labels.template.dx = 25
    },
    makeClusterBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.step = 2

      let xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'label'
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0

      let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      yAxis.min = 0
      this.chart.colors.list = COLORS_LIST
      const createSeries = (value, name) => {
        let series = this.chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'label'
        series.name = name
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'

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
