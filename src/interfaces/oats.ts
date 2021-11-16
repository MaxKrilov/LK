import { IOffer, IPrice as IPurchasedPrice } from '@/tbapi'

interface IChars extends Record<string, any> {}

export interface IOATSDomain {
  billingAccountId: string
  purchasedPrices: IPurchasedPrice
  locationId: string
  name: string
  id: string
  chars: IChars
  status: string
  actualStartDate: Date
  cloudPhones: Record<string, ICloudPhone>
  services: IOATSService[],
  offer?: IOATSDomainOffer,
  searchAddress?: string
}

export interface IOATSDomainOffer {
  code:string,
  tomsId: string
}

export interface ICloudPhone {
  billingAccountId: string
  purchasedPrices: IPurchasedPrice
  locationId: string
  name: string
  id: string
  chars: IChars
  status: string
  actualStartDate: Date
  services: ICloudPhoneService[]
  offer?: IOffer
}

export interface ICloudPhoneService {
  billingAccountId: string
  purchasedPrices: IPurchasedPrice
  locationId: string
  name: string
  id: string
  chars: IChars
  status: string
  actualStartDate: Date
  offer?: IOffer
}

export interface IOATSService {
  purchasedPrices: IPurchasedPrice
  parentId: string
  locationId: string
  name: string
  id: string
  chars: IChars
  status: string
  actualStartDate: Date
}
