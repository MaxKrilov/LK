/* eslint camelcase: 0 */
export interface DocumentInterface {
  attachmentName: string
  fileName: string
  relatedTo: {
    name: string
    id: string | number
  }
  id: string | number
  signedWithDigitalSignature?: string
  letterOfGuarantee?: string
  verifying?: string
  visibleInSSP?: string
  bucket: string
  filePath: string
  contractNumber?: string
  contractStatus?: 'Готов для клиента' | 'Подписан' | 'Активный' | 'Отменён' | 'Расторгнут' | 'Истёк',
  amount?: string
  modifiedWhen: number
  creationDate: number
  type: {
    name: string
    id: string | number
  }
}

export interface ILocationOfferInfo {
  name: string
  id: string | number
  fulladdress: string
  address: {
    id: string | number
    name: string
  }
  amount: {
    currency: {
      name: string
      currentCode: string
    }
    value: string | number
  }
  city: string
  status: string
  bpi: string | number
  offer: {
    name: string
    id: string | number
  },
  marketId: string
}

export interface IDocumentObject {
  [key: string]: DocumentInterface[]
}

export type typeYesOrNo = 'Да' | 'Нет'

export interface ICustomerOffer {
  availableFrom: string
  availableTo: string
  canBeActivatedInSSP: false
  categoryRelationships: [{
    maxCount: number
    minCount: number
    offeringCategoryId: number
    orderNumber: number
  }]
  code: string
  customerCategory: {
    code: string
    href: string
    id: string
    name: string
    originalName: string
    tomsId: string
  }
  description: string
  feasibilityCheckRequired: boolean
  href: string
  id: string
  isEquipment: boolean
  isRoot: boolean
  market: {
    code: string
    href: string
    id: string
    marketingBrands: [{
      id: string
      name: string
    }]
    name: string
    originalName: string
    tomsId: string
  }
  name: string
  offeringCategories: [{
    code: string
    id: string
    isTop: boolean
    name: string
    orderNumber: string
    originalName: string
    parent: { id: string, code: string }
    reconciliationId: string
    tomsId: string
    visible: boolean
  }]
  originalDescription: string
  originalName: string
  prices: ISLOPricesItem[]
  requiresContract: boolean
  status: string
  suspendable: boolean
  visibleInSSP: boolean
}

export interface ICustomerProductSLO {
  activated: boolean
  availableFrom: string
  availableTo: string
  canBeActivatedInSSP: boolean
  categoryRelationships: [{
    maxCount: number
    minCount: number
    offeringCategoryId: number
    orderNumber: number
  }]
  chars: any
  code: string
  customerCategories: [{
    code: string
    href: string
    id: string
    name: string
    originalName: string
    tomsId: string
  }]
  description: string
  distributionChannels: [{
    code: string
    href: string
    id: string
    name: string
    originalName: string
    tomsId: string
  }]
  feasibilityCheckRequired: boolean
  href: string
  id: string
  isEquipment: boolean
  isRoot: boolean
  marketingBrands: [{
    name: string
    id: string
  }]
  markets: [{
    code: string
    href: string
    id: string
    marketingBrands: {
      name: string
      id: string
    }
    name: string
    originalName: string
    tomsId: string
  }]
  name: string
  offer?: ICustomerOffer
  offeringCategories: [{
    code: string
    id: string
    isTop: boolean
    name: string
    orderNumber: string
    originalName: string
    reconciliationId: string
    tomsId: string
  }]
  offeringRelationships: [{
    childMax: string
    childMin: string
    childProductOffering: {
      availableFrom: string
      availableTo: string
      canBeActivatedInSSP: boolean
      code: string
      customerCategories: [{
        code: string
        href: string
        id: string
        name: string
        originalName: string
        tomsId: string
      }]
      description: string
      distributionChannels: [{
        code: string
        href: string
        id: string
        name: string
        originalName: string
        tomsId: string
      }]
      feasibilityCheckRequired: boolean
      href: string
      id: string
      isEquipment: boolean
      isRoot: boolean
      marketingBrands: [{
        name: string
        id: string
      }]
      markets: [{
        code: string
        href: string
        id: string
        marketingBrands: {
          name: string
          id: string
        }
        name: string
        originalName: string
        tomsId: string
      }]
      name: string
      originalDescription: string
      originalName: string
      prices: [{
        amount: string
        id: string
        productOfferingIds: string[]
        startDate: string
        tax: string
        type: string
      }]
      product: {
        chars: [{
          defaultListValue?: { id: string, name: string }
          id: string
          isMandatory?: boolean
          isModifiable?: boolean
          isMultiple?: boolean
          isReference?: boolean
          isVisible?: boolean
          mappingType?: string
          name: string
          orderNumber?: string
          productId?: string
          tomsId?: string
          tomsOfferId?: string
          tomsProductId?: string
          type?: string
          values?: { id: string, name: string }[]
          visibleInSsp?: boolean
        }]
        code: string
        href: string
        id: string
        name: string
        originalName: string
      }
      requiresContract: boolean
      status: string
      suspendable: boolean
      visibleInSSP: boolean
    }
    defaultBehavior: string
    id: string
    name: string
    orderNumber: string
    originalId: string
    reconciliationId: string
  }]
  orderNumber: number
  originalDescription: string
  originalName: string
  parentId: string
  prices: ISLOPricesItem[]
  product: {
    chars: [{
      defaultListValue?: { id: string, name: string }
      id: string
      isMandatory?: boolean
      isModifiable?: boolean
      isMultiple?: boolean
      isReference?: boolean
      isVisible?: boolean
      mappingType?: string
      name: string
      orderNumber?: string
      productId?: string
      tomsId?: string
      tomsOfferId?: string
      tomsProductId?: string
      type?: string
      values?: { id: string, name: string }[]
      visibleInSsp?: boolean
    }]
    code: string
    href: string
    id: string
    name: string
    originalName: string
  }
  productId: string
  purchasedPrices: IPurchasedPrices
  requiresContract: boolean
  status: string
  suspendable: boolean
  visibleInSSP: boolean
  startDate: string
  endDate: string
}

export interface ICustomerProduct {
  tlo: {
    actualStartDate: string
    billingAccountId: string
    chars: any
    href: string
    id: string
    locationId: string
    name: string
    offer: ICustomerOffer
    pointAmount: string | number
    purchasedPrices: IPurchasedPrices
    status: string
    bundle?: Record<any, any>
  }
  slo: ICustomerProductSLO[]
}

export interface IAddress {
    id?: string | number,
    value?: string
    locationId?: string | number
}
export interface IBillingStatisticResponse {
  costedEventName: string
  bill: string
  prebillingCost: number
  service: string
  duration: string
  productInstance: {
    name: string
    id: string
    instanceId: number
  }
  createdDate: number
  priceEventSpecification: {
    eventTypeId: number
    name: string
  }
  billedCost: number
  calledNumber: string
  customer: {
    name: string
    id: string
    customerReference: string
  }
}

export interface ISLOPricesItem {
  amount: string
  chars: Record<string, string>
  id: string
  productOfferingIds: string[]
  startDate: string
  tax: string
  type: string
}

export interface IPurchasedPrices {
  recurrent: IPriceItem
  recurrentDisacount: IPriceItem
  recurrentTotal: IPriceItem
}

export interface IPriceItem {
  currency: {
    name: string
    currencyCode: string
  }
  value: string
}

export interface IPrice {
  taxFlag?: IPriceItem
  totalPointAmount?: IPriceItem
  oneTimeDiscount?: IPriceItem
  oneTimeTax?: IPriceItem
  oneTimeTotal?: IPriceItem
  recurrentTotal?: IPriceItem
  recurrentTax?: IPriceItem
  oneTime?: IPriceItem
  recurrent?: IPriceItem
}

export interface ISaleOrder {
  validationElements?: [{
    locationId?: string
    typeOfProblem?: string
    validationPriority?: string
    targetOrderItemId?: string
    id?: string
    message?: string
  }]
  salesOrderOwner?: string | number
  operationType?: string[]
  submitDate?: string
  processedWhen?: string
  createdWhen?: string
  locationIds?: string[]
  rules?: [{
    locationId?: string
    targetOrderItemIds?: string[]
    name?: string
    description?: string
    active?: boolean
    id?: string
    productOfferingRuleId?: string
    parentId?: string

  }]
  sequenceNo: string
  price: IPrice
  customerId: string
  name: string
  id: string
  distributionChannel: string
  status: string
  orderItems: [{
    customerProductId: string
    typeOfSelling?: string
    billingAccountId: string
    orderItems: [{
      customerProductId?: string
      typeOfSelling?: string
      billingAccountId?: string
      parentId?: string
      locationId?: string
      name?: string
      action?: string
      id?: string
      prices?: IPrice
      offer?: any
    }]
    parentId: string
    locationId: string
    name: string
    action: string
    id: string
    prices: IPrice
    suggestions?: any[]
    offer: IOffer
    chars: any
  }]
}

export interface IOffer {
  code: string
  id: string
  offeringRelationships: IOfferingRelationship[]
}

export interface IOfferingRelationship {
  childProductOffering?: {
    code: string
    id: string
    offeringRelationships?: IOfferingRelationship[]
  }
  offerings?: [
    {
      code: string
      id: string
    }
  ]

}

export interface IUpdateElement {
  chars: Record<string, string> | Record<string, string>[]
  productId: string
}

export interface IOrderItem {
  action: string
  chars: any
  customerProductId?: string
  id: string
  orderItems: IOrderItem[]
  parentId: string
  offer: IOffer
  prices?: IPrice
}

export interface ISurveyQuestion {
  id: string
  orderNumber: string // number in string
  questionText: string
  questionType: string
  doNotShowInSSP: 'Yes' | 'No' | 'Да' | 'Нет'
  mandatory: string
  possibleAnswers?: any[]
  dependencyOnAnswer?: any[]
  dependencyOnQuestion?: {
    id: string
    name: string
  }
}

export interface IAddressUnit {
  'latitude': string
  'addressUnitSubtypeId': string
  'validationDate': string
  'addressUnitSubtypeName': string
  'formattedAddress': string
  'id': string
  'validationStatus': string
  'isFias': string
  'longitude': string
  'validationResult': string
  'fiasId': string
  'name': string
  'postCode': string
  'addressUnitChain': [
    {
      'id': string
      'formattedAddress': string
      'name': string
      'addressUnitTypeId'?: string
      'addressUnitSubtypeId'?: string
      'addressUnitSubtypeName'?: string
      'abbreviation'?: string
    }
  ]
}

export interface IWifiResourceInfo {
  // eslint-disable-next-line camelcase
  bpi_id: string,
  vlan?: [{
    cityId: string
    name: string
    number: string
    status: string
  }]
}

export interface IWifiStatUser {
  // eslint-disable-next-line camelcase,camelcase
  count_auth: number
  // eslint-disable-next-line camelcase
  date_reg: string
  // eslint-disable-next-line camelcase,camelcase
  last_session: string
  // eslint-disable-next-line camelcase
  mac_address: string
  // eslint-disable-next-line camelcase
  output_bytes: number
  // eslint-disable-next-line camelcase
  user_name: string
}

export type IWifiPro = {
  actualStartDate: string
  billingAccountId: string
  chars: Record<string, string>
  id: string
  locationId: string
  name: string
  offer: ICustomerOffer
  packets: Record<string, {
    actualStartDate: string
    billingAccountId: string
    chars: Record<string, string>
    id: string
    locationId: string
    name: string
    offer: ICustomerOffer
    parentId: string
    purchasedPrices: IPurchasedPrices
    status: string
  }>
  purchasedPrices: IPurchasedPrices
  services: Record<string, {
    actualStartDate: string
    billingAccountId: string
    chars: Record<string, string>
    id: string
    locationId: string
    fullAddress?: string // Данное поле добавляется в ходе преобразования полученных данных
    addressId?: string
    name: string
    offer: ICustomerOffer
    parentId: string
    purchasedPrices: IPurchasedPrices
    status: string,
    marketId: string
  }>
  status: string
}

export interface WifiData {
  hotspot_id: number;
  hotspot_billing_id: string;
  domain: string;
  active_city_id: number;
  vlan: string;
  name: string;
  address: string;
  hotspot_type_id: number;
  longitude: number;
  latitude: number;
  worktime: string;
  owner_type_id: string;
  client_id: string;
  client_city_id: string;
  functional_type: string;
  macs: string;
  status: number;
  billing_client_id: string;
  field_logo: string | File;
  field_index_banner: string | File;
  field_index_banner_href: string;
  field_index_abonent_title: string;
  field_index_guest_title: string;
  field_abonent_redirect_url: string;
  field_abonent_redirect_delay: string;
  field_abonent_global_redirect: number;
  field_abonent_global_redirect_url: string;
  field_guest_redirect_delay: string;
  field_guest_redirect_url: string;
  field_guest_global_redirect: number;
  field_guest_global_redirect_url: string;
  field_theme: string;
  field_language: string;
  field_guest_sms_auth: number;
  field_voucher_auth: number;
  field_guest_sms_auth_only_russia: number;
  field_premium_auth: number;
  field_adfox_flag: number;
  field_index_premium_title: string;
  field_guest_auth: number;
  field_abonent_auth: number;
  field_index_voucher_title: string;
  field_oferta_checkbox: number;
  field_guest_pin: string;
  field_guest_pin_active: number;
  field_additional_offer: number;
  field_additional_offer_text: string;
  field_adfox_puid: string;
  field_esia_auth: number;
  field_guest_auto_login: number;
  field_fan_id_auth: number;
  field_log_auth: number;
  field_offer_main_template: string;
  field_social_networks: string[];
  field_phone_confirm_sms: number;
  field_phone_confirm_callback: number;
  field_custom_voucher_button: string;
  field_custom_premium_button: string;
  field_custom_button: Record<string, string> | null;
  field_custom_body: any;
  field_custom_fullscreen: number;
  field_custom_background_image: string | File;
  field_social_auth_vk: number;
  field_social_auth_ok: number;
  field_social_auth_fb: number;
  field_social_auth_in: number;
  field_social_auth_tw: number;
  field_guest_auth_time: string;
  field_custom_redirect: string;
  field_private_network_ssid: string;
  field_private_network_password: string;
  field_private_network_speed_per_user: string;
  field_public_network_ssid: string;
  field_guest_speed_profile: string;
  field_guest_auth_cache_duration: string;
  field_guest_hs_session_timout: string;
  field_abon_hs_session_timout: string;
  field_logo_real_size: number;
  field_blacklist_phone: string;
  field_blacklist_mac: string;
  field_subscription_is_active: number;
}

export interface IAvailableFunds {
  accountCurrency: string
  availableFundsAmt: string
  paymentScheme: number
}
