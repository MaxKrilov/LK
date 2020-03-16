import { ERROR_MODAL } from '../actions/variables'

const state = {
  numCard: 0,
  save: 0,
  delCard: false,
  cvc: [],
  listCard: [],
  // todo-er дорисовать карту МАЭСТРО (согласовать с дизайнером)
  card_img: [
    {
      nameRU: 'МИР',
      name: 'mir',
      num: '2',
      butttopimg: require('@/assets/images/paycard/new-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/mir-1200.png'),
      cardbgimg: require('@/assets/images/paycard/mir-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/visa-butt-1200.png')
    },
    {
      nameRU: 'ВИЗА',
      name: 'visa',
      num: '4',
      butttopimg: require('@/assets/images/paycard/mir-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/visa-1200.png'),
      cardbgimg: require('@/assets/images/paycard/visa-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png')
    },
    {
      nameRU: 'МАСТЕР КАРД',
      name: 'mc',
      num: '5',
      butttopimg: require('@/assets/images/paycard/visa-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/mc-1200.png'),
      cardbgimg: require('@/assets/images/paycard/mc-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png')
    },
    {
      nameRU: 'МАЭСТРО',
      name: 'mc',
      num: '6',
      butttopimg: require('@/assets/images/paycard/visa-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/mc-1200.png'),
      cardbgimg: require('@/assets/images/paycard/mc-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png')
    }
  ],
  pay_status: '',
  visAutoPay: 0,
  errAutoPay: false,
  errDelCard: false,
  bindingId: ''
}
const getters = {}
const actions = {
  changeSave: ({ commit }, { save }) => {
    commit('changeSave', save)
  },
  changeCVC: ({ commit }, { cvc }) => {
    commit('changeCVC', cvc)
  },
  clearCVC: ({ commit }) => {
    commit('clearCVC')
  },
  clearErr: ({ commit }) => {
    commit('clearErr')
  },
  changeCurrentNumCard: ({ commit }, { num }) => {
    commit('changeCurrentNumCard', num)
  },
  hideDelCard: async ({ commit }) => {
    commit('hideDelCard')
  },
  payment: async ({ commit }, { api, payload }) => {
    try {
      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/pay')
      const resultArr = [result, payload.email]
      commit('payment', resultArr)

      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  bindpay: async ({ commit }, { api, payload }) => {
    try {
      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/bindpay')
      const resultArr = [
        result,
        payload.email,
        payload.returnUrl,
        payload.billingAccount
      ]
      commit('bindpay', resultArr)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  autoPay: async ({ commit }, { api, payload }) => {
    try {
      let result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/autopay')

      if (payload.load === 0) {
        result = [result, payload.activate]
        commit('autoPay', result)
      } else {
        const resultArr = [result, payload.load]
        commit('loadAutoPay', resultArr)
      }
      return result
    } catch (e) {
      commit('autoPayErr')
    }
  },
  status: async ({ commit }, { api, payload }) => {
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          transaction: payload.transaction,
          billingAccount: payload.billingAccount
        })
        .query('/acquiring/card/status')
      commit('status', result)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  listCard: async ({ commit }, { api, billingAccount }) => {
    try {
      let result = await api
        .setWithCredentials()
        .setData({
          billingAccount: billingAccount
        })
        .query('/acquiring/card/list')
      // todo-er временно для отладки
      result = [
          {
            "bindingId":"41",
            "maskedPan": "411111**1111",
            "expiryDate": "201912",
            "gateId": 1
          },
          {
            "bindingId":"42",
            "maskedPan": "211111**1111",
            "expiryDate": "201912",
            "gateId": 0
          },
          {
            "bindingId":"43",
            "maskedPan": "511111**1111",
            "expiryDate": "201912",
            "gateId": 2
          }
        ]

        let cards = result.map(function (item) {
        state.card_img.forEach(value => {
          if (item.maskedPan[0] === value.num) {
            item = Object.assign(item, value)
          }
        })
        return item
      })
      cards.forEach((value, idx) => {
        value.num1 = cards[idx].maskedPan.slice(0, 4)
        value.num2 = cards[idx].maskedPan.slice(4, 6)
        value.num3 = cards[idx].maskedPan.slice(-4)
        if (idx > 0 && idx < cards.length - 1) {
          value.butttopimg = require('@/assets/images/paycard/' + cards[idx - 1].name + '-butt-1200.png')
          value.buttbottimg = require('@/assets/images/paycard/' + cards[idx + 1].name + '-butt-1200.png')
          value.numbutttop = cards[idx - 1].maskedPan.slice(-4)
          value.numbuttbott = cards[idx + 1].maskedPan.slice(-4)
        } else {
          if (idx === cards.length - 1 && idx !== 0) {
            value.butttopimg = require('@/assets/images/paycard/' + cards[idx - 1].name + '-butt-1200.png')
            value.numbutttop = cards[idx - 1].maskedPan.slice(-4)
          } else {
            value.butttopimg = require('@/assets/images/paycard/new-butt-1200.png')
            const idxOne = cards.length > 1 ? idx + 1 : idx
            value.buttbottimg = require('@/assets/images/paycard/' + cards[idxOne].name + '-butt-1200.png')
            value.numbuttbott = cards[idxOne].maskedPan.slice(-4)
          }
        }
      })
      commit('listCard', cards)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  delCard: async ({ commit }, { api, payload }) => {
    try {
      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/unbind')

      commit('delCard', result)
      return result
    } catch (e) {
      commit('delErr')
    }
  }
}
const mutations = {
  status: (state, result) => {
    state.pay_status = result.pay_status
    state.bindingId = result.bindingId
  },
  payment: (state, result) => {
    localStorage.setItem('email', result[1])
    location.href = result[0].pay_url
  },
  bindpay: (state, result) => {
    localStorage.setItem('email', result[1])
    location.href = `${result[2]}?transaction=${result[0]
      .transactionId}&billing_account=${result[3]}`
  },
  autoPay: (state, result) => {
    state.visAutoPay = result[1] === 0 ? 0 : state.numCard
    state.errAutoPay = false
  },
  loadAutoPay: (state, result) => {
    state.visAutoPay = result[0].result === 0 ? 0 : result[1]
    state.errAutoPay = false
  },
  autoPayErr: () => {
    state.errAutoPay = true
  },
  hideDelCard: (state) => {
    state.delCard = false
    state.numCard = 0
  },
  delCard: (state, result) => {
    state.delCard = result
    state.errDelCard = !result
  },
  delErr: () => {
    state.errDelCard = true
  },
  changeSave: (state, save) => {
    state.save = save
  },
  changeCVC: (state, cvc) => {
    state.cvc[state.numCard - 1] = cvc
  },
  clearCVC: (state) => {
    let len = state.listCard.length
    let cvc = [len + 1]
    for (let i = 0; i < len; i++) { cvc[i] = '' }
    state.cvc = cvc
  },
  clearErr: (state) => {
    state.errAutoPay = false
    state.errDelCard = false
  },
  changeCurrentNumCard: (state, num) => {
    state.numCard = num
  },
  listCard: (state, result) => {
    state.listCard = result
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
