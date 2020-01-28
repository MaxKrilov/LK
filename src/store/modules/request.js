import {
  CANCEL_REQUEST,
  CREATE_REQUEST,
  CREATE_REQUEST_SUCCESS,
  GET_REQUEST,
  GET_REQUEST_BY_ID,
  GET_REQUEST_SUCCESS
} from '../actions/request'
import { ERROR_MODAL } from '../actions/variables'

const CANCELLATION_REASON = '9150410012013966885'
const REQUEST_REASON = '9154749926213188767'
const COMPLAINT_REASON = '0'

const CHANNEL_OF_NOTIFICATION_VIBER = '9130635331813922067'

const state = {
  listRequest: {}
}

const actions = {
  [GET_REQUEST]: async ({ rootState, rootGetters, commit }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setData({
          requestName: 'all',
          clientId: toms
        })
        .query('/problem/management/list')
      commit(GET_REQUEST_SUCCESS, result)
      return result
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/loadingRequest', false, { root: true })
    }
  },
  [CANCEL_REQUEST]: async ({ rootGetters, commit }, { api, requestId, description }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setData({
          clientId: toms,
          reasonId: CANCELLATION_REASON,
          id: requestId,
          description
        })
        .query('/problem/management/close')
      return true
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      return false
      // todo Логирование
    }
  },
  [CREATE_REQUEST]: async ({ rootGetters, commit, dispatch }, {
    api,
    requestName,
    location,
    description,
    customerContact,
    category,
    type,
    phoneNumber,
    emailAddress,
    complainantContactName,
    complainantPhone,
    complainantEmail
  }) => {
    const data = {}
    const { toms: clientId } = rootGetters['auth/user']
    data.clientId = clientId
    data.customerAccount = clientId
    data.requestName = requestName
    data.location = location
    data.channelOfNotification = CHANNEL_OF_NOTIFICATION_VIBER
    data.description = description
    data.customerContact = customerContact
    data.category = requestName.match(/request/i)
      ? REQUEST_REASON
      : requestName.match(/problem/i)
        ? category
        : COMPLAINT_REASON
    data.type = type
    data.phoneNumber = phoneNumber
    if (emailAddress) {
      data.emailAddress = emailAddress
    }
    if (complainantContactName) {
      data.complainantContactName = complainantContactName
    }
    if (complainantPhone) {
      data.complainantPhone = complainantPhone
    }
    if (complainantEmail) {
      data.complainantEmail = complainantEmail
    }
    try {
      const result = await api
        .setData(data)
        .setBranch('web-bss')
        .query('/problem/management/create')
      if (result && result.hasOwnProperty('ticket_id')) {
        return dispatch(GET_REQUEST_BY_ID, { api, id: result.ticket_id, requestName })
      }
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
  },
  [GET_REQUEST_BY_ID]: async ({ rootGetters, commit, dispatch }, { api, id, requestName }) => {
    const { toms: clientId } = rootGetters['auth/user']
    const data = {
      id,
      clientId,
      requestName
    }
    try {
      const result = await api
        .setData(data)
        .setBranch('web-bss')
        .query('/problem/management/info')
      commit(CREATE_REQUEST_SUCCESS, result)
      return true
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
      return false
    }
  }
}

const mutations = {
  [GET_REQUEST_SUCCESS]: (state, payload) => {
    state.listRequest = payload
  },
  [CREATE_REQUEST_SUCCESS]: (state, payload) => {
    state.listRequest.push(payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
