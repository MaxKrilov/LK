import { IPointItem } from '@/interfaces/point'
import { IState } from './state'
import { IPointVLAN } from '@/interfaces/wifi-filter'

const filterVlanByBPI = (bpiId: string) =>
  (el: IPointVLAN): boolean =>
    el.bpiId === bpiId

export default {
  pointList: (state: IState): IPointItem[] => {
    return state.locationList.map(
      ({ id, bpi, fulladdress, offer, marketId }) =>
        ({ id, bpi, fulladdress, offerName: offer.name, marketId })
    )
  },
  pointBpiList: (state: IState): (string | number)[] => {
    return state.locationList.map(({ bpi }) => bpi)
  },
  vlanByBPI: (state: IState) =>
    (bpi:string): IPointVLAN[] =>
      state.vlan.filter(filterVlanByBPI(bpi)),
  firstVlan: (state: IState) => state.vlan?.[0]?.vlan?.[0]?.cityId,
  contentFilter: (state: IState) => state.contentFilter
}
