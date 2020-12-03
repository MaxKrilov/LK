import Vue from 'vue'
import * as campaignConst from '@/constants/campaign.ts'
import { logInfo } from '@/functions/logging.ts'
import { campaignShitToNotification, isSurvey, pprToNotification } from '@/functions/notifications'
import { isPostponedTillExpired } from '@/functions/survey'
import moment from 'moment'
import { logError } from '@/functions/logging'

const NO_ITEMS_FOUND_MESSAGE = 'No items found.'

const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS'
const SET_PPR = 'SET_PPR'
const SEND_RESPONSE = true
const HIDE_ITEM = 'HIDE_ITEM'

const state = {
  list: [],
  ppr: []
}

const apiWrap = api => {
  return api
    .setWithCredentials()
}

const getters = {
  async getAll (state, getters) {
    const notifications = await getters.getFilteredList
    const pprList = await getters.getPPRList
    const all = await [...pprList, ...notifications]
    const result = await Promise.all(all)
    return result
  },
  getFilteredList (state) {
    const types = Object.keys(campaignConst.TYPES)

    return state.list.filter(el => {
      const includes = types.includes(el.communication_type)
      const isHidden = el.hidden ? el.hidden : false
      const isExpired = el.communication_end_dttm <= moment()
      return includes && !isHidden && !isExpired
    })
  },
  async getCount (state, getters) {
    const list = await getters.getAll
    return list.length
  },
  getPPRList (state) {
    return state.ppr
  }
}

const actions = {
  _fetchNotifications: ({ rootGetters }, { api }) => {
    const url = '/campaign/notification/all'
    const toms = rootGetters['auth/getTOMS']

    return apiWrap(api)
      .setData({
        customer_id: toms
      })
      .query(url)
      .then(data => {
        return data
      })
  },
  fetchByTaskId: ({ commit, dispatch }, { api, taskId }) => {
    return dispatch('_fetchNotifications', { api })
      .then(data => {
        const task = data.find(el => el.data.task_id === taskId)
        return campaignShitToNotification(task)
      })
  },
  fetchNotifications: ({ commit, rootGetters, dispatch }, { api }) => {
    const url = '/campaign/notification/all'
    const toms = rootGetters['auth/getTOMS']

    return apiWrap(api)
      .setData({
        customer_id: toms
      })
      .query(url)
      .then(async data => {
        let newData = []
        if (data.message !== NO_ITEMS_FOUND_MESSAGE) {
          newData = await data.map(async el => {
            el = await campaignShitToNotification(el)

            if (isSurvey(el.communication_type)) {
              const payload = {
                api,
                id: el.task_id
              }

              /*
                заранее скрываем "Анкетные" уведомления,
                чтобы при ошибке получения данных их не выводить
              */
              el.hidden = true

              try {
                el.bindedSurvey = await dispatch(
                  'survey/fetchSurveyById',
                  payload,
                  { root: true }
                )

                const isSatisfactionAssessment = el?.bindedSurvey?.scenario?.name === campaignConst.T_SURVEY_SATISFACTION_ASSESSMENT

                if (isSatisfactionAssessment && el?.bindedSurvey?.postponedTill) {
                  el.hidden = isPostponedTillExpired(
                    el.bindedSurvey.postponedTill,
                    el.communication_end_dttm
                  )
                } else {
                  el.hidden = false
                }
              } catch (err) {
                logError(err)
              }
            }

            return el
          })
        }

        const notificationList = await Promise.all(newData)

        commit(SET_NOTIFICATIONS, notificationList)
        return notificationList
      })
  },
  fetchPPR: ({ commit, rootGetters }, { api }) => {
    const url = '/campaign/ppr/client'
    const toms = rootGetters['auth/getTOMS']

    return apiWrap(api)
      .setData({
        id: toms
      })
      .query(url)
      .then(data => {
        commit(SET_PPR, data)
      })
  },
  hide: ({ commit }, { id }) => {
    logInfo('hide campaign', { id })
    commit(HIDE_ITEM, { id })
  },
  response: ({ rootGetters }, payload) => {
    const url = '/campaign/notification/response'
    const toms = rootGetters['auth/getTOMS']
    const { api, response, ...newPayload } = payload

    newPayload.customer_id = toms
    newPayload.response = response
    newPayload.timestamp = new Date().getTime()

    logInfo(`campaign/response`, newPayload)

    if (!SEND_RESPONSE) {
      return new Promise((resolve) => resolve({}))
    } else {
      return apiWrap(api)
        .setData(newPayload)
        .query(url)
        .then(data => {
          return data
        })
    }
  },
  responseAccept: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_ACCEPT
    dispatch('hide', payload)
    return dispatch('response', payload)
  },
  responseAnswer: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_ANSWER
    return dispatch('response', payload)
  },
  responseRefuse: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_REFUSE
    dispatch('hide', payload)
    return dispatch('response', payload)
  },
  responsePutOff: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_PUTOFF
    dispatch('hide', payload)
    return dispatch('response', payload)
  },
  responseClickForView: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_CLICK_FOR_VIEW
    return dispatch('response', payload)
  },
  responseClickToCloseView: ({ dispatch }, payload) => {
    payload.response = campaignConst.RESPONSE_CLICK_TO_CLOSE_VIEW
    return dispatch('response', payload)
  },
  delete: ({ dispatch, rootGetters }, { api, id }) => {
    const toms = rootGetters['auth/getTOMS']
    const url = '/campaign/notification/delete'
    const payload = {
      id,
      customer_id: toms
    }

    logInfo('campaign/delete', payload)

    if (!SEND_RESPONSE) {
      return new Promise((resolve) => {
        dispatch('hide', { id })
        return resolve({})
      })
    } else {
      return apiWrap(api)
        .setData(payload)
        .query(url)
        .then(data => {
          dispatch('hide', { id })
          return data
        })
    }
  }
}

const mutations = {
  [SET_NOTIFICATIONS]: (state, payload) => {
    state.list = payload
  },
  [SET_PPR]: (state, payload) => {
    state.ppr = payload.map(el => pprToNotification(el))
  },
  [HIDE_ITEM]: (state, { id }) => {
    const newList = state.list.map(el => {
      if (el.id === id) {
        el.hidden = true
      }

      return el
    })
    Vue.set(state, 'list', newList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
