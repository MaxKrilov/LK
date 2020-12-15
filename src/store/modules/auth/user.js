import { authParamsAfterRedirect, makeTokens } from '@/functions/auth'
import { generateUrl } from '@/functions/helper'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'
const REMOVE_USER_INFO = 'REMOVE_USER_INFO'
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
  signIn ({ commit, dispatch, state }, { api }) {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)

      const params = authParamsAfterRedirect()
      const url = generateUrl('authUser')

      api
        .setWithCredentials()
        .setData(params)
        .query(url)
        .then(response => {
          makeTokens(response)
            .then(tokens => {
              commit(SET_AUTH_TOKENS, tokens)
              commit(AUTH_SUCCESS, response)
              resolve(tokens)
            })
            .catch(error => {
              commit(REMOVE_AUTH_TOKENS)
              commit(REMOVE_USER_INFO)
              commit(AUTH_ERROR, `Не удалось авторизоваться: ${error?.toString() || ''}`)
              reject(error)
            })
        })
        .catch(error => {
          commit(AUTH_ERROR, `Ошибка сервера ${error?.toString() || ''}`)
          reject(error)
        })
    })
  }
}

export {
  actions,
  getters
}
