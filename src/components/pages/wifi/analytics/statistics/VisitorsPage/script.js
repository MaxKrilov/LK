import Header from '../components/Header'
import ChartCard from '../components/ChartCard'
import SimpleChart from '../components/SimpleChart'
import AuthTypeChart from '../components/AuthTypeChart'
import ConnectionsChart from '../components/ConnectionsChart'
import PageFooter from '../components/PageFooter'

import { VISITS, LANGS, AGES } from '../mock'
import { CHART_TYPES } from '../chart-types'

import { head } from 'lodash'
import moment from 'moment'
import { PERIOD_TYPE_DAY } from '../constants'

const DATE_FORMAT = 'DD.MM.YYYY'
const DATE_FORMAT_REQUEST = 'YYYYMMDDHH'

export default {
  name: 'wifi-analytics-visitors',
  components: {
    'stat-header': Header,
    'chart-card': ChartCard,
    'page-footer': PageFooter,
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
      ages: AGES,
      connections: {}
    },
    periodDate: {
      from: '',
      to: ''
    },
    periodType: PERIOD_TYPE_DAY
  }),
  props: {
    vlanInfo: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    vlanInfo () {
      this.init()
    },
    periodType () {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    setPeriod (val) {
      if (!Array.isArray(val) || val.length !== 2) return
      this.periodDate.from = moment(val[0]).format(DATE_FORMAT_REQUEST)
      this.periodDate.to = moment(val[1]).format(DATE_FORMAT_REQUEST)
      this.period = `${moment(val[0]).format(DATE_FORMAT)} - ${moment(val[1]).format(DATE_FORMAT)}`
      this.$nextTick(() => {
        this.init()
      })
      return this.period
    },
    init () {
      this.mock.connections = {}
      if (!this.vlanInfo || !this.vlanInfo.hasOwnProperty('vlan')) return
      // eslint-disable-next-line no-unused-vars
      const { cityId, number: vlan } = head(this.vlanInfo.vlan)
      this.$store.dispatch('wifi/bigDataStatAudience', {
        vlan: '140:1298',
        cityId: '1',
        dateFrom: this.periodDate.from,
        dateTo: this.periodDate.to,
        authType: 1,
        periodType: this.periodType
      })
        .then(response => {
          this.mock.connections = response
        })
    }
  }
}
