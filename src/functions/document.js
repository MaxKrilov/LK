import { TYPES } from '@/constants/document'

function isBlankDocument (document) {
  return TYPES.BLANK.includes(document.type.id)
}

function isContractDocument (document) {
  return TYPES.CONTRACT.includes(document.type.id)
}

function isUserListDocument (document) {
  return TYPES.USER_LIST.includes(document.type.id)
}

function isReportDocument (document) {
  return TYPES.REPORT.includes(document.type.id)
}

export {
  isBlankDocument,
  isContractDocument,
  isUserListDocument,
  isReportDocument
}
