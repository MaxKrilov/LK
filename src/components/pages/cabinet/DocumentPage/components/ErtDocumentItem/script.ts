/* eslint no-undef: "off",  no-unused-vars: "off" */
import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'
import { mapActions, mapState } from 'vuex'

// Components
import ErtActivationModal from '@/components/blocks2/ErtActivationModal/index.vue'
import ErtForm from '@/components/UI2/ErtForm'

// Interfaces
import { DocumentInterface } from '@/tbapi'
import { API } from '@/functions/api'
import { IClientInfo } from '@/tbapi/user'

// Utils
import moment from 'moment'
import { last } from 'lodash'
import { isActDocument, isReportDocument } from '@/functions/document'
import {
  isStatusActNotSigned,
  isStatusActSigned,
  isStatusActCanceled,
  isStatusContractSigned,
  isNo,
  isStatusContractReady,
  isYes,
  isStatusContractCanceled,
  isStatusContractActive
} from './helpers'
import { ACT_OF_RECONCILIATION, CONTRACT_ID, SUPPLEMENTARY_AGREEMENT_ID } from '@/constants/document'
import DigitalSignature, { iCertificate } from '@/functions/digital_signature'
import { dataURLtoFile } from '@/functions/helper'
import { ATTACH_SIGNED_DOCUMENT } from '@/store/actions/documents'

@Component<InstanceType<typeof ErtDocumentItem>>({
  components: {
    ErtActivationModal
  },
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo
    })
  },
  methods: mapActions({
    downloadFile: 'fileinfo/downloadFile',
    changeActStatus: 'fileinfo/actSigning',
    logEdo: 'fileinfo/logEdo',
    uploadFile: 'fileinfo/uploadFile',
    attachSignedDocument: `documents/${ATTACH_SIGNED_DOCUMENT}`,
    changeContractStatus: 'fileinfo/changeContractStatus',
    createClosedRequest: 'request2/createClosedRequest'
  })
})
export default class ErtDocumentItem extends Vue {
  /// Options
  $refs!: {
    'act-cancel-form': InstanceType<typeof ErtForm>
  }
  /// Props
  @Prop({ type: Object, default: () => ({}) })
  readonly document!: DocumentInterface

  @Prop({ type: Boolean })
  readonly value!: boolean

  /// Data
  __file: Blob | null = null

  /**
   * Флаг, отвечающий за загрузку файла
   * @param {boolean}
   */
  isDownloadingFile: boolean = false
  /**
   * Флаг, указывающий на то, что документ был загружен с ошибкой
   * @param {boolean}
   */
  isDownloadedError: boolean = false
  /**
   * Флаг, указывающий на то, что браузер заблокировал возможность открытия окон
   * @param {boolean}
   */
  isOpenedError: boolean = false
  /**
   * Флаг, указывающий на открытие документа в новом окне
   * @param {boolean}
   */
  isOpeningFile: boolean = false

  isShowDialogActStatusChange: boolean = false
  isActStatusChangedSuccess: boolean = false
  isActStatusChangedError: boolean = false
  isActStatusChanging: boolean = false

  isActWasAccepted: boolean = false
  isActWasDeclined: boolean = false

  actStatusChangeInfo = {
    title: '',
    description: '',
    button: '',
    status: 0
  }

  actRejectReason: string = ''

  listCertificate: iCertificate[] = []
  activeCertificate: iCertificate | null = null

  isShowDialogSelectCertificate: boolean = false
  isErrorGotCertificate: boolean = false

  isDigitalSigningDocument: boolean = false
  isDigitalSignedDocumentSuccess: boolean = false
  isDigitalSignedDocumentError: boolean = false

  isShowDialogManualSign: boolean = false
  isManualSignSuccess: boolean = false
  isManualSignError: boolean = false
  isManualSignLoading: boolean = false

  manualSignFile: File | null = null
  errorTextOfSelectManualSignDocument: string = ''

  isInternalSigned: boolean = false
  isInternalVerifying: boolean = false

  isShowDialogCancel: boolean = false
  isCancelingRequest: boolean = false
  isCanceledSuccess: boolean = false
  isCanceledError: boolean = false

  isInternalCanceled: boolean = false

  /// Vuex state
  readonly clientInfo!: IClientInfo

  /// Proxy
  get internalValue () {
    return this.value
  }

  set internalValue (val: boolean) {
    this.$emit('select', val)
  }

  /// Computed
  get documentNumber () {
    return ('relatedTo' in this.document) && ('name' in this.document.relatedTo)
      ? isReportDocument(this.document)
        ? this.document.attachmentName.replace(/по ЛС \w+/ig, '').trim()
        : this.documentTypeID === ACT_OF_RECONCILIATION
          ? this.document.attachmentName.replace(/\.[^/.]+$/, '')
          : this.document.relatedTo.name
      : ''
  }

  get documentRelatedToID () {
    return ('relatedTo' in this.document) && ('id' in this.document.relatedTo)
      ? String(this.document.relatedTo.id)
      : ''
  }

  get documentCreationDate () {
    return ('creationDate' in this.document)
      ? moment(this.document.creationDate).format('DD.MM.YY')
      : ''
  }

  get documentTypeName () {
    return ('type' in this.document) && ('name' in this.document.type)
      ? this.document.type.name
      : ''
  }

  get documentTypeID () {
    return ('type' in this.document) && ('id' in this.document.type)
      ? String(this.document.type.id)
      : ''
  }

  get documentDescription () {
    return `${isReportDocument(this.document) || this.documentTypeID === ACT_OF_RECONCILIATION ? '' : `${this.documentTypeName} от `}${this.documentCreationDate}`
  }

  get documentFileName () {
    return 'fileName' in this.document
      ? this.document.fileName
      : ''
  }

  get documentBucket () {
    return 'bucket' in this.document
      ? this.document.bucket
      : ''
  }

  get documentFilePath () {
    return 'filePath' in this.document
      ? this.document.filePath
      : ''
  }

  get documentExtension () {
    return last(this.documentFileName.split('.')) || ''
  }

  get documentID () {
    return 'id' in this.document
      ? String(this.document.id)
      : ''
  }

  get documentContractStatus () {
    return 'contractStatus' in this.document
      ? this.document.contractStatus
      : ''
  }

  get documentLetterOfGuarantee () {
    return 'letterOfGuarantee' in this.document
      ? this.document.letterOfGuarantee!
      : ''
  }

  get documentVerifying () {
    return 'verifying' in this.document
      ? this.document.verifying!
      : ''
  }

  get documentSignedWithDigitalSignature () {
    return 'signedWithDigitalSignature' in this.document
      ? this.document.signedWithDigitalSignature!
      : ''
  }

  get isActDocument () {
    return isActDocument(this.document)
  }

  /**
   * Документ является актом и не акцептован
   * @return {boolean}
   */
  get isActNotSigned () {
    return this.isActDocument && ('actStatus' in this.document) && isStatusActNotSigned(this.document.actStatus!)
  }

  /**
   * Документ является актом и акцептован
   * @return {boolean}
   */
  get isActSigned () {
    return (this.isActDocument && ('actStatus' in this.document) && isStatusActSigned(this.document.actStatus!)) ||
      this.isActWasAccepted
  }

  /**
   * Документ является актом и был отказ от акцептования
   * @return {boolean}
   */
  get isActCanceled () {
    return (this.isActDocument && ('actStatus' in this.document) && isStatusActCanceled(this.document.actStatus!)) ||
      this.isActWasDeclined
  }

  /**
   * Классы для статуса документа
   * @return {object}
   */
  get statusClasses () {
    return {
      'success': this.isActSigned || this.isContractSigned || this.isDocumentActive,
      'error': this.isActCanceled || this.isDocumentCanceled
    }
  }

  get isContractOrSupplementary () {
    return [CONTRACT_ID, SUPPLEMENTARY_AGREEMENT_ID]
      .includes(this.documentTypeID.toString())
  }

  get isContractSigned () {
    return (this.isContractOrSupplementary &&
      (isStatusContractSigned(this.documentContractStatus || '') ||
      isNo(this.documentLetterOfGuarantee))) || this.isInternalSigned
  }

  get isContractReady () {
    return this.isContractOrSupplementary &&
      (isStatusContractReady(this.documentContractStatus || '') ||
      isYes(this.documentLetterOfGuarantee))
  }

  get isDocumentVerifying () {
    return (this.isContractReady && isYes(this.documentVerifying)) || this.isInternalVerifying
  }

  get isDocumentSigned () {
    return this.isContractOrSupplementary && isYes(this.documentSignedWithDigitalSignature)
  }

  get isDocumentNotSign () {
    return this.isContractOrSupplementary && isNo(this.documentSignedWithDigitalSignature)
  }

  get isDocumentCanceled () {
    return (this.isContractOrSupplementary && isStatusContractCanceled(this.documentContractStatus || '')) ||
      this.isInternalCanceled
  }

  get isDocumentActive () {
    return this.isContractOrSupplementary && isStatusContractActive(this.documentContractStatus || '')
  }

  /**
   * Показываем ли кнопку "Скачать"
   * @return {boolean}
   */
  get isShowDownloadButton () {
    return !this.isActNotSigned &&
      !this.isActCanceled &&
      !(this.isContractReady && this.isDocumentSigned) &&
      !(this.isContractReady && this.isDocumentNotSign)
  }

  get actRejectReasonRules () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => v.length <= 900 || 'Максимальное количество символов: 900'
    ]
  }

  get issetManualSignDocument () {
    return this.manualSignFile != null
  }

  get manualSignConfirmButtonText () {
    return this.manualSignFile
      ? 'Сохранить'
      : 'Прикрепить'
  }

  /// Vuex actions
  readonly downloadFile!: (payload: {
    api: API
    bucket: string
    key: string
    ext: string
    asPdf?: number
  }) => Promise<boolean | Blob>

  readonly changeActStatus!: (payload: {
    api: API
    documentId: string
    status: number
    reason: string
  }) => Promise<boolean>

  readonly logEdo!: (payload: {
    api: API
    type: string
    data: any
  }) => Promise<void>

  readonly uploadFile!: (payload: { bucket: string; fileName: string; file: File; filePath: string; api: API }) => Promise<boolean>

  readonly changeContractStatus!: (payload: {
    api: API
    contractId: string
    status: number | string
  }) => Promise<any>

  readonly attachSignedDocument!: (payload: { fileName: string; filePath: string; api: API; id: string; type: string; relatedTo: string }) => Promise<void>

  readonly createClosedRequest!: (type: string) => Promise<void | string>

  /// Methods
  async onDownloadHandler () {
    const __downloadOnDevice = (file: Blob) => {
      const blobURL = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = blobURL
      link.download = this.documentFileName
      link.style.display = 'none'
      link.click()
    }

    if (this.__file) {
      __downloadOnDevice(this.__file)
      return
    }

    this.isDownloadingFile = true

    try {
      const downloadFileResponse = await this.downloadFile({
        api: this.$api,
        bucket: this.documentBucket,
        key: this.documentFilePath,
        ext: this.documentExtension
      })

      if (typeof downloadFileResponse !== 'boolean') {
        this.__file = downloadFileResponse
        __downloadOnDevice(downloadFileResponse)
        this.onSendClosedRequest()
      } else {
        this.isDownloadedError = true
      }
    } catch (ex) {
      this.isDownloadedError = true
    } finally {
      this.isDownloadingFile = false
    }
  }

  async onOpenHandler () {
    const __openDocument = (file: Blob) => {
      const filePDF = file.slice(0, file.size, 'application/pdf')
      const fileObjectURL = URL.createObjectURL(filePDF)
      const windowOpen = window.open(fileObjectURL)

      if (windowOpen) {
        windowOpen.focus()
      } else {
        this.isOpenedError = true
      }
    }

    if (this.__file) {
      __openDocument(this.__file)
      return
    }

    this.isOpeningFile = true

    try {
      const downloadFileResponse = await this.downloadFile({
        api: this.$api,
        bucket: this.documentBucket,
        key: this.documentFilePath,
        ext: this.documentExtension
      })

      if (typeof downloadFileResponse !== 'boolean') {
        this.__file = downloadFileResponse
        __openDocument(downloadFileResponse)
        this.onSendClosedRequest()
      } else {
        this.isDownloadedError = true
      }
    } catch (ex) {
      this.isDownloadedError = true
    } finally {
      this.isOpeningFile = false
    }
  }

  onClickActStatusChange (status: number) {
    if (status === 1) {
      this.actStatusChangeInfo.title = 'Акцептование акта'
      this.actStatusChangeInfo.description = 'Вы уверены, что хотите акцептовать Акт оказания услуг/передачи оборудования?'
      this.actStatusChangeInfo.button = 'Акцептовать'
      this.actStatusChangeInfo.status = 1
    } else if (status === 0) {
      this.actStatusChangeInfo.title = 'Отказ от акцептования'
      this.actStatusChangeInfo.description = 'Вы уверены, что хотите отказаться от акцептования Акта оказания услуг/передачи оборудования?'
      this.actStatusChangeInfo.button = 'Отказаться'
      this.actStatusChangeInfo.status = 0
    }

    this.isShowDialogActStatusChange = true
  }

  async onChangeActStatusHandler () {
    if (this.$refs['act-cancel-form'] && !this.$refs['act-cancel-form'].validate()) return

    this.isActStatusChanging = true

    try {
      const changeActStatusResponse = await this.changeActStatus({
        api: this.$api,
        status: this.actStatusChangeInfo.status,
        documentId: this.documentID,
        reason: this.actRejectReason
      })

      if (changeActStatusResponse) {
        this.isActStatusChangedSuccess = true

        if (this.actStatusChangeInfo.status === 1) {
          this.isActWasAccepted = true
        } else {
          this.isActWasDeclined = true
        }
      } else {
        this.isActStatusChangedError = true
      }
    } catch (ex) {
      console.error(ex)
      this.isActStatusChangedError = true
    } finally {
      this.isShowDialogActStatusChange = false
      this.isActStatusChanging = false
    }
  }

  async getListCertificate () {
    try {
      await cadesplugin
      this.listCertificate = await DigitalSignature.getCertificatesList(cadesplugin as CADESPluginAsync)
      /* Хотя бы один сертификат есть, так как при их отсутствии выбрасывается исключение */
      this.activeCertificate = this.listCertificate[0]!
      this.isShowDialogSelectCertificate = true
    } catch (ex) {
      this.listCertificate = []
      this.isErrorGotCertificate = true
      this.logEdo({
        api: this.$api,
        type: 'ERROR',
        data: {
          errorText: 'Плагин недоступен или не установлен. Текст ошибки:' + ex.message.toString()
        }
      })
      console.error(ex)
    }
  }

  async digitalSigningDocument () {
    const __toBase64 = (file: Blob) => {
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

    this.isDigitalSigningDocument = true

    try {
      /* Получаем файл (загружаем в случае необходимости) */
      let __file = this.__file as Blob | null | boolean

      if (!__file) {
        __file = await this.downloadFile({
          api: this.$api,
          bucket: this.documentBucket,
          key: this.documentFilePath,
          ext: this.documentExtension
        })

        if (typeof __file === 'boolean') {
          this.isDownloadedError = true
          return
        }
      }

      /* Переводим файл в Base64 */
      const fileBase64 = await __toBase64(__file as Blob)
      /* Создаём видимую подпись для документа */
      const visibleSignature = DigitalSignature.createVisibleSignature(
        this.clientInfo.legalName || '',
        this.activeCertificate as iCertificate
      )

      const header = ';base64,'
      const data = fileBase64.substr(fileBase64.indexOf(header) + header.length)

      const signedDocument = await DigitalSignature.signDocument(
        cadesplugin,
        data,
        this.activeCertificate as iCertificate,
        visibleSignature,
        (logData: any, type: string) => this.logEdo({
          api: this.$api,
          type,
          data: {
            ...logData,
            filePath: this.documentFilePath,
            bucket: this.documentBucket,
            fileName: this.documentFileName
          }
        })
      )

      const binaryFile = dataURLtoFile(signedDocument, this.documentFileName)
      const newFilePath = `${moment().format('MMYYYY')}/${this.documentID}`

      await this.uploadFile({
        api: this.$api,
        file: binaryFile,
        bucket: this.documentBucket,
        filePath: newFilePath,
        fileName: this.documentFileName
      })

      await this.attachSignedDocument({
        api: this.$api,
        id: this.documentID,
        fileName: this.documentFileName,
        relatedTo: String(this.documentRelatedToID),
        type: String(this.documentTypeID),
        filePath: newFilePath
      })

      const changeContractStatusResponse = await this.changeContractStatus({
        api: this.$api,
        contractId: this.documentRelatedToID,
        status: 1
      })

      if (!changeContractStatusResponse || !changeContractStatusResponse.submit_statuses) {
        this.isDigitalSignedDocumentError = true
        return
      }

      if (changeContractStatusResponse.submit_statuses.length === 0) {
        this.isDigitalSignedDocumentSuccess = true
        this.isInternalSigned = true
        return
      }

      this.isDigitalSignedDocumentSuccess = true
      this.isInternalSigned = true
    } catch (ex) {
      console.error(ex)
      this.isDigitalSignedDocumentError = true
    } finally {
      this.isDigitalSigningDocument = false
      this.isShowDialogSelectCertificate = false
    }
  }

  async onManualSignConfirm () {
    if (this.issetManualSignDocument) {
      if (this.errorTextOfSelectManualSignDocument) return

      this.isManualSignLoading = true

      try {
        const fileName = `${Number(new Date())}_${this.manualSignFile?.name || ''}`
        const filePath = `${moment().format('MMYYYY')}/${this.documentID}`

        const uploadFileResponse = await this.uploadFile({
          api: this.$api,
          bucket: 'customer-docs',
          fileName,
          filePath,
          file: this.manualSignFile!
        })

        if (!uploadFileResponse) {
          this.isManualSignError = true
          return
        }

        await this.attachSignedDocument({
          api: this.$api,
          id: this.documentID,
          fileName,
          relatedTo: String(this.documentRelatedToID),
          type: String(this.documentTypeID),
          filePath
        })

        const changeContractStatusResponse = await this.changeContractStatus({
          api: this.$api,
          contractId: this.documentRelatedToID,
          status: 1
        })

        if (!changeContractStatusResponse || !changeContractStatusResponse.submit_statuses) {
          this.isManualSignError = true
          return
        }

        if (changeContractStatusResponse.submit_statuses.length === 0) {
          this.isManualSignSuccess = true
          this.isInternalVerifying = true
          return
        }

        this.isManualSignSuccess = true
        this.isInternalVerifying = true
      } catch (ex) {
        console.error(ex)
        this.isManualSignError = true
      } finally {
        this.isManualSignLoading = false
        this.isShowDialogManualSign = false
      }
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp'

      input.onchange = (e: Event) => {
        const __file = (e.target as HTMLInputElement).files?.[0]

        if (!__file) return

        if (
          !['doc', 'docx', 'pdf', 'csv', 'xls', 'xslx', 'jpeg', 'jpg', 'gif', 'png', 'tiff', 'bmp']
            .includes(last(__file.name.split('.'))!)
        ) {
          this.errorTextOfSelectManualSignDocument = 'Некорректный формат файла'
          return
        }

        if (__file.size > 2 * 1024 * 1024) {
          this.errorTextOfSelectManualSignDocument = 'Файл весит более 2 МБ'
          return
        }

        this.errorTextOfSelectManualSignDocument = ''
        this.manualSignFile = __file
      }

      input.click()
    }
  }

  async onCancelRequestHandler () {
    this.isCancelingRequest = true

    try {
      const changeContractStatusResponse = await this.changeContractStatus({
        api: this.$api,
        contractId: this.documentRelatedToID,
        status: '0'
      })

      if (!changeContractStatusResponse || !changeContractStatusResponse.submit_statuses) {
        this.isCanceledError = true
      } else {
        this.isCanceledSuccess = true
        this.isInternalCanceled = true
      }
    } catch (ex) {
      this.isCanceledError = true
      console.error(ex)
    } finally {
      this.isCancelingRequest = false
      this.isShowDialogCancel = false
    }
  }

  onSendClosedRequest () {
    const monthBegin = Number(moment().startOf('month').format('x'))

    if (this.documentTypeID === '9155673999213227559' && monthBegin <= this.document.creationDate) {
      this.createClosedRequest('CN_REPORT_CLOSED_DOCUMENT_FOR_CURRENT')
    } else if (this.documentTypeID === '9155673999213227559' && monthBegin > this.document.creationDate) {
      this.createClosedRequest('CN_REPORT_CLOSED_DOCUMENT_FOR_LAST')
    } else if (['9155673997213227559', '9155673998213227559'].includes(this.documentTypeID)) {
      this.createClosedRequest('CN_REPORT_DOCUMENT')
    } else if (['9154452676313182640', '9154452676313182641'].includes(this.documentTypeID)) {
      this.createClosedRequest('CN_CONTRACT_DOCUMENT_CONTRACT')
    } else if (this.documentTypeID === '9154452676313182647') {
      this.createClosedRequest('CN_CONTRACT_ACCEPTANCE_CERTIFICATE')
    } else if (this.documentTypeID === '9154452676313182646') {
      this.createClosedRequest('CN_CONTRACT_ACY_OF_RECONCILIATION')
    }
  }
}
