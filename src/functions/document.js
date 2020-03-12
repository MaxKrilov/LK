import { TYPES } from '@/constants/document'

function isBlankDocument (document) {
  document = Array.isArray(document) ? document[0] : document
  return TYPES.BLANK.includes(document.type.id)
}

function isContractDocument (document) {
  document = Array.isArray(document) ? document[0] : document
  return TYPES.CONTRACT.includes(document.type.id)
}

function isUserListDocument (document) {
  document = Array.isArray(document) ? document[0] : document
  return TYPES.USER_LIST.includes(document.type.id)
}

function isReportDocument (document) {
  document = Array.isArray(document) ? document[0] : document
  return TYPES.REPORT.includes(document.type.id)
}

export {
  isBlankDocument,
  isContractDocument,
  isUserListDocument,
  isReportDocument
}
