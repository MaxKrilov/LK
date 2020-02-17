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

import ErActivationModal from '../../../blocks/ErActivationModal/index'

import {
  isContractDocument,
  isBlankDocument,
  isUserListDocument
} from '@/functions/document'
import * as DOCUMENT from '@/constants/document'
import DigitalSignature from '../../../../functions/digital_signature'
import { SCREEN_WIDTH } from '../../../../store/actions/variables'
import { BREAKPOINT_MD } from '../../../../constants/breakpoint'
import File from '../../../../functions/file'

const CADESPLUGIN_PATH = `${process.env.BASE_URL}static_js/cadesplugin.js`

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
    ErActivationModal
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
      reportDocuments: [],

      isShowDialogChooseCertificate: false,
      isShowDialogSuccessSigned: false,
      isShowDialogErrorSigned: false,
      listCertificate: [],
      selectedCertificate: null,
      base64Document: '',
      linkToDownload: '',
      errorText: '',
      loadingSigningDocument: false
    }
    return data
  },
  computed: {
    ...mapState({
      documents: state => state.user.documents,
      screenWidth: state => state.variables[SCREEN_WIDTH]
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
    },
    getMaxWidthDialog () {
      return this.screenWidth < BREAKPOINT_MD ? undefined : 484
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
    isUserListDocument,
    getListCertificate (link) {
      if (!window.cadesplugin) return
      DigitalSignature
        .getCertificatesList(window.cadesplugin)
        .then(list => {
          this.listCertificate = list
          this.isShowDialogChooseCertificate = true
        }, error => {
          this.errorText = error.message
          this.isShowDialogErrorSigned = true
        })
    },
    signDocument () {
      if (!this.$refs.certificate_form.validate()) return
      this.loadingSigningDocument = true
      File.getFileByUrl(
        'https://master.edo.b2bweb.t2.ertelecom.ru/get_file?file_path=022020/46348b55687cb8faf536e176999af100.pdf&download=0',
        (base64File) => {
          const visibleSignature = DigitalSignature.createVisibleSignature('Пушистый котик', this.selectedCertificate)
          DigitalSignature
            .signDocument(window.cadesplugin, base64File, this.selectedCertificate, visibleSignature)
            .then(response => {
              this.isShowDialogChooseCertificate = false
              this.isShowDialogSuccessSigned = true
              this.linkToDownload = `data:application/octet-stream;base64,${response}`
              this.loadingSigningDocument = false
            }, error => {
              this.errorText = error.message
              this.isShowDialogErrorSigned = true
            })
        }
      )
    }
  },
  async mounted () {
    const script = document.createElement('script')
    script.setAttribute('src', CADESPLUGIN_PATH)
    script.setAttribute('id', 'cadesplugin-script')
    document.body.append(script)
  },
  beforeDestroy () {
    // eslint-disable-next-line no-unused-expressions
    document.querySelector(`script#cadesplugin-script`)?.remove()
  }
}
