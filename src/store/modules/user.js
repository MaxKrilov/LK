import {
  GET_CLIENT_INFO,
  GET_CLIENT_INFO_SUCCESS, GET_MANAGER_INFO, GET_MANAGER_INFO_SUCCESS,
  GET_UNSIGNED_DOCUMENTS, GET_UNSIGNED_DOCUMENTS_SUCCESS
} from '../actions/user'
import { ERROR_MODAL } from '../actions/variables'

const ACCOUNT_MANAGER_ID = '9134601279613203712'

const state = {
  clientInfo: {},
  personalManager: {},
  countUnsignedDocuments: []
}

const getters = {
  getManagerInfo (state) {
    return {
      name: `${state.personalManager?.surname} ${state.personalManager?.name} ${state.personalManager?.middle_name}`,
      phone: state.personalManager?.phone?.replace(/[^\d]+/g, ''),
      email: state.personalManager?.email
    }
  },
  getCountUnsignedDocuments (state) {
    return state.countUnsignedDocuments.length
  }
}

const actions = {
  [GET_CLIENT_INFO]: async ({ commit, rootState, rootGetters }, { api }) => {
    const { tomsId } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          id: tomsId
        })
        .query('/customer/account/client-info')
      commit(GET_CLIENT_INFO_SUCCESS, result)
      return result
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  },
  [GET_MANAGER_INFO]: async ({ commit, rootState, rootGetters }, { api }) => {
    const accountManagerId = rootState['user']?.clientInfo?.extendedMap?.[ACCOUNT_MANAGER_ID]?.singleValue?.attributeValue
    const { tomsId } = rootGetters['auth/user']
    if (accountManagerId) {
      try {
        const result = await api
          .setWithCredentials()
          .setData({
            id: accountManagerId,
            clientId: tomsId
          })
          .query('/customer/manager/index')
        commit(GET_MANAGER_INFO_SUCCESS, result)
      } catch (error) {
        commit(ERROR_MODAL, true, { root: true })
        // todo Логирование
      }
    }
  },
  [GET_UNSIGNED_DOCUMENTS]: async ({ commit, rootState, rootGetters }, { api }) => {
    const { tomsId } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setBranch('web-bss')
        .setData({
          clientId: tomsId
        })
        .query('/customer/management/fileinfo')
      commit(GET_UNSIGNED_DOCUMENTS_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  }
}

const mutations = {
  [GET_CLIENT_INFO_SUCCESS]: (state, payload) => {
    state.clientInfo = payload
  },
  [GET_MANAGER_INFO_SUCCESS]: (state, payload) => {
    state.personalManager = payload
  },
  [GET_UNSIGNED_DOCUMENTS_SUCCESS]: (state, payload) => {
    state.countUnsignedDocuments = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
