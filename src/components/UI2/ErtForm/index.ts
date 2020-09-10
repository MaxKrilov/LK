import ErtInput from '@/components/UI2/ErtInput'

import Component, { mixins } from 'vue-class-component'

import ErBindAttrs from '@/mixins2/ErBindAttrs'
import { provide as RegistrableProvide } from '@/mixins2/ErRegistrableMixin'

import { CreateElement, VNode } from 'vue'

type ErrorBag = Record<number, boolean>
type ErtInputInstance = InstanceType<typeof ErtInput>
type Watchers = {
  _uid: number
  valid: () => void
  shouldValidate: () => void
}

const baseMixins = mixins(
  ErBindAttrs,
  RegistrableProvide('form')
)

const props = {
  disabled: Boolean,
  lazyValidation: Boolean,
  readonly: Boolean,
  value: Boolean
}

const inheritAttrs = false

@Component<InstanceType<typeof ErtForm>>({
  provide (): object {
    return { form: this }
  },
  props,
  inheritAttrs,
  watch: {
    errorBag: {
      handler (val) {
        const errors = Object.values(val).includes(true)

        this.$emit('input', !errors)
      },
      deep: true,
      immediate: true
    }
  }
})
class ErtForm extends baseMixins {
  // Props
  readonly disabled!: boolean
  readonly lazyValidation!: boolean
  readonly readonly!: boolean
  readonly value!: boolean

  // Data
  inputs: ErtInputInstance[] = []
  watchers: Watchers[] = []
  errorBag: ErrorBag = {}

  // Methods
  watchInput (input: any): Watchers {
    const watcher = (input: any): (() => void) => {
      return input.$watch('hasError', (val: boolean) => {
        this.$set(this.errorBag, input._uid, val)
      }, { immediate: true })
    }

    const watchers: Watchers = {
      _uid: input._uid,
      valid: () => {},
      shouldValidate: () => {}
    }

    if (this.lazyValidation) {
      watchers.shouldValidate = input.$watch('shouldValidate', (val: boolean) => {
        if (!val) return

        if (this.errorBag.hasOwnProperty(input._uid)) return

        watchers.valid = watcher(input)
      })
    } else {
      watchers.valid = watcher(input)
    }

    return watchers
  }
  validate (): boolean {
    return this.inputs.filter(input => !input.validate(true)).length === 0
  }
  reset (): void {
    this.inputs.forEach(input => input.reset())
    this.resetErrorBag()
  }
  resetErrorBag () {
    if (this.lazyValidation) {
      setTimeout(() => {
        this.errorBag = {}
      }, 0)
    }
  }
  resetValidation () {
    this.inputs.forEach(input => input.resetValidation())
    this.resetErrorBag()
  }
  register (input: ErtInputInstance) {
    this.inputs.push(input)
    this.watchers.push(this.watchInput(input))
  }
  unregister (input: ErtInputInstance) {
    const found = this.inputs.find(i => i._uid === input._uid)

    if (!found) return

    const unwatch = this.watchers.find(i => i._uid === found._uid)
    if (unwatch) {
      unwatch.valid()
      unwatch.shouldValidate()
    }

    this.watchers = this.watchers.filter(i => i._uid !== found._uid)
    this.inputs = this.inputs.filter(i => i._uid !== found._uid)
    this.$delete(this.errorBag, found._uid)
  }

  render (h: CreateElement): VNode {
    return h('form', {
      staticClass: 'ert-form',
      attrs: {
        novalidate: true,
        ...this.attrs$
      },
      on: {
        submit: (e: Event) => this.$emit('submit', e)
      }
    }, this.$slots.default)
  }
}

export { ErtForm }
export default ErtForm
