import { Component, DirectiveOptions } from 'vue'

import { Hex, Hexa, HSLA, HSVA, RGBA } from '@/utils/colorUtils'

export type ComponentOrPack = Component & {
  // eslint-disable-next-line camelcase
  $_subcomponents?: Record<string, ComponentOrPack>
}

export interface ErtUseOptions {
  directives?: Record<string, DirectiveOptions>
  components?: Record<string, ComponentOrPack>
}

export interface TouchHandlers {
  start?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  end?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  move?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  left?: (wrapper: TouchWrapper) => void
  right?: (wrapper: TouchWrapper) => void
  up?: (wrapper: TouchWrapper) => void
  down?: (wrapper: TouchWrapper) => void
}

export interface TouchWrapper extends TouchHandlers {
  touchstartX: number
  touchstartY: number
  touchmoveX: number
  touchmoveY: number
  touchendX: number
  touchendY: number
  offsetX: number
  offsetY: number
}

export type TouchValue = TouchHandlers & {
  parent?: boolean
  options?: AddEventListenerOptions
}

export type NumberAsString = string

export type InputValidationRule = (value: any) => string | boolean

export type InputMessage = string | string[]

export type InputValidationRules = (InputValidationRule | string)[]

export interface IIconModule {
  default: {
    id: string
    toString: () => string
    url: string
    viewBox: string
  }
}

export interface IIconShadow {
  color: string
  offset: {
    x: string | number
    y: string | number
  }
  radius: string | number
}

export type SelectItemKey = string | (string | number)[] | ((item: object, fallback?: any) => any)

export interface IColor {
  alpha: number
  hex: Hex
  hexa: Hexa
  hsla: HSLA
  hsva: HSVA
  hue: number
  rgba: RGBA
}
