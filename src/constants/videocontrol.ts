
const PLUG_URL = 'https://b2b.domru.ru/products/videonablyudenie'

const MARKET_ID = '68'
const CUSTOMER_CATEGORY_ID = '152'
const DISTRIBUTION_CHANNEL_ID = '144'
const VIDEOCONTROL_OFFER_NAME = 'Видеоконтроль'

// для поиска в данных в /catalog/management/allowed-offers
const ANALYTIC_CATEGORY_ID = 230
const ANALYTIC_NAME = 'Базовая функциональность видеоконтроля к Сервисы видеоаналитики'
const VIDEOREGISTRATOR_ANALYTIC_NAME = 'Базовая функциональность видеоконтроля для Видеорегистратора к Сервисы видеоаналитики - Видеорегистратор'
const BF_CATEGORY_ID = 187
const BF_CATEGORY_NAME = 'Базовая функциональность видеоконтроля к Дополнительные услуги Видеоконтроль'
const VIDEOREGISTRATOR_BF_CATEGORY_NAME = 'Базовая функциональность видеоконтроля для Видеорегистратора к Дополнительные услуги - Видеорегистратор'
const BF_CATEGORY_NAME_2 = 'Базовая функциональность видеоконтроля к Тип записи'

const VIDEOARCHIVE_DAY_COUNT = 'Количество дней архива'
const ADDITION_USERS = 'Дополнительные пользователи'

const PRODUCT_TYPES: Record<string, string> = {
  forpost: 'Видеонаблюдение Дом.ru Бизнес',
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

const TOMS_IDS = {
  USERS: '310000002',
  BASE: '310000006',
  CAMERA: '303000140',
  SOUND_RECORD: '310000008',
  SOUND_RECORD_VIDEOREGISTRATOR: '310000042',
  VIDNCAM: '310200009',
  PTZ: '310000009',
  PTZ_VIDEOREGISTRATOR: '9162663801413753876',
  FULLHD: '310000007',
  FULLHD_VIDEOREGISTRATOR: '310000041',
  HD_ARCHIVE: '310100003',
  FULLHD_ARCHIVE: '310100004',
  CONST_RECORD: '310000013',
  DETECTOR_RECORD: '310000050',
  VIDCSTAFF: '310000010',
  VIDCPSEC: '310100002',
  VIDCPSECP: '310100001', // Пакет детекторов "Security+"
  VIDCCOUNT: '310000012',
  VIDCMAP: '310000011',
  MASK_DETECT_LIGHT: '310000032',
  MASK_DETECT_PRO: '310000033',
  QUEUE_DETECT: '310000034',
  FULL_SHELF_DETECT: '310000035',
  SMART_PARKING: '310000037',
  VIDCSEGM: '310000020',
  VIDCCAR: '310000021',
  VIDCBARR: '310000022',
  TEMP_CONTROL: '310000030',
  TEMP_CONTROL_FACE: '310000031',
  FACE_AND_AGE_DETECT: '310000036'
}

const VC_TYPES = {
  BASE: TOMS_IDS.BASE,
  USERS: TOMS_IDS.USERS,
  BRAND_ID: '9154394142013178781'
}

const CAMERA_SALE_TYPES = {
  RENT: 'Аренда',
  INSTALLMENT: 'Рассрочка',
  OWN_DEVICE: 'Собственное оборудование клиента',
  SALE: 'Продажа'
}

const CHARS = {
  USER_COUNT: 'Количество пользователей',
  CAMERA_SALE_TYPE: 'Способ передачи оборудования',
  NAME_IN_INVOICE: 'Имя в счете',
  DEVICE_NAME: 'Имя оборудования',
  PTZ: 'Поддержка PTZ', // В характеристиках камеры (может быть "Да", "Нет" или "ХЗ")
  SOUND_RECORD: 'Поддержка записи звука', // В характеристиках камеры (может быть "Да" или "Нет"),
  FULLHD: 'Поддержка FullHD',
  ARCHIVE_DAY_COUNT: 'Количество дней архива',
  DURATION: 'Длительность рассрочки',
  GARANTE_TO: 'Гарантийный срок (до)',
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
  [TOMS_IDS.HD_ARCHIVE]: true, // видеоархив
  [TOMS_IDS.FULLHD_ARCHIVE]: true, // видеоархив FullHD
  [TOMS_IDS.SOUND_RECORD]: true, // запись звука
  [TOMS_IDS.VIDCSTAFF]: true, // контроль активности
  [TOMS_IDS.VIDCPSEC]: true, // пакет "Security"
  [TOMS_IDS.PTZ]: true, // Поворотный модуль
  [TOMS_IDS.VIDCCOUNT]: true, // подсчёт посетителей
  [TOMS_IDS.FULLHD]: true, // разрешение FullHD
  [TOMS_IDS.VIDCMAP]: true, // тепловая карта
  [TOMS_IDS.MASK_DETECT_LIGHT]: true,
  [TOMS_IDS.MASK_DETECT_PRO]: true,
  [TOMS_IDS.QUEUE_DETECT]: true,
  [TOMS_IDS.FULL_SHELF_DETECT]: true,
  [TOMS_IDS.SMART_PARKING]: true,

  [TOMS_IDS.VIDCSEGM]: false, // сегментация клиента
  [TOMS_IDS.VIDCCAR]: false, // распознавание номеров
  [TOMS_IDS.VIDCBARR]: false, // умный шлагбаум
  [TOMS_IDS.DETECTOR_RECORD]: false,
  [TOMS_IDS.CONST_RECORD]: false,
  [TOMS_IDS.TEMP_CONTROL]: false,
  [TOMS_IDS.TEMP_CONTROL_FACE]: false,
  [TOMS_IDS.FACE_AND_AGE_DETECT]: false
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
  VIDEOREGISTRATOR_ANALYTIC_NAME,
  BF_CATEGORY_ID,
  BF_CATEGORY_NAME,
  VIDEOREGISTRATOR_BF_CATEGORY_NAME,
  BF_CATEGORY_NAME_2,
  CAMERA_SALE_TYPES,
  CHARS,
  CHAR_VALUES,
  CODES,
  TOMS_IDS,
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
