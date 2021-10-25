import './style.scss'

import Vue from 'vue'
import Component from 'vue-class-component'

import DocumentName from '../FileName/'
import FileUpload from '../../../components/file-upload/index.vue'

import ErtDocumentItemComponent from './components/document-item-component.vue'

import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'
import { IOrderContractContractSignee } from '@/tbapi/fileinfo'
import { mapActions, mapGetters } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import moment from 'moment'
import { logError } from '@/functions/logging'
import { DocumentInterface } from '@/tbapi'

const FILE_DATA_TYPE = '9154452676313182650'
const FILE_DATA_BUCKET = 'customer-docs'

@Component({
  components: {
    DocumentName,
    FileUpload,
    ErDocumentViewer,
    ErtDocumentItemComponent
  },
  props: {
    contractSignee: Object
  },
  computed: {
    ...mapGetters({
      getTOMS: 'auth/getTOMS'
    })
  },
  methods: {
    ...mapActions({
      uploadFile: `documents/${UPLOAD_FILE}`,
      attachDocument: `documents/${ATTACH_SIGNED_DOCUMENT}`,
      downloadListDocument: 'fileinfo/downloadListDocument'
    })
  }
})
export default class Signatory extends Vue {
  // Props
  readonly contractSignee!: IOrderContractContractSignee | null

  // Data
  internalFile: null | File = null
  listInternalFile: File[] = []
  isOpenViewer: boolean = false

  isLoading: boolean = false
  isLoadSuccess: boolean = false
  isLoadError: boolean = false
  isLoaded: boolean = false

  isDownloadingDocuments: boolean = true

  listDocument: DocumentInterface[] = []

  /// Vuex getters
  readonly getTOMS!: string

  // Computed
  get computedSigneeName () {
    if (!this.contractSignee) return ''
    const { lastName, firstName, secondName } = this.contractSignee

    return `${lastName || ''} ${firstName || ''} ${secondName || ''}`.trim()
  }

  // get computedHasFile () {
  //   if (this.internalFile != null) return true
  //   if (!this.contractSignee) return false
  //
  //   return this.contractSignee.hasOwnProperty('signedDocuments') && this.contractSignee.registrationDocument.match(/устав/i)
  // }

  get computedFileName () {
    if (this.internalFile != null) return this.internalFile.name
    if (!this.contractSignee) return ''

    return this.contractSignee.signedDocuments.fileName
  }

  get computedSignedDocument () {
    if (!this.contractSignee) return []

    return Array.isArray(this.contractSignee.signedDocuments)
      ? this.contractSignee.signedDocuments
      : [this.contractSignee.signedDocuments]
  }

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

  readonly downloadListDocument!: ({
    api,
    relatedTo
  }: {
    api: API,
    relatedTo?: string
  }) => Promise<DocumentInterface[] | undefined>

  // Methods
  getFilePath (id: string) {
    return `${moment().format('MMYYYY')}/${id}`
  }

  removeFile (idx: number) {
    this.listInternalFile = this.listInternalFile.filter((_, _idx) => _idx !== idx)
  }

  async uploadDocument () {
    this.isLoading = true

    if (this.internalFile == null) {
      throw new Error('Inccorect')
    }

    const filePath = this.getFilePath(this.getTOMS)

    const uploadFileRequestData = {
      api: this.$api,
      file: this.internalFile,
      bucket: FILE_DATA_BUCKET,
      filePath: filePath
    }

    const addFileRequestData = {
      api: this.$api,
      fileName: this.internalFile!.name,
      bucket: FILE_DATA_BUCKET,
      relatedTo: this.contractSignee?.id || '',
      filePath: filePath,
      type: FILE_DATA_TYPE
    }

    try {
      const uploadFileResponse = await this.uploadFile(uploadFileRequestData)
      if (uploadFileResponse) {
        await this.attachDocument(addFileRequestData)
        this.isLoaded = true
        this.isLoadSuccess = true
      } else {
        this.isLoadError = true
      }
    } catch (e) {
      logError(e)
      this.isLoadError = true
    } finally {
      this.isLoading = false
    }
  }

  downloadFiles () {
    this.isDownloadingDocuments = true
    return new Promise(async (resolve) => {
      try {
        this.listDocument = await this.downloadListDocument({
          api: this.$api,
          relatedTo: this.contractSignee?.id
        }) as DocumentInterface[]

        resolve()
      } catch (e) {
        logError(e)
        this.listDocument = []
      } finally {
        this.isDownloadingDocuments = false
      }
    })
  }

  async mounted () {
    await this.downloadFiles()
  }
}
