import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import sumBy from 'lodash/sumBy'
import BreakpointMixin from '@/mixins/BreakpointMixin'
import mixins from '../../mixins'
import { CONNECTIONS } from '../../mock'
import { COLORS_LIST } from '../../chart-colors'

const LINE_CHART_PERIODS = ['Час', 'День', 'Неделя', 'Месяц', 'Год']
const LEGEND_UNITS = {
  'pcnt': 'В процентах',
  'unit': 'В единицах'
}
const LEGEND_INACTIVE_CONTROL = ['Скрыть неактивные', 'Показать все']

export default {
  name: 'ConnectionsChart',
  mixins: [mixins, BreakpointMixin],
  data: () => ({
    pre: 'connections-chart',
    chart: null,
    chartHolder: null,
    legendHolder: null,
    legendIsOpen: true,
    legendUnits: LEGEND_UNITS,
    legendUnit: null,
    legendSections: {},
    legendInactiveIsVisible: true,
    legendInactiveControl: LEGEND_INACTIVE_CONTROL,
    legendColor: {},
    lineChartPeriods: LINE_CHART_PERIODS,
    lineChartPeriod: 2,
    data: CONNECTIONS,
    test: () => {
      return CONNECTIONS.map((item, i) => {
        return { [`item${i}`]: false }
      })
    }
  }),
  computed: {
    connections () {
      let connections = []
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i]
        connections.push({
          section: item.label,
          data: item.data
        })
        this.$set(this.legendSections, `section${i}`, true)
      }
      connections.map((item) => {
        const active = find(item.data, (o) => {
          return o.active === true
        })
        item.active = !!active
      })
      return connections
    },
    activeConnections () {
      const connections = cloneDeep(this.connections)
      for (let i = 0; i < connections.length; i++) {
        let item = connections[i]
        item.data = item.data.filter((item) => {
          return item.active === true
        })
      }
      return connections
    },
    combineSimpleChartData () {
      let data = []
      for (let i = 0; i < this.activeConnections.length; i++) {
        let item = this.activeConnections[i]
        for (let s = 0; s < item.data.length; s++) {
          // перед формированием данных должен быть установлен период
          // тогда вместо data[0] надо брать сложенные за этот период данные
          // если я правильно понял
          data.push({
            label: item.data[s].label,
            data: item.data[s].data[0].data
          })
        }
      }
      return data
    },
    getLineChartPeriods () {
      if (this.isMobile) {
        return this.lineChartPeriods.map((item) => {
          return item.charAt(0)
        })
      }
      return this.lineChartPeriods
    },
    getLegendInactiveControl () {
      const idx = this.legendInactiveIsVisible ? 0 : 1
      return this.legendInactiveControl[idx]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.chartHolder = this.$refs.chartholder
      this.legendHolder = this.$refs.chartlegend

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
        case 'line':
          this.makeLineChart()
          break
        case 'pie':
          this.makePieChart()
          break
        case 'bar':
          this.makeBarChart()
          break
      }

      this.chart.dateFormatter.dateFormat = 'd.MM.yyyy'
    },
    makeBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.data = this.combineSimpleChartData

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
    },
    makePieChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.PieChart)
      this.chart.data = this.combineSimpleChartData
      this.chart.colors.list = COLORS_LIST
      this.chart.innerRadius = am4core.percent(50)
      let pieSeries = this.chart.series.push(new am4charts.PieSeries())
      pieSeries.dataFields.value = 'data'
      pieSeries.dataFields.category = 'label'
      pieSeries.slices.template.strokeWidth = 0
      pieSeries.labels.template.text = '{value.percent.formatNumber("###.#")}%'
      pieSeries.slices.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })
    },
    makeLineChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.list = COLORS_LIST
      // Create axes
      let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis())
      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      dateAxis.cursorTooltipEnabled = false
      valueAxis.cursorTooltipEnabled = false
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.6
      dateAxis.dateFormatter.dateFormat = 'd.MM.yyyy'
      dateAxis.dateFormats.setKey('day', 'd.MM')
      dateAxis.dateFormats.setKey('month', 'd.MM.yyyy')
      if (!this.isMobile) {
        dateAxis.baseInterval = {
          'timeUnit': 'day',
          'count': 1
        }
        dateAxis.gridIntervals.setAll([
          { timeUnit: 'day', count: 1 }
        ])
      }

      const createSeries = (data, name, s) => {
        let series = this.chart.series.push(new am4charts.LineSeries())
        series.dataFields.valueY = 'value' + s
        series.dataFields.dateX = 'date'
        series.name = name
        series.tooltipText = '{dateX.formatDate("d.MM")}: [bold]{valueY}[/]'

        let combineData = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          let dataItem = { date: new Date(item.date) }
          dataItem['value' + s] = item.data
          combineData.push(dataItem)
        }
        series.data = combineData
        this.$set(this.legendColor, name, series.fill.hex)
        return series
      }

      for (let i = 0; i < this.activeConnections.length; i++) {
        let item = this.activeConnections[i]
        for (let s = 0; s < item.data.length; s++) {
          createSeries(item.data[s].data, item.data[s].label, s)
        }
      }

      this.chart.cursor = new am4charts.XYCursor()
    },
    setLineChartPeriod (periodIdx) {
      this.lineChartPeriod = periodIdx
    },
    toggleLegend () {
      this.legendIsOpen = !this.legendIsOpen
    },
    toggleLegendSection (idx) {
      this.legendSections[`section${idx}`] = !this.legendSections[`section${idx}`]
    },
    toggleLegendUnits () {
      this.legendUnit = this.legendUnit === 'pcnt' ? 'unit' : 'pcnt'
    },
    toggleLegendInactiveVisible () {
      this.legendInactiveIsVisible = !this.legendInactiveIsVisible
    },
    calcLegendItemData (data) {
      return sumBy(data, (o) => (o.data))
    },
    calcLegendSectionData (data) {
      let totalData = 0
      for (let i = 0; i < data.length; i++) {
        totalData = totalData + sumBy(data[i].data, (o) => (o.data))
      }
      return totalData
    }
  },
  watch: {
    isMobile (val, prevVal) {
      this.legendUnit = !prevVal && val ? 'pcnt' : null
    }
  }
}
