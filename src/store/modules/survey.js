import {
  QUESTION_CANCELED,
  QUESTION_SENDED,
  SURVEY_PUTOFF_DAYS,
  SURVEY_STATUS_SENDED
} from '@/constants/survey.ts'
import { logInfo } from '@/functions/logging.ts'
import { processSurvey, surveyStatusIsDone } from '@/functions/survey'

const MUTATIONS = {
  SET_CURRENT_SURVEY_IS_LOADED: 'SET_CURRENT_SURVEY_IS_LOADED',
  SET_USER_SURVEYS: 'SET_USER_SURVEYS',
  SET_CURRENT_SURVEY: 'SET_CURRENT_SURVEY',
  REMOVE_SURVEY: 'REMOVE_SURVEY'
}

/*
  Используется для тестирования.
  Нужно отключить, если нужно пройти анкету но не отсылать результаты на бэкенд кампейна.
 */
const SEND_RESPONSE = true

const state = {
  list: [],
  actualList: [],
  current: {},
  currentIsLoaded: false,
  removed: []
}

const apiWrap = api => {
  return api
    .setWithCredentials()
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
    ).length
  },
  getActualSurveyList (state) {
    return state.actualList.filter(el => {
      const isRemoved = state.removed.includes(el.id)
      const isDone = surveyStatusIsDone(el.surveyStatus)
      return !isRemoved && !isDone
    })
  }
}

const actions = {
  fetchCurrentSurvey: ({ commit, dispatch }, { api, id }) => {
    commit(MUTATIONS.SET_CURRENT_SURVEY_IS_LOADED, false)

    return dispatch('fetchSurveyById', { api, id })
      .then(data => {
        commit(MUTATIONS.SET_CURRENT_SURVEY, data)
        commit(MUTATIONS.SET_CURRENT_SURVEY_IS_LOADED, true)
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
      .catch(data => {
        throw new Error()
      })
      .then(data => {
        return processSurvey(data)
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
        commit(MUTATIONS.SET_USER_SURVEYS, processedData)
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
      return new Promise((resolve) => { resolve({}) })
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
    commit(MUTATIONS.REMOVE_SURVEY, payload)
  }
}

const mutations = {
  [MUTATIONS.REMOVE_SURVEY]: (state, payload) => {
    state.removed.push(payload.id)
  },
  [MUTATIONS.SET_USER_SURVEYS]: (state, payload) => {
    state.list = payload
    state.actualList = payload.filter(el => {
      const isRemoved = state.removed.includes(el.id)
      const isDone = surveyStatusIsDone(el.surveyStatus)
      return !isRemoved && !isDone
    })
  },
  [MUTATIONS.SET_CURRENT_SURVEY]: (state, payload) => {
    state.current = payload
  },
  [MUTATIONS.SET_CURRENT_SURVEY_IS_LOADED]: (state, payload) => {
    state.currentIsLoaded = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
