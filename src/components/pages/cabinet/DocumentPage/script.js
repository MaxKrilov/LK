import { mapState, mapGetters } from 'vuex'

import ErPageTitle from '@/components/UI/ErPageTitle'
import ErMonthSelect from '@/components/UI/ErMonthSelect'

import BlankDocument from './components/BlankDocument'
import ButtonDocument from './components/ButtonDocument'
import CommonDocument from './components/CommonDocument'
import ContractDocument from './components/ContractDocument'
import ErContractFilter from './components/ErContractFilter'
import ErDocumentActions from './components/ErDocumentActions'
import ErReportFilter from './components/ErReportFilter'
import ReportDocument from './components/ReportDocument'
import UserListDocument from './components/UserListDocument'
import OtherDocument from './components/OtherDocument'

import {
  isContractDocument,
  isBlankDocument,
  isUserListDocument
} from '@/functions/document'
import * as DOCUMENT from '@/constants/document'

export default {
  name: 'document-page',
  components: {
    BlankDocument,
    ButtonDocument,
    CommonDocument,
    ContractDocument,
    ErContractFilter,
    ErDocumentActions,
    ErMonthSelect,
    ErPageTitle,
    ErReportFilter,
    OtherDocument,
    ReportDocument,
    UserListDocument
  },
  data () {
    const data = {
      pre: 'document-page',
      DOCUMENT,
      emails: [
        'test@example.com',
        'test2@example.com'
      ],
      contractFilterType: 0,
      reportSelected: new Set([]),
      reportSelectedCount: 0,
      filterContract: '',
      reportDocuments: []
    }
    return data
  },
  computed: {
    ...mapState({
      documents: state => state.user.documents
    }),
    ...mapGetters(
      'user',
      {
        allContractDocuments: 'getContractDocuments',
        allReportDocuments: 'getReportDocuments'
      }
    ),
    hasSelectedReports () {
      return this.reportSelectedCount > 0
    }
  },
  methods: {
    onChangeMonth (idx) {
    },
    onReportUnselect (reportId) {
      this.reportSelectedCount -= 1
      this.reportSelected.delete(reportId)
    },
    onReportSelect (reportId) {
      this.reportSelectedCount += 1
      this.reportSelected.add(reportId)
    },
    onOrderDocumentClick () {
      this.$router.push({ path: '/lk/documents/order' })
    },
    isContractDocument,
    isBlankDocument,
    isUserListDocument
  }
}
