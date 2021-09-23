import Vue from 'vue'
import Component from 'vue-class-component'

import DocumentName from '../FileName'
import FileUpload from '../../../components/file-upload/index.vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'

import { mapActions, mapGetters, mapState } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import moment from 'moment'
import { DocumentInterface } from '@/tbapi'

const FILE_DATA_TYPE = '9154452676313182654'
const FILE_DATA_BUCKET = 'customer-docs'
const TYPE_STATUTORY_DOCUMENT = '9154452676313182654'

@Component({
  components: {
    DocumentName,
    FileUpload,
    ErDocumentViewer
  },
  computed: {
    ...mapState({
      listDocument: (state: any) => state.fileinfo.listDocument
    }),
    ...mapGetters({
      getTOMS: 'auth/getTOMS'
    })
  },
  methods: {
    ...mapActions({
      uploadFile: `documents/${UPLOAD_FILE}`,
      attachDocument: `documents/${ATTACH_SIGNED_DOCUMENT}`
    })
  }
})
export default class StatutoryDocuments extends Vue {
  /// Vuex getters
  readonly getTOMS!: string
  readonly listDocument!: DocumentInterface[]

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
  // Data
  listInternalFile: File[] = []

  isLoading: boolean = false
  isLoadSuccess: boolean = false
  isLoadError: boolean = false

  isLoaded: boolean = false
  modelOpenViewer: Record<string, boolean> = {}

  // Computed
  get getListStatutoryDocument () {
    return this.listDocument.filter(document => document.type.id === TYPE_STATUTORY_DOCUMENT)
  }

  // Methods
  removeFile (idx: number) {
    this.listInternalFile = this.listInternalFile.filter((_, _idx) => _idx !== idx)
  }

  getFilePath (id: string) {
    return `${moment().format('MMYYYY')}/${id}`
  }

  uploadDocumentItem (file: File) {
    const filePath = this.getFilePath(this.getTOMS)

    const uploadFileData = {
      api: this.$api,
      file: file,
      bucket: FILE_DATA_BUCKET,
      filePath: filePath
    }

    const attachFileData = {
      api: this.$api,
      fileName: file.name,
      bucket: FILE_DATA_BUCKET,
      relatedTo: this.getTOMS,
      filePath: filePath,
      type: FILE_DATA_TYPE
    }
    return new Promise((resolve, reject) => {
      this.uploadFile(uploadFileData)
        .then(() => {
          this.attachDocument(attachFileData)
            .then(() => { resolve() })
            .catch((error) => {
              console.error(error)
              reject(error)
            })
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  }

  uploadDocuments () {
    this.isLoading = true

    Promise.all(this.listInternalFile.map(this.uploadDocumentItem))
      .then(() => {
        this.isLoadSuccess = true
        this.isLoaded = true
      })
      .catch(() => {
        this.isLoadError = true
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
