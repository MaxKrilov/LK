/* eslint-disable camelcase */
export interface IBillingAccount {
  accountBrand?: { id: string, name: string }
  accountNumber: string
  accountSign?: string
  accountStatus: { id: string, name: string }
  billingAccountId: string
  billingForm?: { id: string, name: string }
  contractBrand?: { id: string, name: string }
  contractId?: string
  contractNumber: string
  contractStatus?: string
  deliveryMethod?: string
  dmpOnly?: string
  isPartnerAccount?: string
  vdcAccount?: string
}

export interface IBillingInfo {
  autoPay: boolean
  balance: string
  billPeriodUnit: { id: string, name: string }
  branchId: string
  clientBankAccount: string
  clientBankBic: string
  clientBankCorrAccount: string
  clientBankName: string
  contractDate: string
  contractEndDate: string
  contractNumber: string
  id: string
  legacyAccountNumber: string
  market: { id: string, name: string }
  marketingBrandId: string
  nextDate: string
  number: string
  paymentMethod: { id: string, name: string },
  sumToPay: number
  totalChaseableDebt: number
}

export interface IBillingPromisePaymentInfo {
  id: string
  promisePaymentActive?: {
    dlnqAmt: number
    totalActualPymtAmt: number
    totalRemainingPymtAmt: number
    pymtSchdEffDt: string
    totalSchdPymtAmt: number
    pymtSchdSeq: number
    reasonCd: string
    reconnectFeeFlag: string
    pymtSchdSumStatusDt: string
    promisePaymentDetails: [{
      pymtSchdCreateDt: string
      schdPymtAmt: number
      pymtMthdId: string
      schdPymtDueDt: string
      acctCurrencyCd: string
      recordCanBeUpdatedFlag: string
      actualPymtAmt: number
      pymtSchdStatusInd: string
      langCd: string
      verNbr: number
      pymtSchdStatusDt: string
    }]
    pymtSchdSumStatusInd: string
    verNbr: number
    restoreFlag: string
  }
}

export interface IBillingPromisePaymentCheck {
  paymentCanBeCreated: boolean
  reason?: string
}

export interface IPaymentHistory {
  billingAccount: { id: string, name: string, accountNumber: string }
  paymentAmount: number
  paymentOrigin: { paymentOriginId: number, name: string, id: string }
  currency: { name: string, id: string, currencyCode: string }
  id: string,
  paymentAttributes: [{
    index: number
    type: { id: string, name: string }
    name: string
    value?: string
    dateValue?: number
  }]
  createdDate: Date,
  accountPaymentStatus: { id: string, name: string }
  accountPaymentSequence: number
  paymentBalanceType: { id: string, name: string }
  paymentDate: number
  customer: { customerReference: string, id: string }
  cancelledReason: any[]
  paymentMethod: { paymentMethodId: string, name: string, id: string }
  bill: {
    extendedMap: Record<string, {
      attributeType: number,
      attributeName: string
      singleValue: { attributeValue: string }
    }>,
    billPeriodStartDate: number
    billingAccount: {
      accountNumber: string
      name: string
      id: string
      invoicingCompany: {
        invoicingCompanyId: string
        name: string
        id: string
        extendedMap: Record<string, {
          attributeType: number,
          attributeName: string
          singleValue: { attributeValue: string }
        }>
      }
    }
    customer: { customerReference: string, id: string }
    billVersion: string
    invoiceNumber: string
    billType: {
      billTypeId: string
      name: string
      id: string
      extendedMap: Record<string, {
        attributeType: number,
        attributeName: string
        singleValue: { attributeValue: string }
      }>
    }
    invoiceTotalAmount: number
    name: string
    id: string
    billSequenceNumber: number
    refund: boolean
  }
}

export interface IPaymentBillBillingAccount {
  name: string;
  id: string;
  accountNumber: string;
}

export interface IPaymentBillBillType {
  name: string;
  id: string;
  billTypeId: string;
}

export interface IPaymentBillInfoCurrency {
  name: string;
  id: string;
  currencyCode: string;
}

export interface IPaymentBillCustomer {
  customerReference: string;
  id: string;
}

export interface IPaymentBillBillStatus {
  name: string;
  id: string;
}

export interface IPaymentBillProductInstance {
  name: string;
  instanceId: number;
}

export interface IPaymentBillDetail {
  productInstance: IPaymentBillProductInstance;
  classCharge: IPaymentBillBillStatus;
  typeCharge: string;
  chargePeriod: string;
  chargeName: string;
  chargeCost: number;
}

export interface IPaymentBill {
  billPeriodStartDate: Date;
  billingAccount: IPaymentBillBillingAccount;
  id: string;
  name: string;
  billType: IPaymentBillBillType;
  infoCurrency: IPaymentBillInfoCurrency;
  customer: IPaymentBillCustomer;
  redeemedLoyaltyPoints: string;
  invoiceTaxAmount: number;
  adjustedLoyaltyPoints: string;
  billDate: string;
  invoiceTotalAmount: number;
  disputedAmount: number;
  paymentDueDate: string;
  invoiceNetAmount: number;
  forwardAccountBalance: number;
  receivablesAge: string;
  effectiveDebtsAge: string;
  actualBillDate: string;
  outAccountBalance: number;
  totalPaymentsAmount: number;
  forwardLoyaltyPoints: string;
  paidStatus: IPaymentBillBillStatus;
  outStandingDebt: number;
  billStatus: IPaymentBillBillStatus;
  invoiceNumber: string;
  billSequenceNumber: string;
  totalAdjustmentsAmount: number;
  billVersion: string;
  totalFailedPaymentsAmount: number;
  collectableAmount: number;
  outLoyaltyPoints: string;
  earnedLoyaltyPoints: string;
  billImageUrl: string;
  detail: IPaymentBillDetail[];
}

export interface IPaymentCard {
  bindingId: string
  maskedPan: string
  expiryDate: string
  gateId: number
  autopay: number
}

export interface IInfoBillAccount {
  bucket: string
  fileName: string
  filePath: string
  id: string
}

// todo вынести в документы
export interface IDocumentViewerDocument {
  id: string,
  bucket: string,
  fileName: string,
  filePath: string,
  type: {
    id: string,
    name: string
  }
}

export interface INewCardPayment {
  req_status: number
  error_text: string
  pay_url: string
  transaction_id: string
  gate_transaction_id: string
  amount: number
  param_set_id: string
}

export interface IPaymentStatus {
  pay_status: 0 | 1 | 2,
  pay_status_name: string,
  pay_status_descr: string,
  last_update: string
  transaction_id: string
  gate_transaction_id: string
  amount: number
  binding_id: any
  autopay_enabled: any
  err_code: any
}

export interface IBindCardPayment {
  status: number
  statusName: string
  statusDescription: string
  lastUpdate: string
  transactionId: string
  gateTransactionId: string
  amount: number
  paramSetId: string
  bindingId: any,
  autopayEnabled: any,
  errCode: any,
  acsUrl: string
  PaReq: string
  TermUrl: string
  MD: string
}
