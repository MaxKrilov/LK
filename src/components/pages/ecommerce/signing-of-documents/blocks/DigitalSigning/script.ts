/* eslint no-undef: "off",  no-unused-vars: "off" */
import Vue from 'vue'
import Component from 'vue-class-component'

import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { ISigningDocument } from '@/tbapi/fileinfo'
import { API } from '@/functions/api'
import DigitalSignature, { iCertificate } from '@/functions/digital_signature'

import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
import { IClientInfo } from '@/tbapi/user'
import { dataURLtoFile } from '@/functions/helper'

const CADESPLUGIN_PATH = `${process.env.BASE_URL}static_js/cadesplugin.js`
const FILE_DATA_BUCKET = 'customer-docs'

@Component<InstanceType<typeof DigitalSigning>>({
  components: {
    ErDocumentViewer
  },
  props: {
    documents: Object
  },
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo
    }),
    ...mapGetters({
      getTOMS: 'auth/getTOMS'
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
      downloadFile: 'fileinfo/downloadFile',
      logEdo: 'fileinfo/logEdo'
    })
  }
})
export default class DigitalSigning extends Vue {
  // Props
  readonly documents!: Record<string, ISigningDocument> | null

  // Data
  isOpenDialogOfListCertificate: boolean = false
  isSigning: boolean = false
  isError: boolean = false
  isDialogError: boolean = false
  isSuccess: Record<string, boolean> = {}

  listViewerFlag: Record<string, boolean> = {}

  listCertificate: iCertificate[] = []
  selectedCertificate: iCertificate | null = null

  signingDocument: ISigningDocument | null = null

  /// Vuex state
  readonly clientInfo!: IClientInfo

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
    ext
  }: {
    api: API,
    bucket: string,
    key: string,
    ext: string
  }) => Promise<Blob | boolean>

  readonly logEdo!: ({
    api,
    type,
    data
  }: {
    api: API,
    type: string,
    data: any
  }) => Promise<void>

  // Methods
  appendCadespluginScript () {
    const script = document.createElement('script')
    script.setAttribute('src', CADESPLUGIN_PATH)
    script.setAttribute('id', 'cadesplugin-script')
    document.body.append(script)
  }

  removeCadespluginScript () {
    const scriptElement = document.querySelector(`script#cadesplugin-script`)
    if (scriptElement) {
      scriptElement.remove()
    }
  }

  getListCertificate () {
    return new Promise(async (resolve, reject) => {
      try {
        await cadesplugin
        this.listCertificate = await DigitalSignature.getCertificatesList(cadesplugin as CADESPluginAsync)
        this.selectedCertificate = cloneDeep(head(this.listCertificate)!)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  async checkCertificate (document: ISigningDocument) {
    try {
      if (this.listCertificate.length === 0) {
        await this.getListCertificate()
      }
      this.isOpenDialogOfListCertificate = true
      this.signingDocument = cloneDeep(document)
    } catch (e) {
      console.error(e)
      this.isError = true
    }
  }

  selectCertificate (certificat: iCertificate) {
    this.selectedCertificate = cloneDeep(certificat)
  }

  fileToBase64 (file: Blob) {
    const reader = new FileReader()
    return new Promise<string>((resolve) => {
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = (reader.result as string)
          .replace(
            'application/octet-stream',
            'application/pdf'
          )
        resolve(result)
      }
    })
  }

  getDocumentBase64 ({ bucket, filePath, fileName }: { bucket: string, filePath: string, fileName: string }) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const downloadFileResult = await this.downloadFile({
          api: this.$api,
          bucket,
          key: filePath,
          ext: fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName
        })

        if (
          (typeof downloadFileResult === 'boolean' && !downloadFileResult) ||
          (downloadFileResult instanceof Blob && downloadFileResult.size === 0)) {
          resolve('')
        } else if (downloadFileResult instanceof Blob) {
          let documentBase64 = await this.fileToBase64(downloadFileResult)
          const header = ';base64,'
          documentBase64 = documentBase64.substr(documentBase64.indexOf(header) + header.length)
          resolve(documentBase64)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  async signDocument () {
    this.isSigning = true
    this.isDialogError = false

    try {
      const { filePath, bucket, fileName } = this.signingDocument!

      const documentBase64 = await this.getDocumentBase64({ filePath, bucket, fileName })
      const visibleSignature = DigitalSignature
        .createVisibleSignature(this.clientInfo.legalName || '', this.selectedCertificate!)
      const logCallback = (logData: any, type: string) => {
        return new Promise<void>(async (resolve) => {
          await this.logEdo({
            api: this.$api,
            type,
            data: { ...logData, filePath, bucket, fileName }
          })
          resolve()
        })
      }

      const signDocumentResult =
        await DigitalSignature.signDocument(cadesplugin, documentBase64, this.selectedCertificate!, visibleSignature, logCallback)
      const binaryFile = dataURLtoFile(signDocumentResult, fileName)
      const newFilePath = `${moment().format('MMYYYY')}/${this.signingDocument?.contractId}`

      const uploadFileData = {
        api: this.$api,
        bucket: FILE_DATA_BUCKET,
        filePath: newFilePath,
        file: binaryFile
      }

      const attachFileData = {
        api: this.$api,
        fileName: fileName,
        bucket: FILE_DATA_BUCKET,
        type: this.signingDocument?.type.id || '',
        relatedTo: this.signingDocument?.contractId || '',
        filePath: newFilePath
      }

      const changeContractStatusData = {
        api: this.$api,
        contractId: this.signingDocument?.contractId || '',
        status: 1
      }

      await this.uploadFile(uploadFileData)
      await this.attachDocument(attachFileData)
      const resChangeContractStatus = await this.changeContractStatus(changeContractStatusData)

      if (!resChangeContractStatus || !resChangeContractStatus.submit_statuses) {
        this.isDialogError = true
      // } else if (['success', 'not_executed'].includes(resChangeContractStatus.submit_statuses[0].submitStatus.toLowerCase())) {
      } else {
        this.isSuccess[this.signingDocument!.contractId] = true
        this.isOpenDialogOfListCertificate = false

        // Если подписанный документ был последним в списке на подписание - говорим, что все документы подписаны
        if (
          Object.keys(this.isSuccess).length +
          Object.values(this.documents!).filter(document => document.contractStatus === 'Подписан').length ===
          Object.keys(this.documents!).length) {
          this.$emit('signed', 1)
        }
      }
    } catch (e) {
      this.isDialogError = true
      console.error(e)
    } finally {
      this.isSigning = false
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

  checkDocuments () {
    if (!this.documents) return

    // Есть хотя бы один документ в статусе "Подписан"
    const hasSignedDocuments = Object.values(this.documents)
      .some(valItem => valItem.contractStatus === 'Подписан')

    // Все документы подписаны
    const isEverythingSigned = Object.values(this.documents)
      .every(valItem => valItem.contractStatus === 'Подписан')

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
  }

  mounted () {
    this.appendCadespluginScript()
    this.checkDocuments()
  }

  beforeDestroy () {
    this.removeCadespluginScript()
  }
}
