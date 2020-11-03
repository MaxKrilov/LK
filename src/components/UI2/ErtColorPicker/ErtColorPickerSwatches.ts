import './ErtColorPickerSwatches.scss'

import Vue, { VNode, CreateElement } from 'vue'
import Component from 'vue-class-component'

import ErtIcon from '@/components/UI2/ErtIcon'

import colors from '@/utils/colors'
import { ErtColorPickerColor, fromHex, parseColor } from './util'
import { convertToUnit, deepEqual } from '@/functions/helper2'

import { contrastRatio } from '@/utils/colorUtils'

function parseDefaultColors (colors: Record<string, Record<string, string>>) {
  return Object.keys(colors).map(key => {
    const color = colors[key]
    return color.base ? [
      color.base,
      color.darken4,
      color.darken3,
      color.darken2,
      color.darken1,
      color.lighten1,
      color.lighten2,
      color.lighten3,
      color.lighten4,
      color.lighten5
    ] : [
      color.black,
      color.white,
      color.transparent
    ]
  })
}

const white = fromHex('#FFFFFF').rgba
const black = fromHex('#000000').rgba

const props = {
  swatches: {
    type: Array,
    default: () => parseDefaultColors(colors)
  },
  color: Object,
  maxWidth: [Number, String],
  maxHeight: [Number, String]
}

@Component({
  props
})
export default class ErtColorPickerSwatches extends Vue {
  // Props
  readonly swatches!: string[][]
  readonly color!: ErtColorPickerColor
  readonly maxWidth!: number | string
  readonly maxHeight!: number | string

  // Methods
  genColor (color: string) {
    const content = this.$createElement('div', {
      style: {
        background: color
      }
    }, [
      deepEqual(this.color, parseColor(color, null)) && this.$createElement(ErtIcon, {
        props: {
          small: true,
          name: 'circle_ok'
        },
        style: {
          color: contrastRatio(this.color.rgba, white) > 2 && this.color.alpha > 0.5
            ? '#000000'
            : contrastRatio(this.color.rgba, black) > 2 && this.color.alpha > 0.5
              ? '#FFFFFF'
              : undefined
        }
      })
    ])

    return this.$createElement('div', {
      staticClass: 'ert-color-picker__color',
      on: {
        click: () => this.$emit('update:color', fromHex(color === 'transparent' ? '#00000000' : color))
      }
    }, [content])
  }

  genSwatches () {
    return this.swatches.map(swatch => {
      const colors = swatch.map(this.genColor)

      return this.$createElement('div', {
        staticClass: 'ert-color-picker__swatch'
      }, colors)
    })
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-color-picker__swatches',
      style: {
        maxWidth: convertToUnit(this.maxWidth),
        maxHeight: convertToUnit(this.maxHeight)
      }
    }, [
      this.$createElement('div', this.genSwatches())
    ])
  }
}
