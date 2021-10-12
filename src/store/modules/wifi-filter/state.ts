import { ILocationOfferInfo } from '@/tbapi'
import {
  ISubscription,
  IAdditionSubscription,
  IPointVLAN,
  TVlanNumber,
  ISubscriptionInfo
} from '@/interfaces/wifi-filter'

export interface IState {
  locationList: ILocationOfferInfo[]
  isLocationListLoaded: boolean
  vlan: IPointVLAN[]
  isVlanLoaded: boolean
  filterAvailableList: ISubscription[]
  subscriptions: Record<TVlanNumber, ISubscription>
  subscriptionInfo: Record<string, ISubscriptionInfo>
  subscriptionInfoLoad: Record<string, Boolean>
  addFilterList: IAdditionSubscription[]
}

export const state: IState = {
  locationList: [],
  isLocationListLoaded: false,
  isVlanLoaded: false,
  vlan: [],
  subscriptions: {},
  subscriptionInfo: {},
  subscriptionInfoLoad: {},
  filterAvailableList: [],
  addFilterList: []
}
