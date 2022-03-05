export const WIFIAUTOECIA = 'WIFIAUTOECIA' // Дополнительная услуга Авторизации через Госуслуги (ЕСИА)
export const WIFIAUTCNHS = 'WIFIAUTCNHS' // Авторизация через соц. cети (HS)
export const WIFIADVCANCEL = 'WIFIADVCANCEL' // Отмена внешней рекламы
export const WIFIHSCLONET = 'WIFIHSCLONET' // Закрытая сеть (HS)
export const WIFIACCCHANGE = 'WIFIACCCHANGE' // Изменение параметров доступа
export const WIFIAVTVOUCH = 'WIFIAVTVOUCH' // Авторизация по ваучеру
export const WIFINAME = 'WIFINAME' // Дополнительная услуга по изменению названия сети DOM.RU Wi-Fi
export const WIFIREDIR = 'WIFIREDIR' // Переадресация пользователя

export const WIFIKONTFIL = 'WIFIKONTFIL' // Контент фильтрация (Wi-Fi)
export const WIFIANALYTICS = 'WIFIANALYTICS' // Аналитика по пользователям
export const WIFIDESIGNOPT = 'WIFIDESIGNOPT' // Конструктор страницы авторизации

export const SERVICES_AUTH = [
  WIFIAUTOECIA,
  WIFIAUTCNHS,
  WIFIADVCANCEL,
  WIFIHSCLONET,
  WIFIACCCHANGE,
  WIFIAVTVOUCH,
  WIFINAME,
  WIFIREDIR
]

export const SERVICE_AUTH_TOMS_ID = [
  /* WIFIAVTVOUCH */
  '302000003',
  /* WIFIHSCLONET */
  '302000020',
  /* WIFIDESIGNOPT */
  '302000023',
  /* WIFIKONTFIL */
  '302000024',
  /* WIFINAME */
  '302000025',
  /* WIFIREDIR */
  '302000026',
  /* WIFIADVCANCEL */
  '302000027',
  /* WIFIACCCHANGE */
  '302000028',
  /* WIFIANALYTICS */
  '302000029',
  /* WIFIAUTCNHS */
  '302000030',
  /* WIFIAUTOECIA */
  '302000031'
]

export const TOMS_ID_BY_PRODUCT_CODE: Record<string, string> = {
  [WIFIAVTVOUCH]: '302000003',
  [WIFIHSCLONET]: '302000020',
  [WIFIDESIGNOPT]: '302000023',
  [WIFIKONTFIL]: '302000024',
  [WIFINAME]: '302000025',
  [WIFIREDIR]: '302000026',
  [WIFIADVCANCEL]: '302000027',
  [WIFIACCCHANGE]: '302000028',
  [WIFIANALYTICS]: '302000029',
  [WIFIAUTCNHS]: '302000030',
  [WIFIAUTOECIA]: '302000031'
}
