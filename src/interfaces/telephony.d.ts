export interface ITelephonyRedirectionParent {
  bpi: string
  locationId: string
  marketId: string
}

export interface ITelephonyRedirection {
  id: string
  phoneId: string
  fromPhone: string
  toPhone: string
  type: string
  hoursFrom: string
  hoursTo: string
  period: Record<string, boolean>
  status: string
  redirectionStatus: string
  parent: ITelephonyRedirectionParent
}
