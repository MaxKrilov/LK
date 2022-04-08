import { mapGetters, mapState } from 'vuex'

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

import ManualSigningDocument from './components/ManualSigningDocument'
import DigitalSigningDocument from './components/DigitalSigningDocument'

import ErActivationModal from '../../../blocks/ErActivationModal/index'

import { isBlankDocument, isContractDocument, isUserListDocument } from '@/functions/document'
import * as DOCUMENT from '@/constants/document'
import { SCREEN_WIDTH } from '../../../../store/actions/variables'
import { BREAKPOINT_MD } from '../../../../constants/breakpoint'
import { getFirstElement, lengthVar } from '../../../../functions/helper'
import { GET_DOCUMENTS } from '../../../../store/actions/user'

const CADESPLUGIN_PATH = `${process.env.BASE_URL}static_js/cadesplugin.js`

const ALL_DOCUMENTS = 'all'
const NOT_SIGNED_DOCUMENTS = 'notSigned'

const REPORT_DOCUMENTS = 'report-documents'
const CONTRACT_DOCUMENTS = 'contract-documents'

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
    UserListDocument,
    ErActivationModal,
    ManualSigningDocument,
    DigitalSigningDocument
  },
  data () {
    return {
      pre: 'document-page',
      DOCUMENT,
      REPORT_DOCUMENTS,
      CONTRACT_DOCUMENTS,
      currentDocumentType: REPORT_DOCUMENTS,
      emails: [
        'test@example.com',
        'test2@example.com'
      ],
      contractFilterType: 0,
      reportSelected: new Map(),
      reportSelectedCount: 0,
      filterContract: '',
      reportDocuments: [],

      isShowDialogChooseCertificate: false,
      isShowDialogSuccessSigned: false,
      isShowDialogErrorSigned: false,
      listCertificate: [],
      selectedCertificate: null,
      base64Document: '',
      linkToDownload: '',
      errorText: '',
      loadingSigningDocument: false,

      contractFilterTypes: {
        [ALL_DOCUMENTS]: 'Все',
        [NOT_SIGNED_DOCUMENTS]: 'На подпись'
      },
      contractFilterTypesModel: ALL_DOCUMENTS,
      contractPeriod: [],
      contractType: { 'id': '-1', 'value': 'Все' },

      reportPeriod: [],
      reportType: { 'id': '-1', 'value': 'Все' },

      signingDocument: {},

      isManualSigning: false,
      isDigitalSigning: false,

      loadingSending: false,
      isSuccessSend: false,
      isErrorSend: false
    }
  },
  computed: {
    ...mapState({
      documents: state => state.user.documents,
      screenWidth: state => state.variables[SCREEN_WIDTH]
    }),
    ...mapGetters({
      allContractDocuments: 'fileinfo/getListContractDocument',
      allReportDocuments: 'fileinfo/getListReportDocument',
      listContact: 'user/getListContact',
      isUserlistRequired: 'user/getUserlistRequired',
      loadingUserListInfo: 'loading/indexPageProductByService',
      loadingDocuments: 'loading/loadingDocuments'
    }),
    hasSelectedReports () {
      return this.reportSelectedCount > 0
    },
    getMaxWidthDialog () {
      return this.screenWidth < BREAKPOINT_MD ? undefined : 484
    },
    computedAllContractDocuments () {
      let allContractDocuments = this.allContractDocuments
      // Тип документа: Все или только на подпись
      if (this.contractFilterTypesModel !== ALL_DOCUMENTS) {
        allContractDocuments = allContractDocuments.filter(document => getFirstElement(document)?.contractStatus?.toLowerCase() === DOCUMENT.CONTRACT.IS_READY.toLowerCase())
      }
      // Если установлен период
      if (Array.isArray(this.contractPeriod) && lengthVar(this.contractPeriod) !== 0) {
        allContractDocuments = allContractDocuments.filter(document => {
          return getFirstElement(document)?.modifiedWhen > this.contractPeriod[0] &&
            getFirstElement(document).modifiedWhen < this.contractPeriod[1]
        })
      }
      return allContractDocuments
    },
    getReportFilterItems () {
      const typeReport = DOCUMENT.TYPE_REPORT
      typeReport.push({
        'id': '-1',
        'value': 'Все'
      })
      return typeReport
    },
    computedAllReportDocuments () {
      let allReportDocuments = this.allReportDocuments
      // Тип документа
      if (this.reportType?.id !== '-1') {
        allReportDocuments = allReportDocuments.filter(item => item?.type?.id === this.reportType?.id)
      }
      // Период
      if (Array.isArray(this.reportPeriod) && lengthVar(this.reportPeriod) === 2) {
        const [from, to] = this.reportPeriod
        allReportDocuments = allReportDocuments.filter(item =>
          (item?.modifiedWhen >= from) && (item?.modifiedWhen <= to))
      }
      return allReportDocuments
    },
    listEmail () {
      return this.listContact.map(item => item?.email?.value).filter(item => !!item)
    },
    getContractType () {
      const typeContract = DOCUMENT.TYPE_CONTRACT
      typeContract.push({
        'id': '-1',
        'value': 'Все'
      })
      return typeContract
    }
  },
  methods: {
    onSelectReportTab () {
      this.currentDocumentType = REPORT_DOCUMENTS
    },
    onSelectContractTab () {
      this.currentDocumentType = CONTRACT_DOCUMENTS
    },
    onChangeMonth (idx) {
    },
    onReportUnselect (documentId) {
      this.reportSelectedCount -= 1
      this.reportSelected.delete(documentId)
    },
    onReportSelect (document) {
      this.reportSelectedCount += 1
      this.reportSelected.set(document.id, { key: document.key, bucket: document.bucket })
    },
    onOrderDocumentClick () {
      this.$router.push({ path: '/lk/support?open=document' })
    },
    isContractDocument,
    isBlankDocument,
    isUserListDocument,
    manualSigning (e) {
      this.signingDocument = e
      this.isManualSigning = true
    },
    digitalSigning (e) {
      this.signingDocument = e
      this.isDigitalSigning = true
    },
    successSigned () {
      this.$store.dispatch(`user/${GET_DOCUMENTS}`, { api: this.$api })
    },
    sendOnEmail (email) {
      const files = Array.from(this.reportSelected.values())
      this.loadingSending = true
      this.$store.dispatch('fileinfo/sendOnEmail', {
        api: this.$api,
        files,
        email
      })
        .then(answer => {
          if (answer) {
            this.isSuccessSend = true
          } else {
            this.isErrorSend = true
          }
        })
        .catch(() => { this.isErrorSend = true })
        .finally(() => {
          this.loadingSending = false
        })
    }
  },
  async mounted () {
    const documentType = this.$route.query.open || this.$route.params.open

    if (documentType && [REPORT_DOCUMENTS, CONTRACT_DOCUMENTS].includes(documentType)) {
      this.currentDocumentType = documentType
    }

    const script = document.createElement('script')
    script.setAttribute('src', CADESPLUGIN_PATH)
    script.setAttribute('id', 'cadesplugin-script')
    document.body.append(script)
    // Устанавливаем период контрактных документов за последний месяц
    const today = new Date()
    const beforeMonth = new Date()
    beforeMonth.setMonth(beforeMonth.getMonth() - 1)
    this.contractPeriod = [
      beforeMonth,
      today
    ]
    this.reportPeriod = [
      beforeMonth,
      today
    ]
  },
  beforeDestroy () {
    // eslint-disable-next-line no-unused-expressions
    document.querySelector(`script#cadesplugin-script`)?.remove()
  }
}
