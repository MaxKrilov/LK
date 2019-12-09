import { generateUrl, copyObject } from '@/functions/helper'
import { authParamsAfterRedirect, makeTokens, validationToken } from '@/functions/auth'
import { USER_ROLES } from '../mock/profile'
import { isCombat } from '../../functions/helper'
import { ERROR_MODAL } from '../actions/variables'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'
const AUTH_LOGOUT = 'AUTH_LOGOUT'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'

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
  error: null
}

const mappingResourceAccess = (rawAccess, bSystems) => {
  const baseSystems = copyObject(bSystems)
  const resourceAccess = Object.keys(rawAccess)
  return resourceAccess.reduce((prev, curr) => {
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
    const roles = user?.realmAccess?.roles
    if (!roles) {
      return false
    }
    return roles.includes(USER_ROLES.LPR.code)
  },
  hasAccess (state, { user }) {
    const resources = user?.resourceAccess
    if (!resources) {
      return false
    }
    return Object.keys(resources).includes(LKB2B_ACCESS)
  },
  realmRoles (state, { user }) {
    const roles = user?.realmAccess?.roles || []

    return roles
      .map(o => USER_ROLES[o]?.label)
      .filter(o => o && o.length > 0)
  },
  /**
   * Информация о текущем пользователе
   * @param state
   */
  user (state) {
    if (!state.userInfo) {
      return null
    }
    return {
      ...state.userInfo
    }
  },
  userResourceAccess (state, getters, rootState, rootGetters) {
    const systemsBase = rootGetters['directories/systemsDirectory']
    const resultData = mappingResourceAccess(state.userInfo.resourceAccess, systemsBase)
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

  signIn: async ({ commit, dispatch, state }, { api }) => {
    commit(AUTH_REQUEST)
    try {
      const params = authParamsAfterRedirect()
      const url = generateUrl('authUser')

      const response = await api
        .setWithCredentials()
        .setData(params)
        .query(url)

      try {
        const tokens = await makeTokens(response)
        commit(SET_AUTH_TOKENS, tokens)
        commit(AUTH_SUCCESS, response)
        return tokens
      } catch (e) {
        commit(REMOVE_AUTH_TOKENS)
        commit(AUTH_ERROR, `Не удалось авторизоваться: ${e.toString()}`)
        return false
      }
    } catch (e) {
      commit(AUTH_ERROR, `Ошибка сервера ${e.toString()}`)
    }
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

  signOut: async ({ commit, rootState }, { api }) => {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
