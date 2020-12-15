import { authParamsAfterRedirect, makeTokens } from '@/functions/auth'
import { generateUrl } from '@/functions/helper'

const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const REMOVE_AUTH_TOKENS = 'REMOVE_AUTH_TOKENS'

const getters = {
  hasAccess (state, payload) {
    const resources = payload?.user?.userId

    return !!resources
  }
}

const actions = {
  signIn ({ commit }, { api }) {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      const params = authParamsAfterRedirect()
      const url = generateUrl('authManager')

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
