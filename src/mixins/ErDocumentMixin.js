import * as DOCUMENT from '@/constants/document'

export default {
  computed: {
    getFirstElement () {
      return this.document[0]
    },
    contractIsActive () {
      return !!this.getFirstElement.contractStatus?.match(new RegExp(DOCUMENT.CONTRACT.IS_ACTIVE, 'ig'))
    },
    contractIsSigned () {
      return !!this.getFirstElement.contractStatus?.match(new RegExp(DOCUMENT.CONTRACT.IS_SIGNED), 'ig')
    },
    contractIsReady () {
      return !!this.getFirstElement.contractStatus?.match(new RegExp(DOCUMENT.CONTRACT.IS_READY), 'ig')
    },
    documentIsSigned () {
      return !!this.getFirstElement.signedWithDigitalSignature?.match(new RegExp(DOCUMENT.DIGITAL_SIGNATURE.IS_SIGNED), 'ig')
    },
    documentIsNotSigned () {
      return !!this.getFirstElement.signedWithDigitalSignature?.match(new RegExp(DOCUMENT.DIGITAL_SIGNATURE.IS_NOT_SIGNED), 'ig')
    },
    documentIsVerifying () {
      return !!this.getFirstElement.verifying?.match(new RegExp(DOCUMENT.IS_VERIFYING.IS_VERIFYING), 'ig')
    }
  }
}
