import {
  getAllUrlParams,
  parseJwt,
  eachObject,
  stringToCamel,
  toFullName } from '@/functions/helper'

const makeUserInfo = function (token) {
  const userObj = parseJwt(token)
  let userInfo = {}
  eachObject(userObj, (value, key) => {
    userInfo[stringToCamel(key)] = value
  })
  const { firstName } = userInfo
  userInfo = {
    ...userInfo,
    userId: userInfo?.sub,
    ...toFullName(firstName)
  }

  return userInfo
}

/**
 * если первый раз - то редирект, если вернулись с sso,
 * то передаем параметры в теле запроса
 * @returns {{redirect?: string, code?: string, state?: string}}
 */
export const authParamsAfterRedirect = () => {
  const urlParams = getAllUrlParams()
  let data = { redirect: window.location.href }
  if (urlParams.code && urlParams.state) {
    data = { code: urlParams.code, state: urlParams.state }
  }

  // убираем параметры из строки после редиректа
  history.replaceState(
    {},
    '',
    window.location.href.replace(window.location.search, '')
  )

  return data
}

/**
 * обработка ответа от sso
 * @param success
 * @param message
 * @param redirect
 * @param output
 * @returns {Promise<unknown>}
 */
export const makeTokens = ({ success, message, redirect, output }) => {
  return new Promise((resolve, reject) => {
    if (!success || message) {
      return reject(new Error('Ошибка авторизации'))
    }

    if (redirect) {
      window.location.href = redirect
      return
    }

    const { access, id, refresh } = output
    const tokens = {}
    if (id) tokens.userToken = id
    if (id) tokens.user = makeUserInfo(id)
    if (access) tokens.accessToken = access
    if (refresh) tokens.refreshToken = refresh

    resolve({ tokens })
  })
}

/**
 * Проверка токена
 * @param token
 * @returns {boolean}
 */
export const validationToken = (token) => {
  if (!token) {
    return false
  }

  const payload = parseJwt(token)
  const time = parseInt(Date.now() / 1000, 10)
  const { exp } = payload

  // n сек до истечения времени жизни токена
  return !(exp && exp - time < 10)
}
