import Vue from 'vue'
import Component from 'vue-class-component'

import DocumentName from '../FileName'
import FileUpload from '../../../components/file-upload/index.vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'

import { ISigningDocument } from '@/tbapi/fileinfo'
import { mapActions, mapGetters, mapState } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import moment from 'moment'

const FILE_DATA_BUCKET = 'customer-docs'

@Component<InstanceType<typeof SigningWithScans>>({
  components: {
    DocumentName,
    FileUpload,
    ErDocumentViewer
  },
  props: {
    documents: Object
  },
  computed: {
    ...mapGetters({
      getTOMS: 'auth/getTOMS'
    }),
    ...mapState({
      officeAddress: (state: any) => state.branch.address,
      officeName: (state: any) => state.branch.name
    })
  },
  watch: {
    documents () {
      this.checkDocuments()
    }
  },
  methods: {
    ...mapActions({
      uploadFile: `documents/${UPLOAD_FILE}`,
      attachDocument: `documents/${ATTACH_SIGNED_DOCUMENT}`,
      changeContractStatus: `fileinfo/changeContractStatus`,
      downloadFile: 'fileinfo/downloadFile'
    })
  }
})
export default class SigningWithScans extends Vue {
  // Props
  readonly documents!: Record<string, ISigningDocument> | null

  // Data
  activeTab: 'scan' | 'office' = 'scan'
  listInternalFile: Record<string, File> = {}
  listViewerFlag: Record<string, boolean> = {}

  tracker: number = 1

  isLoading: boolean = false
  isLoadSuccess: boolean = false
  isLoadError: boolean = false
  isLoaded: boolean = false

  /// Vuex state
  readonly officeAddress!: string
  readonly officeName!: string

  /**
   * Проверяет - прикреплены ли все документы
   */
  get isUploadAllDocuments () {
    if (!this.tracker) return false
    if (this.documents == null) return false

    return Object.keys(this.listInternalFile).length === Object.keys(this.documents).length
  }

  get computedOfficeAddress () {
    return this.officeAddress || 'Овчинниковская набережная, 20с2, Москва, 123022, Россия'
  }

  /// Vuex getters
  readonly getTOMS!: string

  /// Vuex methods
  readonly uploadFile!: ({
    api,
    file,
    bucket,
    filePath
  }: {
    api: API,
    file: File,
    bucket: string,
    filePath: string
  }) => Promise<boolean>

  readonly attachDocument!: ({
    api,
    fileName,
    bucket,
    relatedTo,
    type,
    filePath
  }: {
    api: API
    fileName: string
    bucket: string
    relatedTo: string
    type: string
    filePath: string
  }) => Promise<any>

  readonly changeContractStatus!: ({
    api,
    contractId,
    status
  }: {
    api: API,
    contractId: string,
    status: string | number
  }) => Promise<any>

  readonly downloadFile!: ({
    api,
    bucket,
    key,
    ext,
    asPdf
  }: {
    api: API,
    bucket: string,
    key: string,
    ext: string,
    asPdf?: number
  }) => Promise<Blob>

  // Methods
  onAddInternalFile (customerNumber: string, file: File) {
    this.listInternalFile[customerNumber] = file
    this.tracker++
  }

  getFilePath (id: string) {
    return `${moment().format('MMYYYY')}/${id}`
  }

  onDeleteInternalFile (customerNumber: string) {
    delete this.listInternalFile[customerNumber]
    this.tracker--
  }

  async onUploadDocuments () {
    this.isLoading = true

    try {
      await Promise.all(
        Object.keys(this.listInternalFile)
          .filter(contractNumber => this.listInternalFile.hasOwnProperty(contractNumber))
          .map(contractNumber => {
            const filePath = this.getFilePath(this.documents![contractNumber].id)
            return new Promise(async (resolve, reject) => {
              try {
                const uploadFileData = {
                  api: this.$api,
                  bucket: FILE_DATA_BUCKET,
                  filePath: filePath,
                  file: this.listInternalFile[contractNumber]
                }

                const attachFileData = {
                  api: this.$api,
                  fileName: this.listInternalFile[contractNumber].name,
                  bucket: FILE_DATA_BUCKET,
                  type: this.documents![contractNumber].type.id,
                  relatedTo: this.documents![contractNumber].contractId,
                  filePath: filePath
                }

                const changeContractStatusData = {
                  api: this.$api,
                  contractId: this.documents![contractNumber].contractId,
                  status: 1
                }

                await this.uploadFile(uploadFileData)
                await this.attachDocument(attachFileData)
                const resChangeContractStatus = await this.changeContractStatus(changeContractStatusData)

                if (!resChangeContractStatus || !resChangeContractStatus.submit_statuses) {
                  reject('Ошибка смены статуса')
                } else if (['success', 'not_executed'].includes(resChangeContractStatus.submit_statuses[0].submitStatus.toLowerCase())) {
                  resolve()
                } else {
                  reject('Ошибка смены статуса')
                }
              } catch (e) {
                reject(e)
              }
            })
          })
      )
      this.isLoadSuccess = true
      this.isLoaded = true
    } catch (e) {
      console.error(e)
      this.isLoadError = true
    } finally {
      this.isLoading = false
    }
  }

  checkDocuments () {
    if (!this.documents) return

    // Есть хотя бы один документ в статусе "Подписан"
    const hasSignedDocuments = Object.values(this.documents)
      .some(valItem => valItem.contractStatus === 'Подписан')

    // Все документы подписаны
    const isEverythingSigned = Object.values(this.documents)
      .every(valItem => valItem.contractStatus === 'Подписан')

    // Все документы подписаны и прошли верификацию
    const isEveryVerifying = isEverythingSigned && Object.values(this.documents)
      .every(valItem => valItem.verifying === 'Да')

    if (hasSignedDocuments) {
      // Есть хотя бы один подписанный доккумент - блокируем кнопку "Назад"
      window.parent.postMessage({ eventType: 'ertClientContracts', state: 'inProgress' }, '*')
    } else {
      // Нет ни одного подписанного документа - кнопка "Назад" разблокирована
      window.parent.postMessage({ eventType: 'ertClientContracts', state: 'notStarted' }, '*')
    }

    if (isEverythingSigned) {
      this.$emit('signed', 1)
    }

    if (isEveryVerifying) {
      this.$emit('verifying', 1)
    }
  }

  async onDownloadDocumentHandler (document: ISigningDocument, key: string) {
    Vue.set(this.listViewerFlag, key, true)

    const file = await this.downloadFile({
      api: this.$api,
      bucket: document.bucket,
      key: document.filePath,
      ext: document.fileName.split('.').pop()!
    })

    const link = window.document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = document.fileName

    window.document.body.append(link)
    link.click()
    link.remove()

    Vue.set(this.listViewerFlag, key, false)

    setTimeout(() => URL.revokeObjectURL(link.href), 7000)
  }

  mounted () {
    this.checkDocuments()
  }
}
