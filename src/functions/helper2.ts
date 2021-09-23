import Vue, { VNode } from 'vue'
import { SelectItemKey } from '@/types'

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true

  if (a instanceof Date && b instanceof Date) {
    if (a.getTime() !== b.getTime()) return false
  }

  if (a !== Object(a) || b !== Object(b)) {
    return false
  }

  const props = Object.keys(a)

  if (props.length !== Object.keys(b).length) {
    return false
  }

  return props.every(p => deepEqual(a[p], b[p]))
}

export const convertToUnit = (str: string | number | null | undefined, unit = 'px'): string | undefined => {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str!)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
  }
}

export const getSlot = (vm: Vue, name = 'default', data?: object | (() => object), optional = false) => {
  if (vm.$scopedSlots[name]) {
    return vm.$scopedSlots[name]!(data instanceof Function ? data() : data)
  } else if (vm.$slots[name] && (!data || optional)) {
    return vm.$slots[name]
  }
  return undefined
}

export function getSlotType<T extends boolean = false> (vm: Vue, name: string, split?: T): (T extends true ? 'v-slot' : never) | 'normal' | 'scoped' | void {
  if (vm.$slots[name] && vm.$scopedSlots[name] && (vm.$scopedSlots[name] as any).name) {
    return split ? 'v-slot' as any : 'scoped'
  }
  if (vm.$slots[name]) return 'normal'
  if (vm.$scopedSlots[name]) return 'scoped'
}

export function keys<O> (o: O) {
  return Object.keys(o) as (keyof O)[]
}

export function kebabCase (str: string): string {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const camelizeRE = /-(\w)/g
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

export function wrapInArray<T> (v: T | T[] | null | undefined): T[] { return v != null ? Array.isArray(v) ? v : [v] : [] }

export function upperFirst (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getNestedValue (obj: any, path: (string | number)[], fallback?: any): any {
  const last = path.length - 1

  if (last < 0) return obj === undefined ? fallback : obj

  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }

  if (obj == null) return fallback

  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function getObjectValueByPath (obj: any, path: string, fallback?: any): any {
  if (obj == null || !path || typeof path !== 'string') return fallback
  if (obj[path] !== undefined) return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  return getNestedValue(obj, path.split('.'), fallback)
}

export function addOnceEventListener (
  el: EventTarget,
  eventName: string,
  cb: (event: Event) => void,
  options: boolean | AddEventListenerOptions = false
): void {
  var once = (event: Event) => {
    cb(event)
    el.removeEventListener(eventName, once, options)
  }

  el.addEventListener(eventName, once, options)
}

let passiveSupported = false
try {
  if (typeof window !== 'undefined') {
    const testListenerOpts = Object.defineProperty({}, 'passive', {
      get: () => {
        passiveSupported = true
      }
    })

    window.addEventListener('testListener', testListenerOpts, testListenerOpts)
    window.removeEventListener('testListener', testListenerOpts, testListenerOpts)
  }
} catch (e) { console.warn(e) }
export { passiveSupported }

export function addPassiveEventListener (
  el: EventTarget,
  event: string,
  cb: EventHandlerNonNull | (() => void),
  options: {}
): void {
  el.addEventListener(event, cb, passiveSupported ? options : false)
}

export function getZIndex (el?: Element | null): number {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0

  const index = +window.getComputedStyle(el).getPropertyValue('z-index')

  if (!index) return getZIndex(el.parentNode as Element)
  return index
}

export function createSimpleFunctional (
  c: string,
  el = 'div',
  name?: string
) {
  return Vue.extend({
    name: name || c.replace(/__/g, '-'),

    functional: true,

    render (h, { data, children }): VNode {
      data.staticClass = (`${c} ${data.staticClass || ''}`).trim()

      return h(el, data, children)
    }
  })
}

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
} as any

export function escapeHTML (str: string): string {
  return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag)
}

export function getPropertyFromItem (
  item: object,
  property: SelectItemKey,
  fallback?: any
): any {
  if (property == null) return item === undefined ? fallback : item

  if (item !== Object(item)) return fallback === undefined ? item : fallback

  if (typeof property === 'string') return getObjectValueByPath(item, property, fallback)

  if (Array.isArray(property)) return getNestedValue(item, property, fallback)

  if (typeof property !== 'function') return fallback

  const value = property(item, fallback)

  return typeof value === 'undefined' ? fallback : value
}

export function eachArray<T> (array: T[], cb: (item: T, index?: number, array?: T[]) => void) {
  for (let _i = 0; _i < array.length; _i++) {
    cb(array[_i], _i, array)
  }
}

export function eachObject<T> (
  object: Record<string | number | symbol, T>,
  cb: (item: T, key?: string | number | symbol, object?: Record<string | number | symbol, T>) => void
) {
  for (const _key in object) {
    if (object.hasOwnProperty(_key)) {
      cb(object[_key], _key, object)
    }
  }
}

export function isMobileDevice () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function clamp (value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

export function padEnd (str: string, length: number, char = '0') {
  return str + char.repeat(Math.max(0, length - str.length))
}

export function chunk (str: string, size = 1) {
  const chunked: string[] = []
  let index = 0
  while (index < str.length) {
    chunked.push(str.substr(index, size))
    index += size
  }
  return chunked
}

export function createRange (length: number): number[] {
  return Array.from({ length }, (v, k) => k)
}

export function validateINN (inn: string) {
  if (inn.length !== 10 && inn.length !== 12) {
    return false
  }
  if (inn.length === 10) {
    const sum = [2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * Number(inn.charAt(index)), 0)
    const residue = sum % 11 % 10
    return residue === +inn[9]
  }
  const firstSumm = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * Number(inn.charAt(index)), 0)
  const secondSumm = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8].reduce((sum, item, index) => sum + item * Number(inn.charAt(index)), 0)
  const firstResidue = firstSumm % 11 % 10
  const secondResidue = secondSumm % 11 % 10
  return firstResidue === +inn[10] && secondResidue === +inn[11]
}

export function throttle<T extends (...args: any[]) => any> (fn: T, limit: number) {
  let throttling = false
  return (...args: Parameters<T>): void | ReturnType<T> => {
    if (!throttling) {
      throttling = true
      setTimeout(() => { throttling = false }, limit)
      return fn(...args)
    }
  }
}

export function isObject (value: any): boolean {
  return typeof value === 'object'
}

export function booleanToNumber (bool: boolean): number {
  return bool ? 1 : 0
}

export function parseDecimal (value: string): number {
  return parseInt(value, 10)
}

export function findGetParameter (parameterName: string) {
  let result = null
  let tmp = []
  location.search
    .substr(1)
    .split('&')
    .forEach(function (item) {
      tmp = item.split('=')
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
