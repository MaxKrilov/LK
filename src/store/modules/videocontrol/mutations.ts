import Vue from 'vue'
import { TYPES } from './types'
import { IState } from './state'
import { ILocationOfferInfo } from '@/tbapi'
import { IDomainRegistry } from '@/interfaces/videocontrol'

export const mutations = {
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
    Vue.set(state.allowedOffers, payload.id, payload.data)
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
