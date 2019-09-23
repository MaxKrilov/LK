import { ERROR_MODAL } from '../actions/variables'

const state = {
  [ERROR_MODAL]: false
}

const mutations = {
  [ERROR_MODAL] (state, value) {
    state[ERROR_MODAL] = value
  }
}

export default {
  state,
  mutations
}
