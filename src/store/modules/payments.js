import { ERROR_MODAL } from '../actions/variables'

const state = {
  numCard: 0,
  save: 0,
  delCard: false,
  cvc: [],
  listCard: [],
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
      name: 'maestro',
      num: '6',
      butttopimg: require('@/assets/images/paycard/maestro-butt-1200.png'),
      cardimg: require('@/assets/images/paycard/maestro-1200.png'),
      cardbgimg: require('@/assets/images/paycard/maestro-bg-1200.png'),
      buttbottimg: require('@/assets/images/paycard/maestro-butt-1200.png')
    }
  ],
  pay_status: '',
  visAutoPay: 0,
  errAutoPay: false,
  errDelCard: false,
  errPromisePay: false,
  bindingId: '',
  isLoading: null,
  isLoadingButt: false,
  invPaymentsForViewer: [
    {
      id: 0,
      bucket: '',
      fileName: '',
      filePath: '',
      type: {
        id: 0,
        name: ''
      }
    }
  ],
  promisePayInterval: '',
  isPromisePay: false,
  isExpired: false,
  isDebt: false,
  appCreation: ''
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
  updateAutoPay: ({ commit }, payload) => {
    commit('updateAutoPay', payload)
  },
  isLoadingClean: ({ commit }) => {
    commit('isLoadingClean')
  },
  isExpired: ({ commit }, payload) => {
    commit('isExpired', payload)
  },
  isLoadingTrue: ({ commit }) => {
    commit('isLoadingTrue')
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
  history: async ({ commit, rootGetters, rootState }, { api, payload }) => {
    const { toms } = rootGetters['auth/user']
    const { activeBillingAccount } = rootState.user
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          dateFrom: payload[0],
          dateTo: payload[1],
          id: activeBillingAccount
        })
        .query('/payment/billing/history')
      console.log('result', result)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  payment: ({ commit }, { api, payload }) => {
    return new Promise((resolve, reject) => {
      commit('isLoading')
      api
        .setWithCredentials()
        .setData(payload)
        .query('/acquiring/card/pay')
        .then(response => {
          if (response && response.hasOwnProperty('pay_url')) {
            commit('paymentSuccess', {
              email: payload.email,
              payUrl: response.pay_url
            })
            resolve()
          } else {
            commit(ERROR_MODAL, true, { root: true })
            reject()
          }
        })
        .catch(() => {
          commit(ERROR_MODAL, true, { root: true })
          reject()
        })
    })
  },
  bindpay: ({ commit }, { api, payload }) => {
    return new Promise((resolve, reject) => {
      commit('isLoading')
      api
        .setWithCredentials()
        .setData(payload)
        .query('/acquiring/card/bindpay')
        .then(response => {
          commit('bindpaySuccess', {
            email: payload.email,
            acsUrl: response.acsUrl,
            MD: response.MD,
            PaReq: response.PaReq,
            TermUrl: response.TermUrl
          })
          resolve(response)
        })
        .catch(() => {
          commit(ERROR_MODAL, true, { root: true })
          reject(false)
        })
    })
  },
  bindPayNext: async ({ commit }, { api, payload }) => {
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
    commit('isLoading')
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
    commit('isLoading')
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
  },
  invPayment: async ({ commit, rootGetters, rootState }, { api }) => {
    const toms = rootGetters['auth/getTOMS']
    const { activeBillingAccount } = rootState.user
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          id: activeBillingAccount
        })
        .query('/billing/info-bill/index')
      commit('invPayment', result)
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  promisePayInfo: async ({ commit, rootGetters, rootState }, { api }) => {
    const { toms } = rootGetters['auth/user']
    const { activeBillingAccount } = rootState.user
    try {
      const checkPromisePay = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          id: activeBillingAccount
        })
        .query('/billing/promise/index')

      const checkDebt = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          promiseCode: 1,
          id: activeBillingAccount
        })
        .query('/payment/billing/check-promise-payment')

      commit('promisePayInfo', [checkPromisePay, checkDebt])
    } catch (e) {
      commit('isLoadingClean')
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  appCreation: async ({ commit, rootGetters, rootState }, { api, payload }) => {
    const { toms } = rootGetters['auth/user']
    const { activeBillingAccount } = rootState.user
    commit('isLoading')
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          marketingBrandId: payload.marketingBrandId
        })
        .query('/order/management/create')

      await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          billingAccountId: activeBillingAccount,
          locationId: result.locationIds,
          id: result.id
        })
        .query('/order/management/promised-payment')

      await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          id: result.id
        })
        .query('/order/management/save')

      const res = [result, payload.date]
      commit('appCreation', res)
      return result
    } catch (e) {
      commit('promisePayErr')
    }
  },
  appSend: async ({ commit, rootGetters }, { api, date }) => {
    const { toms } = rootGetters['auth/user']
    commit('isLoadingButt')
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          id: state.appCreation
        })
        .query('/order/management/send-order')

      commit('isLoadingButtClean')
      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  },
  appCancel: async ({ commit, rootGetters }, { api }) => {
    const { toms } = rootGetters['auth/user']
    try {
      const result = await api
        .setWithCredentials()
        .setData({
          clientId: toms,
          id: state.appCreation
        })
        .query('/order/management/cancel')

      return result
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
    }
  }
}
const mutations = {
  updateAutoPay: (state, payload) => {
    state.visAutoPay = payload
  },
  isLoadingClean: (state) => {
    state.isLoading = false
  },
  isLoadingButtClean: (state) => {
    state.isLoadingButt = false
    state.isLoading = true
  },
  isLoadingTrue: (state) => {
    state.isLoading = true
  },
  isLoading: (state) => {
    state.isLoading = true
  },
  isExpired: (state, payload) => {
    state.isExpired = payload
  },
  isLoadingButt: (state) => {
    state.isLoadingButt = true
  },
  appCreation: (state, result) => {
    state.appCreation = result[0].id
    state.isPromisePay = false
    state.promisePayInterval = result[1]
    state.isLoading = false
  },
  status: (state, result) => {
    state.pay_status = result.pay_status
    state.bindingId = result.bindingId
  },
  paymentSuccess: (_, payload) => {
    localStorage.setItem('email', payload.email)
    location.href = payload.payUrl
  },
  bindpaySuccess: (_, payload) => {
    localStorage.setItem('email', payload.email)
    let form = document.createElement('form')
    form.setAttribute('action', payload.acsUrl)
    form.setAttribute('method', 'POST')
    form.style.display = 'none'
    // MD
    const mdInput = document.createElement('input')
    mdInput.setAttribute('type', 'hidden')
    mdInput.setAttribute('name', 'MD')
    mdInput.setAttribute('value', payload.MD)
    form.appendChild(mdInput)
    // PaReq
    const paReqInput = document.createElement('input')
    paReqInput.setAttribute('type', 'hidden')
    paReqInput.setAttribute('name', 'PaReq')
    paReqInput.setAttribute('value', payload.PaReq)
    form.appendChild(paReqInput)
    // TermUrl
    const termUrlInput = document.createElement('input')
    termUrlInput.setAttribute('type', 'hidden')
    termUrlInput.setAttribute('name', 'TermUrl')
    termUrlInput.setAttribute('value', payload.TermUrl)
    form.appendChild(termUrlInput)

    form = document.body.appendChild(form)
    form.submit()
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
  promisePayErr: () => {
    state.errPromisePay = true
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
    state.errPromisePay = false
    state.errDelCard = false
  },
  changeCurrentNumCard: (state, num) => {
    state.numCard = num
  },
  listCard: (state, result) => {
    state.listCard = result
    state.isLoading = true
  },
  promisePayInfo: (state, result) => {
    const len = Object.keys(result[0]).length
    if (len > 1) {
      state.isPromisePay = false
      if (result[0].promisePaymentActive !== undefined) {
        state.promisePayInterval = result[0].promisePaymentActive
          .promisePaymentDetails[0].schdPymtDueDt
      } else {
        state.promisePayInterval = result[0].promisePaymentHistory[0]
          .promisePaymentDetails[0].schdPymtDueDt
      }
    } else {
      state.isPromisePay = true
    }
    state.isLoading = true
    if (!result[1].paymentCanBeCreated) {
      state.isDebt = true
      state.errPromisePay = true
    }
  },
  invPayment: (state, result) => {
    let invPayment = []
    let myObj = {}
    for (let [key, value] of Object.entries(result)) {
      if (key) myObj[key] = `${value}`
      if (key === 'fileName') myObj[key] = `${value}.pdf`
    }
    myObj.type = { id: '0', name: 'Счёт на оплату' }
    invPayment.push(myObj)
    state.invPaymentsForViewer = invPayment
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
