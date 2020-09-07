import { GET_CHAT_TOKEN, CHAT_TOKEN_SUCCESS, CHAT_TOKEN_ERROR } from '../actions/chat'

const state = {
  chatToken: undefined,
  chatTokenTimeStapm: undefined,
  isOpenChat: false,
  chatTokenError: false
}

const getters = {
  getChatToken (state) {
    return state.chatToken
  },
  getChatTokenTimeStapm (state) {
    return state.chatTokenTimeStapm
  },
  isOpenChat (state) {
    return state.isOpenChat
  }
}

const actions = {
  [GET_CHAT_TOKEN]: async ({ commit, rootGetters }, { api }) => {
    const billingAccountId = rootGetters['user/getActiveBillingAccount']
    const contractNumber = rootGetters['user/getActiveBillingAccountNumber']
    const customerAccountId = rootGetters['auth/getTOMS']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          contractNumber,
          customerAccountId,
          city: 'perm',
          billingAccountId,
          userType: 'bss'
        })
        .query('/chat/token')
      commit(CHAT_TOKEN_SUCCESS, result)
    } catch (e) {
      commit(CHAT_TOKEN_ERROR, true)
    }
  }
}
const mutations = {
  [CHAT_TOKEN_SUCCESS]: (state, payload) => {
    state.chatToken = payload?.token
    state.chatTokenTimeStapm = payload?.timestamp
  },
  [CHAT_TOKEN_ERROR]: (state, payload) => {
    state.chatTokenError = payload
  },
  closeChat: (state) => {
    state.isOpenChat = false
  },
  openChat: (state) => {
    state.isOpenChat = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
