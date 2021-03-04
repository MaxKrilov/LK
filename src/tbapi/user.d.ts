export interface IClientInfo {
  customerLocations: CustomerLocation[];
  legalAddress: LegalAddress;
  legalName: string;
  customerReference: string;
  id: string;
  customerCategory: CustomerCategory;
  accountNumber: string;
  customerSince: Date;
  primaryContact: LegalAddress;
  name: string;
  contactMethods: IPaymentBillContactMethod[];
  contacts: Contact[];
  status: string;
  massiveOutage: string;
  accountManager: AccountManager;
  fullLegalAddress: string;
  creditRating: string;
  ogrn: string;
  director: string;
  phoneNumber: string;
  extendedMap: { [key: string]: IPaymentBillExtendedMap };
  ownership: LegalAddress;
  industries: LegalAddress[];
  okved: LegalAddress[];
  href: string;
}

export interface AccountManager {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  mobilePhone: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface IPaymentBillContactMethod {
  name: string;
  id: string;
  '@type': string;
}

export interface Contact {
  primaryEmailId?: string;
  jobTitle?: string;
  roles: Role[];
  preferredContactMethodId: string;
  firstName: string;
  extendedMap: { [key: string]: ContactExtendedMap };
  name: string;
  id: string;
  status: string;
  contactMethods: ContactContactMethod[];
  lastName?: string;
  gender?: string;
}

export interface ContactContactMethod {
  contactMethodType: LegalAddress;
  extendedMap: { [key: string]: ContactMethodExtendedMap };
  name: string;
  id: string;
  value: string;
  '@type': string;
  contactHours?: string;
}

export interface LegalAddress {
  name: string;
  id: string;
}

export interface ContactMethodExtendedMap {
  attributeType: number;
  attributeName: string;
  singleValue: any[] | PurpleSingleValue;
}

export interface PurpleSingleValue {
  attributeValue: string;
}

export interface ContactExtendedMap {
  attributeType: number;
  attributeName: string;
  singleValue: any[] | ExtendedMapSingleValueClass;
}

export interface ExtendedMapSingleValueClass {
  attributeValue: string;
  attributeValueName?: string;
}

export interface Role {
  extendedMap: { [key: string]: RoleExtendedMap };
  name: string;
  id: string;
  role: LegalAddress;
  contact: LegalAddress;
  contactFor: LegalAddress;
}

export interface RoleExtendedMap {
  attributeType: number;
  attributeName: string;
  singleValue: ExtendedMapSingleValueClass;
}

export interface CustomerCategory {
  name: string;
  description: string;
  id: string;
}

export interface CustomerLocation {
  address: LegalAddress;
  extendedMap: { [key: string]: ContactExtendedMap };
  name: string;
  fullAddress: string;
  id: string;
  parentId: string;
}

export interface IPaymentBillExtendedMap {
  attributeType: number;
  attributeName: string;
  singleValue?: ExtendedMapSingleValueClass;
  multipleValues?: MultipleValue[];
}

export interface MultipleValue {
  attributeValue: string;
  attributeValueName: string;
}
