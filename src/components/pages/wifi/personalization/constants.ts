import { isCombat } from '@/functions/helper'

export const HOST_WIFI_BACKEND = isCombat()
  ? 'https://wifi-backend.domru.ru'
  : 'https://master.wifi-backend.wifi.t2.ertelecom.ru'

export const DEFAULT_BUTTON_STYLE: Partial<CSSStyleDeclaration> = {
  color: '#000000',
  borderRadius: '3px',
  borderColor: '#F8DD17',
  backgroundColor: '#F8DD17',
  boxShadow: '0 2px 0 #CCB100'
}

export const SLO_CODE = 'WIFIDESIGNOPT'
