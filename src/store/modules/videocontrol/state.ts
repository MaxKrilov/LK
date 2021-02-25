import { ILocationOfferInfo } from '@/tbapi'
import {
  IDomainRegistry,
  IEnfortaRegistry
} from '@/interfaces/videocontrol'

export interface IAllowedOffers {
  [BFOfferId: string]: []
}

export interface IDomainUserRegistry {
  [domainId: string]: number
}

export interface IState {
  productType: string
  points: ILocationOfferInfo[]
  isPointsLoaded: boolean
  domainRegistry: IDomainRegistry
  enfortaRegistry: IEnfortaRegistry
  isDomainRegistryLoaded: boolean
  domainUserCount: IDomainUserRegistry
  allowedOffers: IAllowedOffers
  isAllowedOffersLoaded: boolean
  isEnfortaDataLoaded: boolean
  searchCamera: string
}

export const state: IState = {
  productType: '',
  points: [],
  isPointsLoaded: false,
  domainRegistry: {},
  enfortaRegistry: {},
  isDomainRegistryLoaded: false,
  domainUserCount: {},
  allowedOffers: {},
  isAllowedOffersLoaded: false,
  isEnfortaDataLoaded: false,
  searchCamera: ''
}
