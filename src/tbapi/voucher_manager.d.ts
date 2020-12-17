/* eslint-disable camelcase */
export interface IVoucherManager {
  status: string;
  result: Result;
}

export interface Result {
  point_id: number;
  client_id: number;
  city_id: number;
  vlan: string;
  login_prefix: string;
  created_at: Date;
  updated_at: Date;
  client: Client;
  city: City;
  managers: Manager[];
  persons: any[];
}

export interface City {
  city_id: number;
  city_name_ru: string;
  city_name_en: string;
  city_timezone_offset: number;
  billing_domain: string;
}

export interface Client {
  client_id: number;
  taxpayer_id: number;
  zip_code: null;
  legal_name: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export interface Manager {
  manager_id: number;
  point_id: number;
  full_name: string;
  authorized_at: Date;
  created_at: Date;
  removed_at: Date | null | string;
  updated_at: Date;
}

export interface ManagerResult {
  status: string,
  'result': ResultManagerResult
}

export interface ResultManagerResult {
  'full_name': string,
  'point_id': number,
  'created_at': Date,
  'updated_at': Date,
  'manager_id': number,
  'authorized_at': Date,
  'removed_at': Date,
  'point': ResultManagerPoint,
  'persons': []
}

export interface ResultManagerPoint {
  'point_id': number,
  'client_id': number,
  'city_id': number,
  'vlan': string,
  'login_prefix': string,
  'created_at': Date,
  'updated_at': Date
}
