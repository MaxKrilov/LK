import { IOffer } from '@/interfaces/videocontrol'
import { HIDDEN_ANALYTIC_CODES } from '@/constants/videocontrol'

export const isVisibleAnalytic = (item: IOffer) =>
  !HIDDEN_ANALYTIC_CODES.includes(item.code)
