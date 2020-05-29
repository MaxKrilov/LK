import {
  QUESTION_SENDED,
  QUESTION_CANCELED,
  SURVEY_STATUS_SENDED,
  SURVEY_PUTOFF_DAYS
} from '@/constants/survey.ts'
import { logInfo } from '@/functions/logging.ts'
import {
  surveyStatusIsDone,
  processSurvey
} from '@/functions/survey'

const SURVEY_BACKEND_BRANCH = 'master'

const SET_USER_SURVEYS = 'SET_USER_SURVEYS'
const SET_CURRENT_SURVEY = 'SET_CURRENT_SURVEY'
const SEND_RESPONSE = true
const REMOVE_SURVEY = 'REMOVE_SURVEY'

const state = {
  list: [],
  actualList: [],
  current: {},
  removed: []
}

const apiWrap = api => {
  return api
    .setWithCredentials()
    .setBranch(SURVEY_BACKEND_BRANCH)
}

const getters = {
  getSurvey (state) {
    return state.current
  },
  getAllActualSurveyCount (state) {
    return state.actualList.length
  },
  getActualSurveyCount (state) {
    // кол-во актуальных анкет кроме текущей
    return state.actualList.filter(
      el => el.id !== state.current.id
    ).length > 0
  },
  getActualSurveyList (state) {
    return state.actualList.filter(el => {
      const isRemoved = state.removed.includes(el.id)
      const isDone = surveyStatusIsDone(el.surveyStatus)
      const isActual = !isRemoved && !isDone
      return isActual
    })
  }
}

const actions = {
  fetchCurrentSurvey: ({ commit, dispatch }, { api, id }) => {
    return dispatch('fetchSurveyById', { api, id })
      .then(data => {
        commit(SET_CURRENT_SURVEY, data)
        return data
      })
  },
  fetchSurveyById: ({ rootGetters }, { api, id }) => {
    const url = '/customer/survey/get-by-id'
    const toms = rootGetters['auth/getTOMS']

    return apiWrap(api)
      .setData({
        clientId: toms,
        id
      })
      .query(url)
      .then(data => {
        const processedData = processSurvey(data)
        return processedData
      })
  },
  fetchSurveyByClient: ({ commit, rootGetters }, { api }) => {
    const url = '/customer/survey/get-by-client'
    const toms = rootGetters['auth/getTOMS']

    return apiWrap(api)
      .setData({
        clientId: toms
      })
      .query(url)
      .then(data => {
        const processedData = data.map(el => processSurvey(el))
        commit(SET_USER_SURVEYS, processedData)
        return processedData
      })
  },
  response: ({ commit, rootGetters }, payload) => {
    const url = '/customer/survey/create'
    const toms = rootGetters['auth/getTOMS']

    const { api, ...newPayload } = payload
    newPayload.clientId = toms

    logInfo('survey/response', newPayload)

    if (!SEND_RESPONSE) {
      return new Promise((resolve, reject) => { resolve({}) })
    } else {
      return apiWrap(api)
        .setData(newPayload)
        .setType('json')
        .query(url)
        .then(data => {
          return data
        })
    }
  },
  responseSended: ({ dispatch }, payload) => {
    payload.surveyStatus = QUESTION_SENDED
    return dispatch('response', payload)
  },
  responseCanceled: ({ dispatch }, payload) => {
    payload.surveyStatus = QUESTION_CANCELED
    return dispatch('response', payload)
  },
  responsePutOff: ({ dispatch }, payload) => {
    const today = new Date()

    payload.postponedTill = today.setDate(today.getDate() + SURVEY_PUTOFF_DAYS)
    payload.surveyStatus = SURVEY_STATUS_SENDED
    return dispatch('response', payload)
  },
  remove: ({ commit }, payload) => {
    console.log('remove survey action', payload)
    commit(REMOVE_SURVEY, payload)
  }
}

const mutations = {
  [REMOVE_SURVEY]: (state, payload) => {
    state.removed.push(payload.id)
  },
  [SET_USER_SURVEYS]: (state, payload) => {
    state.list = payload
    state.actualList = payload.filter(el => {
      const isRemoved = state.removed.includes(el.id)
      const isDone = surveyStatusIsDone(el.surveyStatus)
      const isActual = !isRemoved && !isDone
      return isActual
    })
  },
  [SET_CURRENT_SURVEY]: (state, payload) => {
    state.current = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
