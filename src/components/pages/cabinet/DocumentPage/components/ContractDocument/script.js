import CommonDocument from '../CommonDocument'
import * as DOCUMENT from '@/constants/document'
import DocumentMixin from '@/mixins/ErDocumentMixin'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'
import * as Document from '../../../../../../constants/document'
import { getFirstElement } from '../../../../../../functions/helper'
import { isActDocument } from '../../../../../../functions/document'

export default {
  mixins: [DocumentMixin],
  props: {
    document: {
      type: [Array, Object]
    }
  },
  data: () => ({
    ...DOCUMENT,
    isOpenViewer: false,
    isOpenConfirm: false,
    isCancelSuccess: false,
    isCancelError: false,
    cancelErrorText: '',
    actConfirmTitle: '',
    actConfirmButton: '',
    actStatus: 0,
    isActConfirm: false,
    isActSuccess: false,
    isActError: false,
    isActSigning: false
  }),
  components: {
    CommonDocument,
    ErDocumentViewer,
    ErActivationModal
  },
  computed: {
    isSingleDocument () {
      return (Array.isArray(this.document) && this.document.length === 1)
    },
    computedTypeName () {
      return this.isSingleDocument
        ? this.getFirstElement.type.id === Document.TRILATERAL_DOCUMENTS
          ? `Трехстороннее соглашение`
          : this.getFirstElement.type.name
        : 'Комплект документов'
    },
    computedRelatedToName () {
      return this.getFirstElement.relatedTo.name
    },
    computedModifiedWhen () {
      return this.getFirstElement.modifiedWhen
    },
    computedListDocumentForViewer () {
      return this.document.map(_document => ({
        id: _document.id,
        bucket: _document.bucket,
        fileName: _document.fileName,
        filePath: _document.filePath,
        type: _document.type
      }))
    },
    getContractOrSupplementary () {
      const findContract = this.document.find(_document => _document.type.id === Document.CONTRACT_ID)
      if (findContract) return findContract
      const findSupplementary = this.document.find(_document => _document.type.id === Document.SUPPLEMENTARY_AGREEMENT_ID)
      if (findSupplementary) return findSupplementary
      return undefined
    },
    contractIsSigned () {
      return !!(
        (this.getContractOrSupplementary || this.getFirstElement)
          .contractStatus?.match(new RegExp(DOCUMENT.CONTRACT.IS_SIGNED), 'i') &&
        (this.getContractOrSupplementary?.letterOfGuarantee?.toLowerCase() !== 'yes')) ||
        (isActDocument(this.document) && this.document.actStatus?.toLowerCase() === 'подписан')
    },
    contractIsReady () {
      return (
        (this.getContractOrSupplementary || this.getFirstElement)
          .contractStatus?.toLowerCase() === DOCUMENT.CONTRACT.IS_READY.toLowerCase()) ||
        (this.getContractOrSupplementary?.letterOfGuarantee?.toLowerCase() === 'yes') ||
        (isActDocument(this.document) && this.document.actStatus?.toLowerCase() === 'не подписан')
    },
    documentIsVerifying () {
      return this.contractIsReady &&
        (this.getContractOrSupplementary || this.getFirstElement).verifying?.toLowerCase() === DOCUMENT.IS_VERIFYING.IS_VERIFYING.toLowerCase()
    },
    documentIsSigned () {
      return !!this.getContractOrSupplementary &&
        this.getContractOrSupplementary.signedWithDigitalSignature?.toLowerCase() === DOCUMENT.DIGITAL_SIGNATURE.IS_SIGNED.toLowerCase()
    },
    documentIsNotSigned () {
      return !!this.getContractOrSupplementary &&
        this.getContractOrSupplementary.signedWithDigitalSignature?.toLowerCase() === DOCUMENT.DIGITAL_SIGNATURE.IS_NOT_SIGNED.toLowerCase()
    },
    documentIsCancel () {
      return (this.getContractOrSupplementary || this.getFirstElement).contractStatus?.toLowerCase() === DOCUMENT.CONTRACT.IS_CANCEL.toLowerCase()
    },
    documentIsActive () {
      return ((this.getContractOrSupplementary || this.getFirstElement).contractStatus?.toLowerCase() === DOCUMENT.CONTRACT.IS_ACTIVE.toLowerCase())
    },
    documentIsAct () {
      return isActDocument(getFirstElement(this.document))
    },
    documentIsActNotSigned () {
      return this.documentIsAct &&
        getFirstElement(this.document)?.actStatus === 'Не подписан'
    },
    documentIsActSigned () {
      return this.documentIsAct &&
        getFirstElement(this.document)?.actStatus === 'Подписан'
    },
    documentIsActCancel () {
      return this.documentIsAct &&
        getFirstElement(this.document)?.actStatus === 'Отказ'
    }
  },
  methods: {
    __signing (e, eventName) {
      let documentForSignature = this.document.find(item => [Document.CONTRACT_ID, Document.SUPPLEMENTARY_AGREEMENT_ID].includes(String(item.type.id)))
      documentForSignature = documentForSignature || this.document[0]
      if (!e) {
        this.$refs.viewer.downloadFile(documentForSignature)
          .then(data => {
            this.$emit(eventName, {
              data,
              ...documentForSignature
            })
          })
      } else {
        this.$emit(eventName, {
          data: e.data,
          ...documentForSignature
        })
      }
    },
    manualSigning (e) {
      this.__signing(e, 'signing:manual')
    },
    digitalSigning (e) {
      this.__signing(e, 'signing:digital')
    },
    cancelSigningConfirm () {
      this.isOpenConfirm = true
    },
    cancelSigning () {
      this.$store.dispatch('fileinfo/changeContractStatus', {
        api: this.$api,
        contractId: getFirstElement(this.document).relatedTo.id,
        status: '0'
      })
        .then(result => {
          this.isOpenConfirm = false
          if (!result || !result.submit_statuses) {
            this.cancelErrorText = ''
            this.isCancelError = true
            return
          }
          if (['success', 'not_executed'].includes(result.submit_statuses[0].submitStatus.toLowerCase())) {
            this.isCancelSuccess = true
            this.$store.dispatch('fileinfo/downloadListDocument', { api: this.$api })
          } else {
            this.cancelErrorText = result.submit_statuses[0].submitError
            this.isCancelError = true
          }
        })
    },
    actSigningConfirm (status) {
      this.actConfirmTitle = status
        ? 'Вы уверены, что хотите акцептовать Акт оказания услуг/передачи оборудования?'
        : 'Вы уверены, что хотите отказаться от акцептования Акта оказания услуг/передачи оборудования?'
      this.actConfirmButton = status ? 'Акцептовать' : 'Отказаться'
      this.actStatus = status
      this.isActConfirm = true
    },
    actSigning () {
      this.isActSigning = true
      this.$store.dispatch('fileinfo/actSigning', {
        api: this.$api,
        status: this.actStatus,
        documentId: getFirstElement(this.document).id
      })
        .then(response => {
          if (response) {
            this.isActSuccess = true
            setTimeout(() => {
              this.$store.dispatch(`fileinfo/downloadListDocument`, { api: this.$api })
            }, 5001)
          } else {
            this.isActError = true
          }
          this.isActConfirm = false
        })
        .catch(() => {
          this.isActConfirm = false
          this.isActError = true
        })
        .finally(() => {
          this.isActSigning = false
        })
    }
  }
}
