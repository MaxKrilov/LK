import { IState } from './state'
import { ILocationOfferInfo } from '@/tbapi'
import {
  IBaseFunctionality,
  ICamera,
  IDomain,
  IEnfortaVideocontrol,
  IOffer,
  IVideocontrol
} from '@/interfaces/videocontrol'
import {
  // ANALYTIC_CATEGORY_ID,
  ANALYTIC_NAME,
  BF_CATEGORY_ID,
  BF_CATEGORY_NAME,
  BF_CATEGORY_NAME_2,
  VIDEOCONTROL_OFFER_NAME
} from '@/constants/videocontrol'
import { IOfferingRelationship } from '@/interfaces/offering'

const isVCPoint = (item: ILocationOfferInfo) =>
  item.offer.name === VIDEOCONTROL_OFFER_NAME

const isActiveOffering = (item: IOffer) =>
  ['Активный', 'Active'].includes(item.status)

// const isBFAnalyticByCategoryId = (item: IOfferingRelationship) =>
//   item.categoryId === ANALYTIC_CATEGORY_ID

const isBFAnalyticByName = (item: IOfferingRelationship) =>
  item.name === ANALYTIC_NAME

const isBFAnalytic = isBFAnalyticByName

const isBFAddon = (item: IOfferingRelationship) =>
  item.categoryId === BF_CATEGORY_ID || item.name === BF_CATEGORY_NAME || item.name === BF_CATEGORY_NAME_2

export const getters = {
  BPIList (state: IState) {
    return state.points.map(el => el.bpi)
  },
  pointByBPI (state: IState) {
    return (pointBPI: string) => state.points.filter(
      (point: ILocationOfferInfo) => point.bpi === pointBPI
    )[0] || {}
  },
  pointById (state: IState) {
    return (pointId: string) => state.points.find(
      (point: ILocationOfferInfo) => point.id === pointId
    ) || {}
  },
  videocontrolPoints (state: IState) {
    return state.points.filter(isVCPoint)
  },
  domainByKey (state: IState) {
    return (key: string) => state.domainRegistry?.[key]
  },
  domainList (state: IState): IDomain[] {
    return Object.values(state.domainRegistry)
  },
  videocontrolRegistry (state: IState) {
    return Object.values(state.domainRegistry)
      .reduce((result, domain: IDomain) => {
        result = { ...result, ...domain.videocontrols }
        return result
      }, {})
  },
  domainUserCount (state: IState) {
    return (domainId: string) => state.domainRegistry[domainId]
  },
  cameraById (state: IState, getters: any) {
    return (cameraId: string) => {
      let camera = null
      getters.domainList.forEach((domain: IDomain) => {
        Object.values(domain.videocontrols).forEach((vc: IVideocontrol) => {
          if (cameraId in vc.cameras) {
            camera = vc.cameras[cameraId]
            camera.videocontrolId = vc.id
          }
        })
      })

      return camera
    }
  },
  bfById (state: IState, getters: any) {
    /* bf - базовая функциональность */
    return (id: string) => {
      let bf = null
      getters.domainList.forEach((domain: IDomain) => {
        Object.values(domain.videocontrols).forEach((vc: IVideocontrol) => {
          if (id in vc.bf) {
            bf = vc.bf[id]
          }
        })
      })

      return bf
    }
  },
  allVideocontrolList (state: IState, getters: any): IVideocontrol[] {
    return getters.domainList
      .reduce(
        (result: IVideocontrol[], el: IDomain): IVideocontrol[] => {
          return [
            ...result,
            ...Object.values(el.videocontrols)
          ]
        },
        []
      )
  },
  allBaseFunctionality (state: IState, getters: any) {
    return getters.allVideocontrolList
      .reduce(
        (result: IBaseFunctionality[], el: IVideocontrol): IBaseFunctionality[] => {
          return [
            ...result,
            ...Object.values(el.bf)
          ]
        },
        []
      )
  },
  allCameraList (state: IState, getters: any) {
    return getters.allVideocontrolList
      .reduce(
        (result: ICamera[], el: IVideocontrol): ICamera[] => {
          return [
            ...result,
            ...Object.values(el.cameras)
          ]
        },
        []
      )
  },
  allowedOfferByBFOId (state: IState) {
    return (BFOfferId: string) => state.allowedOffers[BFOfferId]
  },
  availableAnalyticListByBFOId (state: IState, getters: any) {
    return (BFOfferId: string) => {
      return getters.allowedOfferByBFOId(BFOfferId)?.[0]
        ?.offeringRelationships
        ?.find(isBFAnalytic)
        ?.offerings
        ?.filter(isActiveOffering)
    }
  },
  availableServiceListByBFOId (state: IState, getters: any) {
    return (BFOfferId: string) => {
      return getters.allowedOfferByBFOId(BFOfferId)?.[0]
        ?.offeringRelationships
        ?.filter(isBFAddon)
        ?.reduce((acc: [], el: any) => {
          return [ ...acc, ...el.offerings ]
        }, [])
        ?.filter(isActiveOffering)
    }
  },
  uniqPointList (state: IState) {
    function isUniquePoint (
      el: ILocationOfferInfo,
      idx: number,
      self: ILocationOfferInfo[]
    ) {
      return self.map(el => el.id).indexOf(el.id) === idx
    }

    return state.points.filter(isUniquePoint)
  },
  enfortaVideocontrolList (state: IState): IEnfortaVideocontrol[] {
    return Object.values(state.enfortaRegistry?.videocontrols || {})
  },
  enfortaCameraRegistry (state: IState, getters: any) {
    return getters.enfortaVideocontrolList.reduce((acc: {}, videocontrol: any) => {
      return { ...acc, ...videocontrol.cameras }
    }, {})
  }
}
