import { ILocationOfferInfo } from '@/tbapi'
import { IDomainRegistry } from '@/interfaces/videocontrol'

export interface IAllowedOffers {
  [BFOfferId: string]: []
}

export interface IDomainUserRegistry {
  [domainId: string]: number
}

export interface IState {
  points: ILocationOfferInfo[]
  isPointsLoaded: boolean
  domainRegistry: IDomainRegistry
  isDomainRegistryLoaded: boolean
  domainUserCount: IDomainUserRegistry
  allowedOffers: IAllowedOffers
  isAllowedOffersLoaded: boolean
}

export const state: IState = {
  points: [],
  isPointsLoaded: false,
  domainRegistry: {},
  isDomainRegistryLoaded: false,
  domainUserCount: {},
  allowedOffers: {},
  isAllowedOffersLoaded: false
}
