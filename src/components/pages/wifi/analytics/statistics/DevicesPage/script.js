import Header from '../components/Header'
import ChartCard from '../components/ChartCard'
import SimpleChart from '../components/SimpleChart'
import PageNav from '../components/PageNav'
import ConnectionsChart from '../components/ConnectionsChart'

import { CONNECTIONS_DEVICES, OS, BROWSERS } from '../mock'
import { CHART_TYPES } from '../chart-types'
import setPeriod from '../set-period-mixin'
export default {
  name: 'wifi-analytics-devices',
  components: {
    'stat-header': Header,
    'chart-card': ChartCard,
    'page-nav': PageNav,
    'simple-chart': SimpleChart,
    'connections-chart': ConnectionsChart
  },
  mixins: [setPeriod],
  data: () => ({
    pre: 'stat-template',
    chartTypes: CHART_TYPES,
    mock: {
      connections: CONNECTIONS_DEVICES,
      os: OS,
      browsers: BROWSERS
    }
  })
}
