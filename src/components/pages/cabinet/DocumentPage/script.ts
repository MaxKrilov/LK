import Vue from 'vue'
import Component from 'vue-class-component'

// Components
import ErtDocumentNavigation from './components/ErtDocumentNavigation/index.vue'
import ErtDocumentItem from './components/ErtDocumentItem/index.vue'
import ErtUserListItem from './components/ErtUserListItem/index.vue'
import ErtActivationModal from '@/components/blocks2/ErtActivationModal/index.vue'

// Vuex helpers
import { mapActions, mapGetters, mapState } from 'vuex'

// Types
import { DocumentInterface } from '@/tbapi'
import { API } from '@/functions/api'

// Helpers
import moment from 'moment'
import { isReportDocument, isContractDocument, isBlankDocument } from '@/functions/document'
import { flattenDeep, head, last, uniq, orderBy } from 'lodash'
import { ACT_OF_RECONCILIATION, TYPE_CONTRACT, TYPE_REPORT } from '@/constants/document'
import { IClientInfo } from '@/tbapi/user'
import { PATTERN_EMAIL } from '@/constants/regexp'

const CADESPLUGIN_PATH = `${process.env.BASE_URL}static_js/cadesplugin.js`

@Component<InstanceType<typeof ErtDocumentPage>>({
  components: {
    ErtDocumentNavigation,
    ErtDocumentItem,
    ErtUserListItem,
    ErtActivationModal
  },
  computed: {
    ...mapState({
      listDocument: (state: any) => state.fileinfo.listDocument,
      clientInfo: (state: any) => state.user.clientInfo
    }),
    ...mapGetters({
      isLoadingDocuments: 'loading/loadingDocuments'
    })
  },
  watch: {
    computedListEmail (val) {
      this.lazyListEmail = val
    },
    email (val) {
      if (PATTERN_EMAIL.test(val)) {
        this.$nextTick(() => {
          this.lazyListEmail.push(val)
          this.email = val
        })
      } else {
        this.$nextTick(() => {
          this.email = null
        })
      }
    }
  },
  methods: {
    ...mapActions({
      sendOnEmail: 'fileinfo/sendOnEmail'
    })
  }
})
export default class ErtDocumentPage extends Vue {
  /// Data
  listNavigation: string[] = ['Последние', 'Отчётные', 'Контрактные', 'Акты сверки']
  navigationActive: number = 0

  selectAll: boolean = false

  listSelectedDocument: string[] = []

  isVisibleReportContainer: boolean = false
  isVisibleContractContainer: boolean = false
  isVisibleActContainer: boolean = false

  reportPeriod = [
    moment().startOf('month'),
    moment()
  ]

  reportListType = [
    { id: '0', value: 'Все' },
    ...TYPE_REPORT
  ]
  reportType = head(this.reportListType)!

  contractPeriod = [
    moment().startOf('month'),
    moment()
  ]

  contractListType = [
    { id: '0', value: 'Все' },
    ...TYPE_CONTRACT
  ]
  contractType = head(this.contractListType)!

  actPeriod = [
    moment().startOf('month').subtract(2, 'month'),
    moment()
  ]

  isShowDialogSendEmail: boolean = false
  isSendingRequest: boolean = false
  isSendSuccess: boolean = false
  isSendError: boolean = false

  email: string | null = null
  searchEmail: string | null = null
  lazyListEmail: string[] = []

  /// Vuex state
  readonly listDocument!: DocumentInterface[]
  readonly clientInfo!: IClientInfo

  /// Vuex getters
  readonly isLoadingDocuments!: boolean

  /// Proxy
  get datePickerModelReport () {
    return [
      new Date(head(this.reportPeriod)!.format('YYYY-MM-DD 00:00:00')),
      new Date(last(this.reportPeriod)!.format('YYYY-MM-DD 23:59:59'))
    ]
  }
  set datePickerModelReport (val) {
    this.reportPeriod = [
      moment(head(val)!),
      moment(last(val)!)
    ]
  }

  get datePickerModelContract () {
    return [
      new Date(head(this.contractPeriod)!.format('YYYY-MM-DD 00:00:00')),
      new Date(last(this.contractPeriod)!.format('YYYY-MM-DD 23:59:59'))
    ]
  }
  set datePickerModelContract (val) {
    this.contractPeriod = [
      moment(head(val)!),
      moment(last(val)!)
    ]
  }

  get datePickerModelAct () {
    return [
      new Date(head(this.actPeriod)!.format('YYYY-MM-DD 00:00:00')),
      new Date(last(this.actPeriod)!.format('YYYY-MM-DD 23:59:59'))
    ]
  }
  set datePickerModelAct (val) {
    this.actPeriod = [
      moment(head(val)!),
      moment(last(val)!)
    ]
  }

  /// Computed
  get listDisplayedDocument () {
    return this.listDocument
      .filter(document =>
        isReportDocument(document) ||
        isContractDocument(document) ||
        isBlankDocument(document) ||
        document.type.id === ACT_OF_RECONCILIATION
      )
  }

  get listLastDocument () {
    const monthBegin = Number(moment().startOf('month').format('x'))
    return this.listDisplayedDocument
      .filter(document => document.creationDate >= monthBegin && isReportDocument(document))
  }

  get reportPeriodFormat () {
    return `${head(this.reportPeriod)!.format('DD.MM.YYYY')}-${last(this.reportPeriod)?.format('DD.MM.YYYY')}`
  }

  get contractPeriodFormat () {
    return `${head(this.contractPeriod)!.format('DD.MM.YYYY')}-${last(this.contractPeriod)?.format('DD.MM.YYYY')}`
  }

  get actPeriodFormat () {
    return `${head(this.actPeriod)!.format('DD.MM.YYYY')}-${last(this.actPeriod)?.format('DD.MM.YYYY')}`
  }

  get listReportDocument () {
    const from = Number(this.reportPeriod[0].format('x'))
    const to = Number(this.reportPeriod[1].format('x'))
    return orderBy(this.listDisplayedDocument
      .filter(document =>
        document.creationDate >= from &&
        document.creationDate <= to &&
        isReportDocument(document) &&
        (
          this.reportType.id === '0'
            ? true
            : document.type.id === this.reportType.id
        )
      ), ['creationDate'], ['desc'])
  }

  get listContractDocument () {
    const from = Number(this.contractPeriod[0].format('x'))
    const to = Number(this.contractPeriod[1].format('x'))
    return orderBy(this.listDisplayedDocument
      .filter(document =>
        document.creationDate >= from &&
        document.creationDate <= to &&
        isContractDocument(document) &&
        (
          this.contractType.id === '0'
            ? true
            : document.type.id === this.contractType.id
        )
      ), ['creationDate'], ['desc'])
  }

  get listActReconciliation () {
    const from = Number(this.actPeriod[0].format('x'))
    const to = Number(this.actPeriod[1].format('x'))
    return orderBy(this.listDisplayedDocument
      .filter(document =>
        document.creationDate >= from &&
        document.creationDate <= to &&
        document.type.id === ACT_OF_RECONCILIATION
      ), ['creationDate'], ['desc'])
  }

  get computedListEmail (): string[] {
    return uniq(flattenDeep(this.clientInfo?.contacts.map(contact => {
      return contact.contactMethods
        .filter(contactMethod => contactMethod['@type'].toLowerCase() === 'email')
        .map(contactMethod => contactMethod.value)
    }) || []))
  }

  get validateRulesEmail () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => PATTERN_EMAIL.test(v) || 'Некоректный адрес эл. почты'
    ]
  }

  /// Vuex actions
  readonly sendOnEmail!: (payload: {
    api: API,
    files: { bucket: string, key: string }[],
    email: string
  }) => Promise<boolean>

  /// Methods
  onSelectDocumentItemHandler (documentId: string) {
    if (this.listSelectedDocument.includes(documentId)) {
      this.listSelectedDocument = this.listSelectedDocument
        .filter(_documentId => _documentId !== documentId)
    } else {
      this.listSelectedDocument.push(documentId)
    }
  }

  disabledDateCallback (date: Date) {
    const _date = moment(date)
    return _date > moment()
  }

  async onSendEmailHandler () {
    if (!this.validateRulesEmail.every(rule => rule(this.email || '') === true)) return

    this.isSendingRequest = true

    try {
      const listFile = this.listDisplayedDocument
        .filter(file => this.listSelectedDocument.includes(String(file.id)))
        .map(file => ({ bucket: file.bucket, key: file.filePath }))
      const sendOnEmailResponse = await this.sendOnEmail({
        api: this.$api,
        files: listFile,
        email: this.email!
      })

      if (sendOnEmailResponse) {
        this.isSendSuccess = true
      } else {
        this.isSendError = true
      }
    } catch (ex) {
      this.isSendError = true
      console.error(ex)
    } finally {
      this.isSendingRequest = false
      this.isShowDialogSendEmail = false
    }
  }

  created () {
    const params = this.$route.query

    if ('type' in params) {
      if (params.type === 'last') {
        this.navigationActive = 0
      } else if (params.type === 'report') {
        this.navigationActive = 1
      } else if (params.type === 'contract') {
        this.navigationActive = 2
      } else if (params.type === 'act') {
        this.navigationActive = 3
      }
    }
  }

  mounted () {
    const script = document.createElement('script')
    script.setAttribute('src', CADESPLUGIN_PATH)
    script.setAttribute('id', 'cadesplugin-script')
    document.body.append(script)
  }

  beforeDestroy () {
    // eslint-disable-next-line no-unused-expressions
    document.querySelector(`script#cadesplugin-script`)?.remove()
  }
}
