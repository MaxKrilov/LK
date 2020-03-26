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
    pointAmount: string
    billingAccountId: string
    purchasedPrices: {
      recurrentTotal: {
        currency: { name: string, currencyCode: string },
        value: string
      }
      recurrentDiscount: {
        currency: { name: string, currencyCode: string },
        value: string
      }
      recurrent: {
        currency: { name: string, currencyCode: string },
        value: string
      }
    }
    locationId: string
    name: string
    id: string,
    chars: {
      ['Метод назначения IP-адреса']?: string
      ['Выделенная IP-адресация']?: typeYesOrNo
      ['Имя в счете']?: string
      ['Тип авторизации']?: string
      ['Возможность сделать прямой запрет-разрешение']?: typeYesOrNo
      ['Скорость доступа, до (Мбит/с)']?: string
      ['Идентификатор сервиса']?: string
      ['Тип IPv4 адреса']?: string
      ['Проверка технической возможности (ТЭО)']?: string
    }
    status: string
    offer: {
      orderNumber: number
      code: string
      isRoot: boolean
      description: string
      availableFrom: string
      originalName: string
      suspenable: boolean
      customerCategory: {
        originalName: string
        code: string
        name: string
        id: string
        tomsId: string
        href: string
      }
      id: string
      originalDescription: string
      requiresContract: boolean
      availableTo: string
      market: {
        code: string
        marketingBrands: {
          [index: number]: { name: string, id: string }
        }
        originalName: string
        name: string
        id: string
        tomsId: string
        href: string
      }
      canBeActivatedInSSP: boolean
      name: string
      feasibilityCheckRequired: boolean
      visibleInSSP: boolean
      status: string
      maxCount: any
      isEquipment: boolean
      href: string
    }
    actualStartDate: string
    href: string
  }
  slo: [
    {
      childMax: string
      orderNumber: string
      childProductOffering: {
        code: string
        isRoot: boolean
        availableFrom: string
        originalName: string
        suspendable: boolean
        id: string
        prices: [
          {
            amount: string
            tax: string
            id: string
            startDate: string
            chars: Record<string, string>,
            productOfferingIds: Record<number, string>
          }
        ]
        product: {
          code: string
          originalName: string
          name: string
          id: string
          chars: {
            [index: number]: {
              orderNumber?: string
              type?: string
              tomsProductId?: string
              isModifiable?: boolean
              id: string
              tomsId?: string
              tomsOfferId?: string
              isMandatory?: boolean
              productId?: string
              isMultiple?: boolean
              isVisible?: boolean
              mappingType?: string
              name: string
              visibleInSsp?: boolean
              defaultListValue?: {
                [index: number]: { id: string, name: string }
              }
              values?: {
                [index: number]: { id: string, name: string }
              }
              isReference?: boolean
            }
          }
          href: string
        }
        requiresContract: boolean
        availableTo: string
        canBeActivatedInSSP: boolean
        name: string
        feasibilityCheckRequired: boolean
        visibleInSSP: boolean
        status: string
        isEquipment: boolean
        href: string
      }
      defaultBehavior: string
      name: string
      reconciliationId: string
      id: string
      originalId: string
      childMin: string
      activated: boolean
      purchasedPrices: string | {
        recurrentTotal: {
          currency: { name: string, currencyCode: string },
          value: string
        }
        recurrentDiscount: {
          currency: { name: string, currencyCode: string },
          value: string
        }
        recurrent: {
          currency: { name: string, currencyCode: string },
          value: string
        }
      }
    }
  ]
}
