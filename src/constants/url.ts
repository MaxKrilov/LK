import { isCombat, isServer } from '@/functions/helper'

export const BACKEND_TESTING = '.lk-backend.b2bweb.t2.ertelecom.ru'
export const BACKEND_COMBAT = 'api-lkb2b.domru.ru'
export const FRONTEND_LOCALHOST = 'localhost:8080'
export const FRONTEND_TESTING = 'frontend2.b2bweb.t2.ertelecom.ru'
export const FRONTEND_COMBAT = 'newlkb2b.domru.ru'
export const FRONTEND_STAGING = 'lkb2bnew.domru.staging.ertelecom.ru'
export const BACKEND_STAGING = 'api-lkb2b.domru.staging.ertelecom.ru'

const CHANGE_CUSTOMER_IFRAME: Record<string, string> = {
  PATH: '/auth/admin/user/console?iframe=1&hiddenHeader=true',
  SSO2: 'https://sso-balancer2.testing.srv.loc',
  SSO4: 'https://sso-balancer4.testing.srv.loc',
  PROD: 'https://auth.domru.ru'
}

export const TEST_SSO_CHANGE_CUSTOMER_IFRAME = CHANGE_CUSTOMER_IFRAME.SSO2 + CHANGE_CUSTOMER_IFRAME.PATH
export const PSI_SSO_CHANGE_CUSTOMER_IFRAME = CHANGE_CUSTOMER_IFRAME.SSO4 + CHANGE_CUSTOMER_IFRAME.PATH
export const PROD_SSO_CHANGE_CUSTOMER_IFRAME = CHANGE_CUSTOMER_IFRAME.PROD + CHANGE_CUSTOMER_IFRAME.PATH

export const SSO_CUSTOMER_IFRAME_URL = isCombat()
  ? PROD_SSO_CHANGE_CUSTOMER_IFRAME
  : isServer('psi2')
    ? PSI_SSO_CHANGE_CUSTOMER_IFRAME
    : TEST_SSO_CHANGE_CUSTOMER_IFRAME

export const OFFER_LINKS: Record<string, string> = {
  'cctv': 'https://beta-lkb2b.domru.ru/files/oferta-cctv.pdf',
  'telephonya': 'https://beta-lkb2b.domru.ru/files/oferta-telephonya.pdf',
  'internet': 'https://beta-lkb2b.domru.ru/files/oferta-internet.pdf',
  'wifi': 'https://beta-lkb2b.domru.ru/files/oferta-wifi-mono.pdf'
}
