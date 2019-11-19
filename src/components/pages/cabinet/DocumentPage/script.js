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

import DOCUMENT_TYPES from './types'

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
    ReportDocument,
    UserListDocument
  },
  data: () => ({
    pre: 'document-page',
    DOCUMENT_TYPES,
    emails: [
      'test@example.com',
      'test2@example.com'
    ],
    contractFilterType: 0,
    reportSelected: new Set([]),
    reportSelectedCount: 0,
    contractDocuments: [
      {
        file: '/document.pdf',
        number: 783302834,
        date: new Date(),
        type: DOCUMENT_TYPES['BLANK'],
        signed: false
      },
      {
        file: '/document2.pdf',
        number: 783302833,
        date: new Date(),
        type: DOCUMENT_TYPES['CONTRACT'],
        signed: true
      },
      {
        file: '/document2.pdf',
        number: 783302843,
        date: new Date(),
        type: DOCUMENT_TYPES['CONTRACT'],
        signed: false
      },
      {
        number: 783302832,
        date: new Date(),
        type: DOCUMENT_TYPES['USERS'],
        signed: true,
        file: '/downloads/shurupovert_spisok.xls',
        updatePeriod: '01.04-05.04.2019'
      },
      {
        number: 783302839,
        date: new Date(),
        type: DOCUMENT_TYPES['USERS'],
        signed: false,
        expired: true,
        file: '/downloads/shurupovert_spisok.xls',
        updatePeriod: '01.04-05.04.2019'
      }
    ],
    reportDocuments: [
      {
        number: 783302834,
        date: new Date()
      },
      {
        number: 783302833,
        date: new Date()
      },
      {
        number: 783302832,
        date: new Date()
      },
      {
        number: 783302831,
        date: new Date()
      },
      {
        number: 783302830,
        date: new Date()
      }
    ]
  }),
  computed: {
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
    }
  }
}
