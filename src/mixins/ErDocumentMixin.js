import * as DOCUMENT from '@/constants/document'

export default {
  computed: {
    contractIsActive () {
      return this.document.contractStatus === DOCUMENT.CONTRACT.IS_ACTIVE
    },
    contractIsSigned () {
      return this.document.contractStatus === DOCUMENT.CONTRACT.IS_SIGNED
    },
    contractIsReady () {
      return this.document.contractStatus === DOCUMENT.CONTRACT.IS_READY
    },
    documentIsSigned () {
      return this.document.signedWithDigitalSignature === DOCUMENT.DIGITAL_SIGNATURE.IS_SIGNED
    },
    documentIsNotSigned () {
      return this.document.signedWithDigitalSignature === DOCUMENT.DIGITAL_SIGNATURE.IS_NOT_SIGNED
    },
    documentIsVerifying () {
      return this.document.verifying === DOCUMENT.IS_VERIFYING.IS_VERIFYING
    }
  }
}
