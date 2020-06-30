import Header from '../components/Header'
import ChartCard from '../components/ChartCard'
import PageNav from '../components/PageNav'
import SimpleChart from '../components/SimpleChart'
import AuthTypeChart from '../components/AuthTypeChart'
import ConnectionsChart from '../components/ConnectionsChart'

import { VISITS, LANGS, AGES, CONNECTIONS } from '../mock'
import setPeriod from '../set-period-mixin'
import { CHART_TYPES } from '../chart-types'

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
  mixins: [setPeriod],
  data: () => ({
    pre: 'stat-template',
    // period: '',
    chartTypes: CHART_TYPES,
    mock: {
      visits: VISITS,
      langs: LANGS,
      ages: AGES,
      connections: CONNECTIONS
    }
  })
}
