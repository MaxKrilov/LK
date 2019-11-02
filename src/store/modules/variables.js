import { ERROR_MODAL, SCREEN_WIDTH } from '../actions/variables'

const state = {
  [ERROR_MODAL]: false,
  [SCREEN_WIDTH]: 0
}

const getters = {
  [SCREEN_WIDTH]: state => state[SCREEN_WIDTH]
}

const mutations = {
  [ERROR_MODAL] (state, value) {
    state[ERROR_MODAL] = value
  },
  [SCREEN_WIDTH] (state, value) {
    state[SCREEN_WIDTH] = value
  }
}

export default {
  state,
  getters,
  mutations
}
