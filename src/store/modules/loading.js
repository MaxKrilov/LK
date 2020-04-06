const state = {
  clientInfo: true,
  indexPageProductByAddress: true,
  menuComponentBillingAccount: true,
  menuComponentBalance: true,
  menuComponentManager: true,
  loadingDocuments: true,
  loadingRequest: true,
  loadingPromisedPayment: true,
  loadingInvoiceForPayment: true,

  rebootBillingAccount: false
}
const getters = {
  indexPageProductByAddress: state => state.indexPageProductByAddress,
  menuComponentBillingAccount: state => state.menuComponentBillingAccount,
  menuComponentBalance: state => state.menuComponentBalance,
  menuComponentManager: state => state.menuComponentManager,
  clientInfo: state => state.clientInfo,
  loadingDocuments: state => state.loadingDocuments,
  loadingRequest: state => state.loadingRequest,
  loadingPromisedPayment: state => state.loadingPromisedPayment,
  loadingInvoiceForPayment: state => state.loadingInvoiceForPayment
}
const mutations = {
  indexPageProductByAddress (state, payload) {
    state.indexPageProductByAddress = payload
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
  rebootBillingAccount (state, payload) {
    state.rebootBillingAccount = payload
  },
  loadingInvoiceForPayment (state, payload) {
    state.loadingInvoiceForPayment = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
