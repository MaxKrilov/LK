export interface IRequestData {
  type: string;
  descriptionModal?: string;
  fulladdress: string;
  addressId: string;
  services: string;
  type?: string
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
