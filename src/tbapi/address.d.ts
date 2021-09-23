/* eslint-disable camelcase */

export interface IOrganisationInfo {
  postalCode: null | string,
  fio: {
    surName: string,
    name: string,
    lastName: string
  },
  headPosition: null | string,
  dateRegistation: string,
  okved: null | string,
  orgNameFull: string,
  orgname: string,
  kpp: string,
  ogrn: string,
  legalAddress: {
    subject: string,
    city: string,
    street: string,
    house: string,
    korpus: string
  } | null,
  legalAddressText: string,
  type: 'corporation' | 'entrepreneur'
}

export interface IDadataAddressSuggestionsData {
  /** Индекс */
  'postal_code': string,
  /** Страна */
  country: string,
  /** ISO-код страны (двухсимвольный) */
  country_iso_code: string,
  /** Федеральный округ */
  federal_district: string,
  /** Код ФИАС региона */
  region_fias_id: string,
  /** Код КЛАДР региона */
  region_kladr_id: string,
  /** ISO-код региона */
  region_iso_code: string,
  /** Регион с типом */
  region_with_type: string,
  /** Тип региона (сокращенный) */
  region_type: string,
  /** Тип региона */
  region_type_full: string,
  /** Регион */
  region: string,
  /** Код ФИАС района в регионе */
  area_fias_id: string,
  /** Код КЛАДР района в регионе */
  area_kladr_id: string,
  /** Район в регионе с типом */
  area_with_type: string,
  /** Тип района в регионе (сокращенный) */
  area_type: string,
  /** Тип района в регионе */
  area_type_full: string,
  /** Район в регионе */
  area: string,
  /** Код ФИАС города */
  city_fias_id: string,
  /** Код КЛАДР города */
  city_kladr_id: string,
  /** Город с типом */
  city_with_type: string,
  /** Тип города (сокращенный) */
  city_type: string,
  /** Тип города */
  city_type_full: string,
  /** Город */
  city: string,
  /**  */
  city_area: string,
  /** Код ФИАС района города (заполняется, только если район есть в ФИАС) */
  city_district_fias_id: string,
  /** Код КЛАДР района города (не заполняется) */
  city_district_kladr_id: null,
  /** Район города с типом */
  city_district_with_type: string,
  /** Тип района города (сокращенный) */
  city_district_type: string,
  /** Тип района города */
  city_district_type_full: string,
  /** Район города */
  city_district: string,
  /** Код ФИАС нас. пункта */
  settlement_fias_id: string,
  /** Код КЛАДР нас. пункта */
  settlement_kladr_id: string,
  /** Населенный пункт с типом */
  settlement_with_type: string,
  /** Тип населенного пункта (сокращенный) */
  settlement_type: string,
  /** Тип населенного пункта */
  settlement_type_full: string,
  /** Населенный пункт */
  settlement: string,
  /** Код ФИАС улицы */
  street_fias_id: string,
  /** Код КЛАДР улицы */
  street_kladr_id: string,
  /** Улица с типом */
  street_with_type: string,
  /** Тип улицы (сокращенный) */
  street_type: string,
  /** Тип улицы */
  street_type_full: string,
  /** Улица */
  street: string,
  /** Код ФИАС дома */
  house_fias_id: string,
  /** Код КЛАДР дома */
  house_kladr_id: string,
  /** Тип дома (сокращенный) */
  house_type: string,
  /** Тип дома */
  house_type_full: string,
  /** Дом */
  house: string,
  /** Тип корпуса/строения (сокращенный) */
  block_type: string,
  /** Тип корпуса/строения */
  block_type_full: string,
  /** Корпус/строение */
  block: string,
  /** */
  flat_fias_id: null,
  /** Тип квартиры (сокращенный) */
  flat_type: string,
  /** Тип квартиры */
  flat_type_full: string,
  /** Квартира */
  flat: string,
  /** Площадь квартиры */
  flat_area: string,
  /** Рыночная стоимость м² */
  square_meter_price: string,
  /** Рыночная стоимость квартиры */
  flat_price: string,
  /** Абонентский ящик */
  postal_box: string,
  /** Код ФИАС для России */
  fias_id: string,
  /** Иерархический код адреса в ФИАС */
  fias_code: string,
  /** Уровень детализации, до которого адрес найден в ФИАС */
  fias_level: '0' | '1' | '3' | '4' | '5' | '6' | '7' | '8' | '65' | '-1',
  /** Признак актуальности адреса в ФИАС */
  fias_actuality_state: string,
  /** Код КЛАДР */
  kladr_id: string,
  /** Идентификатор объекта в базе GeoNames. Для российских адресов не заполняется. */
  geoname_id: string,
  /** Признак центра района или региона: */
  capital_marker: '0' | '1' | '2' | '3' | '4',
  /** Код ОКАТО */
  okato: string,
  /** Код ОКТМО */
  oktmo: string,
  /** Код ИФНС для физических лиц */
  tax_office: string,
  /** Код ИФНС для организаций */
  tax_office_legal: string,
  /** Часовой пояс */
  timezone: string,
  /** Координаты: широта */
  geo_lat: string,
  /** Координаты: долгота */
  geo_lon: string,
  /** Внутри кольцевой? */
  beltway_hit: string,
  /** Расстояние от кольцевой в километрах */
  beltway_distance: string,
  /** Список ближайших станций метро */
  metro: {
    name: string
    line: string
    distance: string
  }[],
  /** Не заполняется */
  qc_geo: null,
  /** Не заполняется */
  qc_complete: null,
  /** Не заполняется */
  qc_house: null,
  /** Список исторических названий объекта нижнего уровня. */
  history_values: string[],
  /** Не заполняется */
  unparsed_parts: null,
  /** Не заполняется */
  source: null,
  /** Не заполняется */
  qc: null
}

export interface IDadataAddressSuggestions {
  value: string
  unrestricted_value: string
  data: IDadataAddressSuggestionsData
}

export interface IDadataAddress {
  suggestions: IDadataAddressSuggestions[]
}

export interface IAddressUnitByFias {
  addressUnitSubtypeId: string;
  validationDate: string;
  addressUnitSubtypeName: string;
  formattedAddress: string;
  id: string;
  validationStatus: string;
  isFias: string;
  validationResult: string;
  fiasId: string;
  name: string;
  addressUnitChain: AddressUnitChain[];
}

export interface AddressUnitChain {
  id: string;
  formattedAddress: string;
  name: string;
  addressUnitTypeId?: string;
  addressUnitSubtypeId?: string;
  addressUnitSubtypeName?: string;
  abbreviation?: string;
}

export interface IFMSUnit {
  unrestricted_value: string
  value: string
  data: IFMSUnitData
}

export interface IFMSUnitData {
  code: string
  name: string
  region_code: string
  type: string
}
