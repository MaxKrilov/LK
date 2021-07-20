import { IOffer } from '@/interfaces/videocontrol'
// import { VISIBLE_ANALYTICS } from '@/constants/videocontrol'

// export const isVisibleAnalytic = (item: IOffer) => VISIBLE_ANALYTICS.includes(item.code)
export const isVisibleAnalytic = (item: IOffer) => !!item
