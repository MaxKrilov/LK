import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
// eslint-disable-next-line camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import BreakpointMixin from '@/mixins/BreakpointMixin'
import mixins from '../../chart-mixin'
import { COLORS_LIST } from '../../chart-colors'
import { tickSettings } from '../../chart-axis-settings'

import {
  AUTH_TYPE_AUTHORIZED, AUTH_TYPE_AUTHORIZED_UNIQUE, AUTH_TYPE_GUEST, AUTH_TYPE_PREMIUM, AUTH_TYPE_SUBSCRIBER,
  AUTH_TYPE_UNAUTHORIZED,
  AUTH_TYPE_UNAUTHORIZED_UNIQUE,
  PERIOD_TYPE_DAY
} from '../../constants'
import { eachObject } from '../../../../../../../functions/helper'

const LINE_CHART_PERIODS = ['Год', 'Месяц', 'День', 'Час']
const LEGEND_UNITS = {
  'pcnt': 'В процентах',
  'unit': 'В единицах'
}
const LEGEND_INACTIVE_CONTROL = ['Скрыть неактивные', 'Показать все']

const LIST_AUTH_TYPE = {
  [AUTH_TYPE_UNAUTHORIZED]: 'Неавторизованные пользователи',
  [AUTH_TYPE_UNAUTHORIZED_UNIQUE]: 'Уникальные неавторизованные пользователи',
  [AUTH_TYPE_AUTHORIZED]: 'Авторизованные пользователи',
  [AUTH_TYPE_AUTHORIZED_UNIQUE]: 'Уникальные авторизованные пользователи',
  [AUTH_TYPE_SUBSCRIBER]: 'Пользователи Дом.ru',
  [AUTH_TYPE_PREMIUM]: 'Премиум-доступ',
  [AUTH_TYPE_GUEST]: 'Гость'
}

export default {
  name: 'ConnectionsChart',
  mixins: [mixins, BreakpointMixin],
  props: {
    data: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data: () => ({
    pre: 'connections-chart',
    chart: null,
    chartHolder: null,
    legendData: [],
    legendHolder: null,
    legendIsOpen: true,
    legendUnits: LEGEND_UNITS,
    legendUnit: null,
    legendSections: {},
    legendInactiveIsVisible: true,
    legendInactiveControl: LEGEND_INACTIVE_CONTROL,
    legendColor: {},
    lineChartPeriods: LINE_CHART_PERIODS,
    lineChartPeriod: (PERIOD_TYPE_DAY - 1)
  }),
  computed: {
    connections () {
      let connections = []
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i]
        if (item.items) {
          connections.push({
            section: item.label,
            data: item.items,
            isToggle: true
          })
        } else {
          connections.push({
            data: item.data,
            section: item.label
          })
        }
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
      const result = []
      for (const key in this.data) {
        if (
          !this.data.hasOwnProperty(key) ||
          !Array.isArray(this.data[key]) ||
          this.data[key].length === 0
        ) continue
        const dataItem = this.data[key]
        result.push({
          label: LIST_AUTH_TYPE[parseInt(key)],
          data: dataItem.reduce((acc, item) => {
            return (acc += item.value)
          }, 0),
          authType: parseInt(key)
        })
      }
      return result
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
    },
    transformData () {
      const result = new Map()
      for (const key in this.data) {
        if (
          !this.data.hasOwnProperty(key) ||
          !Array.isArray(this.data[key]) ||
          this.data[key].length === 0
        ) continue
        const dataItem = this.data[key]
        dataItem.forEach(subItemData => {
          if (result.has(subItemData.date)) {
            result.set(subItemData.date, {
              [subItemData.auth_id]: subItemData.value,
              ...result.get(subItemData.date)
            })
          } else {
            result.set(subItemData.date, {
              date: new Date(subItemData.date),
              [subItemData.auth_id]: subItemData.value
            })
          }
        })
      }

      return Array.from(result.values())
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

      // this.chart.dateFormatter.dateFormat = 'd.MM.yyyy'
    },
    makeBarChart () {
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.data = this.combineSimpleChartData

      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'label'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.minGridDistance = 30
      categoryAxis.renderer.labels.template.hidden = true
      categoryAxis = tickSettings(categoryAxis)

      let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      yAxis.renderer.opposite = true
      this.chart.colors.list = COLORS_LIST
      let series = this.chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'data'
      series.dataFields.categoryX = 'label'
      series.dataFields.icon = 'icon'
      series.name = 'data'
      series.columns.template.tooltipText = '[font-size:14px]{categoryX}: [bold]{valueY}[/]'
      series.columns.template.tooltipHTML = `<div class="am-tooltip"><div class="am-tooltip__label">{categoryX}<div><div class="am-tooltip__val">{valueY}</div></div>`
      series.columns.template.width = am4core.percent(50)
      series.columns.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })
      series.tooltip.getFillFromObject = false

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
      pieSeries.slices.template.tooltipHTML = `<div class="am-tooltip"><div class="am-tooltip__label">{category}<div><div class="am-tooltip__val">{value}</div></div>`
      pieSeries.slices.template.adapter.add('fill', (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index)
      })
      pieSeries.tooltip.getFillFromObject = false
    },
    makeLineChart () {
      am4core.useTheme(am4themes_animated)
      this.chart = am4core.create(this.chartHolder, am4charts.XYChart)
      this.chart.colors.list = COLORS_LIST
      this.chart.data = this.transformData
      // Create axes
      let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.cursorTooltipEnabled = false
      dateAxis.startLocation = 0.3
      dateAxis.endLocation = 0
      dateAxis.dateFormatter = new am4core.DateFormatter()
      dateAxis.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm:ss'
      dateAxis.dateFormats.setKey('hour', 'd.MM HH:mm')
      dateAxis.dateFormats.setKey('day', 'd.MM')
      dateAxis.dateFormats.setKey('week', 'd.MM')
      dateAxis.dateFormats.setKey('month', 'MM.yyyy')
      dateAxis.dateFormats.setKey('year', 'yyyy')
      dateAxis.renderer.minGridDistance = 30
      dateAxis = tickSettings(dateAxis)

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.renderer.opposite = true
      valueAxis = tickSettings(valueAxis)
      valueAxis.cursorTooltipEnabled = false

      const createSeries = (field, name) => {
        const series = this.chart.series.push(new am4charts.LineSeries())
        series.dataFields.valueY = field
        series.dataFields.dateX = 'date'
        series.name = name
        series.tooltipText = '[font-size:14px]{dateX.formatDate("d.MM")}: [bold]{valueY}[/]'
        series.calculatePercent = true
        series.tooltip.getFillFromObject = false

        series.adapter.add('tooltipHTML', ev => {
          let html = `
            <div class="am-tooltip">
              <div class="am-tooltip__date-n-time">
                <span class="date">{dateX.formatDate("dd.MM.yyyy")}&nbsp;</span>
                <span class="time">{dateX.formatDate("HH:mm")}</span>
              </div>
          `
          this.chart.series.each(item => {
            html += `
              <div class="am-tooltip__item">
                <div class="bullet" style="background-color: ${item.stroke.hex}"></div>
                <div class="count">{${item.dataFields.valueY}}</div>
                <div class="name">${item.name}</div>
              </div>
            `
          })
          html += '</div>'
          return html
        })

        series.tooltip.getFillFromObject = false

        this.$set(this.legendColor, field, series.fill.hex)

        return series
      }

      eachObject(LIST_AUTH_TYPE, (name, key) => {
        createSeries(key, name)
      })

      this.chart.cursor = new am4charts.XYCursor()
      this.chart.cursor.maxTooltipDistance = -1
    },
    setLineChartPeriod (periodIdx) {
      this.lineChartPeriod = periodIdx
      this.$emit('setLineChartPeriod', (periodIdx + 1))
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
      return 0
      // return sumBy(data, (o) => (o.data))
    },
    calcLegendSectionData (data) {
      return 0
      // let totalData = 0
      // for (let i = 0; i < data.length; i++) {
      //   totalData = totalData + sumBy(data[i].data, (o) => (o.data))
      // }
      // return totalData
    },
    transformLegendData (data) {
      if (Object.keys(data).length === 0) return []
      const result = new Map()
      for (const key in data) {
        if (
          !data.hasOwnProperty(key) ||
          !Array.isArray(data[key]) ||
          data[key].length === 0
        ) continue

        const dataItem = data[key]
        const authType = parseInt(key)
        const label = LIST_AUTH_TYPE[authType]
        const count = dataItem.reduce((acc, subDataItem) => {
          return (acc += subDataItem.value)
        }, 0)
        const percentage = 0
        const visible = true
        const children = []

        const setData = { authType, label, count, percentage, visible, children }
        if ([AUTH_TYPE_UNAUTHORIZED, AUTH_TYPE_AUTHORIZED].includes(authType)) {
          setData.isToggle = true
        }

        result.set(authType, setData)
      }

      const authTypeUnauthorizedUnique = result.get(AUTH_TYPE_UNAUTHORIZED_UNIQUE)
      const authTypeUnauthorized = result.get(AUTH_TYPE_UNAUTHORIZED)
      result.set(AUTH_TYPE_UNAUTHORIZED, {
        authType: authTypeUnauthorized.authType,
        label: authTypeUnauthorized.label,
        count: authTypeUnauthorized.count,
        percentage: authTypeUnauthorized.percentage,
        visible: authTypeUnauthorized.visible,
        isToggle: authTypeUnauthorized.isToggle,
        children: authTypeUnauthorized.children.push(authTypeUnauthorizedUnique)
      })
      result.delete(AUTH_TYPE_UNAUTHORIZED_UNIQUE)

      const authTypeAuthorizedUnique = result.get(AUTH_TYPE_AUTHORIZED_UNIQUE)
      const authTypeAuthorized = result.get(AUTH_TYPE_AUTHORIZED)
      result.set(AUTH_TYPE_AUTHORIZED, {
        authType: authTypeAuthorized.authType,
        label: authTypeAuthorized.label,
        count: authTypeAuthorized.count,
        percentage: authTypeAuthorized.percentage,
        visible: authTypeAuthorized.visible,
        isToggle: authTypeAuthorized.isToggle,
        children: authTypeAuthorized.children.push(authTypeAuthorizedUnique)
      })
      result.delete(AUTH_TYPE_AUTHORIZED_UNIQUE)

      // Считаем проценты
      const authTypeSubscriber = result.get(AUTH_TYPE_SUBSCRIBER)
      const authTypePremium = result.get(AUTH_TYPE_PREMIUM)
      const authTypeGuest = result.get(AUTH_TYPE_GUEST)

      const sumType = authTypeUnauthorized.count + authTypeAuthorized.count
      const sumEnter = authTypeSubscriber.count + authTypePremium.count + authTypeGuest.count

      result.set(AUTH_TYPE_UNAUTHORIZED, {
        ...authTypeUnauthorized,
        percentage: sumType > 0 ? (authTypeUnauthorized.count / sumType * 100).toFixed(2) : 0
      })
      result.set(AUTH_TYPE_AUTHORIZED, {
        ...authTypeAuthorized,
        percentage: sumType > 0 ? (authTypeAuthorized.count / sumType * 100).toFixed(2) : 0
      })
      result.set(AUTH_TYPE_SUBSCRIBER, {
        ...authTypeSubscriber,
        percentage: sumEnter > 0 ? (authTypeSubscriber.count / sumEnter * 100).toFixed(2) : 0
      })
      result.set(AUTH_TYPE_PREMIUM, {
        ...authTypePremium,
        percentage: sumEnter > 0 ? (authTypePremium.count / sumEnter * 100).toFixed(2) : 0
      })
      result.set(AUTH_TYPE_GUEST, {
        ...authTypeGuest,
        percentage: sumEnter > 0 ? (authTypeGuest.count / sumEnter * 100).toFixed(2) : 0
      })

      return Array.from(result.values())
    },
    toggleVisibilityLegend (authType) {
      if (this.getChartType === 'line') {
        this.chart.series.each(value => {
          if (parseInt(value.dataFields.valueY) === authType) {
            value.visible
              ? value.hide()
              : value.show()
          }
        })
      } else {
        this.chart.series.getIndex(0).dataItems.each(value => {
          if (parseInt(value.dataContext.authType) === authType) {
            value.visible
              ? value.hide()
              : value.show()
          }
        })
      }
    }
  },
  watch: {
    isMobile (val, prevVal) {
      this.legendUnit = !prevVal && val ? 'pcnt' : null
    },
    data (val) {
      this.buildChart()
      this.legendData = this.transformLegendData(val)
      this.chart.events.on('ready', (event) => {
        this.$emit('chartready', event)
      })
    }
  }
}
