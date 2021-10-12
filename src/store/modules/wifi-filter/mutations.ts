import Vue from 'vue'
import TYPES from './types'
import { IState } from './state'
import { ILocationOfferInfo } from '@/tbapi'
import { IAdditionSubscription, IPointVLAN, ISubscription } from '@/interfaces/wifi-filter'

export default {
  [TYPES.SET_LOCATIONS] (state: IState, payload: ILocationOfferInfo[]) {
    state.locationList = payload
  },
  [TYPES.SET_LOCATIONS_IS_LOADED] (state: IState) {
    state.isLocationListLoaded = true
  },
  [TYPES.DELETE_LOCATIONS] (state: IState) {
    state.locationList = []
  },
  [TYPES.SET_VLAN] (state: IState, payload: IPointVLAN[]) {
    state.vlan = [...payload]
  },
  [TYPES.SET_VLAN_LOADED] (state: IState, status: boolean) {
    state.isVlanLoaded = status
  },
  [TYPES.SET_AVAILABLE_FILTERS] (state: IState, payload: ISubscription[]) {
    state.filterAvailableList = payload
  },
  [TYPES.SET_SUBSCRIPTION] (state: IState, payload: any) {
    state.subscriptions[payload.vlan] = payload.data
  },
  [TYPES.SET_SUBSCRIPTION_INFO] (state: IState, payload: any) {
    Vue.set(state.subscriptionInfo, payload.subscriptionId, payload.data)
  },
  [TYPES.SET_SUBSCRIPTION_INFO_LOADED] (state: IState, subscriptionId: string) {
    Vue.set(state.subscriptionInfoLoad, subscriptionId, true)
  },
  [TYPES.UNSET_SUBSCRIPTION_INFO_LOADED] (state: IState, subscriptionId: string) {
    Vue.set(state.subscriptionInfoLoad, subscriptionId, false)
  },
  [TYPES.SET_ADD_FILTERS] (state: IState, payload: IAdditionSubscription[]) {
    state.addFilterList = payload
  }
}
