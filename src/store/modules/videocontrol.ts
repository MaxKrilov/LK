import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import {
  IDomainRegistry,
  IDomain,
  IVideocontrol,
  IBaseFunctionality,
  ICamera
} from '@/interfaces/videocontrol'
import { IOfferingRelationship, IOffering } from '@/interfaces/offering'
import { ILocationOfferInfo } from '@/tbapi'

import PnS from './productnservices'
import {
  MARKET_ID,
  PRODUCT_TYPE,
  DISTRIBUTION_CHANNEL_ID,
  CUSTOMER_CATEGORY_ID,
  VC_TYPES,
  ANALYTIC_CATEGORY_ID,
  BF_CATEGORY_NAME,
  BF_CATEGORY_ID
} from '@/constants/videocontrol'

const TYPES = {
  SET_POINTS: 'SET_POINTS',
  DELETE_POINTS: 'DELETE_POINTS',
  SET_POINTS_IS_LOADED: 'SET_POINTS_IS_LOADED',

  SET_DOMAINS: 'SET_DOMAINS',
  DELETE_DOMAINS: 'DELETE_DOMAINS',
  SET_DOMAINS_IS_LOADED: 'SET_DOMAINS_IS_LOADED',

  SET_DOMAIN_USER_COUNT: 'SET_DOMAIN_USER_COUNT',

  SET_ALLOWED_OFFERS: 'SET_ALLOWED_OFFERS',
  DELETE_ALLOWED_OFFERS: 'DELETE_ALLOWED_OFFERS',
  SET_ALLOWED_OFFERS_IS_LOADED: 'SET_ALLOWED_OFFERS_IS_LOADED'
}

interface IAllowedOffers {
  [BFOfferId: string]: []
}

interface IState {
  points: ILocationOfferInfo[]
  isPointsLoaded: boolean
  domainRegistry: IDomainRegistry
  isDomainRegistryLoaded: boolean
  domainUserCount: IDomainUserRegistry
  allowedOffers: IAllowedOffers
  isAllowedOffersLoaded: boolean
}

interface IPayload {
  api: API,
  id?: string
}

interface IDomainUserRegistry {
  [domainId: string]: number
}

const APIShortcut = (api: API, url: string, data: Object) => {
  return api
    .setType('json')
    .setWithCredentials()
    .setData(data)
    .query(url)
}

const state: IState = {
  points: [],
  isPointsLoaded: false,
  domainRegistry: {},
  isDomainRegistryLoaded: false,
  domainUserCount: {},
  allowedOffers: {},
  isAllowedOffersLoaded: false
}

function isBFAnalytic (item: IOfferingRelationship) {
  return item.categoryId === ANALYTIC_CATEGORY_ID
}

function isBFAddon (item: IOfferingRelationship) {
  return item.categoryId === BF_CATEGORY_ID || item.name === BF_CATEGORY_NAME
}

function isActiveOffering (item: IOffering) {
  return ['Активный', 'Active'].includes(item.status)
}

const getters = {
  BPIList (state: IState) {
    return state.points.map(el => el.bpi)
  },
  pointByBPI (state: IState) {
    return (pointBPI: string) => state.points.filter(
      (point: ILocationOfferInfo) => point.bpi === pointBPI
    )[0] || {}
  },
  pointById (state: IState) {
    return (pointId: string) => state.points.find(
      (point: ILocationOfferInfo) => point.id === pointId
    ) || {}
  },
  domainByKey (state: IState) {
    return (key: string) => state.domainRegistry?.[key]
  },
  domainList (state: IState): IDomain[] {
    return Object.values(state.domainRegistry)
  },
  videocontrolRegistry (state: IState) {
    return Object.values(state.domainRegistry)
      .reduce((result, domain: IDomain) => {
        result = { ...result, ...domain.videocontrols }
        return result
      }, {})
  },
  domainUserCount (state: IState) {
    return (domainId: string) => state.domainRegistry[domainId]
  },
  cameraById (state: IState, getters: any) {
    return (cameraId: string) => {
      let camera = null
      getters.domainList.forEach((domain: IDomain) => {
        Object.values(domain.videocontrols).forEach((vc: IVideocontrol) => {
          if (cameraId in vc.cameras) {
            camera = vc.cameras[cameraId]
            camera.videocontrolId = vc.id
          }
        })
      })

      return camera
    }
  },
  bfById (state: IState, getters: any) {
    /* bf - базовая функциональность */
    return (id: string) => {
      let bf = null
      getters.domainList.forEach((domain: IDomain) => {
        Object.values(domain.videocontrols).forEach((vc: IVideocontrol) => {
          if (id in vc.bf) {
            bf = vc.bf[id]
          }
        })
      })

      return bf
    }
  },
  allVideocontrolList (state: IState, getters: any): IVideocontrol[] {
    return getters.domainList
      .reduce(
        (result: IVideocontrol[], el: IDomain): IVideocontrol[] => {
          return [
            ...result,
            ...Object.values(el.videocontrols)
          ]
        },
        []
      )
  },
  allBaseFunctionality (state: IState, getters: any) {
    return getters.allVideocontrolList
      .reduce(
        (result: IBaseFunctionality[], el: IVideocontrol): IBaseFunctionality[] => {
          return [
            ...result,
            ...Object.values(el.bf)
          ]
        },
        []
      )
  },
  allCameraList (state: IState, getters: any) {
    return getters.allVideocontrolList
      .reduce(
        (result: ICamera[], el: IVideocontrol): ICamera[] => {
          return [
            ...result,
            ...Object.values(el.cameras)
          ]
        },
        []
      )
  },
  allowedOfferByBFOId (state: IState) {
    return (BFOfferId: string) => state.allowedOffers[BFOfferId]
  },
  availableAnalyticListByBFOId (state: IState, getters: any) {
    return (BFOfferId: string) => {
      return getters.allowedOfferByBFOId(BFOfferId)?.[0]
        ?.offeringRelationships
        ?.find(
          (el: IOfferingRelationship) => isBFAnalytic(el)
        )
        ?.offerings
        ?.filter((el: IOffering) => isActiveOffering(el))
    }
  },
  availableServiceListByBFOId (state: IState, getters: any) {
    return (BFOfferId: string) => {
      return getters.allowedOfferByBFOId(BFOfferId)?.[0]
        ?.offeringRelationships
        ?.find(
          (el: IOfferingRelationship) => isBFAddon(el)
        )
        ?.offerings
        ?.filter((el: IOffering) => isActiveOffering(el))
    }
  }
}

/*
  fetch*() -> скачивает и возвращает данные
  pull*() -> скачивает, записывает в стор и возвращает данные
*/
const actions = {
  fetchPoints (context: ActionContext<IState, any>, { api }: { api: API}) {
    const newPayload = {
      api,
      productType: PRODUCT_TYPE
    }

    return PnS.actions.locationOfferInfo(context, newPayload)
  },
  fetchDomains (
    context: ActionContext<IState, any>,
    payload: IPayload
  ) {
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
  fetchAllowedOffers (
    context: ActionContext<IState, any>,
    { api, ...payload }: { api: API}
  ) {
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
   * @param id (Идентификатор верхнеуровнего предложения)
   * @param clientId (Идентификатор клиента)
   * @param pricesType (Тип оплаты)
   * @param productId (ID продукта)
   * @param productName (Наименование продукта)
   * @param offeringCategoryId (ID категории предложения)
   * @param offeringCategoryName(Наименование категории предложения)
   * @param customerCategoryId(ID пользовательской категории)
   * @param customerCategoryName(Наименование пользовательской категории)
   * @param marketId(ID магазина)
   * @param marketName(Наименование магазина)
   * @param distributionChannelId(ID канала продаж)
   * @param distributionChannelName(Наименование канала продаж)
   */
  fetchProductOffering (
    context: ActionContext<IState, any>,
    { api, ...payload }: { api: API}
  ) {
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
  pullPoints (context: ActionContext<IState, any>, { api }: { api: API}) {
    return context.dispatch('fetchPoints', { api })
      .then(data => {
        context.commit(TYPES.SET_POINTS, data)
        context.commit(TYPES.SET_POINTS_IS_LOADED, true)
        return data
      })
  },
  pullDomainRegistry (context: ActionContext<IState, any>, payload: IPayload) {
    return context.dispatch('fetchDomains', payload)
      .then(data => {
        context.commit(TYPES.SET_DOMAINS, data)
        context.commit(TYPES.SET_DOMAINS_IS_LOADED, true)
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
  }
}

const mutations = {
  [TYPES.SET_POINTS] (state: IState, payload: ILocationOfferInfo[]) {
    state.points = payload
  },
  [TYPES.SET_POINTS_IS_LOADED] (state: IState, payload: boolean) {
    state.isPointsLoaded = payload
  },
  [TYPES.SET_DOMAINS] (state: IState, payload: IDomainRegistry) {
    state.domainRegistry = payload
  },
  [TYPES.SET_DOMAINS_IS_LOADED] (state: IState, payload: boolean) {
    state.isDomainRegistryLoaded = payload
  },
  [TYPES.SET_ALLOWED_OFFERS] (
    state: IState, payload: {id: string, data: []}
  ) {
    state.allowedOffers[payload.id] = payload.data
  },
  [TYPES.SET_ALLOWED_OFFERS_IS_LOADED] (state: IState, payload: boolean) {
    state.isAllowedOffersLoaded = payload
  },
  [TYPES.DELETE_POINTS] (state: IState) {
    state.points = []
    state.isPointsLoaded = false
  },
  [TYPES.DELETE_DOMAINS] (state: IState) {
    state.domainRegistry = {}
    state.isDomainRegistryLoaded = false
  },
  [TYPES.DELETE_ALLOWED_OFFERS] (state: IState) {
    state.allowedOffers = {}
    state.isAllowedOffersLoaded = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
