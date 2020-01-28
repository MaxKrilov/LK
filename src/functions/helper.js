import { FRONTEND_TESTING } from '../constants/url'
import { COMBAT_DOMAIN, LOCALHOST_DOMAIN, TESTING_DOMAIN } from '../constants/domain'
import { ENDPOINTS_API } from '../constants/endpoints'
import { BREAKPOINT_XL, BREAKPOINT_MD } from '@/constants/breakpoint'
import { Cookie } from './storage'
import Vue from 'vue'

/**
 * Функция, изменяет горизонтальную позицию скролла
 * @param {Element} element исходный элемент
 * @param {number} direction направление движения скролла
 * @param {number} speed скорость перемещения скролла
 * @param {number} distance дистанция на которую нужно переместить скролл
 * @param {number} step шаг с которым будет перемещаться скролл
 */
export function scrollXTo (element, direction, speed, distance, step) {
  let scrollAmount = 0
  let slideTimer = setInterval(() => {
    if (direction === 'left') {
      element.scrollLeft -= step
    } else {
      element.scrollLeft += step
    }
    scrollAmount += step
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer)
    }
  }, speed)
}

/**
 * Функция, возвращает скролл в исходную горизонтальную позицию
 * @param {Element} element исходный элемент
 * @param {number} currScroll текущая позиция скролла
 * @param {number} speed скорость перемещения скролла
 * @param {number} step шаг с которым будет перемещаться скролл
 */
export function scrollXToStart (element, currScroll, speed, step) {
  let scrollAmount = currScroll
  let slideTimer = setInterval(() => {
    element.scrollLeft -= step
    scrollAmount -= step
    if (scrollAmount <= 0) {
      window.clearInterval(slideTimer)
    }
  }, speed)
}

/**
 * Функция, приводит мобильный телефон к одному типу: 79196026543
 * @param {string}
 * @return {string}
 */
export function toDefaultPhoneNumber (str) {
  if (str) { return str.replace(/[\s-()+]/g, '') }
  return ''
}
/**
 * Функция, преобразует строку в ФИО
 * @param {string} str исходный объект
 * @return {Object} новый объект
 */
export function toFullName (str) {
  str = str || ''
  const nameArr = str.split(' ')
  switch (nameArr.length) {
    case 2:
      return { firstName: nameArr[1], lastName: nameArr[0], middleName: '' }
    case 3:
      return { firstName: nameArr[1], lastName: nameArr[0], middleName: nameArr[2] }
    default:
      return { firstName: nameArr[0], lastName: '', middleName: '' }
  }
}

/**
 * Функция, копирующая объект, поддерживает глубокое копирование
 * @param {Object} object исходный объект
 * @return {Object} новый объект
 */
export function copyObject (object) {
  return JSON.parse(JSON.stringify(object))
}

/**
 * Функция, перебирающая элементы объекта
 * @param {Object} object исходный объект
 * @param {Function} cb функция обратного вызова, принимающая в качестве аргументов значение свойства, свойство и исходный объект
 */
export function eachObject (object, cb) {
  for (let _key in object) {
    if (object.hasOwnProperty(_key)) {
      cb(object[_key], _key, object)
    }
  }
}

/**
 * Функция, перебирающая элементы массива
 * @param {Array} array исходный массив
 * @param {Function} cb функция обратного вызова, принимающая в качестве аргументов элемент массива, индекс и исходный массив
 */
export function eachArray (array, cb) {
  for (let _i = 0; _i < array.length; _i++) {
    cb(array[_i], _i, array)
  }
}

/**
 * Функция, проверяющая, является ли переменная пустой
 * @param {any} variable
 * @return {boolean}
 */
export function isEmpty (variable) {
  return variable?.length ? variable.length === 0 : true
}

/**
 * Функция, проверяющая, является ли текущий сервер локальным
 * @return {boolean}
 */
export function isLocalhost () {
  return process.env.NODE_ENV === 'development'
}

/**
 * Функция, проверяющая, является ли текущий сервер тестовым
 * @return {number}
 */
export function isTesting () {
  return ~location.origin.indexOf(FRONTEND_TESTING)
}

/**
 * Функция, проверяющая, является ли текущий сервер боевым
 * @return {number|boolean}
 */
export function isCombat () {
  return !isLocalhost() && !isTesting()
}

export function isDeveloper () {
  return isLocalhost() ||
    isTesting() ||
    Cookie.get('is_developer') === '1'
}

/**
 * Функция, получающая домен для кук в зависимости от сервера
 * @return {string}
 */
export function getDomain () {
  return isCombat()
    ? COMBAT_DOMAIN
    : isTesting()
      ? TESTING_DOMAIN
      : LOCALHOST_DOMAIN
}

/**
 * Добавляет перед url'ом https
 * @param {string} url
 * @return {string}
 */
export function wrapHttps (url) {
  return `https://${url}`
}

/**
 * Получает первый элемент массива
 * @param {Array} array
 * @return {any}
 */
export function getFirstElement (array) {
  return array?.[0]
}

/**
 * Получает последний элемент массива
 * @param {Array} array
 * @return {any}
 */
export function getLastElement (array) {
  return array?.[array?.length - 1]
}

/**
 * Добавляет класс элементу
 * @param {Element} element
 * @param {string} className
 */
export function addClass (element, className) {
  element.classList.add(className)
}

/**
 * Удаляет класс у элемента
 * @param {Element} element
 * @param {string} className
 */
export function removeClass (element, className) {
  element.classList.remove(className)
}

/**
 * Устанавливает стили для элемента
 * @param {Element} el
 * @param {string} property
 * @param {string|number} value
 */
export function setStyle (el, property, value) {
  el.style[property] = value
}

/**
 * Получает стили для элемента. Если не указано второй аргумент - возвращает все стили элемента
 * @param {Element} el
 * @param {string} property
 * @return {CSSStyleDeclaration|string|number}
 */
export function getStyle (el, property) {
  return property ? window.getComputedStyle(el)[property] : window.getComputedStyle(el)
}

/**
 * Устанавливает дата атрибут
 * @param {Element} el
 * @param {string} data
 * @param {string|number|boolean} value
 */
export function setDataAttr (el, data, value) {
  el.dataset[data] = value
}

/**
 * Получает дата атрибут
 * @param {Element} el
 * @param {string} data
 * @return {string | undefined}
 */
export function getDataAttr (el, data) {
  return el.dataset[data]
}

/**
 * Удаляет дата атрибут
 * @param {Element} el
 * @param {string} data
 */
export function removeDataAttr (el, data) {
  el.removeAttribute(el, `data-${data}`)
}

/**
 * Получает длину переменной
 * @param {any} variable
 * @return {number}
 */
export function lengthVar (variable) {
  return variable?.length || 0
}

/**
 * Проверяет - определена ли переменная
 * @param {any} variable
 * @return {boolean}
 */
export function isUndefined (variable) {
  return typeof variable === 'undefined'
}

/**
 * Добавляет обработчики событий элементу
 * @param {Element} el
 * @param {object} events
 */
export function addEvents (el, events) {
  eachArray(events, event => {
    el.addEventListener(event.type, event.function, event.options)
  })
}

/**
 * Удаляет обработчики событий у элемента
 * @param {Element} el
 * @param {object} events
 */
export function removeEvents (el, events) {
  eachArray(events, event => {
    el.removeEventListener(event.type, event.function, event.options)
  })
}

/**
 * Получает номер порта, на котором запущено приложение
 * @return {number}
 */
export function getPort () {
  return isLocalhost()
    ? Number(location.origin.replace(/[\D]+/g, ''))
    : 8080
}

export function getSlot (vm, name = 'default', data, optional = false) {
  if (vm.$scopedSlots[name]) {
    return vm.$scopedSlots[name](data)
  } else if (vm.$slots[name] && (!data || optional)) {
    return vm.$slots[name]
  }
  return undefined
}

export function getSlotType (vm, name, split) {
  if (vm.$slots[name] && vm.$scopedSlots[name] && vm.$scopedSlots[name].name) {
    return split ? 'v-slot' : 'scoped'
  }
  if (vm.$slots[name]) {
    return 'normal'
  }
  if (vm.$scopedSlots[name]) {
    return 'scoped'
  }
}

export function convertToUnit (str, unit = 'px') {
  return str == null || str === ''
    ? undefined
    : isNaN(+str)
      ? String(str)
      : `${Number(str)}${unit}`
}

export function getScreenWidth () {
  return window.screen.width
}

export function getWindowWidth () {
  return window.innerWidth
}

export function getZIndex (el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return 0
  }
  const index = +getStyle(el).getPropertyValue('z-index')
  if (isNaN(index)) {
    return getZIndex(el.parentNode)
  }
  return index
}

export function filterObjectOnKeys (obj, keys) {
  const filtered = {}
  eachArray(keys, key => {
    if (!isUndefined(obj[key])) {
      filtered[key] = obj[key]
    }
  })
  return filtered
}

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
}

export function escapeHTML (str) {
  return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag)
}

export function isMobile () {
  return getScreenWidth() < BREAKPOINT_MD
}

export function isDesktop () {
  return getWindowWidth() >= BREAKPOINT_XL
}

function renderImage (url, scale = 0.3) {
  let img = new Image()
  img.onload = () => {
    const style = `
      display: block !important;
      margin: 10px 0;
      font-size: ${img.height * scale}px;
      padding: ${Math.floor(img.height * scale / 2)}px ${Math.floor(img.width * scale / 2)}px;
      background: url(${url});
      background-size: ${img.width * scale}px ${img.height * scale}px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      color: transparent;
    `
    console.log('%c+', style)
  }
  img.src = url
}

console.image = renderImage

export const months = [
  { name: 'Январь', abbr: 'янв.', genitive: 'Января' },
  { name: 'Февраль', abbr: 'фев.', genitive: 'Февраля' },
  { name: 'Март', abbr: 'март', genitive: 'Марта' },
  { name: 'Апрель', abbr: 'апр.', genitive: 'Апреля' },
  { name: 'Май', abbr: 'май', genitive: 'Мая' },
  { name: 'Июнь', abbr: 'июнь', genitive: 'Июня' },
  { name: 'Июль', abbr: 'июль', genitive: 'Июля' },
  { name: 'Август', abbr: 'авг.', genitive: 'Августа' },
  { name: 'Сентябрь', abbr: 'сент.', genitive: 'Сентября' },
  { name: 'Октябрь', abbr: 'окт.', genitive: 'Октября' },
  { name: 'Ноябрь', abbr: 'нояб.', genitive: 'Ноября' },
  { name: 'Декабрь', abbr: 'дек.', genitive: 'Декабря' }
]

export const daysOfWeek = [
  'ПН',
  'ВТ',
  'СР',
  'ЧТ',
  'ПТ',
  'СБ',
  'ВС'
]

export function getMonthByNumber (number) {
  return months[number]
}

/**
 * Генерирует строку URL
 * @param {string} endpoint
 * @param {string} api
 * @param {string} postfix
 * @return {string}
 */

export function generateUrl (endpoint, api = ENDPOINTS_API, postfix = null) {
  if (!api.endpoints.hasOwnProperty(endpoint)) {
    console.warn(`There is no ${endpoint} endpoint`)
    return endpoint
  }
  const endpointUrl = api.endpoints[endpoint]
  const url = `${api.url}/${endpointUrl}`
  return postfix ? `${url}/${postfix}` : url
}

/**
 * Декодирует JWT
 * @param {string} token
 * @return {object}
 */

export function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const component = atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join('')
  const jsonPayload = decodeURIComponent(component)

  return JSON.parse(jsonPayload)
}

/**
 * Приводим строку snake_case к camelCase
 * @param str
 * @returns {string}
 */

export function stringToCamel (str) {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

export function validateINN (inn) {
  if (inn.length !== 10 && inn.length !== 12) {
    return false
  }
  if (inn.length === 10) {
    const sum = [2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * inn[index], 0)
    const residue = sum % 11 % 10
    return residue === +inn[9]
  }
  const firstSumm = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * inn[index], 0)
  const secondSumm = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * inn[index], 0)
  const firstResidue = firstSumm % 11 % 10
  const secondResidue = secondSumm % 11 % 10
  return firstResidue === +inn[10] && secondResidue === +inn[11]
}

export function getAllUrlParams (url) {
  let queryString = url
    ? url.split('?')[1]
    : window.location.search.slice(1)
  const obj = {}
  if (queryString) {
    queryString = getFirstElement(queryString.split('#'))
    const arr = queryString.split('&')
    eachArray(arr, item => {
      const subArr = item.split('=')
      let paramNum
      let paramName = getFirstElement(subArr).replace(/\[\d*\]/, v => {
        paramNum = v.slice(1, -1)
        return ''
      })
      let paramValue = typeof subArr[1] === 'undefined'
        ? true
        : subArr[1]
      // paramName = paramName.toLowerCase()
      // paramValue = paramValue.toLowerCase()
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]]
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(paramValue)
        } else {
          obj[paramName][paramNum] = paramValue
        }
      } else {
        obj[paramName] = paramValue
      }
    })
  }
  return obj
}

export const getNoun = (number, one, two, five) => {
  let n = Math.abs(number)
  n %= 100
  if (n >= 5 && n <= 20) {
    return five
  }
  n %= 10
  if (n === 1) {
    return one
  }
  if (n >= 2 && n <= 4) {
    return two
  }
  return five
}

export const ucfirst = str => str.charAt(0).toUpperCase() + str.substr(1, str.length - 1)

export const kebabCase = str => (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

export const createRange = length => Array.from({ length }, (v, k) => k)

export const escape = s => String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')

export const regExpByStr = (s, f = 'i') => new RegExp(escape(s), f)

export const compareObject = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

export function mergeSlotSafely (source, vm, slotName) {
  if (vm.$scopedSlots[slotName] === void 0) {
    return source
  }

  const slot = vm.$scopedSlots[slotName]()
  return source !== void 0
    ? source.concat(slot)
    : slot
}

export function createSimpleComponent (c, el = 'div', name) {
  return Vue.extend({
    name: name || c.replace(/__/g, '-'),
    functional: true,
    render (h, { data, children }) {
      data.staticClass = (`${c} ${data.staticClass || ''}`).trim()
      return h(el, data, children)
    }
  })
}
