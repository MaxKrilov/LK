import { ERROR_MODAL, SCREEN_WIDTH, FNS, SELF_EMPLOYED } from '../actions/variables'
import { Cookie } from '../../functions/storage'

const FNS_LINK = 'https://egrul.nalog.ru/index.html'
const SELF_EMPLOYED_LINK = 'https://www.rusprofile.ru/egrul-fns'

const state = {
  [ERROR_MODAL]: false,
  [SCREEN_WIDTH]: 0,
  [FNS]: FNS_LINK,
  [SELF_EMPLOYED]: SELF_EMPLOYED_LINK
}

const getters = {
  [SCREEN_WIDTH]: state => state[SCREEN_WIDTH]
}

const mutations = {
  [ERROR_MODAL] (state, value) {
    // document.cookie = "show_me_debug=1; path=/"
    if (!Cookie.get('show_me_debug')) {
      state[ERROR_MODAL] = value
    }
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
