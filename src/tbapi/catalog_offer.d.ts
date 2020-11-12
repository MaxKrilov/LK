export interface ICatalogOffer {
  isRoot: boolean;
  availableFrom: Date;
  originalName: string;
  id: string;
  requiresContract: boolean;
  availableTo: Date;
  name: string;
  feasibilityCheckRequired: boolean;
  status: string;
  code: string;
  description: string;
  offeringCategories: OfferingCategory[];
  offeringRelationships: OfferingRelationship[];
  suspendable: boolean;
  relocationAllowed: boolean;
  prices: any[];
  originalDescription: string;
  product: Product;
  canBeActivatedInSSP: boolean;
  categoryRelationships: CategoryRelationship[];
  visibleInSSP: boolean;
  productTypes: string[];
  isEquipment: boolean;
  href: string;
}

export interface CategoryRelationship {
  offeringCategoryId: number;
  orderNumber: number;
  minCount: number;
  maxCount: number;
}

export interface OfferingCategory {
  code: string;
  orderNumber: string;
  originalName: string;
  isTop: boolean;
  name: string;
  reconciliationId: string;
  id: string;
  tomsId: string;
}

export interface OfferingRelationship {
  childMax: string;
  orderNumber: string;
  name: string;
  id: string;
  originalId: string;
  offerings?: Offering[];
  categoryId?: number;
  childMin: string;
  childProductOffering?: Offering;
  defaultBehavior?: string;
  reconciliationId?: string;
}

export interface Offering {
  orderNumber: number;
  isRoot: boolean;
  availableFrom: Date;
  originalName: string;
  id: string;
  requiresContract: boolean;
  availableTo: Date;
  name: string;
  feasibilityCheckRequired: boolean;
  status: string;
  code: string;
  description: string;
  offeringCategories: OfferingCategory[];
  suspendable: boolean;
  prices: Price[];
  originalDescription: string;
  product: Product;
  canBeActivatedInSSP: boolean;
  categoryRelationships: CategoryRelationship[];
  visibleInSSP: boolean;
  isEquipment: boolean;
  href: string;
  markets?: Product[];
  distributionChannels?: Product[];
  customerCategories?: Product[];
  marketingBrands?: MarketingBrand[];
}

export interface Product {
  code: string;
  originalName: string;
  name: string;
  id: string;
  chars?: Char[];
  href: string;
  tomsId?: string;
  marketingBrands?: MarketingBrand[];
}

export interface Char {
  orderNumber?: string;
  type?: Type;
  tomsProductId?: string;
  isModifiable?: boolean;
  id: string;
  tomsOfferId?: string;
  tomsId?: string;
  isMandatory?: boolean;
  productId?: string;
  isMultiple?: boolean;
  isVisible?: boolean;
  mappingType?: MappingType;
  name: string;
  visibleInSsp?: boolean;
  defaultValue?: string;
  isReference?: boolean;
  tooltip?: string;
  editableInSsp?: string;
}

export enum MappingType {
  Date = 'DATE',
  Memo = 'MEMO',
  Number = 'NUMBER',
  Object = 'OBJECT',
  Text = 'TEXT',
}

export enum Type {
  String = 'String',
}

export interface MarketingBrand {
  name: Name;
  id: string;
}

export enum Name {
  Tomtel = 'TOMTEL',
  Бикс = 'БИКС+',
  ВестКолл = 'ВестКолл',
  ДеловаяСетьИркутск = 'Деловая сеть - Иркутск',
  ДомRuБизнес = 'Дом.ru Бизнес',
  Новотелеком = 'Новотелеком',
  СтрелаТелеком = 'Стрела Телеком',
  Энфорта = 'Энфорта',
  ЭрТелекомХолдинг = 'Эр-Телеком Холдинг',
}

export interface Price {
  amount: string;
  tax: string;
  id: string;
  startDate: Date;
  productOfferingIds: string[];
  type: string;
}
