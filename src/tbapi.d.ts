export interface DocumentInterface {
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
  modifiedWhen: string | number
  creationDate: string | number
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
  ammount: {
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
  }
}

export interface IDocumentObject {
  [key: string]: DocumentInterface[]
}

export type typeYesOrNo = 'Да' | 'Нет'

export interface ICustomerProduct {
  tlo: {
    actualStartDate: string
    billingAccountId: string
    chars: any
    href: string
    id: string
    locationId: string
    name: string
    offer: {
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
      prices: [{
        amount: string
        chars: Record<string, string>
        id: string
        productOfferingIds: string[]
        startDate: string
        tax: string
        type: string
      }]
      requiresContract: boolean
      status: string
      suspendable: boolean
      visibleInSSP: boolean
    }
    pointAmount: string | number
    purchasedPrices: {
      recurrent: IPriceItem
      recurrentDisacount: IPriceItem
      recurrentTotal: IPriceItem
    }
    status: string
  }
  slo: [{
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
    prices: [{
      amount: string
      chars: Record<string, string>
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
    productId: string
    purchasedPrices: {
      recurrent: IPriceItem
      recurrentDisacount: IPriceItem
      recurrentTotal: IPriceItem
    }
    requiresContract: boolean
    status: string
    suspendable: boolean
    visibleInSSP: boolean
  }]
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
    offer: any
    chars: any
  }]
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
