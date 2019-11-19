import BreakpointMixin from '@/mixins/BreakpointMixin'
import ReportDocument from '../DocumentPage/components/ReportDocument'
import DuplicatePageWrap from './components/DuplicatePageWrap'

export default {
  components: {
    ReportDocument,
    DuplicatePageWrap
  },
  mixins: [BreakpointMixin],
  data () {
    return {
      documentList: [
        {
          number: 7001002003,
          date: new Date()
        },
        {
          number: 7001002004,
          date: new Date()
        },
        {
          number: 7001002005,
          date: new Date()
        }
      ]
    }
  },
  methods: {
    currentComponent () {
      if (this.isMobile) {
        return 'er-dialog'
      }

      return 'duplicate-page-wrap'
    }
  }
}
