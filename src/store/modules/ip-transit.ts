import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import PnS from '@/store/modules/productnservices'
import { ICustomerProduct } from '@/tbapi'
import { PRODUCT_CODE, PRODUCT_TYPE } from '@/constants/ip-transit'

const MUTATIONS = {
  SET_POINTS: 'SET_POINTS',
  SET_PRODUCT: 'SET_PRODUCT'
}

interface IState {
  pointList: any[]
  product: Record<string, any>
}

const state = (): IState => ({
  pointList: [],
  product: {}
})

const getters = {
  mappedPointList (state: IState) {
    return state.pointList.map((el: Record<string, any>) => {
      return {
        id: el.id,
        bpi: el.bpi,
        fulladdress: el.fulladdress,
        offerName: el.offer.name,
        addressId: el.address.id,
        status: el.status
      }
    })
  }

}

const actions = {
  fetchPoints (context: ActionContext<IState, any>, payload: { api: API, productType: string}) {
    return PnS.actions.locationOfferInfo(context, payload)
  },
  pullPoints (context: ActionContext<IState, any>) {
    const payload = {
      api: new API(),
      productType: PRODUCT_TYPE
    }

    return context.dispatch('fetchPoints', payload)
      .then(points => {
        context.commit(MUTATIONS.SET_POINTS, points)
        return points
      })
  },
  fetchProduct (context: ActionContext<IState, any>, payload: {
    api: API,
    parentId?: string | number,
    parentIds?: string[]
    locationId?: string | number,
    code?: string
  }) {
    return PnS.actions.customerProduct(context, payload)
  },
  pullProduct (context: ActionContext<IState, any>, payload: Record<string, any>) {
    const newPayload = {
      api: new API(),
      code: PRODUCT_CODE,
      ...payload
    }

    return context.dispatch('fetchProduct', newPayload)
      .then(product => {
        context.commit(MUTATIONS.SET_PRODUCT, product)
        return product
      })
  }
}

const mutations = {
  [MUTATIONS.SET_POINTS] (state: IState, pointList: []) {
    state.pointList = pointList
  },
  [MUTATIONS.SET_PRODUCT] (state: IState, payload: ICustomerProduct) {
    state.product = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
