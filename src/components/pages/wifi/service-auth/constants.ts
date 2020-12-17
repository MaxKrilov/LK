import {
  WIFIREDIR,
  WIFINAME,
  WIFIACCCHANGE,
  WIFIHSCLONET,
  WIFIADVCANCEL,
  WIFIAUTCNHS,
  WIFIAUTOECIA, WIFIAVTVOUCH
} from '../index/constants'

/**
 * Список сервисов авторизации без дополнительных параметров
 */
export const LIST_SERVICE_AUTH_WO_PARAMETERS = [
  WIFIADVCANCEL,
  WIFIAUTCNHS,
  WIFIAUTOECIA
]

/**
 * Список сервисов авторизации с дополнительными параметрами
 */
export const LIST_SERVICE_AUTH_WITH_PARAMETERS = [
  WIFIREDIR,
  WIFINAME,
  WIFIACCCHANGE,
  WIFIHSCLONET,
  WIFIAVTVOUCH
]
