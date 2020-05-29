import { authParamsAfterRedirect, makeTokens } from '@/functions/auth'
import { generateUrl } from '@/functions/helper'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'
const LKB2B_ACCESS = 'lkb2b'

const getters = {
  hasAccess (state, { user }) {
    const resources = user?.postAccess
    if (!resources) {
      return false
    }
    return resources.includes(LKB2B_ACCESS)
  }
}

const actions = {
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
  }
}

export {
  actions,
  getters
}
