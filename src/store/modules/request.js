import {
  ATTACH_FILE,
  CANCEL_REQUEST,
  CREATE_REQUEST,
  CREATE_REQUEST_SUCCESS,
  GET_REQUEST,
  GET_REQUEST_BY_ID,
  GET_REQUEST_SUCCESS,
  GET_SERVICES_BY_LOCATION
} from '../actions/request'
import { ERROR_MODAL } from '../actions/variables'
import { TYPE_ARRAY } from '../../constants/type_request'
import { UPLOAD_FILE } from '../actions/documents'

const CANCELLATION_REASON = '9150410012013966885'
const REQUEST_REASON = '9156211041213279417'
const COMPLAINT_REASON = '9156160182613264494'
const PROBLEM_REASON = '9156211040213279417'

const PROBLEM_REASON_THIRD = '9154741760013186143'

const CHANNEL_OF_NOTIFICATION_VIBER = '9130635331813922067'

const state = {
  listRequest: {}
}

const getters = {
  getCountRequestInWork (state) {
    return state.listRequest?.request?.filter(item => item.status.match(/в работе/ig)).length || 0
  }
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
        .setBranch('web-bss')
        .query('/problem/management/list')
      commit(GET_REQUEST_SUCCESS, result)
      return true
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      return false
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
      return result === null
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
    type,
    phoneNumber,
    emailAddress,
    complainantContactName,
    complainantPhone,
    complainantEmail,
    problemTheme,
    service,
    file,
    complaintTheme
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
        ? PROBLEM_REASON
        : COMPLAINT_REASON
    data.type = requestName.match(/problem/i)
      ? problemTheme
      : requestName.match(/complaint/i)
        ? complaintTheme
        : type
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
    if (requestName.match(/problem/i)) {
      data.element = PROBLEM_REASON_THIRD
      data.affectedProduct = [service]
    }

    try {
      const result = await api
        .setData(data)
        .setType(TYPE_ARRAY)
        .query('/problem/management/create')
      if (result && result.hasOwnProperty('ticket_id')) {
        await dispatch(GET_REQUEST, { api })
        if (file) {
          // const fileInfo = await dispatch(ATTACH_FILE, { api, id: result.ticket_id })
          // return fileInfo ? result.ticket_name : false
          dispatch(`documents/${UPLOAD_FILE}`, {
            api,
            file,
            bucket: 'customer-docs'
          }, { root: true })
          return result.ticket_name
        }
        return result.ticket_name
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },
  [GET_REQUEST_BY_ID]: async ({ rootGetters, commit, dispatch }, { api, id, requestName, name }) => {
    const { toms: clientId } = rootGetters['auth/user']
    const data = {
      id,
      clientId,
      requestName
    }
    try {
      const result = await api
        .setData(data)
        .query('/problem/management/info')
      commit(CREATE_REQUEST_SUCCESS, result)
      return name
    } catch (error) {
      return false
    }
  },
  [GET_SERVICES_BY_LOCATION]: async ({ rootGetters, commit, dispatch }, { api, locationId, parentId }) => {
    const { toms: clientId } = rootGetters['auth/user']
    const data = {}
    data.clientId = clientId
    if (locationId) {
      data.locationId = locationId
    }
    if (parentId) {
      data.parentId = parentId
    }
    try {
      return await api
        .setData({ clientId, locationId })
        .query('/customer/product/client')
    } catch (e) {
      return []
    }
  },
  [ATTACH_FILE]: async ({ rootGetters, commit, dispatch }, { id, type, fileName, bucket, filePath, api }) => {
    const { toms: clientId } = rootGetters['auth/user']
    type = type || '9154452676313182655'
    fileName = fileName || 'ERT.INT.DSG.TBAPI.Интеграционные операции и параметр.xlsx'
    bucket = bucket || 'customer-docs'
    filePath = filePath || '9155658058913664055'
    const data = {
      clientId,
      id,
      type,
      fileName,
      bucket,
      filePath
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const result = api
        .setData(data)
        .query('/problem/management/attache-file')
      return true
    } catch (error) {
      return false
    }
  }
}

const mutations = {
  [GET_REQUEST_SUCCESS]: (state, payload) => {
    state.listRequest = payload
  },
  [CREATE_REQUEST_SUCCESS]: (state, payload) => {
    state.listRequest.request.push(payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
