const state = {
  clientInfo: true,
  indexPageProductByAddress: true,
  indexPageProductByService: true,
  menuComponentBillingAccount: true,
  menuComponentBalance: true,
  menuComponentManager: true,
  loadingDocuments: true,
  loadingRequest: true,
  loadingPromisedPayment: true,
  loadingOrders: true,
  sendingCancellingOrder: false,
  loadingInvoiceForPayment: true,
  contacts: true,

  rebootBillingAccount: false,

  loadingPaymentHistoryBill: true
}
const getters = {
  indexPageProductByAddress: state => state.indexPageProductByAddress,
  indexPageProductByService: state => state.indexPageProductByService,
  menuComponentBillingAccount: state => state.menuComponentBillingAccount,
  menuComponentBalance: state => state.menuComponentBalance,
  menuComponentManager: state => state.menuComponentManager,
  clientInfo: state => state.clientInfo,
  loadingDocuments: state => state.loadingDocuments,
  loadingRequest: state => state.loadingRequest,
  loadingPromisedPayment: state => state.loadingPromisedPayment,
  loadingOrders: state => state.loadingOrders,
  sendingCancellingOrder: state => state.sendingCancellingOrder,
  loadingInvoiceForPayment: state => state.loadingInvoiceForPayment,
  loadingPaymentHistoryBill: state => state.loadingPaymentHistoryBill
}
const mutations = {
  indexPageProductByAddress (state, payload) {
    state.indexPageProductByAddress = payload
  },
  indexPageProductByService (state, payload) {
    state.indexPageProductByService = payload
  },
  menuComponentBillingAccount (state, payload) {
    state.menuComponentBillingAccount = payload
  },
  menuComponentBalance (state, payload) {
    state.menuComponentBalance = payload
  },
  menuComponentManager (state, payload) {
    state.menuComponentManager = payload
  },
  clientInfo (state, payload) {
    state.clientInfo = payload
  },
  loadingDocuments (state, payload) {
    state.loadingDocuments = payload
  },
  loadingRequest (state, payload) {
    state.loadingRequest = payload
  },
  loadingPromisedPayment (state, payload) {
    state.loadingPromisedPayment = payload
  },
  loadingOrders (state, payload) {
    state.loadingOrders = payload
  },
  sendingCancellingOrder (state, payload) {
    state.sendingCancellingOrder = payload
  },
  rebootBillingAccount (state, payload) {
    state.rebootBillingAccount = payload
  },
  loadingInvoiceForPayment (state, payload) {
    state.loadingInvoiceForPayment = payload
  },
  loadingPaymentHistoryBill (state, payload) {
    state.loadingPaymentHistoryBill = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
