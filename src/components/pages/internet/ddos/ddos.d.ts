import { IDeleteOrderData } from '@/constants/er-plug'

export interface IDdosItem {
    date: string
    fulladdress: string
    price: string
    bpi: string
    deleteData: IDeleteOrderData,
    isDisconnected: boolean
}
export interface IPointItem {
    id: string
    fulladdress: string
    bpi: string
    offerName: string
  }

export interface IDdosPrice {
    price: string
    speed: string
  }
