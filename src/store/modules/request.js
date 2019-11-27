import { GET_REQUEST, GET_REQUEST_SUCCESS } from '../actions/request'
import { ERROR_MODAL } from '../actions/variables'

const state = {
  listRequest: {}
}

const actions = {
  [GET_REQUEST]: async ({ rootState, rootGetters, commit }, { api }) => {
    const { tomsId } = rootGetters['auth/user']
    try {
      const result = await api
        .setBranch('web-bss')
        .setData({
          requestName: 'all',
          clientId: tomsId
        })
        .query('/problem/management/list')
      commit(GET_REQUEST_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
      // todo Логирование
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
