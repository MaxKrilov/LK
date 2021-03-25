import { IProductOffering } from './offering'
import { IPrice as IPurchasedPrice, ISLOPricesItem } from '@/tbapi'

export type TBaseFunctionalityId = string
export type TDomainServiceId = string

export interface IOrderChar extends Record<string, string> {}

export interface IOffer {
  id: string // number "3295"
  code: string // "VIDCDOMAIN"
  availableFrom: string // datetime "2001-01-01T00:00:00+03:00"
  status: string // "Активный"
  isEquipment: boolean
  visibleInSSP: boolean
  prices?: ISLOPricesItem[]
  name?: string
}

export interface IDomain {
  id: string
  name: string
  locationId: string
  status: string // 'Active'
  offer: IOffer
  actualStartDate: string // datetime "2020-04-08T10:12:21+03:00"
  billingAccountId: string // "9156925760213408499"
  services?: Record<TDomainServiceId, IDomainService>
  videocontrols: Record<string, IVideocontrol>
}

export interface IDomainService {
  id: TDomainServiceId
  offer: IOffer
  chars: IOrderChar
  purchasedPrices: IPurchasedPrice
  status: string
}

export interface IDomainRegistry {
  [key: string]: IDomain
}

export interface IVideocontrol {
  id: string
  bf: IBaseFunctionalityRegistry
  status: string
  cameras: ICameraRegistry
  offer: IOffer
  locationId: string

  purchasedPrices?: Record<string, IPurchasedPrice>
}

export interface IVideocontrolRegistry {
  [key: string]: IVideocontrol
}

export interface IMarket {
  id: string
}

export interface IBaseFunctionality {
  id: TBaseFunctionalityId
  offer: IOffer
  market: IMarket
  services?: IProductOffering[]
  status: string
}

export interface IBaseFunctionalityRegistry
  extends Record<TBaseFunctionalityId, IBaseFunctionality> {}

export interface ICameraRegistry
  extends Record<string, ICamera> {}

export interface ICamera {
  id: string
  parentId: TBaseFunctionalityId
  locationId: string
  name: string
  chars: IOrderChar
  purchasedPrices: Record<string, any>

  // кастомное поле, добавляеся отдельно
  videocontrolId?: string
}

/* Enforta aka iVideon */
export interface IEnfortaRegistry {
  name?: string
  videocontrols?: Record<string, IEnfortaVideocontrol>
}

export interface IEnfortaVideocontrol {
  id: string
  chars: IOrderChar
  locationId: string
  cameras: Record<string, IEnfortaCamera>
  offer?: IOffer
}

export interface IEnfortaCamera extends ICamera {
  pakets: Record<string, IEnfortaPaket>
  services: Record<string, IEnfortaService>
  offer: IOffer
  actualStartDate: Date
  status: IEnfortaPaketStatus
}

export interface IEnfortaService {
  id: string
  name: string
  parentId: string
  locationId: string
  purchasedPrices: IPurchasedPrice
  status: IEnfortaPaketStatus
  offer: IOffer
  actualStartDate: Date
  chars: IOrderChar
}

export interface IEnfortaPaket {
  id: string
  name: string
  billingAccountId: string
  parentId: string
  locationId: string
  purchasedPrices: IPurchasedPrice
  status: IEnfortaPaketStatus
  offer: IOffer
  actualStartDate: Date
  chars: IOrderChar
  // market: ?
}

export enum IEnfortaPaketStatus {
  Active = 'Active',
  Completed = 'Completed'
}
