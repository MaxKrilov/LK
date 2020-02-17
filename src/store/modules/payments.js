import { ERROR_MODAL } from '../actions/variables'

const state = {
  billingAccount: 111111111111,
  numCard: 0,
  delCard: false,
  cvc: ["", "", ""],
  listCard: [],
  transaction: '',
  card_img: [
    {
      // id: 0,
      name: 'mir',
      num: '2',
      butttopimg: require('@/assets/images/paycard/new-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/mir-1200.png'),
      cardbgimg: require('@/assets/images/paycard/mir-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/visa-butt-1200.png'),
    },
    {
      // id: 1,
      name: 'visa',
      num: '4',
      butttopimg: require('@/assets/images/paycard/mir-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/visa-1200.png'),
      cardbgimg: require('@/assets/images/paycard/visa-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png'),
    },
    {
      // id: 2,
      name: 'mc',
      num: '5',
      butttopimg: require('@/assets/images/paycard/visa-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/mc-1200.png'),
      cardbgimg: require('@/assets/images/paycard/mc-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/mc-butt-1200.png'),
    },
  ],
  pay_status: 0,
  visAutoPay: 0,
  bindingId: ''
}

const getters = {
  getDelCard (state) {
    return state.delCard
  },
  getPayStatus (state) {
    return state.pay_status
  },
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
  payment: async ({ commit, dispatch, state }, { api, payload }) => {
    // alert('payment')
    commit('status', 0) // временно, до вкл. запросов
    console.log(payload)
    try {
      // alert(1)

      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/pay')

      location.href = result.pay_url

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
/*
  paymentCard: async ({ commit, dispatch, state }, { api, payload }) => {
    // alert('payment')
    commit('status', 0) // временно, до вкл. запросов
    console.log(payload)
    try {
      // alert(1)

      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/pay')

      location.href = result.pay_url

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
*/
  autoPay: async ({ commit, dispatch, state }, { api, payload }) => {
/*
    console.log('payload->',payload)
    const result = [true, payload.activate]       // временно
    commit('autoPay', result)  // временно
*/

    try {
      alert(1)
      const result = await api
        .setWithCredentials()
        .setData(
          payload
        )
        .query('/acquiring/card/autopay')
      commit('autoPay', result)
      return result
    } catch (e) {
      // alert('autoPay')
      // const result = [true, payload.activate]       // временно
      // commit('autoPay', result)  // временно

      // commit(ERROR_MODAL, true, { root: true })
    }
  },
  status: async ({ commit, dispatch, state }, { api, billingAccount }) => {
    const result0 = [{
      "pay_status": 2,
      "pay_status_name": " Платеж в обработке",
      "pay_status_descr": " Оплата будет произведена в течение нескольких минут",
      "last_update":"22.11.2019",
      "transaction_id": "G67Y34B8PGN",
      "gate_transaction_id": "71fc054a-915e-7228-b179-bd5700000590",
      "amount": 1024.01,
      "binding_id": null,
      "autopay_enabled": null,
      "err_code": null
    }]
    // alert('status->',result0.pay_status)
    commit('status', result0.pay_status)
    /*
        alert(state.transaction)
        try {
          const status = await api
            .setWithCredentials()
            .setData({
              transaction: state.transaction,
              billingAccount: billingAccount
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
    */
  },
  listCard: async ({ commit, dispatch, state }, { api, billingAccount }) => {

// ----------------
//     alert(1)

    const result0 = [
      {
        "bindingId":"10340ceb-da2a-42b1-8ea5-09fcd8c51d80",
        "maskedPan": "411222**7878",
        "expiryDate": "201912",
        "gateId": 1
      },
      {
        "bindingId":"10320ceb-da2a-42b1-8ea5-09fcd8c51d80",
        "maskedPan": "288676**7986",
        "expiryDate": "201912",
        "gateId": 2
      },
      {
        "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
        "maskedPan": "521345**6738",
        "expiryDate": "201912",
        "gateId": 3
      }
    ]
    // const result0 = []

    // console.log('card_img -> ', payload.card_img)
    // console.log('result ->',result)

    let cards0 = result0.map( function(item) {
      // console.log(payload.card_img)
      // console.log(item.maskedPan[0])
      state.card_img.forEach(value => {
        if (item.maskedPan[0] === value.num) {
          item = Object.assign(item,value)
        }
      })
      return item
    });

    console.log('cards->',cards0)

    cards0.forEach((value, idx) => {
      value.num1 = cards0[idx].maskedPan.slice(0, 4)
      value.num2 = cards0[idx].maskedPan.slice(4, 6)
      value.num3 = cards0[idx].maskedPan.slice(-4)
      if(idx > 0 && idx < cards0.length-1) {
        value.butttopimg = require('@/assets/images/paycard/' + cards0[idx-1].name + '-butt-1200.png')
        value.buttbottimg = require('@/assets/images/paycard/' + cards0[idx+1].name + '-butt-1200.png')
        value.numbutttop = cards0[idx-1].maskedPan.slice(-4)
        value.numbuttbott = cards0[idx+1].maskedPan.slice(-4)
        // console.log(cards0[idx-1].name,cards0[idx].name,cards0[idx+1].name)
      } else {
        if (idx === cards0.length - 1) {
          value.butttopimg = require('@/assets/images/paycard/' + cards0[idx-1].name + '-butt-1200.png')
          value.numbutttop = cards0[idx-1].maskedPan.slice(-4)
          // console.log(cards0[idx-1].name, cards0[idx].name)
        } else {
          value.butttopimg = require('@/assets/images/paycard/new-butt-1200.png')
          value.buttbottimg = require('@/assets/images/paycard/' + cards0[idx+1].name + '-butt-1200.png')
          // console.log(value.num1)
          // console.log(value.num2)
          // console.log(value.num3)
          // value.numbutttop = ''
          value.numbuttbott = cards0[idx+1].maskedPan.slice(-4)

          // console.log('>>->', cards0[idx+1])
          // console.log('new', cards0[idx].name, cards0[idx + 1].name)
        }
      }
    })

    // alert(2)
    // console.log('cards->',cards0)
    commit('listCard', cards0)

// ----------------

/*
    try {
      let result = await api
        .setWithCredentials()
        .setData({
          billingAccount: billingAccount,
        })
        .query('/acquiring/card/list')
/!*
      result = [
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "411111**1111",
          "expiryDate": "201912",
          "gateId": 1
        },
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "211111**1111",
          "expiryDate": "201912",
          "gateId": 0
        },
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "511111**1111",
          "expiryDate": "201912",
          "gateId": 2
        }
      ]
*!/

      console.log('result ->',result)

      commit('listCard', result)
      return result
    } catch (e) {
      // commit(ERROR_MODAL, true, { root: true })
      const result = [
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "411111**1111",
          "expiryDate": "201912",
          "gateId": 1
        },
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "211111**1111",
          "expiryDate": "201912",
          "gateId": 0
        },
        {
          "bindingId":"10350ceb-da2a-42b1-8ea5-09fcd8c51d80",
          "maskedPan": "511111**1111",
          "expiryDate": "201912",
          "gateId": 2
        }
      ]

      // console.log('card_img -> ', payload.card_img)
      // console.log('result ->',result)

      let cards = result.map( function(item) {
        // console.log(payload.card_img)
        // console.log(item.maskedPan[0])
        payload.card_img.forEach(value => {
          if (item.maskedPan[0] === value.num) {
            item = Object.assign(item,value)
            // let item1 = Object.assign(item,value)
            // item = [...item, ...value]
          }
        })
        return item
      });
      // alert('cards->',cards)
      commit('listCard', cards)

      // commit('payments_req', '555')
      alert(41)
    }
*/
  },
  delCard: async ({ commit, dispatch, state }, { api }) => {
    const result0 = true
    commit('delCard', result0)

    /*
        alert(state.transaction)
        try {
          const status = await api
            .setWithCredentials()
            .setData({
              transaction: state.transaction,
              billingAccount: state.billingAccount
            })
            .query('/acquiring/card/unbind')

          console.log('result ->',result)
          // alert(2)

          commit('listCard', result)
          return result
        } catch (e) {
          commit(ERROR_MODAL, true, { root: true })
          // commit('payments_req', '555')
          alert(41)
        }
    */
  },
  delCard1: async ({ commit}) => {
    commit('delCard1', false)

    /*
        alert(state.transaction)
        try {
          const status = await api
            .setWithCredentials()
            .setData({
              transaction: state.transaction,
              billingAccount: state.billingAccount
            })
            .query('/acquiring/card/unbind')

          console.log('result ->',result)
          // alert(2)

          commit('listCard', result)
          return result
        } catch (e) {
          commit(ERROR_MODAL, true, { root: true })
          // commit('payments_req', '555')
          alert(41)
        }
    */
  },

}
const mutations = {
  autoPay: (state, result) => {
    if (result[0]) {
      state.visAutoPay = result[1] === 0 ? 0 : state.numCard
    }
  },
  delCard1: (state, result) => {
    state.delCard = result
  },
  delCard: (state, result) => {
    state.delCard = result
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
  status: (state, result) => {
    state.pay_status = result
  },
  transaction: (state, payload) => {
    // alert(payload)
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
