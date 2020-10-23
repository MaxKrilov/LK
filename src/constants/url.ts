export const BACKEND_TESTING = '.lk-backend.b2bweb.t2.ertelecom.ru'
export const BACKEND_COMBAT = 'api-lkb2b.domru.ru'
export const FRONTEND_LOCALHOST = 'localhost:8080'
export const FRONTEND_TESTING = 'frontend2.b2bweb.t2.ertelecom.ru'
export const FRONTEND_COMBAT = 'newlkb2b.domru.ru'
export const FRONTEND_STAGING = 'lkb2bnew.domru.staging.ertelecom.ru'
export const BACKEND_STAGING = 'api-lkb2b.domru.staging.ertelecom.ru'

const CHANGE_CUSTOMER_IFRAME: Record<string, string> = {
  PATH: '/auth/admin/user/console?iframe=1&hiddenHeader=true',
  SSO: 'https://sso-balancer.testing.srv.loc',
  SSO2: 'https://sso-balancer2.testing.srv.loc',
  SSO4: 'https://sso-balancer4.testing.srv.loc',
  PROD: 'https://auth.domru.ru'
}

const buildIframeUrl = (url:string) => url + CHANGE_CUSTOMER_IFRAME.PATH
export const EDU_SSO_CHANGE_CUSTOMER_IFRAME = buildIframeUrl(CHANGE_CUSTOMER_IFRAME.SSO)
export const TEST_SSO_CHANGE_CUSTOMER_IFRAME = buildIframeUrl(CHANGE_CUSTOMER_IFRAME.SSO2)
export const PSI_SSO_CHANGE_CUSTOMER_IFRAME = buildIframeUrl(CHANGE_CUSTOMER_IFRAME.SSO4)
export const PSI3_SSO_CHANGE_CUSTOMER_IFRAME = buildIframeUrl(CHANGE_CUSTOMER_IFRAME.SSO4)
export const PROD_SSO_CHANGE_CUSTOMER_IFRAME = buildIframeUrl(CHANGE_CUSTOMER_IFRAME.PROD)

export const VS_LOGIN = 'https://vs.domru.ru/login.html'

export const OFFER_LINKS: Record<string, string> = {
  'cctv': 'https://beta-lkb2b.domru.ru/files/oferta-cctv.pdf',
  'telephonya': 'https://beta-lkb2b.domru.ru/files/oferta-telephonya.pdf',
  'tv': 'https://beta-lkb2b.domru.ru/files/oferta-tv.pdf',
  'internet': 'https://beta-lkb2b.domru.ru/files/oferta-internet.pdf',
  'wifi': 'https://beta-lkb2b.domru.ru/files/oferta-wifi-mono.pdf'
}

export const MANAGER_LOGOUT = {
  'psi1': 'https://public-gateway-dmp-uat1.nonprod.cloud-bss.loc/api/v1/identity-provider/auth/realms/f4000b9a-bc97-4783-899b-55b499b1cac0/protocol/openid-connect/logout',
  'psi2': 'https://public-gateway-dmp-uat2.nonprod.cloud-bss.loc/api/v1/identity-provider/auth/realms/cdf6f4e0-ef43-4a8e-9a12-0a18d63824b0/protocol/openid-connect/logout',
  'combat': 'https://public-gateway.online.domru.ru/api/v1/identity-provider/auth/realms/7404b7f5-b4b3-48a9-8bbd-97a4ff8e1ef0/protocol/openid-connect/logout'
}
