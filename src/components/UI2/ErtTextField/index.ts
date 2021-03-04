import './style.scss'

import { VNode } from 'vue/types'
import Component, { mixins } from 'vue-class-component'

import ErtInput from '@/components/UI2/ErtInput'

import ErtCounter from '@/components/UI2/ErtCounter'
import ErtLabel from '@/components/UI2/ErtLabel'

import ErtIntersectableMixin from '@/mixins2/ErtIntersectableMixin'
import ErtLoadableMixin from '@/mixins2/ErtLoadableMixin'

import Ripple from '@/directives/ripple'

import { convertToUnit } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month']

const baseMixins = mixins(
  ErtInput,
  ErtIntersectableMixin({
    onVisible: [
      'setLabelWidth',
      'setPrefixWidth',
      'setPrependWidth',
      'tryAutofocus'
    ]
  }),
  ErtLoadableMixin
)

const directives = { Ripple }

const inheritAttrs = false

const props = {
  appendOuterIcon: String,
  autofocus: Boolean,
  clearable: Boolean,
  clearIcon: {
    type: String,
    default: 'close'
  },
  counter: [Boolean, Number, String],
  counterValue: Function,
  fullWidth: Boolean,
  label: String,
  placeholder: String,
  prefix: String,
  prependInnerIcon: String,
  suffix: String,
  type: {
    type: String,
    default: 'text'
  }
}

@Component<InstanceType<typeof ErtTextField>>({
  inheritAttrs,
  directives,
  props,
  watch: {
    labelValue: 'setLabelWidth',
    outlined: 'setLabelWidth',
    label () {
      this.$nextTick(this.setLabelWidth)
    },
    prefix () {
      this.$nextTick(this.setPrefixWidth)
    },
    isFocused: 'updateValue',
    value (val) {
      this.lazyValue = val
    }
  }
})
class ErtTextField extends baseMixins {
  // Options
  $refs!: {
    label: HTMLElement
    input: HTMLInputElement
    'prepend-inner': HTMLElement
    prefix: HTMLElement
    suffix: HTMLElement
  }

  // Props
  readonly appendOuterIcon!: string
  readonly autofocus!: boolean
  readonly clearable!: boolean
  readonly clearIcon!: string
  readonly counter!: boolean | number | string
  readonly counterValue!: (value: any) => number
  readonly fullWidth!: boolean
  readonly label!: string
  readonly placeholder!: string
  readonly prefix!: string
  readonly prependInnerIcon!: string
  readonly suffix!: string
  readonly type!: string

  // Data
  badInput: boolean = false
  labelWidth: number = 0
  prefixWidth: number = 0
  prependWidth: number = 0
  initialValue: any = null
  isBooted: boolean = false
  isClearing: boolean = false

  // Computed
  get classes (): object {
    return {
      ...ErtInput.options.computed.classes.get.call(this),
      'ert-text-field': true,
      'ert-text-field--full-width': this.fullWidth,
      'ert-text-field--prefix': this.prefix,
      'ert-text-field--is-booted': this.isBooted,
      'ert-text-field--placeholder': this.placeholder,
      'ert-text-field--is-error': this.hasError,
      'ert-text-field--is-success': this.hasSuccess
    }
  }

  get computedCounterValue (): number {
    if (typeof this.counterValue === 'function') {
      return this.counterValue(this.internalValue)
    }
    return (this.internalValue || '').toString().length
  }

  get hasCounter (): boolean {
    return this.counter !== false && this.counter != null
  }

  get hasDetails (): boolean {
    return ErtInput.options.computed.hasDetails.get.call(this) || this.hasCounter
  }

  get isDirty (): boolean {
    return this.lazyValue?.toString().length > 0 || this.badInput
  }

  get isLabelActive (): boolean {
    return this.isDirty || dirtyTypes.includes(this.type)
  }

  get labelPosition (): Record<'left' | 'right', string | number | undefined> {
    let offset = (this.prefix && !this.labelValue) ? this.prefixWidth : 0

    if (this.labelValue && this.prependWidth) offset -= this.prependWidth

    return {
      left: offset,
      right: 'auto'
    }
  }

  get showLabel (): boolean {
    return this.hasLabel
  }

  get labelValue (): boolean {
    return Boolean(this.isFocused || this.isLabelActive || this.placeholder)
  }

  get internalValue (): any {
    return this.lazyValue
  }

  set internalValue (val: any) {
    this.lazyValue = val
    this.$emit('input', this.lazyValue)
  }

  // Methods
  focus () {
    this.onFocus()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blur (e?: Event) {
    window.requestAnimationFrame(() => {
      this.$refs.input && this.$refs.input.blur()
    })
  }
  clearableCallback () {
    this.$refs.input && this.$refs.input.focus()
    this.$nextTick(() => { this.internalValue = null })
  }
  genAppendSlot () {
    const slot = []

    if (this.$slots['append-outer']) {
      slot.push(this.$slots['append-outer'] as VNode[])
    } else if (this.appendOuterIcon) {
      slot.push(this.genIcon('appendOuter'))
    }

    return this.genSlot('append', 'outer', slot)
  }
  genPrependInnerSlot () {
    const slot = []

    if (this.$slots['prepend-inner']) {
      slot.push(this.$slots['prepend-inner'] as VNode[])
    } else if (this.prependInnerIcon) {
      slot.push(this.genIcon('prependInner'))
    }

    return this.genSlot('prepend', 'inner', slot)
  }
  genIconSlot () {
    const slot = []

    if (this.$slots['append']) {
      slot.push(this.$slots['append'] as VNode[])
    } else if (this.appendIcon) {
      slot.push(this.genIcon('append'))
    }

    return this.genSlot('append', 'inner', slot)
  }
  genInputSlot () {
    const input = ErtInput.options.methods.genInputSlot.call(this)

    const prepend = this.genPrependInnerSlot()

    if (prepend) {
      input.children = input.children || []
      input.children.unshift(prepend)
    }

    return input
  }
  genClearIcon () {
    if (!this.clearable) return null

    const data = this.isDirty ? undefined : { attrs: { disabled: true } }

    return this.genSlot('append', 'inner', [
      this.genIcon('clear', this.clearableCallback, data)
    ])
  }
  genCounter () {
    if (!this.hasCounter) return null

    const max = this.counter === true ? this.attrs$.maxlength : this.counter

    return this.$createElement(ErtCounter, {
      props: {
        max,
        value: this.computedCounterValue
      }
    })
  }
  genControl () {
    return ErtInput.options.methods.genControl.call(this)
  }
  genDefaultSlot () {
    return [
      this.genFieldset(),
      this.genTextFieldSlot(),
      this.genClearIcon(),
      this.genIconSlot(),
      this.genProgress()
    ]
  }
  genFieldset () {
    return this.$createElement('fieldset', {
      attrs: {
        'aria-hidden': true
      }
    }, [this.genLegend()])
  }
  genLabel () {
    if (!this.showLabel) return null

    const data = {
      props: {
        absolute: true,
        disabled: this.isDisabled,
        focused: this.isFocused || !!this.validationState,
        for: this.computedId,
        left: this.labelPosition.left,
        right: this.labelPosition.right,
        value: this.labelValue
      }
    }

    return this.$createElement(ErtLabel, data, this.$slots.label || this.label)
  }
  genLegend () {
    const width = this.labelValue || this.isDirty ? this.labelWidth : 0
    const span = this.$createElement('span', {
      domProps: { innerHTML: '&#8203;' }
    })

    return this.$createElement('legend', {
      style: {
        width: convertToUnit(width)
      }
    }, [span])
  }
  genInput () {
    const listeners = Object.assign({}, this.listeners$)
    delete listeners['change']

    return this.$createElement('input', {
      style: {},
      domProps: {
        value: (this.type === 'number' && Object.is(this.lazyValue, -0)) ? '-0' : this.lazyValue
      },
      attrs: {
        ...this.attrs$,
        autofocus: this.autofocus,
        disabled: this.isDisabled,
        id: this.computedId,
        placeholder: this.placeholder,
        readonly: this.isReadonly,
        type: this.type
      },
      on: Object.assign(listeners, {
        blur: this.onBlur,
        input: this.onInput,
        focus: this.onFocus,
        keydown: this.onKeyDown
      }),
      ref: 'input'
    })
  }
  genMessages () {
    if (!this.showDetails) return null

    const messagesNode = ErtInput.options.methods.genMessages.call(this)
    const counterNode = this.genCounter()

    return this.$createElement('div', {
      staticClass: 'ert-text-field__details'
    }, [
      messagesNode,
      counterNode
    ])
  }
  genTextFieldSlot () {
    return this.$createElement('div', {
      staticClass: 'ert-text-field__slot'
    }, [
      this.genLabel(),
      this.prefix ? this.genAffix('prefix') : null,
      this.genInput(),
      this.suffix ? this.genAffix('suffix') : null
    ])
  }
  genAffix (type: 'prefix' | 'suffix') {
    return this.$createElement('div', {
      class: `ert-text-field__${type}`,
      ref: type
    }, this[type])
  }
  onBlur (e?: Event) {
    this.isFocused = false
    e && this.$nextTick(() => this.$emit('blur', e))
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick (e: MouseEvent) {
    if (this.isFocused || this.isDisabled || !this.$refs.input) return

    this.$refs.input.focus()
  }
  onFocus (e?: Event) {
    if (!this.$refs.input) return

    if (document.activeElement !== this.$refs.input) {
      return this.$refs.input.focus()
    }

    if (!this.isFocused) {
      this.isFocused = true
      e && this.$emit('focus', e)
    }
  }
  onInput (e: Event) {
    const target = e.target as HTMLInputElement
    this.internalValue = target.value
    this.badInput = target.validity && target.validity.badInput
  }
  onKeyDown (e: KeyboardEvent) {
    if (e.keyCode === keyCodes.DOM_VK_ENTER) this.$emit('change', this.internalValue)

    this.$emit('keydown', e)
  }
  onMouseDown (e: Event) {
    // Prevent input from being blurred
    if (e.target !== this.$refs.input) {
      e.preventDefault()
      e.stopPropagation()
    }

    ErtInput.options.methods.onMouseDown.call(this, e)
  }
  onMouseUp (e: Event) {
    if (this.hasMouseDown) this.focus()

    ErtInput.options.methods.onMouseUp.call(this, e)
  }
  setLabelWidth () {
    this.labelWidth = this.$refs.label
      ? Math.min(this.$refs.label.scrollWidth * 0.75 + 8, (this.$el as HTMLElement).offsetWidth - 24)
      : 0
  }
  setPrefixWidth () {
    if (!this.$refs.prefix) return

    this.prefixWidth = this.$refs.prefix.offsetWidth
  }
  setPrependWidth () {
    if (!this.$refs['prepend-inner']) return

    this.prependWidth = this.$refs['prepend-inner'].offsetWidth
  }
  tryAutofocus () {
    if (
      !this.autofocus ||
      typeof document === 'undefined' ||
      !this.$refs.input ||
      document.activeElement === this.$refs.input
    ) return false

    this.$refs.input.focus()

    return true
  }
  updateValue (val: boolean) {
    if (val) {
      this.initialValue = this.lazyValue
    } else if (this.initialValue !== this.lazyValue) {
      this.$emit('change', this.lazyValue)
    }
  }

  mounted () {
    this.autofocus && this.tryAutofocus()
    this.setLabelWidth()
    this.setPrefixWidth()
    this.setPrependWidth()
    requestAnimationFrame(() => (this.isBooted = true))
  }
}

export { ErtTextField }
export default ErtTextField
