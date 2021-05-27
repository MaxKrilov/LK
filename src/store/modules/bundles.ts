import { ActionContext } from 'vuex'
import MESSAGES from '@/constants/messages'
import { booleanToNumber } from '@/functions/helper2'
import { API } from '@/functions/api'
import { IBundle } from '@/interfaces/bundle'
import { TYPES } from '@/store/actions/bundles.js'
import { groupBy as _groupBy } from 'lodash'

interface IState {
  activeBundleList: IBundle[]
}

const state: IState = {
  activeBundleList: []
}

const getters = {
  activeBundleGroupList (state: IState) {
    return _groupBy(state.activeBundleList, 'bundle.name')
  }
}

const actions = {
  [TYPES.FETCH_ACTIVE_BUNDLES] (context: ActionContext<IState, any>, payload: { bundleOnly: false, productType: null}) {
    const clientId = context.rootGetters['auth/getTOMS']
    const billingAccountId = context.rootGetters['payments/getActiveBillingAccount']

    // const clientId = '9159429405213675413'
    // const billingAccountId = '9159429402013801018'

    if (!billingAccountId) {
      throw new Error(MESSAGES.NO_BILLING_ACCOUNT_ID)
    }

    const newPayload = {
      clientId,
      billingAccountId,
      ...payload
    }

    // @ts-ignore
    newPayload.bundleOnly = booleanToNumber(payload.bundleOnly)

    const api = new API()
    return api
      .setData(newPayload)
      .setBranch('web-23421')
      .query('/customer/bundle/active?bundle-active')
      .then(function (data): IBundle[] {
        return data
      })
  },
  [TYPES.FETCH_ACTIVE_BUNDLES_BY_PRODUCT] (context: ActionContext<IState, any>, payload: {productType: string}) {
    return context.dispatch(
      'fetchActiveBundle',
      { bundleOnly: false, ...payload }
    )
  },
  [TYPES.FETCH_ALL_BUNDLES] (context: ActionContext<IState, any>, payload: {bundleId: string}) {
    const clientId = context.rootGetters['auth/getTOMS']

    const api = new API()

    api
      .setData({
        clientId,
        bundleId: payload.bundleId
      })
      .setBranch('web-23421')
      .query('/customer/bundle/all?bundle-all')
      .then(data => {
        return data
      })
  },
  [TYPES.PULL_ACTIVE_BUNDLES] (context: ActionContext<IState, any>, payload: any) {
    const newPayload = { ...payload }
    newPayload.bundleOnly = true

    return context.dispatch(TYPES.FETCH_ACTIVE_BUNDLES, newPayload)
      .then(data => {
        context.commit(TYPES.SET_BUNDLES, data)
        return data
      })
  }
}
const mutations = {
  [TYPES.SET_BUNDLES] (state: IState, payload: IBundle[]) {
    state.activeBundleList = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
