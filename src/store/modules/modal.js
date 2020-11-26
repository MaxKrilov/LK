import { generateUrl } from '../../functions/helper'

const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST'
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'
const CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR'

const CHANGE_MESSAGE_SUCCESS = 'CHANGE_MESSAGE_SUCCESS'

const state = {
  isOpen: false,
  isFetched: false,
  isFetching: false,
  error: undefined,
  message: {}
}

const mutations = {
  [CHANGE_MESSAGE_SUCCESS]: (state, payload) => {
    state.message = { type: 'success', text: payload?.text, icon: 'ok' }
  },
  'setModalVisibility': (state, payload) => {
    state.isOpen = payload
  },
  [CHANGE_PASSWORD_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [CHANGE_PASSWORD_SUCCESS]: (state) => {
    state.isOpen = false
    state.isFetching = false
    state.isFetched = true
    state.message = { type: 'success', text: 'Пароль изменен', icon: 'ok' }
  },
  [CHANGE_PASSWORD_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
    state.message = { type: 'error', text: 'Пароль не изменен', icon: 'close' }
  },
  'resetChangePassword': (state) => {
    state.isFetched = false
    state.isFetching = false
    state.error = undefined
    state.message = {}
  }
}

const actions = {
  // Сменить пароль
  changePasswordRequest: async ({ commit, dispatch, rootState }, { api, password, userId }) => {
    commit(CHANGE_PASSWORD_REQUEST)
    try {
      const { accessToken } = rootState.auth
      const url = generateUrl('changePassword')
      const { success, message } = await api
        .setData({
          token: accessToken,
          user: userId,
          password
        })
        .query(url)

      if (success) {
        commit(CHANGE_PASSWORD_SUCCESS)
        commit('setModalVisibility', false)
        return false
      }
      commit(CHANGE_PASSWORD_ERROR, 'Что-то пошло не так. Пароль не изменён. Попробуйте повторить попытку через 2 минуты')
      console.error('Ошибка SSO ', new Error(message))
    } catch (e) {
      commit(CHANGE_PASSWORD_ERROR, 'Сервер не отвечает. Попробуйте обновить страницу.')
      console.error('Сервер не отвечает ', new Error(e))
    }
  },
  changeMessage: ({ commit, rootState }, payload) => {
    commit(CHANGE_MESSAGE_SUCCESS, payload)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
