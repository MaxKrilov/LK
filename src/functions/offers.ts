import { ISLOPricesItem } from '@/tbapi'
import { ACTIVE_RU, ACTIVE_EN, RELEASED, MONTHLY_FEE_TYPE } from '@/constants/orders'
import { IOffer } from '@/interfaces/videocontrol'

export const isMonthlyFeePrice = (el: ISLOPricesItem) => el.type === MONTHLY_FEE_TYPE

export const isActiveOffering = (item: IOffer) =>
  [ACTIVE_RU, ACTIVE_EN, RELEASED].includes(item.status)
