import { ActionContext } from 'vuex'

import { API } from '@/functions/api'

import PnS from '../productnservices'
import { IState } from './state'

import {
  MARKET_ID,
  DISTRIBUTION_CHANNEL_ID,
  CUSTOMER_CATEGORY_ID,
  VC_TYPES
} from '@/constants/videocontrol'

import { TYPES } from './types'

interface IPayload {
  api: API,
  id?: string
}

const APIShortcut = (api: API, url: string, data: Object) => {
  return api
    .setType('json')
    .setData(data)
    .query(url)
}

/*
  fetch*() -> скачивает и возвращает данные
  pull*() -> скачивает, записывает в стор и возвращает данные
*/
export const actions = {
  setProductType ({ commit }: ActionContext<IState, any>, productType: string) {
    commit(TYPES.SET_PRODUCT_TYPE, productType)
  },
  unsetProductType ({ commit }: ActionContext<IState, any>) {
    commit(TYPES.UNSET_PRODUCT_TYPE)
  },
  fetchEnfortaData (context: ActionContext<IState, any>, payload: any) {
    const { parentIds } = payload
    return context.dispatch('productnservices/customerProducts', {
      api: API,
      parentIds,
      code: 'VIDNCAM'
    })
  },
  fetchForpostLink (context: ActionContext<IState, any>) {
    const api = new API()

    const isManager = context.rootState.auth.isManager
    let payload: Record<string, any> = {
      isManager
    }

    const toms = context.rootGetters['auth/getTOMS']
    if (isManager) payload['externalId'] = toms

    return APIShortcut(
      api,
      `/sso/forpost/link`,
      payload
    )
  },
  fetchPoints (context: ActionContext<IState, any>, payload: { api: API, productType: string}) {
    return PnS.actions.locationOfferInfo(context, payload)
  },
  fetchCCTV (context: ActionContext<IState, any>, payload: IPayload) {
    const { toms: clientId } = context.rootGetters['auth/user']

    const { api, ...params } = payload

    const newPayload = {
      clientId,
      ...params
    }

    return APIShortcut(
      api,
      '/customer/product/cctv',
      newPayload
    )
  },
  fetchAllowedOffers (context: ActionContext<IState, any>, { api, ...payload }: { api: API}) {
    const { toms: clientId } = context.rootGetters['auth/user']

    const newPayload = {
      clientId,
      brandId: VC_TYPES.BRAND_ID,
      marketId: MARKET_ID,
      customerCategoryId: '146',
      distributionChannelId: '144',
      ...payload
    }

    return APIShortcut(
      api,
      '/catalog/management/allowed-offers',
      newPayload
    )
  },
  /**
   * Получение списка заявок
   *
   * id (Идентификатор верхнеуровнего предложения)
   * clientId (Идентификатор клиента)
   * pricesType (Тип оплаты)
   * productId (ID продукта)
   * productName (Наименование продукта)
   * offeringCategoryId (ID категории предложения)
   * offeringCategoryName(Наименование категории предложения)
   * customerCategoryId(ID пользовательской категории)
   * customerCategoryName(Наименование пользовательской категории)
   * marketId(ID магазина)
   * marketName(Наименование магазина)
   * distributionChannelId(ID канала продаж)
   * distributionChannelName(Наименование канала продаж)
   */
  fetchProductOffering (context: ActionContext<IState, any>, { api, ...payload }: { api: API}) {
    const { toms: clientId } = context.rootGetters['auth/user']

    const newPayload = {
      clientId,
      distributionChannelId: DISTRIBUTION_CHANNEL_ID,
      marketId: MARKET_ID,
      customerCategoryId: CUSTOMER_CATEGORY_ID,
      // brandId: VC_TYPES.BRAND_ID,
      ...payload
    }

    return APIShortcut(api, '/catalog/management/product-offering', newPayload)
  },
  pullPoints (context: ActionContext<IState, any>, payload: { api: API, productType: string}) {
    return context.dispatch('fetchPoints', payload)
      .then(data => {
        context.commit(TYPES.SET_POINTS, data)
        context.commit(TYPES.SET_POINTS_IS_LOADED, true)
        return data
      })
  },
  pullForpostDomainRegistry (context: ActionContext<IState, any>, payload: IPayload) {
    context.commit(TYPES.SET_VC_DATA_IS_LOADED, false)

    return context.dispatch('fetchCCTV', payload)
      .then(data => {
        context.commit(TYPES.SET_DOMAINS, data)
        context.commit(TYPES.SET_VC_DATA_IS_LOADED, true)
        return data
      })
  },
  pullAllowedOffers (context: ActionContext<IState, any>, payload: IPayload) {
    return context.dispatch('fetchAllowedOffers', payload)
      .then(data => {
        context.commit(TYPES.SET_ALLOWED_OFFERS, { id: payload.id, data: data })
        context.commit(TYPES.SET_ALLOWED_OFFERS_IS_LOADED, true)
        return data
      })
  },
  cleanupPoints ({ commit }: ActionContext<IState, any>) {
    commit(TYPES.DELETE_POINTS)
    commit(TYPES.DELETE_DOMAINS)
    commit(TYPES.DELETE_ALLOWED_OFFERS)
  },
  pullEnfortaRegistry (context: ActionContext<IState, any>, payload: IPayload) {
    return context.dispatch('fetchCCTV', payload)
      .then(data => {
        context.commit(TYPES.SET_ENFORTA_REGISTRY, data.enforta)
        context.commit(TYPES.SET_VC_DATA_IS_LOADED, true)
        return data.enforta
      })
  },
  setVCDataIsLoaded ({ commit }: ActionContext<IState, any>) {
    commit(TYPES.SET_VC_DATA_IS_LOADED, true)
  },
  setEnfortaDataIsLoaded ({ commit }: ActionContext<IState, any>) {
    commit(TYPES.SET_ENFORTA_DATA_IS_LOADED, true)
  },
  setSearchCameraText ({ commit }: ActionContext<IState, any>, payload: string) {
    commit(TYPES.SET_SEARCH_CAMERA_TEXT, payload)
  }
}
