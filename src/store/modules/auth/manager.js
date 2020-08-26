import { authParamsAfterRedirect, makeTokens } from '@/functions/auth'
import { generateUrl } from '@/functions/helper'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'

const CLEAN_STATE = 'CLEAN_STATE'

const getters = {
  hasAccess (state, payload) {
    const resources = payload?.user?.userId

    return !!resources
  }
}

const actions = {
  signIn: async ({ commit }, { api }) => {
    commit(AUTH_REQUEST)
    try {
      const params = authParamsAfterRedirect()
      const url = generateUrl('authManager')

      const response = await api
        .setWithCredentials()
        .setData(params)
        .query(url)
        .then(data => {
          return data
        })

      try {
        const tokens = await makeTokens(response)
        commit(SET_AUTH_TOKENS, tokens)
        commit(AUTH_SUCCESS, response)
        return tokens
      } catch (e) {
        commit(REMOVE_AUTH_TOKENS)
        commit(CLEAN_STATE)
        commit(AUTH_ERROR, `Не удалось авторизоваться: ${e.toString()}`)
        return false
      }
    } catch (e) {
      commit(AUTH_ERROR, `Ошибка сервера ${e.toString()}`)
    }
  }
}

export {
  actions,
  getters
}
