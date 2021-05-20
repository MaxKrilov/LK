import { IDeleteOrderData } from '@/constants/er-plug'

export interface IDdosItem {
    date: string
    fulladdress: string
    price: string
    bpi: string
    productId: string
    link: string
    deleteData: IDeleteOrderData,
    isDisconnected: boolean
}
export interface IPointItem {
    id: string
    fulladdress: string
    bpi: string
    marketId: string
    offerName: string
  }

export interface IDdosPrice {
    price: string
    speed: string
  }
