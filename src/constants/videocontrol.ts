
const PLUG_URL = 'https://b2b.domru.ru/products/videonablyudenie'

const MARKET_ID = '68'
const CUSTOMER_CATEGORY_ID = '152'
const DISTRIBUTION_CHANNEL_ID = '144'
const VIDEOCONTROL_OFFER_NAME = 'Видеоконтроль'

// для поиска в данных в /catalog/management/allowed-offers
const ANALYTIC_CATEGORY_ID = 230
const ANALYTIC_NAME = 'Базовая функциональность видеоконтроля к Сервисы видеоаналитики'
const BF_CATEGORY_ID = 187
const BF_CATEGORY_NAME = 'Базовая функциональность видеоконтроля к Дополнительные услуги Видеоконтроль'
const BF_CATEGORY_NAME_2 = 'Базовая функциональность видеоконтроля к Тип записи'

const VIDEOARCHIVE_DAY_COUNT = 'Количество дней архива'
const ADDITION_USERS = 'Дополнительные пользователи'

const PRODUCT_TYPES: Record<string, string> = {
  forpost: 'Форпост',
  enforta: 'iVideon'
}

const VC_DOMAIN_STATUSES = {
  MODIFICATION: 'Modification in progress',
  ACTIVE: 'Active'
}

const CODES = {
  CAMERA: 'CCTVCAM',
  BASE: 'VIDBAZ',
  SOUND_RECORD: 'VIDCSOUND',
  FULLHD: 'VIDCFHD',
  USERS: 'VIDCUSERS',
  PTZ: 'VIDCPTZ',
  HD_ARCHIVE: 'VIDCARHD',
  FULLHD_ARCHIVE: 'VIDCARFHD',
  HEAT_MAP: 'VIDCMAP',
  CONST_RECORD: 'VIDCCONST',
  DETECTOR_RECORD: 'VIDCDETС',
  TEMP_CONTROL: 'VIDCTEMP',
  TEMP_CONTROL_FACE: 'VIDCTEMPFACE',
  FACE_AND_AGE_DETECT: 'VIDCFGA',
  MASK_DETECT_PRO: 'VIDCMASKP',
  MASK_DETECT_LIGHT: 'VIDCMASKL',
  QUEUE_DETECT: 'VIDCQUE', // детектор очереди
  FULL_SHELF_DETECT: 'VIDCSHELF',
  SMART_PARKING: 'VIDCPARK'
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
  CAMERA_SALE_TYPE: 'Способ передачи оборудования',
  NAME_IN_INVOICE: 'Имя в счете',
  DEVICE_NAME: 'Имя оборудования',
  PTZ: 'PTZ', // В характеристиках камеры (может быть "Да", "Нет" или "ХЗ")
  SOUND_RECORD: 'Запись звука', // В характеристиках камеры (может быть "Да" или "Нет"),
  FULLHD: 'Поддержка FullHD',
  ARCHIVE_DAY_COUNT: 'Количество дней архива',
  MODEL: 'Модель'
}

const CHAR_VALUES = {
  YES: 'Да',
  NO: 'Нет',
  PHONE_NUMBER: 'Абонентский номер'
}

const MESSAGES = {
  DISABLE: 'Отключить',
  ORDER_ERROR: 'При заказе произошла ошибка, обратитесь к вашему персональному менеджеру',
  USER_MODIFY_ORDER_ERROR: 'При изменении количества пользователей возникла ошибка. ' +
    'Свяжитесь с вашим персональным менеджером.',
  USER_MODIFY_ORDER_SUCCESS: 'Услуга "Дополнительные пользователи" успешно изменена.',
  USER_ADD_QUESTION: 'Вы уверены, что хотите добавить дополнительных пользователей?',
  // Modification In Progress === MIP
  MIP_MESSAGE: `В данный момент нет возможности сделать заказ, так как производится подключение другого заказа на этой услуге.
    <br>Попробуйте позже`,
  FUNC_NOT_EXISTS: 'Уважаемый Клиент. Ваша камера не поддерживает данный функционал.',
  WARNING_FULLHD_AND_HD_ARCHIVE: 'Для изменения разрешения видеопотока, необходимо сначала отключить Срок хранения видеоархива'
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
  'VIDCSTAFF': true, // контроль активности
  'VIDCPSEC': true, // пакет "Security"
  'VIDCPTZ': true, // Поворотный модуль
  'VIDCCOUNT': true, // подсчёт посетителей
  'VIDCFHD': true, // разрешение FullHD
  'VIDCMAP': true, // тепловая карта
  [CODES.MASK_DETECT_LIGHT]: true,
  [CODES.MASK_DETECT_PRO]: true,
  [CODES.QUEUE_DETECT]: true,
  [CODES.FULL_SHELF_DETECT]: true,
  [CODES.SMART_PARKING]: true,

  'VIDCSEGM': false, // сегментация клиента
  'VIDCCAR': false, // распознавание номеров
  'VIDCBARR': false, // умный шлагбаум
  [CODES.DETECTOR_RECORD]: false,
  [CODES.CONST_RECORD]: false,
  [CODES.TEMP_CONTROL]: false,
  [CODES.TEMP_CONTROL_FACE]: false,
  [CODES.FACE_AND_AGE_DETECT]: false
}

/*
  TODO: очистить список когда решат снова показывать эти новые услуги.
        Или перевести на контроль списка из админки
*/
const HIDDEN_ANALYTIC_CODES: string[] = [
  // CODES.DETECTOR_RECORD,
  // CODES.CONST_RECORD,
  // CODES.TEMP_CONTROL,
  // CODES.TEMP_CONTROL_FACE,
  // CODES.FACE_AND_AGE_DETECT,
  // CODES.SMART_PARKING,
  // CODES.FULL_SHELF_DETECT,
  // CODES.QUEUE_DETECT,
  // CODES.MASK_DETECT_LIGHT,
  // CODES.MASK_DETECT_PRO
]

const VISIBLE_ANALYTICS = [
  'VIDCPSEC',
  'VIDCPSECP',
  'VIDCSTAFF',
  'VIDCCOUNT',
  'VIDCMAP',
  'VIDCCAR',
  'VIDCBARR',
  'VIDCSEGM'
]

export {
  PLUG_URL,
  ANALYTIC_CATEGORY_ID,
  ANALYTIC_NAME,
  BF_CATEGORY_ID,
  BF_CATEGORY_NAME,
  BF_CATEGORY_NAME_2,
  CAMERA_SALE_TYPES,
  CHARS,
  CHAR_VALUES,
  CODES,
  CUSTOMER_CATEGORY_ID,
  DISTRIBUTION_CHANNEL_ID,
  MARKET_ID,
  MESSAGES,
  PRODUCT_TYPES,
  SERVICE_ORDER_MAP,
  VC_TYPES,
  VIDEOARCHIVE_DAY_COUNT,
  VIDEOCONTROL_OFFER_NAME,
  ADDITION_USERS,
  VISIBLE_ANALYTICS,
  VC_DOMAIN_STATUSES,
  HIDDEN_ANALYTIC_CODES
}
