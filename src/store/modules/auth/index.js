import { generateUrl, copyObject } from '@/functions/helper'
import { makeTokens, validationToken } from '@/functions/auth'
import { USER_ROLES } from '@/store/mock/profile'
import { ERROR_MODAL } from '@/store/actions/variables'

import {
  actions as userActions,
  getters as userGetters
} from './user'
import {
  actions as managerActions,
  getters as managerGetters
} from './manager'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'
const AUTH_LOGOUT = 'AUTH_LOGOUT'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'

const SET_USER_TOMS = 'SET_USER_TOMS'
const SET_MANAGER_AUTH = 'SET_MANAGER_AUTH'

const REFRESH_REQUEST = 'REFRESH_REQUEST'
const REFRESH_SUCCESS = 'REFRESH_SUCCESS'
const REFRESH_ERROR = 'REFRESH_ERROR'

const LKB2B_ACCESS = 'lkb2b'

const INITIAL_STATE = {
  userToken: '',
  accessToken: null,
  refreshToken: null,
  refreshedToken: {
    isFetching: false,
    isFetched: false,
    error: null
  },
  userInfo: {},
  isFetching: false,
  isFetched: false,
  error: null,
  isManager: false,
  toms: null,
  dmpId: null
}

const mappingResourceAccess = (rawAccess, bSystems) => {
  const baseSystems = copyObject(bSystems)
  return rawAccess.reduce((prev, curr) => {
    if (baseSystems[curr]) {
      baseSystems[curr].content = [
        {
          id: 1,
          label: 'Есть доступ',
          access: true
        }
      ]
      return { ...prev, ...baseSystems }
    }
    return { ...prev }
  }, {})
}

const state = INITIAL_STATE

const getters = {
  isLPR (state, { user }) {
    if (state.isManager) return true
    const roles = user?.postRole
    if (!roles) {
      return false
    }
    return roles.includes(USER_ROLES.LPR.code)
  },
  hasAccess (state, { user }) {
    let getters = userGetters
    if (state.isManager) {
      getters = managerGetters
    }

    return getters.hasAccess(state, { user })
  },
  realmRoles (state, { user }) {
    const role = state.isManager
      ? 'LPR'
      : user?.postRole || ''
    return USER_ROLES[role]?.label
  },
  /**
   * Информация о текущем пользователе
   * @param state
   */
  user (state) {
    if (!state.userInfo) {
      return null
    }
    const ret = {
      ...state.userInfo
    }
    if (state.isManager) {
      ret.toms = state.toms
    }
    return ret
  },
  getTOMS (state) {
    if (state.isManager) {
      return state.toms
    }

    return state.userInfo.toms
  },
  userResourceAccess (state, getters, rootState, rootGetters) {
    const systemsBase = rootGetters['directories/systemsDirectory']
    const resultData = mappingResourceAccess(state.userInfo.postAccess, systemsBase)
    return resultData
  },
  serverErrorMessage (state) {
    return state.refreshedToken.error || state.error
  }
}

const actions = {
  /*
  * Проверка и обновление токенов по времени жизни
  */
  checkAuth: async ({ dispatch, state }, { api }) => {
    const { accessToken } = state
    const validToken = validationToken(accessToken)
    if (validToken) {
      return state
    }

    const tokens = await dispatch('fetchRefreshToken', { api })
    return tokens
  },

  signIn: async (context, payload) => {
    let actions = userActions

    if (context.state.isManager) {
      actions = managerActions
    }

    return actions.signIn(context, payload)
  },

  fetchRefreshToken: async ({ commit, dispatch, state: { error, refreshToken } }, { api }) => {
    commit(REFRESH_REQUEST)

    if (!refreshToken && !error) {
      return dispatch('signIn', { api })
    }

    try {
      const url = generateUrl('refreshToken')
      const response = await api
        .setWithCredentials()
        .setData({
          token: refreshToken
        })
        .query(url)

      try {
        const tokens = await makeTokens(response)
        commit(SET_AUTH_TOKENS, tokens)
        commit(REFRESH_SUCCESS)
      } catch (e) {
        commit(REMOVE_AUTH_TOKENS)
        commit(REFRESH_ERROR, 'Не удалось сохранить токены')
      }
    } catch (e) {
      commit(REFRESH_ERROR, `Ошибка обновления токена ${e.toString()}`)
      throw new Error(e)
    }
  },

  signOut: async ({ commit, rootState }, { api, isRefreshExpired }) => {
    try {
      const { accessToken } = rootState.auth
      const result = await api
        .setWithCredentials()
        .setData({
          token: accessToken
        })
        .query('/sso/default/reject-token')
      if (result.success) {
        commit(AUTH_LOGOUT)
        localStorage.removeItem(LKB2B_ACCESS)
        location.href = result.redirect
      }
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    }
    // commit(AUTH_LOGOUT)
  },
  updateUserInfo ({ commit }, data) {
    const fData = {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      phone: data.phone,
      email: data.email
    }
    commit(UPDATE_USER_INFO, fData)
  },
  setUserToms ({ commit }, payload) {
    commit(SET_USER_TOMS, payload)
  },
  enableManagerAuth ({ commit }) {
    commit(SET_MANAGER_AUTH, true)
  },
  disableManagerAuth ({ commit }) {
    commit(SET_MANAGER_AUTH, false)
  },
  setDmpId ({ commit }, payload) {
    commit('setDmpId', payload)
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [AUTH_SUCCESS]: (state) => {
    state.isFetching = false
    state.isFetched = true
    state.error = null
  },
  [AUTH_ERROR]: (state, payload) => {
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [AUTH_LOGOUT]: (state) => {
    state = INITIAL_STATE
  },
  [REFRESH_REQUEST]: (state) => {
    state.refreshedToken.isFetching = true
    state.refreshedToken.isFetched = false
    state.refreshedToken.error = null
  },
  [REFRESH_SUCCESS]: (state) => {
    state.refreshedToken.isFetching = false
    state.refreshedToken.isFetched = true
    state.refreshedToken.error = null
  },
  [REFRESH_ERROR]: (state, payload) => {
    state.refreshedToken.isFetching = false
    state.refreshedToken.isFetched = false
    state.refreshedToken.error = payload
  },
  [SET_AUTH_TOKENS]: (state, { tokens }) => {
    const { userToken, accessToken, refreshToken, user } = tokens
    if (user) { state.userInfo = { ...user } }
    if (userToken) { state.userToken = userToken }
    if (accessToken) { state.accessToken = accessToken }
    if (refreshToken) { state.refreshToken = refreshToken }
  },
  [REMOVE_AUTH_TOKENS]: (state) => {
    state.userToken = null
    state.accessToken = null
    state.refreshToken = null
  },
  [UPDATE_USER_INFO]: (state, payload) => {
    state.userInfo = { ...state.userInfo, ...payload }
  },
  [SET_USER_TOMS]: (state, payload) => {
    state.toms = payload
  },
  [SET_MANAGER_AUTH]: (state, payload) => {
    console.log('set isManager', payload)
    state.isManager = payload
  },
  setDmpId: (state, payload) => {
    state.dmpId = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
