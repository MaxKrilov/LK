/* eslint-disable camelcase */
import { IPriceItem } from '@/tbapi'

export interface IPointItem {
  fulladdress: string
  bpi: string
  status: string
  amount: string
  addressId: string
}
export interface ITVProduct {
  [key: string]: {
    name: string
    id: string
    status: string
    tvlines: {
      [key: string]: ITVLine
    }
  }
}

export interface ITVLineOfferPrice {
  amount: string
  chars: {
    'Тип подключения к IP-сети': string
  }
}

export interface ITVLine {
  parentId: string
  id: string
  status: string
  locationId: string
  chars: {
    'Тип подключения к IP-сети': string
    'Имя в счете': string
    'Тип TV': string
  }
  purchasedPrices: {
    recurrent: IPriceItem
    recurrentDisacount: IPriceItem
    recurrentTotal: IPriceItem
  }
  offer: {
    id: string
    prices: {
      [key: string]: ITVLineOfferPrice
    }
  }
  stb: {
    [key: string]: ITVSTB
  }
  packets: {
    [key: string]: ITVPacket
  }
}
export interface ITVLineInfo{
  name: string
  price: string
  address: string
  model: string
  mac: string
}
export interface IModuleInfo {
  status: string
  offerId: string
  addressId: string
  fulladdress: string
  locationId: string
  linePrice: string | undefined
  price: string
  tvType: string
  name: string
  id: string
  stb: { id: string; name: string; type: string, price: number; }
  packets: ITVPacketsInModule[]
}
export interface ITVPacketsInModule {
  id: string
  name: string
  price: number
  code: string
}
export interface ITVPacket{
  parentId: string
  name: string
  id: string
  locationId: string
  offer: {
    code: string
  }
  purchasedPrices: {
    recurrent: IPriceItem
    recurrentDisacount: IPriceItem
    recurrentTotal: IPriceItem
  }
  status: string

}
export interface ITVSTB{
  parentId: string
  name: string
  locationId: string
  id: string
  status: string
  purchasedPrices: {
    recurrent: IPriceItem
    recurrentDisacount: IPriceItem
    recurrentTotal: IPriceItem
  }
  chars: {
    'Модель': string,
    'Способ передачи оборудования': string,
    'Имя оборудования': string
  }
}
export interface ITVPacketRequest{
  id:number,
  title: string
  price: string
  description: string
  count: string
  icon_file: string
  nc_id: string
  background: string
  background2: string
  background_mobile: string
  productCode: string
  created_at: string
  updated_at: string
}
export interface ITVPacketPage{
  img?: any;
  id:number,
  title: string
  price: string
  description: string
  count: string
  icon: string
  ncId: string
  background: string
  background2: string
  background_mobile: string
  productCode: string
  created: string
  updated: string
}
export interface ITVChannel{
  button: string
  channel_id: string
  created_at: string
  description: string
  icon_file: string
  id: string
  lang: string
  pack_id: string
  quality: string
  title: string
  updated_at: string
}
export interface ITVPacketInfo{
  packInfo: ITVPacketPage
  channels: ITVChannel[]
}
export interface ITVPacketInfoError{
  id: string,
  error: string
}
export interface ITVPacketsError{
  error: string
}