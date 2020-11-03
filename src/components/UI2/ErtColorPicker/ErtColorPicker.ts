import './ErtColorPicker.scss'

import ErtColorPickerCanvas from './ErtColorPickerCanvas'
import ErtColorPickerEdit, { Mode, modes } from './ErtColorPickerEdit'
import ErtColorPickerPreview from './ErtColorPickerPreview'
import ErtColorPickerSwatches from './ErtColorPickerSwatches'

import { ErtColorPickerColor, parseColor, fromRGBA, extractColor, hasAlpha } from './util'
import { deepEqual } from '@/functions/helper2'

import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'

const props = {
  canvasHeight: {
    type: [String, Number],
    default: 150
  },
  disabled: Boolean,
  dotSize: {
    type: [Number, String],
    default: 10
  },
  flat: Boolean,
  hideCanvas: Boolean,
  hideInputs: Boolean,
  hideModeSwitch: Boolean,
  mode: {
    type: String,
    default: 'rgba',
    validator: (v: string) => Object.keys(modes).includes(v)
  },
  showSwatches: Boolean,
  swatches: Array,
  swatchesMaxHeight: {
    type: [Number, String],
    default: 150
  },
  value: {
    type: [Object, String]
  },
  width: {
    type: [Number, String],
    default: 300
  }
}

@Component<InstanceType<typeof ErtColorPicker>>({
  props,
  watch: {
    value: {
      handler (color: any) {
        this.updateColor(parseColor(color, this.internalValue))
      },
      immediate: true
    }
  }
})
export default class ErtColorPicker extends Vue {
  // Props
  readonly canvasHeight!: string | number
  readonly disabled!: boolean
  readonly dotSize!: number | string
  readonly flat!: boolean
  readonly hideCanvas!: boolean
  readonly hideInputs!: boolean
  readonly hideModeSwitch!: boolean
  readonly mode!: string
  readonly showSwatches!: boolean
  readonly swatches!: string[][]
  readonly swatchesMaxHeight!: number | string
  readonly value!: object | string
  readonly width!: number | string

  // Data
  internalValue: ErtColorPickerColor = fromRGBA({ r: 255, g: 0, b: 0, a: 1 })

  // Computed
  get hideAlpha () {
    if (!this.value) return false

    return !hasAlpha(this.value)
  }

  // Methods
  updateColor (color: ErtColorPickerColor) {
    this.internalValue = color
    const value = extractColor(this.internalValue, this.value)

    if (!deepEqual(value, this.value)) {
      this.$emit('input', value)
      this.$emit('update:color', this.internalValue)
    }
  }
  genCanvas (): VNode {
    return this.$createElement(ErtColorPickerCanvas, {
      props: {
        color: this.internalValue,
        disabled: this.disabled,
        dotSize: this.dotSize,
        width: this.width,
        height: this.canvasHeight
      },
      on: {
        'update:color': this.updateColor
      }
    })
  }
  genControls (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-color-picker__controls'
    }, [
      this.genPreview(),
      !this.hideInputs && this.genEdit()
    ])
  }
  genEdit (): VNode {
    return this.$createElement(ErtColorPickerEdit, {
      props: {
        color: this.internalValue,
        disabled: this.disabled,
        hideAlpha: this.hideAlpha,
        hideModeSwitch: this.hideModeSwitch,
        mode: this.mode
      },
      on: {
        'update:color': this.updateColor,
        'update:mode': (v: Mode) => this.$emit('update:mode', v)
      }
    })
  }
  genPreview (): VNode {
    return this.$createElement(ErtColorPickerPreview, {
      props: {
        color: this.internalValue,
        disabled: this.disabled,
        hideAlpha: this.hideAlpha
      },
      on: {
        'update:color': this.updateColor
      }
    })
  }
  genSwatches (): VNode {
    return this.$createElement(ErtColorPickerSwatches, {
      props: {
        swatches: this.swatches,
        color: this.internalValue,
        maxHeight: this.swatchesMaxHeight
      },
      on: {
        'update:color': this.updateColor
      }
    })
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-color-picker',
      class: {
        'ert-color-picker--flat': this.flat
      },
      props: {
        maxWidth: this.width
      }
    }, [
      !this.hideCanvas && this.genCanvas(),
      this.genControls(),
      this.showSwatches && this.genSwatches()
    ])
  }
}
