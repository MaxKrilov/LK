import Header from '../components/Header'
import ChartCard from '../components/ChartCard'
import PageNav from '../components/PageNav'
import SimpleChart from '../components/SimpleChart'
import AuthTypeChart from '../components/AuthTypeChart'
import ConnectionsChart from '../components/ConnectionsChart'
import moment from 'moment'

import { VISITS, LANGS, AGES } from '../mock'

const DATE_FORMAT = 'DD.MM.YYYY'
const CHART_TYPES = {
  pie: { type: 'pie', ico: 'pie_diagram' },
  bar: { type: 'bar', ico: 'bar_chart' },
  line: { type: 'line', ico: 'line_chart' }
}

export default {
  name: 'wifi-analytics-visitors',
  components: {
    'stat-header': Header,
    'chart-card': ChartCard,
    'page-nav': PageNav,
    'simple-chart': SimpleChart,
    'auth-type-chart': AuthTypeChart,
    'connections-chart': ConnectionsChart
  },
  data: () => ({
    pre: 'stat-template',
    period: '',
    chartTypes: CHART_TYPES,
    mock: {
      visits: VISITS,
      langs: LANGS,
      ages: AGES
    }
  }),
  methods: {
    setPeriod (val) {
      let result = val[0] ? moment(val[0]).format(DATE_FORMAT) : ''
      result = val[1] ? result + ' - ' + moment(val[1]).format(DATE_FORMAT) : result
      this.period = result
      return result
    }
  }
}
