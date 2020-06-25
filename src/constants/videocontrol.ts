
const MARKET_ID = '68'
const CUSTOMER_CATEGORY_ID = '146'
const DISTRIBUTION_CHANNEL_ID = '144'
const PRODUCT_TYPE = 'Форпост'
const VIDEOCONTROL_OFFER_NAME = 'Видеоконтроль'

// для поиска в данных в /catalog/management/allowed-offers
const ANALYTIC_CATEGORY_ID = 228
const ANALYTIC_NAME = 'Базовая функциональность видеоконтроля to Сервисы видеоаналитики'
const BF_CATEGORY_ID = 187
const BF_CATEGORY_NAME = 'Базовая функциональность видеоконтроля to Дополнительные услуги Видеоконтроль'

const VIDEOARCHIVE_DAY_COUNT = 'Количество дней архива'

const CODES = {
  CAMERA: 'CCTVCAM',
  BASE: 'VIDBAZ',
  SOUND_RECORD: 'VIDCSOUND',
  FULLHD: 'VIDCFHD',
  USERS: 'VIDCUSERS',
  PTZ: 'VIDCPTZ',
  HD_ARCHIVE: 'VIDCARHD',
  FULLHD_ARCHIVE: 'VIDCARFHD',
  HEAT_MAP: 'VIDCMAP'
}

const VC_TYPES = {
  BASE: CODES.BASE,
  USERS: CODES.USERS,
  BRAND_ID: '9154394142013178781'
}

const CAMERA_SALE_TYPES = {
  RENT: 'Аренда',
  SALE: 'Продажа'
}

const CHARS = {
  USER_COUNT: 'Количество пользователей',
  CAMERA_SALE_TYPE: 'Способ передачи оборудования'
}

/*
  доп.услуги и аналитика подключается:
  true == Заказ
  false == через заявку
*/
const SERVICE_ORDER_MAP: Record<string, boolean> = {
  'VIDCARHD': true, // видеоархив
  'VIDCARFHD': true, // видеоархив FullHD
  'VIDCSOUND': true, // запись звука
  'VIDCFTAFF': true, // контроль активности
  'VIDCPSEC': true, // пакет "Security"
  'VIDCPTZ': true, // Поворотный модуль
  'VIDCCOUNT': true, // подсчёт посетителей
  'VIDCFHD': true, // разрешение FullHD
  'VIDCMAP': true, // тепловая карта

  'VIDCCONST': false, // постоянный режим записи
  'VIDCSEGM': false, // сегментация клиента
  'VIDCCAR': false, // распознавание номеров
  'VIDCBARR': false // умный шлагбаум
}

export {
  ANALYTIC_CATEGORY_ID,
  ANALYTIC_NAME,
  BF_CATEGORY_ID,
  BF_CATEGORY_NAME,
  CAMERA_SALE_TYPES,
  CHARS,
  CODES,
  CUSTOMER_CATEGORY_ID,
  DISTRIBUTION_CHANNEL_ID,
  MARKET_ID,
  PRODUCT_TYPE,
  SERVICE_ORDER_MAP,
  VC_TYPES,
  VIDEOARCHIVE_DAY_COUNT,
  VIDEOCONTROL_OFFER_NAME
}
