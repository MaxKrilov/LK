import { makeTokens, validationToken } from '@/functions/auth'
import { USER_ROLES } from '@/store/mock/profile'
import { ERROR_MODAL } from '@/store/actions/variables'

import { Cookie } from '@/functions/storage'
import { generateUrl, getAllUrlParams, isCombat, isServer, copyObject } from '../../../functions/helper'

import {
  actions as userActions,
  getters as userGetters
} from './user'
import {
  actions as managerActions,
  getters as managerGetters
} from './manager'

import { MANAGER_LOGOUT } from '../../../constants/url'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'
const AUTH_LOGOUT = 'AUTH_LOGOUT'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'

const REMOVE_USER_INFO = 'REMOVE_USER_INFO'

const SET_USER_TOMS = 'SET_USER_TOMS'
const SET_MANAGER_AUTH = 'SET_MANAGER_AUTH'

const REFRESH_REQUEST = 'REFRESH_REQUEST'
const REFRESH_SUCCESS = 'REFRESH_SUCCESS'
const REFRESH_ERROR = 'REFRESH_ERROR'

const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
const LOGOUT_ERROR = 'LOGOUT_ERROR'

const CLEAN_STATE = 'CLEAN_STATE'

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
  isLogouting: false,
  isLogging: false,
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

const state = copyObject(INITIAL_STATE)

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

  signIn (context, payload) {
    return new Promise((resolve, reject) => {
      const actions = context.state.isManager
        ? managerActions
        : userActions

      // Костыль на случай, если авторизация в фрейме не сработала
      // Проблема происходит в FF, но не исключены проблемы в других браузерах
      const urlParams = getAllUrlParams()
      if (Object.keys(urlParams).length > 0) {
        const billingAccount = urlParams.billing_account
        const totalAmount = urlParams.total_amount

        if (billingAccount && totalAmount) {
          Cookie.set('ff_billing_account', billingAccount, {})
          Cookie.set('ff_total_amount', totalAmount, {})
        }
      }

      actions.signIn(context, payload)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  fetchRefreshToken (
    { commit, dispatch, state: { error, refreshToken } },
    { api }
  ) {
    return new Promise((resolve, reject) => {
      commit(REFRESH_REQUEST)

      if (!refreshToken && !error) {
        return dispatch('signIn', { api })
      }

      const url = generateUrl('refreshToken')
      api
        .setWithCredentials()
        .setData({
          token: refreshToken
        })
        .query(url)
        .then(response => {
          makeTokens(response)
            .then(tokens => {
              commit(SET_AUTH_TOKENS, tokens)
              commit(REFRESH_SUCCESS)
              resolve(true)
            })
            .catch(e => {
              commit(REMOVE_AUTH_TOKENS)
              commit(REMOVE_USER_INFO)
              commit(REFRESH_ERROR, 'Не удалось сохранить токены')
              reject(e.toString())
            })
        })
        .catch(e => {
          commit(REFRESH_ERROR, `Ошибка обновления токена ${e.toString()}`)
          reject(e.toString())
        })
    })
  },

  signOut (
    { commit, rootState, state },
    { api }
  ) {
    return new Promise((resolve, reject) => {
      if (state.isManager) {
        commit(AUTH_LOGOUT)
        const redirectLink = isCombat()
          ? MANAGER_LOGOUT.combat
          : isServer('psi2')
            ? MANAGER_LOGOUT.psi2
            : MANAGER_LOGOUT.psi1
        location.href = `${redirectLink}?redirect_uri=${location.href}`
        resolve()
      } else {
        commit(LOGOUT_REQUEST)
        const { accessToken: token } = rootState.auth
        api
          .setWithCredentials()
          .setData({
            token
          })
          .query('/sso/default/reject-token')
          .then(response => {
            if (response.success) {
              commit(AUTH_LOGOUT)
              commit(LOGOUT_SUCCESS)
              location.href = response.redirect
              resolve()
            } else {
              reject()
            }
          })
          .catch(error => {
            commit(LOGOUT_ERROR)
            setTimeout(() => {
              commit(ERROR_MODAL, true, { root: true })
            })
            reject(error)
          })
      }
    })
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
  },
  clearToken ({ commit }) {
    commit(REMOVE_AUTH_TOKENS)
  },
  clean ({ commit }) {
    commit(REMOVE_AUTH_TOKENS)
    commit(REMOVE_USER_INFO)
    commit(SET_USER_TOMS, null)
    commit(SET_MANAGER_AUTH, false)
    commit('setDmpId', null)
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.isLogging = true
    state.isFetching = true
    state.isFetched = false
    state.error = null
  },
  [AUTH_SUCCESS]: (state) => {
    state.isLogging = false
    state.isFetching = false
    state.isFetched = true
    state.error = null
  },
  [AUTH_ERROR]: (state, payload) => {
    // state.isLogging = false
    state.isFetching = false
    state.isFetched = false
    state.error = payload
  },
  [AUTH_LOGOUT]: (state) => {
    // Clean tokens
    state.accessToken = null
    state.refreshToken = null
    state.userToken = null

    // Clean userInfo
    state.userInfo = {}

    // Clean other Info
    state.dmpId = null
    state.isManager = false
    state.toms = null
  },
  [REFRESH_REQUEST]: (state) => {
    // state.isLogging = true
    state.refreshedToken.isFetching = true
    state.refreshedToken.isFetched = false
    state.refreshedToken.error = null
  },
  [REFRESH_SUCCESS]: (state) => {
    // state.isLogging = false
    state.refreshedToken.isFetching = false
    state.refreshedToken.isFetched = true
    state.refreshedToken.error = null
  },
  [REFRESH_ERROR]: (state, payload) => {
    // state.isLogging = false
    state.refreshedToken.isFetching = false
    state.refreshedToken.isFetched = false
    state.refreshedToken.error = payload
  },
  [SET_AUTH_TOKENS]: (state, { tokens }) => {
    const { userToken, accessToken, refreshToken, user } = tokens
    if (user) {
      state.userInfo = { ...user }
    }
    if (userToken) {
      state.userToken = userToken
    }
    if (accessToken) {
      state.accessToken = accessToken
    }
    if (refreshToken) {
      state.refreshToken = refreshToken
    }
  },
  [REMOVE_AUTH_TOKENS]: (state) => {
    state.userToken = null
    state.accessToken = null
    state.refreshToken = null
  },
  [REMOVE_USER_INFO]: (state) => {
    state.userInfo = {}
  },
  [UPDATE_USER_INFO]: (state, payload) => {
    state.userInfo = { ...state.userInfo, ...payload }
  },
  [SET_USER_TOMS]: (state, payload) => {
    state.toms = payload
  },
  [SET_MANAGER_AUTH]: (state, payload) => {
    state.isManager = payload
  },
  setDmpId: (state, payload) => {
    state.dmpId = payload
  },
  [LOGOUT_REQUEST]: (state) => {
    state.isLogouting = true
  },
  [LOGOUT_SUCCESS]: (state) => {
    // Ничего не делаем, так как происходит редирект
  },
  [LOGOUT_ERROR]: (state) => {
    state.isLogouting = false
  },
  [CLEAN_STATE]: state => {
    // Clean tokens
    state.accessToken = null
    state.refreshToken = null
    state.userToken = null

    // Clean userInfo
    state.userInfo = {}

    // Clean other Info
    state.dmpId = null
    state.isManager = false
    state.toms = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
