// Utilities
import {
  HSVA,
  HSVAtoRGBA,
  HSVAtoHex,
  RGBA,
  Hex,
  RGBAtoHSVA,
  HexToHSVA,
  HSLA,
  HSVAtoHSLA,
  RGBAtoHex,
  HSLAtoHSVA,
  parseHex,
  Hexa
} from '@/utils/colorUtils'

export interface ErtColorPickerColor {
  alpha: number
  hex: Hex
  hexa: Hexa
  hsla: HSLA
  hsva: HSVA
  hue: number
  rgba: RGBA
}

export function fromHSVA (hsva: HSVA): ErtColorPickerColor {
  hsva = { ...hsva }
  const hexa = HSVAtoHex(hsva)
  const hsla = HSVAtoHSLA(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba
  }
}

export function fromHSLA (hsla: HSLA): ErtColorPickerColor {
  const hsva = HSLAtoHSVA(hsla)
  const hexa = HSVAtoHex(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba
  }
}

export function fromRGBA (rgba: RGBA): ErtColorPickerColor {
  const hsva = RGBAtoHSVA(rgba)
  const hexa = RGBAtoHex(rgba)
  const hsla = HSVAtoHSLA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba
  }
}

export function fromHexa (hexa: Hexa): ErtColorPickerColor {
  const hsva = HexToHSVA(hexa)
  const hsla = HSVAtoHSLA(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba
  }
}

export function fromHex (hex: Hex): ErtColorPickerColor {
  return fromHexa(parseHex(hex))
}

function has (obj: object, key: string[]) {
  return key.every(k => obj.hasOwnProperty(k))
}

export function parseColor (color: any, oldColor: ErtColorPickerColor | null) {
  if (!color) return fromRGBA({ r: 255, g: 0, b: 0, a: 1 })

  if (typeof color === 'string') {
    if (color === 'transparent') return fromHexa('#00000000')

    const hex = parseHex(color)

    if (oldColor && hex === oldColor.hexa) return oldColor
    else return fromHexa(hex)
  }

  if (typeof color === 'object') {
    if (color.hasOwnProperty('alpha')) return color

    const a = color.hasOwnProperty('a') ? parseFloat(color.a) : 1

    if (has(color, ['r', 'g', 'b'])) {
      if (oldColor && color === oldColor.rgba) return oldColor
      else return fromRGBA({ ...color, a })
    } else if (has(color, ['h', 's', 'l'])) {
      if (oldColor && color === oldColor.hsla) return oldColor
      else return fromHSLA({ ...color, a })
    } else if (has(color, ['h', 's', 'v'])) {
      if (oldColor && color === oldColor.hsva) return oldColor
      else return fromHSVA({ ...color, a })
    }
  }

  return fromRGBA({ r: 255, g: 0, b: 0, a: 1 })
}

function stripAlpha (color: any, stripAlpha: boolean) {
  if (stripAlpha) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { a, ...rest } = color

    return rest
  }

  return color
}

export function extractColor (color: ErtColorPickerColor, input: any) {
  if (input == null) return color

  if (typeof input === 'string') {
    return input.length === 7 ? color.hex : color.hexa
  }

  if (typeof input === 'object') {
    if (has(input, ['r', 'g', 'b'])) return stripAlpha(color.rgba, !input.a)
    else if (has(input, ['h', 's', 'l'])) return stripAlpha(color.hsla, !input.a)
    else if (has(input, ['h', 's', 'v'])) return stripAlpha(color.hsva, !input.a)
  }

  return color
}

export function hasAlpha (color: any) {
  if (!color) return false

  if (typeof color === 'string') {
    return color.length > 7
  }

  if (typeof color === 'object') {
    return has(color, ['a']) || has(color, ['alpha'])
  }

  return false
}
