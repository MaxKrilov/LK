import Component, { mixins } from 'vue-class-component'

import { inject as RegistrableInject } from '@/mixins2/ErRegistrableMixin'

import { deepEqual } from '@/functions/helper2'
import { InputMessage, InputValidationRules } from '@/types'

const props = {
  disabled: Boolean,
  error: Boolean,
  errorCount: {
    type: [Number, String],
    default: 1
  },
  errorMessages: {
    type: [String, Array],
    default: () => []
  },
  messages: {
    type: [String, Array],
    default: () => []
  },
  readonly: Boolean,
  rules: {
    type: Array,
    default: () => []
  },
  success: Boolean,
  successMessages: {
    type: [String, Array],
    default: () => []
  },
  validateOnBlur: Boolean,
  value: { required: false }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErValidatable>>({
  props,
  watch: {
    rules: {
      handler (newVal, oldVal) {
        if (deepEqual(newVal, oldVal)) return
        this.validate()
      },
      deep: true
    },
    internalValue () {
      this.hasInput = true
      this.validateOnBlur || this.$nextTick(this.validate)
    },
    isFocused (val) {
      if (
        !val &&
        !this.isDisabled
      ) {
        this.hasFocused = true
        this.validateOnBlur && this.$nextTick(this.validate)
      }
    },
    isResetting () {
      setTimeout(() => {
        this.hasInput = false
        this.hasFocused = false
        this.isResetting = false
        this.validate()
      }, 0)
    },
    hasError (val) {
      if (this.shouldValidate) {
        this.$emit('update:error', val)
      }
    },
    value (val) {
      this.lazyValue = val
    }
  }
})
export default class ErValidatable extends mixins(RegistrableInject<'form', any>('form')) {
  // Props
  readonly disabled!: boolean
  readonly error!: boolean
  readonly errorCount!: number | string
  readonly errorMessages!: InputMessage | null
  readonly messages!: InputMessage | null
  readonly readonly!: boolean
  readonly rules!: InputValidationRules
  readonly success!: boolean
  readonly successMessages!: InputMessage
  readonly validateOnBlur!: boolean
  readonly value!: any

  // Data
  errorBucket: string[] = []
  hasFocused: boolean = false
  hasInput: boolean = false
  isFocused: boolean = false
  isResetting: boolean = false
  lazyValue: any = this.value
  valid: boolean = false

  // Computed
  get hasError (): boolean {
    return (
      this.internalErrorMessages.length > 0 ||
      this.errorBucket.length > 0 ||
      this.error
    )
  }

  get hasSuccess (): boolean {
    return (
      this.internalSuccessMessages.length > 0 ||
      this.success
    )
  }

  get externalError (): boolean {
    return this.internalErrorMessages.length > 0 || this.error
  }

  get hasMessages (): boolean {
    return this.validationTarget.length > 0
  }

  get hasState (): boolean {
    if (this.isDisabled) return false

    return (
      this.hasSuccess ||
      (this.shouldValidate && this.hasError)
    )
  }

  get internalErrorMessages (): InputValidationRules {
    return this.genInternalMessages(this.errorMessages)
  }

  get internalMessages (): InputValidationRules {
    return this.genInternalMessages(this.messages)
  }

  get internalSuccessMessages (): InputValidationRules {
    return this.genInternalMessages(this.successMessages)
  }

  get isDisabled (): boolean {
    return this.disabled || (
      !!this.form &&
      this.form.disabled
    )
  }

  get isInteractive (): boolean {
    return !this.isDisabled && !this.isReadonly
  }

  get isReadonly (): boolean {
    return this.readonly || (
      !!this.form &&
      this.form.readonly
    )
  }

  get shouldValidate (): boolean {
    if (this.externalError) return true
    if (this.isResetting) return false

    return this.validateOnBlur
      ? this.hasFocused && !this.isFocused
      : (this.hasInput || this.hasFocused)
  }

  get validations (): InputValidationRules {
    return this.validationTarget.slice(0, Number(this.errorCount))
  }

  get validationState (): string | undefined {
    if (this.isDisabled) return undefined
    if (this.hasError && this.shouldValidate) return 'error'
    if (this.hasSuccess) return 'success'
    return undefined
  }

  get validationTarget (): InputValidationRules {
    if (this.internalErrorMessages.length > 0) {
      return this.internalErrorMessages
    } else if (this.successMessages && this.successMessages.length > 0) {
      return this.internalSuccessMessages
    } else if (this.messages && this.messages.length > 0) {
      return this.internalMessages
    } else if (this.shouldValidate) {
      return this.errorBucket
    } else return []
  }

  // Proxy
  get internalValue () {
    return this.lazyValue
  }
  set internalValue (val: any) {
    this.lazyValue = val

    this.$emit('input', val)
  }

  // Hooks
  beforeMount () {
    this.validate()
  }

  created () {
    this.form && this.form.register(this)
  }

  beforeDestroy () {
    this.form && this.form.unregister(this)
  }

  // Methods
  genInternalMessages (messages: InputMessage | null): InputValidationRules {
    if (!messages) return []
    else if (Array.isArray(messages)) return messages
    else return [messages]
  }

  reset () {
    this.isResetting = true
    this.internalValue = Array.isArray(this.internalValue)
      ? []
      : undefined
  }

  resetValidation () {
    this.isResetting = true
  }

  validate (force = false, value?: any): boolean {
    const errorBucket = []
    value = value || this.internalValue

    if (force) this.hasInput = this.hasFocused = true

    for (let index = 0; index < this.rules.length; index++) {
      const rule = this.rules[index]
      const valid = typeof rule === 'function' ? rule(value) : rule

      if (valid === false || typeof valid === 'string') {
        errorBucket.push(valid || '')
      } else if (typeof valid !== 'boolean') {
        console.error(`Rules should return a string or boolean, received '${typeof valid}' instead`)
      }
    }

    this.errorBucket = errorBucket
    this.valid = errorBucket.length === 0

    return this.valid
  }
}
