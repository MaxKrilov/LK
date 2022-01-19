export interface IRequestData {
  descriptionModal?: string;
  fulladdress: string;
  addressId: string;
  services: string;
  type?: string
  authType?: string
}

export interface IOrderData {
  locationId: string,
  bpi: string,
  marketId: string
  productCode: string
  chars?: any,
  offer?: boolean
  tomsId?: string
}

export interface IDeleteOrderData {
  locationId: string,
  bpi: string,
  productId: string
  title: string
  marketId: string
}
