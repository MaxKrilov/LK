import PnS from './productnservices'

const TELEPHONY_PRODUCT_TYPE = 'Телефония'
const VIRTUAL_PHONE_NUMBER_CODE = 'PHNUMBVN'

const SET_TELEPHONY_POINTS = 'SET_TELEPHONY_POINTS'

const state = {
  points: []
}

const actions = {
  fetchPoints (context, { api }) {
    const newPayload = {
      api,
      productType: TELEPHONY_PRODUCT_TYPE
    }
    return PnS.actions.locationOfferInfo(context, newPayload)
      .then(data => {
        context.commit(SET_TELEPHONY_POINTS, data)
        return data
      })
  },
  fetchPhonesOnPoint (context, { api, parentId }) {
    return PnS.actions.customerProduct(context, { api, parentId })
      .then(data => {
        return data
      })
  }
}

const mutations = {
  [SET_TELEPHONY_POINTS] (state, payload) {
    state.points = payload
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
