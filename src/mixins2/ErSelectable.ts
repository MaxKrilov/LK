import ErtInput from '@/components/UI2/ErtInput'

import ErRippleable from '@/mixins2/ErRippleable'
import ErComparable from '@/mixins2/ErComparable'

import Component, { mixins } from 'vue-class-component'

export function prevent (e: Event) {
  e.preventDefault()
}

const baseMixins = mixins(
  ErtInput,
  ErRippleable,
  ErComparable
)

const model = {
  prop: 'inputValue',
  event: 'change'
}

const props = {
  id: String,
  inputValue: { required: false },
  falseValue: { required: false },
  trueValue: { required: false },
  multiple: {
    type: Boolean,
    default: null
  },
  label: String
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErSelectable>>({
  model,
  props,
  watch: {
    inputValue (val) {
      this.lazyValue = val
    }
  }
})
export default class ErSelectable extends baseMixins {
  // Props
  readonly id!: string
  readonly inputValue!: any
  readonly falseValue!: any
  readonly trueValue!: any
  readonly multiple!: boolean
  readonly label!: string

  // Data
  lazyValue: any = this.inputValue

  // Computed
  get isMultiple (): boolean {
    return this.multiple === true || (this.multiple === null && Array.isArray(this.internalValue))
  }
  get isActive (): boolean {
    const value = this.value
    const input = this.internalValue

    if (this.isMultiple) {
      if (!Array.isArray(input)) return false

      return input.some(item => this.valueComparator(item, value))
    }

    if (this.trueValue === undefined || this.falseValue === undefined) {
      return value
        ? this.valueComparator(value, input)
        : Boolean(input)
    }

    return this.valueComparator(input, this.trueValue)
  }
  get isDirty (): boolean {
    return this.isActive
  }
  get rippleState (): string | undefined {
    return !this.isDisabled && !this.validationState
      ? undefined
      : this.validationState
  }

  // Methods
  genLabel () {
    const label = ErtInput.options.methods.genLabel.call(this)

    if (!label) return label

    label!.data!.on = {
      click: prevent
    }

    return label
  }
  genInput (type: string, attrs: object) {
    return this.$createElement('input', {
      attrs: Object.assign({
        'aria-checked': this.isActive.toString(),
        disabled: this.isDisabled,
        id: this.computedId,
        role: type,
        type
      }, attrs),
      domProps: {
        value: this.value,
        checked: this.isActive
      },
      on: {
        blur: this.onBlur,
        change: this.onChange,
        focus: this.onFocus,
        keydown: this.onKeydown,
        click: prevent
      },
      ref: 'input'
    })
  }
  onBlur () {
    this.isFocused = false
  }
  onClick (e: Event) {
    this.onChange()
    this.$emit('click', e)
  }
  onChange () {
    if (!this.isInteractive) return

    const value = this.value
    let input = this.internalValue

    if (this.isMultiple) {
      if (!Array.isArray(input)) {
        input = []
      }

      const length = input.length

      input = input.filter((item: any) => !this.valueComparator(item, value))

      if (input.length === length) {
        input.push(value)
      }
    } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
      input = this.valueComparator(input, this.trueValue)
        ? this.falseValue
        : this.trueValue
    } else if (value) {
      input = this.valueComparator(input, value)
        ? null
        : value
    } else {
      input = !input
    }

    this.validate(true, input)
    this.internalValue = input
  }
  onFocus () {
    this.isFocused = true
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeydown (e: Event) {}
}
