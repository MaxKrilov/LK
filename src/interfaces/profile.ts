type TIPAddressString = string // '192.168.1.1', '0.0.0.0'

export interface IForpostAccount {
  ID: number
  Name: string
  IsActive: 1
  NetworkIP: TIPAddressString
  NetworkMask: TIPAddressString
  MaxCameraCount: number
  MaxLoginCount: number
  MaxCameraArchivalTranslationCount: number
  MaxCameraOnlineTranslationCount: number
  MaxCameraUserArchivalTranslationCount: number
  MaxCameraUserOnlineTranslationCount: number
  MaxSMSPerMonth: number
  Quota: number
  ContractNumber: string // '840-001'
  CreationDate: string // '13.06.2018 13:34:48'
  CreationAdminID: number
  ManagementAccountID: number
  IsLoginLocked: number
  LoginLockReason: string
  IsNotificationEnabled: string
  CityID: number
}

export interface IForpostUser {
  Login: string
  ID: number
  AccountID: number
  CanChangeOwnInfo: number
  ChangePasswordAtNextLogin: number
  ExternalID: null
  IsActive: number // 1
  IsReadOnly: number // 1
}

export interface IOatsUser {
  login: string
  name: string
  // eslint-disable-next-line camelcase
  sso_id: string
  domain: string // поле добавляется вручную
}
