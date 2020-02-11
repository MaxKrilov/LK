import { ERROR_MODAL } from '../actions/variables'

const state = {
  numCard: 0,
  cvc: ["", "", ""],
  listCard: [],
  transaction: ''
}

const getters = {
  getCurrentNumCard (state) {
    return state.numCard
  },
  getCVC (state) {
    return state.cvc
  },
}

const actions = {
  changeCVC: ({ commit }, { cvc }) => {
    commit('changeCVC', cvc)
  },
  clearCVC: ({ commit }) => {
    commit('clearCVC')
  },
  changeCurrentNumCard: ({ commit }, { num }) => {
    commit('changeCurrentNumCard', num)
  },
  // payment: async ({ commit, dispatch, state }, { api, billingAccount }) => {
  payment: async ({ commit, dispatch, state }, { api, payload }) => {
    console.log(payload)
    try {
      // alert(1)

      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/pay')

      // location.href =result.pay_url

      console.log(result, status)
      // alert(2)

      commit('transaction', result.transaction_id)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      // commit('payments_req', '555')
      alert(41)
    }
  },
  status: async ({ commit, dispatch, state }, { api, billingAccount }) => {
    alert(state.transaction)
    try {
      const status = await api
        .setWithCredentials()
        .setData({
          transaction: state.transaction,
          billingAccount: payload.billingAccount
        })
        .query('/acquiring/card/status')

      console.log('result ->',result)
      // alert(2)

      commit('listCard', result)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      // commit('payments_req', '555')
      alert(41)
    }
  },
  listCard: async ({ commit, dispatch, state }, { api, billingAccount }) => {
    try {
      // alert(1)

      const result = await api
        .setWithCredentials()
        .setData({
          billingAccount: billingAccount,
        })
        .query('/acquiring/card/list')

      console.log('result ->',result)
      // alert(2)

      commit('listCard', result)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      // commit('payments_req', '555')
      alert(41)
    }
  },
}
const mutations = {
  changeCVC: (state, cvc) => {
    state.cvc[state.numCard - 1] = cvc
  },
  clearCVC: (state) => {
    state.cvc = ["", "", ""]
  },
  changeCurrentNumCard: (state, num) => {
    state.numCard = num
  },
  listCard: (state, result) => {
    state.listCard = result
  },
  transaction: (state, payload) => {
    alert(payload)
    state.transaction = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
