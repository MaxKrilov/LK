import {
  GET_CLIENT_INFO,
  GET_CLIENT_INFO_SUCCESS,
  GET_LIST_BILLING_ACCOUNT,
  GET_LIST_BILLING_ACCOUNT_SUCCESS,
  GET_LIST_PRODUCT_BY_ADDRESS,
  GET_LIST_PRODUCT_BY_ADDRESS_SUCCESS,
  GET_LIST_PRODUCT_BY_SERVICE,
  GET_LIST_PRODUCT_BY_SERVICE_SUCCESS,
  GET_LIST_SERVICE_BY_ADDRESS,
  GET_MANAGER_INFO,
  GET_MANAGER_INFO_SUCCESS,
  GET_UNSIGNED_DOCUMENTS,
  GET_UNSIGNED_DOCUMENTS_SUCCESS,
  SET_ACTIVE_BILLING_ACCOUNT,
  GET_LIST_ADDRESS_BY_SERVICES,
  GET_PAYMENT_INFO,
  GET_PAYMENT_INFO_SUCCESS,
  SET_ACTIVE_BILLING_ACCOUNT_NUMBER,
  GET_PROMISED_PAYMENT_INFO
} from '../actions/user'
import { ERROR_MODAL } from '../actions/variables'

const ACCOUNT_MANAGER_ID = '9134601279613203712'
const INN_ID = '9148328342013670726'
const KPP_ID = '9154340518713221693'
const OGRN_ID = '9154340419713221073'

const state = {
  clientInfo: {
    fullAddress: {}
  },
  personalManager: {},
  countUnsignedDocuments: [],
  listBillingAccount: [],
  activeBillingAccount: '',
  activeBillingAccountNumber: '',
  listProductByAddress: [],
  listProductByService: [],
  paymentInfo: {}
}

const getters = {
  getClientInfo (state) {
    return {
      name: state.clientInfo?.legalName,
      inn: state.clientInfo?.extendedMap?.[INN_ID]?.singleValue?.attributeValue,
      kpp: state.clientInfo?.extendedMap?.[KPP_ID]?.singleValue?.attributeValue,
      ogrn: state.clientInfo?.extendedMap?.[OGRN_ID]?.singleValue?.attributeValue,
      address: state.clientInfo?.fullLegalAddress
    }
  },
  getManagerInfo (state) {
    return {
      name: `${state.personalManager?.surname} ${state.personalManager?.name} ${state.personalManager?.middle_name}`,
      phone: state.personalManager?.phone?.replace(/[^\d]+/g, ''),
      email: state.personalManager?.email
    }
  },
  getCountUnsignedDocuments (state) {
    return state.countUnsignedDocuments.length
  },
  getBillingAccountsGroupByContract (state) {
    return state.listBillingAccount.reduce((result, item) => {
      const {
        contractNumber,
        accountNumber,
        billingAccountId,
        accountStatus
      } = item
      if (!result.hasOwnProperty(contractNumber)) {
        result[contractNumber] = []
      }
      result[contractNumber].push({ accountNumber, billingAccountId, accountStatus })
      return result
    }, {})
  },
  getActiveBillingAccount (state) {
    return state.activeBillingAccount
  },
  getListProductByAddress (state) {
    return state.listProductByAddress.map(item => ({
      id: item.id,
      address: item.fulladdress,
      addressId: item.address.id,
      price: Number(item.amount.value),
      currency: item.amount.currency.name
    }))
  },
  getListProductByService (state) {
    return state.listProductByService.map(item => ({
      code: item.offeringCategory.code,
      name: item.offeringCategory.name,
      price: item.amount.value
    }))
  }
}

const actions = {
  [GET_CLIENT_INFO]: async ({ dispatch, commit, rootState, rootGetters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          id: toms,
          clientId: toms
        })
        .query('/customer/account/client-info')
      commit(GET_CLIENT_INFO_SUCCESS, result)
      return result
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/clientInfo', false, { root: true })
    }
  },
  [GET_MANAGER_INFO]: async ({ commit, rootState, rootGetters }, { api }) => {
    const accountManagerId = rootState['user']?.clientInfo?.extendedMap?.[ACCOUNT_MANAGER_ID]?.singleValue?.attributeValue
    const { toms } = rootGetters['auth/user']
    if (accountManagerId) {
      try {
        const result = await api
          .setWithCredentials()
          .setData({
            id: accountManagerId,
            clientId: toms
          })
          .query('/customer/manager/index')
        commit(GET_MANAGER_INFO_SUCCESS, result)
      } catch (error) {
        commit(ERROR_MODAL, true, { root: true })
        // todo Логирование
      } finally {
        commit('loading/menuComponentManager', false, { root: true })
      }
    }
  },
  [GET_UNSIGNED_DOCUMENTS]: async ({ commit, rootState, rootGetters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms
        })
        .query('/customer/management/fileinfo')
      commit(GET_UNSIGNED_DOCUMENTS_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/loadingDocuments', false, { root: true })
    }
  },
  /**
   * Получение списка лицевых счетов
   * @param commit
   * @param rootGetters
   * @param api
   * @return {Promise<void>}
   */
  [GET_LIST_BILLING_ACCOUNT]: async ({ commit, rootGetters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          id: toms,
          clientId: toms
        })
        .query('/payment/account/list')
      commit(GET_LIST_BILLING_ACCOUNT_SUCCESS, result)
      // Устанавливаем активным первый биллинг-аккаунт
      if (Array.isArray(result) && result.length !== 0) {
        commit(SET_ACTIVE_BILLING_ACCOUNT, result[0].billingAccountId)
        commit(SET_ACTIVE_BILLING_ACCOUNT_NUMBER, result[0].accountNumber)
      }
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/menuComponentBillingAccount', false, { root: true })
    }
  },
  [GET_LIST_PRODUCT_BY_ADDRESS]: async ({ commit, rootGetters, getters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    const activeBillingAccount = getters.getActiveBillingAccount
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount
        })
        .query('/order/management/all-points')
      commit(GET_LIST_PRODUCT_BY_ADDRESS_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  },
  [GET_LIST_SERVICE_BY_ADDRESS]: async ({ commit, rootGetters, getters }, { api, address }) => {
    const { toms } = rootGetters['auth/user']
    const activeBillingAccount = getters.getActiveBillingAccount
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount,
          address
        })
        .query('/order/management/products')
      return result
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  },
  [GET_LIST_PRODUCT_BY_SERVICE]: async ({ commit, rootGetters, getters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    const activeBillingAccount = getters.getActiveBillingAccount
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount
        })
        .query('/order/management/products')
      commit(GET_LIST_PRODUCT_BY_SERVICE_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/indexPageProductByAddress', false, { root: true })
    }
  },
  [GET_LIST_ADDRESS_BY_SERVICES]: async ({ commit, rootGetters, getters }, { api, productType }) => {
    const { toms } = rootGetters['auth/user']
    const activeBillingAccount = getters.getActiveBillingAccount
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount,
          productType
        })
        .query('/order/management/points')
      return result
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  },
  [GET_PAYMENT_INFO]: async ({ commit, rootGetters, getters }, { api }) => {
    const activeBillingAccount = getters.getActiveBillingAccount
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          id: activeBillingAccount
        })
        .query('/payment/billing/get-info')
      commit(GET_PAYMENT_INFO_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/menuComponentBalance', false, { root: true })
    }
  },
  [GET_PROMISED_PAYMENT_INFO]: async ({ commit, rootGetters, getters }, { api }) => {
    const activeBillingAccount = getters.getActiveBillingAccount
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setBranch('web-16308')
        .setData({
          id: activeBillingAccount,
          clientId: toms
        })
        .query('/billing/promise/index')
      // commit(GET_PROMISED_PAYMENT_INFO, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/loadingPromisedPayment', false, { root: true })
    }
  }
}

const mutations = {
  [GET_CLIENT_INFO_SUCCESS]: (state, payload) => {
    state.clientInfo = { ...state.clientInfo, ...payload }
  },
  [GET_MANAGER_INFO_SUCCESS]: (state, payload) => {
    state.personalManager = payload
  },
  [GET_UNSIGNED_DOCUMENTS_SUCCESS]: (state, payload) => {
    state.countUnsignedDocuments = payload
  },
  [GET_LIST_BILLING_ACCOUNT_SUCCESS]: (state, payload) => {
    state.listBillingAccount = payload
  },
  [SET_ACTIVE_BILLING_ACCOUNT]: (state, payload) => {
    state.activeBillingAccount = payload
  },
  [SET_ACTIVE_BILLING_ACCOUNT_NUMBER]: (state, payload) => {
    state.activeBillingAccountNumber = payload
  },
  [GET_LIST_PRODUCT_BY_ADDRESS_SUCCESS]: (state, payload) => {
    state.listProductByAddress = payload
  },
  [GET_LIST_PRODUCT_BY_SERVICE_SUCCESS]: (state, payload) => {
    state.listProductByService = payload
  },
  [GET_PAYMENT_INFO_SUCCESS]: (state, payload) => {
    state.paymentInfo = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
