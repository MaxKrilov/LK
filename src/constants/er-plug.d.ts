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
  productCode: string
  chars?: any,
  offer?: boolean
}
export interface IDeleteOrderData {
  locationId: string,
  bpi: string,
  productId: string
  title: string
}
