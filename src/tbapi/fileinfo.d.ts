export interface ICustomerContract {
  contractStatus: string
  contractNumber: string
  contractType: string
}

export interface IOrderContractContractSignee {
  firstName: string
  lastName: string
  registrationDocument: string
  role: string
  jobTitle: string
  id: string
  secondName: string
  // todo - Переделать
  signedDocuments: any
}

export interface IOrderContractContractDocument {
  bucket: string
  verifying: string
  fileName: string
  filePath: string
  attachmentName: string
  id: string
  type: { id: string, name: string },
  visibleInSsp: string
}

export interface IOrderContractBillDocument extends IOrderContractContractDocument {
  billAmount: string
}

export interface IOrderContractBill {
  billingAccount: string,
  document: IOrderContractBillDocument
}

export interface IOrderContract {
  contractId: string
  contractStatus: string
  contractType: string
  signatureType: string
  contractNumber: string
  contractSignee: IOrderContractContractSignee,
  documents: {
    contractDocument: IOrderContractContractDocument
    bills: IOrderContractBill[]
  }
}

export interface ISigningDocument extends IOrderContractContractDocument {
  contractId: string,
  contractSignee: IOrderContractContractSignee,
  contractStatus: string
}
