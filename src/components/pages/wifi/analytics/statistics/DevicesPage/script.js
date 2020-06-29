import Header from '../components/Header'
import PageNav from '../components/PageNav'

export default {
  name: 'wifi-analytics-devices',
  components: {
    'stat-header': Header,
    'page-nav': PageNav
  },
  data: () => ({
    pre: 'stat-template'
  })
}
