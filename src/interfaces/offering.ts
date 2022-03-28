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
  offeringRelationships: IOfferingRelationship[]
  offer?: IOffer
  id?: string
  isRoot?: boolean
  purchasedPrices?: IPrice
  chars?: Record<string, any>
}

export interface IChildProductOffering {
    availableFrom: string
    availableTo: string
    canBeActivatedInSSP: boolean
    code: string
    prices: any
    product: any

    customerCategories: [{
      code: string
      href: string
      id: string
      name: string
      originalName: string
      tomsId: string
    }]
}
export interface IOfferingRelationship {
  id: string // number "2721"
  name: string
  childMax: string // number "999"
  childMin: string // number "1"
  orderNumber: NumberAsString
  originalId: string
  categoryId?: number
  childProductOffering: IChildProductOffering
  defaultBehavior?: string
  reconciliationId?: string
  offerings?: IOffer[]
}
