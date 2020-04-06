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
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  SET_ACTIVE_BILLING_ACCOUNT,
  GET_LIST_ADDRESS_BY_SERVICES,
  GET_PAYMENT_INFO,
  GET_PAYMENT_INFO_SUCCESS,
  SET_ACTIVE_BILLING_ACCOUNT_NUMBER,
  GET_PROMISED_PAYMENT_INFO
} from '../actions/user'
import { ERROR_MODAL } from '../actions/variables'
import { logError } from '@/functions/logging.ts'
import { eachArray } from '../../functions/helper'
import {
  isContractDocument,
  isBlankDocument,
  isUserListDocument,
  isReportDocument
} from '@/functions/document'

const ACCOUNT_MANAGER_ID = '9134601279613203712'
const INN_ID = '9148328342013670726'
const KPP_ID = '9154340518713221693'
const OGRN_ID = '9154340419713221073'

const state = {
  clientInfo: {
    fullAddress: {}
  },
  personalManager: {},
  countUnsignedDocuments: 0,
  documents: [],
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
      // eslint-disable-next-line camelcase
      name: state.personalManager?.surname || state.personalManager?.name || state.personalManager?.middle_name
        ? `${state.personalManager.surname || ''} ${state.personalManager.name || ''} ${state.personalManager.middle_name || ''}`.trim()
        : 'Нет закреплённого менеджера',
      phone: state.personalManager?.phone?.replace(/[^\d]+/g, ''),
      email: state.personalManager?.email
    }
  },
  getListContact (state) {
    return state.clientInfo?.contacts?.reduce((acc, item) => {
      const { id, firstName, name } = item
      const isLPR = !!item.roles?.filter(item => item.role.name.match(/decision maker/ig) || item.role.name.match(/лпр/ig))?.length || false
      eachArray(item.contactMethods || [], _item => {
        if (_item['@type'].match(/phone/i) || _item['@type'].match(/improfile/i)) {
          acc.push({
            id,
            firstName,
            name,
            phone: {
              id: _item.id,
              value: _item.value.replace(/[\D]+/g, '')
            },
            isLPR
          })
        } else if (_item['@type'].match(/email/i)) {
          acc.push({
            id,
            firstName,
            name,
            email: {
              id: _item.id,
              value: _item.value
            },
            isLPR
          })
        }
      })
      return acc
    }, []) || []
  },
  getReportDocuments: state => state.documents.filter(el => {
    return isReportDocument(el)
  }),
  getContractDocuments: state => state.documents.filter(el => {
    return isContractDocument(el) || isBlankDocument(el) || isUserListDocument(el)
  }),
  getCountUnsignedDocument (state) {
    return state.documents.filter(item => item?.contractStatus?.match(/Готов для клиента/i)).length
  },
  getPhoneList (state) {
    return state.clientInfo?.contactMethods?.filter(item => item['@type'] === 'PhoneNumber')
      .map(item => item.name.replace(/[\D]+/g, '')) || []
  },
  getEmailList (state) {
    return state.clientInfo?.contactMethods?.filter(item => item['@type'] === 'Email')
      .map(item => item.name) || []
  },
  getAddressList (state) {
    return state.clientInfo?.customerLocations?.map(item => ({
      value: item.fullAddress,
      id: item.address.id,
      locationId: item.id
    })) || []
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
  getActiveBillingAccountNumber (state) {
    return state.activeBillingAccountNumber
  },
  getListProductByAddress (state) {
    return state.listProductByAddress && Array.isArray(state.listProductByAddress)
      ? state.listProductByAddress.map(item => ({
        id: item.id,
        address: item.fulladdress,
        addressId: item.address.id,
        price: Number(item.amount.value),
        currency: item.amount.currency.name
      })) : []
  },
  getListProductByService (state) {
    return state.listProductByService?.map(item => ({
      code: item.offeringCategory.code,
      name: item.offeringCategory.name,
      price: item.amount.value
    }))
  },
  agreementNumber (state) {
    return state.listBillingAccount.find(item => item.billingAccountId === state.activeBillingAccount)?.contractNumber
  }
}

const actions = {
  [GET_CLIENT_INFO]: async ({ dispatch, commit, rootState, rootGetters }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
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
    const toms = rootGetters['auth/getTOMS']
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
    } else {
      commit('loading/menuComponentManager', false, { root: true })
    }
  },
  [GET_DOCUMENTS]: async ({ commit, rootState, rootGetters }, { api }) => {
    let toms

    if (process.env.VUE_APP_DOCUMENT_TEST_USER_ID !== undefined) {
      toms = process.env.VUE_APP_DOCUMENT_TEST_USER_ID
      console.info(`used VUE_APP_DOCUMENT_TEST_USER_ID=${toms}`)
    } else {
      toms = rootGetters['auth/getTOMS']
    }

    return api
      .setWithCredentials()
      .setData({
        clientId: toms
      })
      .query('/customer/management/fileinfo')
      .then((data) => {
        commit(GET_DOCUMENTS_SUCCESS, data)
      })
      .catch(error => {
        logError(error)
        commit(ERROR_MODAL, true, { root: true })
      })
      .finally(() => {
        commit('loading/loadingDocuments', false, { root: true })
      })
  },
  /**
   * Получение списка лицевых счетов
   * @param commit
   * @param rootGetters
   * @param api
   * @return {Promise<void>}
   */
  [GET_LIST_BILLING_ACCOUNT]: async ({ commit, rootGetters }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
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
      return Array.isArray(result) && result.length !== 0
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/menuComponentBillingAccount', false, { root: true })
    }
  },
  [GET_LIST_PRODUCT_BY_ADDRESS]: async ({ commit, rootGetters, getters }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
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
    const toms = rootGetters['auth/getTOMS']
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
    const toms = rootGetters['auth/getTOMS']
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
    const toms = rootGetters['auth/getTOMS']
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
    const toms = rootGetters['auth/getTOMS']
    try {
      await api
        .setWithCredentials()
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
  [GET_DOCUMENTS_SUCCESS]: (state, payload) => {
    state.documents = payload.filter(item => item.visibleInSSP !== 'Нет')
    state.countUnsignedDocuments = payload.length
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
