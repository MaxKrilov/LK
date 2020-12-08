import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { AxiosError } from 'axios'
import { ISaleOrder, IOrderItem, IOffer, IOfferingRelationship, IUpdateElement } from '@/tbapi'
import { TYPE_JSON } from '@/constants/type_request'
import MESSAGES from '@/constants/messages'

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
function offerIdFinder (offer: IOffer, productCode: string) : string | null {
  if (!offer?.offeringRelationships) return null
  const offeringRelationships = offer.offeringRelationships
  let offerId = null
  offeringRelationships.map((el: IOfferingRelationship) => {
    if (el?.childProductOffering?.code === productCode) {
      offerId = el.childProductOffering.id
    } else {
      if (el?.offerings) {
        const _offerId = el.offerings.find(el => el.code === productCode)?.id
        if (_offerId) offerId = _offerId
      }
      if (el?.childProductOffering) {
        if (el.childProductOffering.code === productCode && el.childProductOffering?.id) {
          offerId = el.childProductOffering.id
        }
        if (el.childProductOffering?.offeringRelationships) {
          el.childProductOffering?.offeringRelationships.map((el: IOfferingRelationship) => {
            if (el?.offerings) {
              const _offerId = el.offerings.find(el => el.code === productCode)?.id
              if (_offerId) offerId = _offerId
            }
          })
        }
      }
    }
  })
  return offerId
}

const api = () => new API()

interface IState {
  orderId: null | string,
  currentResponse: null | ISaleOrder
}

const getClientId = (context: ActionContext<IState, any>) => context.rootGetters['auth/user']?.toms

const state: IState = {
  orderId: null,
  currentResponse: null
}

const getters = {
  orderId: (state: IState) => state.orderId,
  currentResponse: (state: IState) => state.currentResponse
}

const actions = {
  create (
    context: ActionContext<IState, any>,
    { locationId }: { locationId: string }
  ) {
    if (!locationId) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const marketingBrandId = context.rootGetters['user/getMarketingBrandId']

    if (!marketingBrandId) {
      throw new Error(MESSAGES.MARKETING_BRAND_ID_NOT_FOUND)
    }

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
            ...response
          })
          context.commit('responseSuccess', response)
          resolve(response)
        })
        .catch((error: AxiosError) => {
          context.commit('createError')
          context.commit('responseError')
          reject(error?.response?.data)
        })
    })
  },
  addElement (
    context: ActionContext<IState, any>,
    { productId, productCode }: { productId: string, productCode: string }
  ) {
    if (!productId && !productCode) throw new Error('Missing required parameter')
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const clientId = getClientId(context)

    const orderItem = finder(currentResponse.orderItems, productId)

    const offerId = orderItem?.offer && productCode ? offerIdFinder(orderItem.offer, productCode) : null
    if (!offerId) throw new Error('Offer ID not found')

    const orderItemId = orderItem?.id || null
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
          reject(error?.response?.data)
        })
    })
  },
  save (
    context: ActionContext<IState, any>, payload : { isReturnPrice? : boolean, productId? : string }
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
          if (payload?.isReturnPrice && payload?.productId) {
            const orderItem: IOrderItem | null = finder(response.orderItems, payload.productId)
            const orderItemElement = orderItem!.orderItems
              .find(item => item.action && item.action.toLowerCase() === ACTION_ADD)
            resolve(orderItemElement?.prices?.recurrentTotal?.value)
          } else {
            resolve(response)
          }
        })
        .catch((error: AxiosError) => {
          context.commit('responseError')
          reject(error?.response?.data)
        })
    })
  },
  updateElement (
    context: ActionContext<IState, any>,
    { updateElements }: { updateElements: IUpdateElement[] }
  ) {
    if (!updateElements) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const orderId = context.getters.orderId
    const elements = updateElements.map((el: IUpdateElement) => {
      const orderItemElement = finder(currentResponse.orderItems, el.productId)
      if (orderItemElement === null) throw new Error('Не найден элемент заказа')
      const elementId = orderItemElement!.id
      if (!elementId) throw new Error('Не найден идентификатор заказа')
      return {
        id: elementId,
        chars: el.chars
      }
    })

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
          reject(error?.response?.data)
        })
    })
  },
  updateNewElement (
    context: ActionContext<IState, any>,
    { chars, productId }: { chars: Record<string, string> | Record<string, string>[], productId: string }
  ) {
    if (!chars) throw new Error('Missing required parameter')
    const clientId = getClientId(context)
    const currentResponse = context.getters.currentResponse as ISaleOrder
    const orderItem = finder(currentResponse.orderItems, productId)
    const orderId = context.getters.orderId
    const orderItemElement = orderItem!.orderItems
      .find(item => item.action && item.action.toLowerCase() === ACTION_ADD)

    if (orderItemElement === null) throw new Error('Unknown error')
    const elementId = orderItemElement!.id

    if (!elementId) throw new Error('Unknown error')
    const elements = [{
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
          reject(error?.response?.data)
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
          reject(error?.response?.data)
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
          reject(error?.response?.data)
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
          reject(error?.response?.data)
        })
    })
  },
  createSaleOrder (
    context: ActionContext<IState, any>,
    {
      locationId,
      bpi,
      productCode,
      chars,
      isReturnPrice
    }: {
      locationId: string,
      bpi: string,
      productCode: string,
      chars?: Record<string, string> | Record<string, string>[],
      isReturnPrice?: boolean
    }
  ) {
    return new Promise((resolve, reject) => {
      context.dispatch('create', { locationId })
        .then(() => {
          context.dispatch('addElement', { productId: bpi, productCode })
            .then(() => {
              if (!chars) {
                context.dispatch('save', { isReturnPrice, productId: bpi })
                  .then(response => resolve(response))
                  .catch(err => reject(err))
              } else {
                context.dispatch('updateNewElement', { productId: bpi, chars })
                  .then(() => {
                    context.dispatch('save', { isReturnPrice, productId: bpi })
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
      context.dispatch('create', { locationId })
        .then(() => {
          const updateElements = [{ chars, productId: bpi }]
          context.dispatch('updateElement', { updateElements })
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
  getAvailableFunds (
    context: ActionContext<IState, any>) {
    const accountNumber = context.rootGetters['user/getActiveBillingAccountNumber']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          accountNumber
        })
        .query('/payment/billing/available')
        .then((response) => {
          resolve(response)
        })
        .catch((error: AxiosError) => {
          reject(error?.response?.data)
        })
    })
  },
  createDisconnectOrder (
    context: ActionContext<IState, any>,
    { locationId, productId, disconnectDate }: { locationId: string, bpi: string, productId?: string, disconnectDate: string }
  ) {
    return new Promise((resolve, reject) => {
      context.dispatch('create', { locationId })
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
  createSuccess (state: IState, payload: ISaleOrder) {
    state.orderId = payload?.id
  },
  createError (state: IState) {
    state.orderId = null
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
