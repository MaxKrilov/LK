import { IOffer } from './videocontrol'
import { IPrice } from '@/tbapi'
import { NumberAsString } from '@/types'

export type ProductOfferingStatus = 'Активный' | 'Active' | 'Снято с производства'

export interface IProductOffering {
  /*
    Приходит в массиве с эндпоинтов
    /catalog/management/product-offering
    /catalog/management/allowed-offers
  */
  name: string
  originalName: string
  code: string // "VIDCROOT"
  status: ProductOfferingStatus
  offeringRelationships: IOfferingRelationship[] | []

  offer?: IOffer
  isRoot?: boolean
  purchasedPrices?: IPrice
}

export interface IOfferingRelationship {
  id: string // number "2721"
  name: string
  // childMax: string // number "999"
  // childMin: string // number "1"
  orderNumber: NumberAsString
  originalId: string

  categoryId?: number
  childProductOffering?: {}
  defaultBehavior?: string
  reconciliationId?: string
  offerings?: IOffer[]
}
