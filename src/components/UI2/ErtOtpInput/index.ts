import './style.scss'
import '@/components/UI2/ErtTextField/style.scss'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ErtInput from '@/components/UI2/ErtInput'
import ErtTextField from '@/components/UI2/ErtTextField'

import Ripple from '@/directives/ripple'

import { convertToUnit } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

import { CreateElement, VNode } from 'vue'

@Component<InstanceType<typeof ErtOtpInput>>({
  inheritAttrs: false,
  directives: { Ripple },
  watch: {
    isFocused: 'updateValue',
    value (val) {
      this.lazyValue = val
      this.otp = val?.split('') || []
    }
  }
})
class ErtOtpInput extends ErtInput {
  /// Options
  $refs!: {
    input: HTMLInputElement[]
  }

  /// Props
  @Prop({ type: [Number, String], default: 6 })
  readonly length!: number | string

  @Prop({ type: String, default: 'text' })
  readonly type!: string

  /// Data
  badInput: boolean = false

  initialValue: null = null

  isBooted: boolean = false

  otp: string[] = []

  /// Computed
  get classes (): object {
    return {
      ...ErtInput.options.computed.classes.get.call(this),
      ...ErtTextField.options.computed.classes.get.call(this)
    }
  }

  get isDirty (): boolean {
    return ErtInput.options.computed.isDirty.get.call(this) || this.badInput
  }

  /// Hooks
  created () {
    this.otp = this.internalValue?.split('') || []
  }

  mounted () {
    requestAnimationFrame(() => (this.isBooted = true))
  }

  /// Methods
  focus (e: Event, otpIdx: number) {
    this.onFocus(e, otpIdx || 0)
  }

  // @ts-ignore
  genInputSlot (otpIdx: number) {
    return this.$createElement('div', {
      staticClass: 'ert-input__slot',
      style: { height: convertToUnit(this.height) },
      on: {
        click: () => this.onClick(otpIdx),
        mousedown: (e: Event) => this.onMouseDown(e, otpIdx),
        mouseup: (e: Event) => this.onMouseUp(e, otpIdx)
      }
    }, [this.genDefaultSlot(otpIdx)])
  }

  // @ts-ignore
  genControl (otpIdx: number) {
    return this.$createElement('div', {
      staticClass: 'ert-input__control'
    }, [this.genInputSlot(otpIdx)])
  }

  // @ts-ignore
  genDefaultSlot (otpIdx: number) {
    return [
      this.genFieldset(),
      this.genTextFieldSlot(otpIdx)
    ]
  }

  genContent () {
    return Array.from({ length: +this.length }, (_, i) => {
      return this.$createElement('div', {
        staticClass: 'ert-input',
        class: this.classes
      }, [this.genControl(i)])
    })
  }

  genFieldset () {
    return this.$createElement('fieldset', {
      attrs: {
        'aria-hidden': true
      }
    }, [this.genLegend()])
  }

  genLegend () {
    const span = this.$createElement('span', {
      domProps: { innerHTML: '&#8203;' }
    })

    return this.$createElement('legend', {
      style: {
        width: '0px'
      }
    }, [span])
  }

  genInput (otpIdx: number) {
    const listeners = Object.assign({}, this.listeners$)
    delete listeners.change

    return this.$createElement('input', {
      style: {},
      domProps: {
        value: this.otp[otpIdx],
        min: this.type === 'number' ? 0 : null
      },
      attrs: {
        ...this.attrs$,
        disabled: this.isDisabled,
        readonly: this.isReadonly,
        type: this.type,
        id: `${this.computedId}-${otpIdx}`,
        class: `otp-field-box--${otpIdx}`,
        maxLength: 1
      },
      on: Object.assign(listeners, {
        blur: this.onBlur,
        input: (e: Event) => this.onInput(e, otpIdx),
        focus: (e: Event) => this.onFocus(e, otpIdx),
        paste: (e: ClipboardEvent) => this.onPaste(e, otpIdx),
        keydown: this.onKeyDown,
        keyup: (e: KeyboardEvent) => this.onKeyUp(e, otpIdx)
      }),
      ref: 'input',
      refInFor: true
    })
  }

  genTextFieldSlot (otpIdx: number): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-text-field__slot'
    }, [this.genInput(otpIdx)])
  }

  onBlur (e?: Event) {
    this.isFocused = false
    e && this.$nextTick(() => this.$emit('blur', e))
  }

  // @ts-ignore
  onClick (otpIdx: number) {
    if (this.isFocused || this.isDisabled || !this.$refs.input[otpIdx]) return

    this.onFocus(undefined, otpIdx)
  }

  onFocus (e?: Event, otpIdx?: number) {
    e?.preventDefault()
    e?.stopPropagation()

    const elements = this.$refs.input
    const ref = this.$refs.input && elements[otpIdx || 0]

    if (!ref) return

    if (document.activeElement !== ref) {
      ref.focus()
      return ref.select()
    }

    if (!this.isFocused) {
      this.isFocused = true
      ref.select()
      e && this.$emit('focus', e)
    }
  }

  onInput (e: Event, otpIdx: number) {
    const target = e.target as HTMLInputElement
    const value = target.value
    this.applyValue(otpIdx, target.value, () => {
      this.internalValue = this.otp.join('')
    })
    this.badInput = target.validity && target.validity.badInput

    const nextIndex = otpIdx + 1

    if (value) {
      if (nextIndex < +this.length) {
        this.changeFocus(nextIndex)
      } else {
        this.clearFocus(otpIdx)
        this.onCompleted()
      }
    }
  }

  clearFocus (index: number) {
    const input = this.$refs.input[index]
    input.blur()
  }

  onKeyDown (e: KeyboardEvent) {
    if (e.keyCode === keyCodes.DOM_VK_ENTER) {
      this.$emit('change', this.internalValue)
    }

    this.$emit('keydown', e)
  }

  // @ts-ignore
  onMouseDown (e: Event, otpIdx: number) {
    if (e.target !== this.$refs.input[otpIdx]) {
      e.preventDefault()
      e.stopPropagation()
    }

    ErtInput.options.methods.onMouseDown.call(this, e)
  }

  // @ts-ignore
  onMouseUp (e: Event, otpIdx: number) {
    if (this.hasMouseDown) this.focus(e, otpIdx)

    ErtInput.options.methods.onMouseUp.call(this, e)
  }

  onPaste (event: ClipboardEvent, index: number) {
    event.preventDefault()

    const maxCursor = +this.length - 1
    const inputVal = event?.clipboardData?.getData('Text')
    const inputDataArray = inputVal?.split('') || []
    const newOtp = [...this.otp]

    for (let i = 0; i < inputDataArray.length; i++) {
      const appIdx = index + 1
      if (appIdx > maxCursor) break
      newOtp[appIdx] = inputDataArray[i].toString()
    }

    this.otp = newOtp
    this.internalValue = this.otp.join('')
    const targetFocus = Math.min(index + inputDataArray.length, maxCursor)
    this.changeFocus(targetFocus)

    if (newOtp.length === +this.length) {
      this.onCompleted()
      this.clearFocus(targetFocus)
    }
  }

  applyValue (index: number, inputVal: string, next: Function) {
    const newOtp = [...this.otp]
    newOtp[index] = inputVal
    this.otp = newOtp
    next()
  }

  changeFocus (index: number) {
    this.onFocus(undefined, index || 0)
  }

  updateValue (val: Boolean) {
    if (val) {
      this.initialValue = this.lazyValue
    } else if (this.initialValue !== this.lazyValue) {
      this.$emit('change', this.lazyValue)
    }
  }

  onKeyUp (event: KeyboardEvent, index: number) {
    event.preventDefault()
    const eventKey = event.key

    if (['Tab', 'Shift', 'Meta', 'Control', 'Alt', 'Delete'].includes(eventKey)) return

    if (eventKey === 'ArrowLeft' || (eventKey === 'Backspace' && !this.otp[index])) {
      return index > 0 && this.changeFocus(index - 1)
    }
    if (eventKey === 'ArrowRight') {
      return index + 1 < +this.length && this.changeFocus(index + 1)
    }
  }

  onCompleted () {
    const rsp = this.otp.join('')
    if (rsp.length === +this.length) {
      this.$emit('finish', rsp)
    }
  }

  /// Render
  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-otp-input'
    }, this.genContent())
  }
}

export { ErtOtpInput }
export default ErtOtpInput
