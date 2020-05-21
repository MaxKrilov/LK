
export interface IBlacklistPhone {
  id: string
  phoneId: string
  phoneNumber: string
  blockedPhones: string[]
  tlo: {
    bpi: string | undefined
    locationId: string | undefined
  }
}
export interface IPointItem {
  id: string
  fulladdress: string
  bpi: string
  offerName: string
}
export interface IPhone {
  id: string
  phone: string
}
export interface IPlugRedirection {
  phoneId: string
  chars: Record<string, string>
}
export interface IRedirectionList {
  id: string
  phoneId: string
  from: string
  to: string
  status: string
  period: string
  tlo: {
    bpi: string | undefined
    locationId: string | undefined
  }
}
