import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { ISaleOrder, IOrderItem } from '@/tbapi'
import { TYPE_JSON } from '@/constants/type_request'

const ACTION_ADD = 'add'

const QUERY = {
  CREATE: '/order/management/create',
  ADD_ELEMENT: '/order/management/add-element',
  SAVE: '/order/management/save',
  UPDATE_ELEMENT: '/order/management/update-element',
  DELETE_ELEMENT: '/order/management/delete-element',
  CANCEL: '/order/management/cancel',
  SEND_ORDER: '/order/management/send-order'
}
function finder (data:any, id:string) : IOrderItem | null {
  let result = null
  const rec = (data:any, id:any, f:any) => {
    data.forEach((el:any) => {
      if (el.customerProductId === id) {
        result = el
      }
      if (el?.orderItems) {
        f(el.orderItems, id, f)
      }
    })
  }
  rec(data, id, rec)
  return result
}

const api = () => new API()

interface IState {
  orderId: null | string,
  orderItemId: null | string,
  bpi: null | string
  currentResponse: null | ISaleOrder
}

const getClientId = (context: ActionContext<IState, any>) => context.rootGetters['auth/user']?.toms

const state: IState = {
  orderId: null,
  orderItemId: null,
  bpi: null,
  currentResponse: null
}

const getters = {
  orderId: (state: IState) => state.orderId,
  orderItemId: (state: IState) => state.orderItemId,
  bpi: (state: IState) => state.bpi,
  currentResponse: (state: IState) => state.currentResponse
}

const actions = {
  create (
    context: ActionContext<IState, any>,
    { locationId, bpi }: { locationId: string, bpi: string }
  ) {
    if (!locationId || !bpi) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const marketingBrandId = context.rootGetters['user/getMarketingBrandId']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          clientId,
          marketingBrandId,
          locationId
        })
        .query(QUERY.CREATE)
        .then((response: ISaleOrder) => {
          context.commit('createSuccess', {
            ...response,
            bpi
          })
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('createError')
          context.commit('responseError')
          reject(error)
        })
    })
  },
  addElement (
    context: ActionContext<IState, any>,
    { offerId }: { offerId: string }
  ) {
    if (!offerId) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const orderItemId = context.getters.orderItemId
    if (!orderItemId) throw new Error('Order Item ID not found')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          clientId,
          offerId,
          orderItemId
        })
        .query(QUERY.ADD_ELEMENT)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  save (
    context: ActionContext<IState, any>
  ) {
    const clientId = getClientId(context)
    const orderId = context.getters.orderId
    if (!orderId) throw new Error('Order ID not found')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          clientId,
          id: orderId
        })
        .query(QUERY.SAVE)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  updateElement (
    context: ActionContext<IState, any>,
    { chars }: { chars: Record<string, string> | Record<string, string>[] }
  ) {
    if (!chars) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const bpi = context.getters.bpi as string
    const orderItemElement = finder(currentResponse.orderItems, bpi)
    const orderId = context.getters.orderId
    if (orderItemElement === null) throw new Error('Unknown error')
    const elementId = orderItemElement!.id

    if (!elementId) throw new Error('Unknown error')
    const elements = Array.isArray(chars)
      ? chars.map(char => ({
        id: elementId,
        chars: char
      }))
      : [{
        id: elementId,
        chars
      }]

    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          id: orderId,
          elements
        })
        .query(QUERY.UPDATE_ELEMENT)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },

  updateNewElement (
    context: ActionContext<IState, any>,
    { chars }: { chars: Record<string, string> | Record<string, string>[] }
  ) {
    if (!chars) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const bpi = context.getters.bpi as string
    const orderItem = finder(currentResponse.orderItems, bpi)
    const orderId = context.getters.orderId
    const orderItemElement = orderItem!.orderItems
      .find(item => item.action && item.action.toLowerCase() === ACTION_ADD)

    if (orderItemElement === null) throw new Error('Unknown error')
    const elementId = orderItemElement!.id

    if (!elementId) throw new Error('Unknown error')
    const elements = Array.isArray(chars)
      ? chars.map(char => ({
        id: elementId,
        chars: char
      }))
      : [{
        id: elementId,
        chars
      }]

    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          id: orderId,
          elements
        })
        .query(QUERY.UPDATE_ELEMENT)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  deleteElement (
    context: ActionContext<IState, any>,
    { productId, disconnectDate }: { productId: string, disconnectDate: string }
  ) {
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const orderItem = finder(currentResponse.orderItems, productId)
    const orderItemId = orderItem?.id
    const clientId = getClientId(context)
    const orderId = context.getters.orderId

    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          id: orderId,
          orderItemIds: [orderItemId],
          disconnectDate,
          primaryDisconnectReason: '9154707822713202000',
          secondaryDisconnectReason: '9154707827913202000'

        })
        .query(QUERY.DELETE_ELEMENT)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  cancel (
    context: ActionContext<IState, any>
  ) {
    const clientId = getClientId(context)
    const orderId = context.getters.orderId
    if (!orderId) throw new Error('Order ID not found')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          clientId,
          id: orderId
        })
        .query(QUERY.CANCEL)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  send (
    context: ActionContext<IState, any>,
    payload: { offerAcceptedOn?: string }
  ) {
    const clientId = getClientId(context)
    const orderId = context.getters.orderId
    if (!orderId) throw new Error('Order ID not found')
    const data: Record<string, string> = { clientId, id: orderId, offerIdentifier: 'version 1.0' }
    if (payload && payload.offerAcceptedOn) data.offerAcceptedOn = payload.offerAcceptedOn
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData(data)
        .query(QUERY.SEND_ORDER)
        .then((response: ISaleOrder) => {
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error)
        })
    })
  },
  createSaleOrder (
    context: ActionContext<IState, any>,
    { locationId, bpi, offerId, chars }: { locationId: string, bpi: string, offerId: string, chars?: Record<string, string> | Record<string, string>[] }
  ) {
    return new Promise((resolve, reject) => {
      context.dispatch('create', { locationId, bpi })
        .then(() => {
          context.dispatch('addElement', { offerId })
            .then(() => {
              if (!chars) {
                context.dispatch('save')
                  .then(response => resolve(response))
                  .catch(err => reject(err))
              } else {
                context.dispatch('updateNewElement', { chars })
                  .then(() => {
                    context.dispatch('save')
                      .then(response => resolve(response))
                      .catch(err => reject(err))
                  })
                  .catch(err => reject(err))
              }
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  },
  createModifyOrder (
    context: ActionContext<IState, any>,
    { locationId, bpi, chars }: { locationId: string, bpi: string, chars?: Record<string, string> | Record<string, string>[] }
  ) {
    return new Promise((resolve, reject) => {
      context.dispatch('create', { locationId, bpi })
        .then(() => {
          context.dispatch('updateElement', { chars })
            .then(() => {
              context.dispatch('save')
                .then(response => resolve(response))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  },
  createDisconnectOrder (
    context: ActionContext<IState, any>,
    { locationId, bpi, productId, disconnectDate }: { locationId: string, bpi: string, offerId?: string, productId?: string, disconnectDate: string }
  ) {
    return new Promise((resolve, reject) => {
      context.dispatch('create', { locationId, bpi })
        .then(() => {
          context.dispatch('deleteElement', { productId, disconnectDate })
            .then(() => {
              context.dispatch('save')
                .then(response => resolve(response))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
}

const mutations = {
  createSuccess (state: IState, payload: ISaleOrder & { bpi: string }) {
    state.orderId = payload.id
    state.bpi = payload.bpi

    const orderItem = finder(payload.orderItems, payload.bpi)
    if (orderItem?.id) state.orderItemId = orderItem!?.id
  },
  createError (state: IState) {
    state.orderId = null
    state.bpi = null
    state.orderItemId = null
  },
  responseSuccess (state: IState, payload: ISaleOrder) {
    state.currentResponse = payload
  },
  responseError (state: IState) {
    state.currentResponse = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
