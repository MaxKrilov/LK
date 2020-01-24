import { GET_REQUEST, GET_REQUEST_SUCCESS } from '../actions/request'
import { ERROR_MODAL } from '../actions/variables'

const state = {
  listRequest: {}
}

const actions = {
  [GET_REQUEST]: async ({ rootState, rootGetters, commit }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setData({
          requestName: 'all',
          clientId: toms
        })
        .query('/problem/management/list')
      commit(GET_REQUEST_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
    } finally {
      commit('loading/loadingRequest', false, { root: true })
    }
  }
}

const mutations = {
  [GET_REQUEST_SUCCESS]: (state, payload) => {
    state.listRequest = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
