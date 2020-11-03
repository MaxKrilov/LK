import './ErtColorPickerEdit.scss'

import ErtIcon from '@/components/UI2/ErtIcon'

import { parseHex } from '@/utils/colorUtils'

import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'

import { ErtColorPickerColor, fromRGBA, fromHexa, fromHSLA } from './util'

type Input = [string, number, string]

export type Mode = {
  inputs?: Input[]
  from: Function
}

export const modes = {
  rgba: {
    inputs: [
      ['r', 255, 'int'],
      ['g', 255, 'int'],
      ['b', 255, 'int'],
      ['a', 1, 'float']
    ],
    from: fromRGBA
  },
  hsla: {
    inputs: [
      ['h', 360, 'int'],
      ['s', 1, 'float'],
      ['l', 1, 'float'],
      ['a', 1, 'float']
    ],
    from: fromHSLA
  },
  hexa: {
    from: fromHexa
  }
} as { [key: string]: Mode }

type mode = 'rgba' | 'hsla' | 'hexa'

const props = {
  color: Object,
  disabled: Boolean,
  hideAlpha: Boolean,
  hideModeSwitch: Boolean,
  mode: {
    type: String,
    default: 'rgba',
    validator: (v: string) => Object.keys(modes).includes(v)
  }
}

@Component<InstanceType<typeof ErtColorPickerEdit>>({
  props,
  watch: {
    mode (mode) {
      this.internalMode = mode
    }
  }
})
export default class ErtColorPickerEdit extends Vue {
  // Props
  readonly color!: ErtColorPickerColor
  readonly disabled!: boolean
  readonly hideAlpha!: boolean
  readonly hideModeSwitch!: boolean
  readonly mode!: mode

  // Data
  modes: { [key: string]: Mode } = modes
  internalMode = this.mode

  // Computed
  get currentMode (): Mode {
    return this.modes[this.internalMode]
  }

  // Hooks
  created () {
    this.internalMode = this.mode
  }

  // Methods
  getValue (v: any, type: string) {
    if (type === 'float') return Math.round(v * 100) / 100
    else if (type === 'int') return Math.round(v)
    else return 0
  }
  parseValue (v: string, type: string) {
    if (type === 'float') return parseFloat(v)
    else if (type === 'int') return parseInt(v, 10) || 0
    else return 0
  }
  changeMode () {
    const modes = Object.keys(this.modes)
    const index = modes.indexOf(this.internalMode)
    const newMode = modes[(index + 1) % modes.length]
    this.internalMode = newMode as mode
    this.$emit('update:mode', newMode)
  }
  genInput (target: string, attrs: any, value: any, on: any): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-color-picker__input'
    }, [
      this.$createElement('input', {
        key: target,
        attrs,
        domProps: {
          value
        },
        on
      }),
      this.$createElement('span', target.toUpperCase())
    ])
  }
  genInputs (): VNode[] | VNode {
    switch (this.internalMode) {
      case 'hexa': {
        const hex = this.color.hexa
        const value = this.hideAlpha && hex.endsWith('FF') ? hex.substr(0, 7) : hex
        return this.genInput(
          'hex',
          {
            maxlength: this.hideAlpha ? 7 : 9,
            disabled: this.disabled
          },
          value,
          {
            change: (e: Event) => {
              const el = e.target as HTMLInputElement
              this.$emit('update:color', this.currentMode.from(parseHex(el.value)))
            }
          }
        )
      }
      default: {
        const inputs = this.hideAlpha ? this.currentMode.inputs!.slice(0, -1) : this.currentMode.inputs!
        return inputs.map(([target, max, type]) => {
          const value = this.color[this.internalMode as keyof ErtColorPickerColor] as any
          return this.genInput(
            target,
            {
              type: 'number',
              min: 0,
              max,
              step: type === 'float' ? '0.01' : type === 'int' ? '1' : undefined,
              disabled: this.disabled
            },
            this.getValue(value[target], type),
            {
              input: (e: Event) => {
                const el = e.target as HTMLInputElement
                const newVal = this.parseValue(el.value || '0', type)

                this.$emit('update:color', this.currentMode.from(
                  Object.assign({}, value, { [target]: newVal }),
                  this.color.alpha
                ))
              }
            }
          )
        })
      }
    }
  }
  genSwitch (): VNode {
    return this.$createElement('er-button', {
      props: {
        small: true,
        icon: true,
        disabled: this.disabled,
        flat: true
      },
      on: {
        click: this.changeMode
      }
    }, [
      this.$createElement(ErtIcon, { props: { name: 'unfold' } })
    ])
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-color-picker__edit'
    }, [
      this.genInputs(),
      !this.hideModeSwitch && this.genSwitch()
    ])
  }
}
