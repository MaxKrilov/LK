/* eslint-disable camelcase */
// номер VLAN в таком формате "3699.3698"
// Type Vlan Number == TVlanNumber
import { NumberAsString } from '@/types'

export type TVlanNumber = string

export interface IVlan {
  cityId: string
  name: string
  number: TVlanNumber
  status: string
}

export interface ISimpleSubscription {
  subscription_id: string // "1202"
  subscription_name: string // "Азартные игры"
}

export interface ISubscription extends ISimpleSubscription {
  active_from: string // "01.01.0001"
  active_to: string // "01.01.3001"
}

export interface ISubscriptionInfo extends ISimpleSubscription {
  description: string
  subscription_type_id: string // FILTER_ALLOW_TYPE || FILTER_BLOCK_TYPE
  subscriptions: {
    subscription: [{
      is_active: string
      subscription_id: string
      subscription_name: string
    }]
  }
  url_list?: {
    url: IURL[]
  }
}

export interface IURL {
  url_id: string
  value: string // 'http://example.com'
}

export interface IAddendum {
  addendum_id: string
  cost: string
  service_group_id: string
  is_service_activated: number
  pp_address: string
  srv_active_to: string // "01-01-3001"
  terminal_resource: ITerminalResource
}

export interface ITerminalResource {
  terminal_resource_id: string
  login_name: string
  row?: (ISimpleSubscription & { is_addit_cf: string, onoff: string })[]
}

export interface IAdditionSubscription {
  category_name: string
  items: ISimpleSubscription[]
  row?: any
}

export interface IVLANItem {
  cityId: NumberAsString
  name: string
  number: string
  status: string
}

export interface IPointVLAN {
  bpiId: string
  vlan: IVLANItem[]
}
