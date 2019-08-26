import { eachObject, getDomain } from './helper'

/**
 * Класс для работы с куками
 */
export class Cookie {
  /**
   * Получает значение куки
   * @param {string} name Имя куки
   * @return {string|undefined}
   */
  static get (name) {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
  }

  /**
   * Устанавливает значение куки
   * @param {string} name Имя куки
   * @param {any} value Значение куки
   * @param {Object} options Параметры куки
   */
  static set (name, value, options) {
    options = options || {}
    let expires = options.expires
    if (typeof expires === 'number' && expires) {
      const d = new Date()
      d.setTime(d.getTime() + expires * 1000)
      expires = options.expires = d
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString()
    }
    value = encodeURIComponent(value)
    options.path = options.path || '/'
    options.domain = options.domain || getDomain()
    let updatedCookie = `${name}=${value}`
    eachObject(options, (propValue, propName) => {
      updatedCookie += `; ${propName}`
      if (propValue !== true) {
        updatedCookie += `=${propValue}`
      }
    })
    document.cookie = updatedCookie
  }

  /**
   * Удаляет куку
   * @param {string} name Имя удаляемой куки
   */
  static remove (name) {
    Cookie.set(name, '', { expires: -1 })
  }
}
