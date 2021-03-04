import {
  GET_CLIENT_INFO, UPDATE_CLIENT_INFO, GET_COMPANY_INFO,
  GET_CLIENT_INFO_SUCCESS,
  GET_COMPANY_INFO_SUCCESS,
  COMPANY_DATA_FETCHED,
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
  GET_PAYMENT_INFO_SUCCESS,
  SET_ACTIVE_BILLING_ACCOUNT_NUMBER,
  GET_CLIENT_INFO_ERROR,
  ADD_CLIENT_CONTACTS_STORE,
  REPLACE_CLIENT_CONTACTS_STORE,
  DELETE_CLIENT_CONTACTS_STORE,
  SET_PROMISED_PAYMENT_INFO
} from '../actions/user'
import { ERROR_MODAL } from '../actions/variables'
import { logError } from '@/functions/logging.ts'
import { eachArray, eachObject } from '../../functions/helper'
import { findIndex } from 'lodash'
import {
  isContractDocument,
  isBlankDocument,
  isReportDocument
} from '@/functions/document'
import moment from 'moment'
import { TYPE_JSON } from '../../constants/type_request'

const ACCOUNT_MANAGER_ID = '9134601279613203712'
const USER_LIST_LOADING_DATE = '9157297242513186244'
const INN_ID = '9148328342013670726'
const KPP_ID = '9154340518713221693'
const OGRN_ID = '9154340419713221073'

const state = {
  clientInfo: {
    fullAddress: {},
    primaryContact: {},
    contacts: []
  },
  companyInfo: {},
  lprInfo: {},
  personalManager: {},
  countUnsignedDocuments: 0,
  documents: [],
  listBillingAccount: [],
  activeBillingAccount: '',
  activeBillingAccountNumber: '',
  listProductByAddress: [],
  listProductByService: [],
  paymentInfo: {},
  isCanActivatePromisePayment: false,
  reasonCanntActivatePromisePayment: '',
  isHasPromisePayment: false,
  promisePayStart: null,
  promisePayEnd: null
}

const getters = {
  getClientInfo (state) {
    return {
      name: state.clientInfo?.legalName,
      inn: state.clientInfo?.extendedMap?.[INN_ID]?.singleValue?.attributeValue,
      kpp: state.clientInfo?.extendedMap?.[KPP_ID]?.singleValue?.attributeValue,
      ogrn: state.clientInfo?.extendedMap?.[OGRN_ID]?.singleValue?.attributeValue,
      address: state.clientInfo?.fullLegalAddress,
      contactId: state.clientInfo?.primaryContact.id
    }
  },
  getUserListLoadingDate (state) {
    return state.clientInfo?.extendedMap?.[USER_LIST_LOADING_DATE]?.singleValue?.attributeValue
  },
  getFnsClientInfo (state) {
    return {
      inn: state.companyInfo?.inn,
      name: state.companyInfo?.orgNameFull,
      legalAddress: state.companyInfo?.legalAddressText,
      kpp: state.companyInfo?.kpp,
      type: state.companyInfo?.type,
      isFetched: state.companyInfo?.isFetched
    }
  },
  getManagerInfo (state) {
    return {
      // eslint-disable-next-line camelcase
      name: state.personalManager?.surname || state.personalManager?.name
        ? `${state.personalManager.surname || ''} ${state.personalManager.name || ''}`.trim()
        : 'Нет закреплённого менеджера',
      phone: state.personalManager?.phone,
      email: state.personalManager?.email
    }
  },
  getManagerId (state) {
    return state.clientInfo?.accountManager?.id
  },
  getListContact (state) {
    return state.clientInfo?.contacts?.reduce
      ? state.clientInfo?.contacts?.reduce((acc, item) => {
        const { id, firstName, name, status } = item
        if (status.toLowerCase() !== 'active') return acc
        const isLPR = !!item.roles?.filter(item => item.role.name.match(/decision maker/ig) || item.role.name.match(/лпр/ig))?.length || false
        eachArray(item.contactMethods || [], _item => {
          if (_item['@type'].match(/phone/i) || _item['@type'].match(/improfile/i)) {
            acc.push({
              id,
              firstName,
              name,
              phone: { id: _item.id, value: _item.value.replace(/[\D]+/g, '') },
              isLPR
            })
          } else if (_item['@type'].match(/email/i)) {
            acc.push({
              id,
              firstName,
              name,
              email: { id: _item.id, value: _item.value },
              isLPR
            })
          }
        })
        return acc
      }, [])
      : []
  },
  getReportDocuments: state => state.documents.filter(el => {
    return isReportDocument(el)
  }),
  getContractDocuments: state => state.documents.filter(el => {
    return isContractDocument(el) || isBlankDocument(el)
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
        addressId: item.id,
        price: Number(item.amount.value),
        currency: item.amount.currency.name
      })) : []
  },
  getListProductByService (state) {
    return state.listProductByService.reduce((acc, product) => {
      const findElementIndex = acc.findIndex(accItem => accItem.code === product.offeringCategory.code)
      if (findElementIndex > -1) {
        acc[findElementIndex].price = acc[findElementIndex].price + Number(product.amount.value)
        return acc
      }
      acc.push({
        code: product.offeringCategory.code,
        name: product.offeringCategory.name,
        price: Number(product.amount.value),
        offerName: product.offer.name
      })
      return acc
    }, [])
  },
  getUserlistRequired (state) {
    return Boolean(state.listProductByService?.find((el) => el?.offer?.userlistRequired === 'Да'))
  },
  agreementNumber (state) {
    return state.listBillingAccount.find(item => item.billingAccountId === state.activeBillingAccount)?.contractNumber
  },
  getPrimaryContact (state) {
    return state.clientInfo.contacts.filter(item => item.id === state.clientInfo.primaryContact.id)[0]
  },
  getContactById: (state) => (contactId) => {
    return state.clientInfo.contacts.filter(item => item.id === contactId)[0]
  },
  getMarketingBrandId (state) {
    return state.paymentInfo?.marketingBrandId
  },
  getMarketId (state) {
    return state.paymentInfo.market?.id || ''
  }
}

const actions = {
  [GET_CLIENT_INFO]: ({ dispatch, commit, rootState, rootGetters }, { api }) => {
    return new Promise((resolve, reject) => {
      const toms = rootGetters['auth/getTOMS']
      api
        .setWithCredentials()
        .setData({
          id: toms
        })
        .query('/customer/account/client-info')
        .then(response => {
          commit(GET_CLIENT_INFO_SUCCESS, response)
          dispatch('contacts/getCurrentClientContacts', true, { root: true })
          resolve(response)
        })
        .catch(error => {
          commit(ERROR_MODAL, true, { root: true })
          reject(error)
        })
        .finally(() => {
          commit('loading/clientInfo', false, { root: true })
        })
    })
  },
  [UPDATE_CLIENT_INFO]: async (
    { commit, dispatch, rootState, rootGetters },
    { api, formData }) => {
    const { toms: clientId } = rootGetters['auth/user']
    const id = clientId
    const { inn, isFetched, type, legalAddress, ...requestData } = formData
    let preparedData = { inn, id, clientId, legalAddress, ...requestData }
    eachObject(preparedData, (value, key) => {
      if (!preparedData[key]) {
        delete preparedData[key]
      }
    })

    const url = '/customer/account/edit-client'
    try {
      const response = await api
        .setWithCredentials()
        .setData({
          ...preparedData
        })
        .setType(TYPE_JSON)
        .query(url)

      if (response.id) {
        return true
      } else {
        commit(GET_CLIENT_INFO_ERROR, `Ошибка обновления данных клиента: ${response.message.toString()}`)
        return false
      }
    } catch (error) {
      commit(GET_CLIENT_INFO_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
      return false
    }
  },
  updateClientInfo (context, payload) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const { api, ...data } = payload
    data.id = clientId
    return new Promise((resolve, reject) => {
      payload.api
        .setWithCredentials()
        .setData(data)
        .query('/customer/account/edit-client')
        .then((response) => {
          resolve(response)
        })
        .catch((err) => reject(err))
    })
  },
  [GET_COMPANY_INFO]: async ({ commit, rootState, rootGetters }, { api, inn }) => {
    const innLength = inn.length
    try {
      const result = await api
        .setWithCredentials()
        .setData({ inn: inn })
        .query('/customer/account/get-organization-info')

      commit(GET_COMPANY_INFO_SUCCESS, { inn, isFetched: true, ...result })
      return result
    } catch (error) {
      commit(COMPANY_DATA_FETCHED, false)
      switch (innLength) {
        case 10:
          commit(GET_COMPANY_INFO_SUCCESS, { inn, type: 'corporation' })
          break
        case 12:
          commit(GET_COMPANY_INFO_SUCCESS, { inn, type: 'entrepreneur' })
          break
      }
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
  [GET_LIST_PRODUCT_BY_ADDRESS]: async ({ commit, rootGetters, getters }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
    const activeBillingAccount = rootGetters['payments/getActiveBillingAccount']
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
    const activeBillingAccount = rootGetters['payments/getActiveBillingAccount']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount,
          locationId: address
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
    const activeBillingAccount = rootGetters['payments/getActiveBillingAccount']
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
      commit('loading/indexPageProductByService', false, { root: true })
    }
  },
  [GET_LIST_ADDRESS_BY_SERVICES]: async ({ commit, rootGetters, getters }, { api, productType }) => {
    const toms = rootGetters['auth/getTOMS']
    const activeBillingAccount = rootGetters['payments/getActiveBillingAccount']
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
  [ADD_CLIENT_CONTACTS_STORE]: ({ commit }, payload) => {
    commit(ADD_CLIENT_CONTACTS_STORE, payload)
  },
  /**
   * Обновление/удаление контакта в clientInfo.contacts
   * @param state
   * @param commit
   * @param payload { Object } - объект контакта
   */
  [REPLACE_CLIENT_CONTACTS_STORE]: ({ state, commit }, payload) => {
    let contacts = [...state.clientInfo?.contacts]
    const index = findIndex(contacts, function (o) { return o.id === payload.id })
    contacts.splice(index, 1, payload)
    commit(REPLACE_CLIENT_CONTACTS_STORE, contacts)
  },
  [DELETE_CLIENT_CONTACTS_STORE]: ({ state, commit }, payload) => {
    let contacts = [...state.clientInfo?.contacts]
    const index = findIndex(contacts, function (o) { return o.id === payload })
    contacts.splice(index, 1)
    commit(REPLACE_CLIENT_CONTACTS_STORE, contacts)
  }
}

const mutations = {
  [GET_CLIENT_INFO_SUCCESS]: (state, payload) => {
    if (payload.hasOwnProperty('contacts') && Array.isArray(payload.contacts)) {
      payload.contacts = payload.contacts.filter(contact => contact.status?.toLowerCase() === 'active')
    }
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
    state.paymentInfo.balance = Number(payload.balance) > 0
      ? (0 - Number(payload.balance)).toFixed(2)
      : Math.abs(Number(payload.balance)).toFixed(2)
  },
  [GET_COMPANY_INFO_SUCCESS]: (state, payload) => {
    state.companyInfo = { ...state.companyInfo, ...payload }
  },
  [COMPANY_DATA_FETCHED]: (state, payload) => {
    state.companyInfo.isFetched = payload
  },
  [ADD_CLIENT_CONTACTS_STORE]: (state, payload) => {
    state.clientInfo.contacts = [...state.clientInfo.contacts, payload]
  },
  [REPLACE_CLIENT_CONTACTS_STORE]: (state, payload) => {
    state.clientInfo.contacts = [...payload]
  },
  [SET_PROMISED_PAYMENT_INFO]: (state, [infoAboutPromisePaymentResult, canBeActivatedPromisePaymentResult]) => {
    if (canBeActivatedPromisePaymentResult.paymentCanBeCreated) {
      state.isCanActivatePromisePayment = true
      return
    } else {
      state.reasonCanntActivatePromisePayment = canBeActivatedPromisePaymentResult.reason
    }
    if (!infoAboutPromisePaymentResult.hasOwnProperty('promisePaymentActive')) return
    const { pymtSchdCreateDt, schdPymtDueDt } = infoAboutPromisePaymentResult.promisePaymentActive.promisePaymentDetails[0] || {}
    if (!pymtSchdCreateDt || !schdPymtDueDt) return
    if (Number(new Date()) > (new Date(moment(schdPymtDueDt, 'YYYYMMDD')))) return
    state.isHasPromisePayment = true
    state.promisePayStart = moment(pymtSchdCreateDt, 'YYYYMMDD')
    state.promisePayEnd = moment(schdPymtDueDt, 'YYYYMMDD')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
