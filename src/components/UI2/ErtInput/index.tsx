import './_style.scss'

// Components
import ErtIcon from '@/components/UI2/ErtIcon'
import ErtLabel from '@/components/UI2/ErtLabel'
import ErtMessages from '@/components/UI2/ErtMessages'

// Mixins
import BindsAttrs from '@/mixins2/ErBindAttrs'
import Validatable from '@/mixins2/ErValidatable'

import {
  convertToUnit,
  getSlot,
  kebabCase
} from '@/functions/helper2'
import mergeData from '@/utils/mergeData'

import Component, { mixins } from 'vue-class-component'
import { CreateElement, VNode, VNodeData } from 'vue'
import { InputValidationRule } from '@/types'

import { head } from 'lodash'

const baseMixins = mixins(
  BindsAttrs,
  Validatable
)

const props = {
  appendIcon: String,
  height: [Number, String],
  hideDetails: [Boolean, String],
  hint: String,
  id: String,
  isShowRequiredLabel: Boolean,
  label: String,
  loading: Boolean,
  persistentHint: Boolean,
  prependIcon: String,
  value: { required: false }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtInput>>({
  inheritAttrs: false,
  props,
  watch: {
    value (val) {
      this.lazyValue = val
    }
  }
})
class ErtInput extends baseMixins {
  // Options
  // eslint-disable-next-line camelcase
  $_modelEvent!: string
  h: CreateElement = this.$createElement

  // Props
  readonly appendIcon!: string
  readonly height!: number | string
  readonly hideDetails!: boolean | 'auto'
  readonly hint!: string
  readonly id!: string
  readonly label!: string
  readonly loading!: boolean
  readonly persistentHint!: boolean
  readonly prependIcon!: string
  readonly value!: any
  readonly isShowRequiredLabel!: boolean

  // Data
  lazyValue: any = this.value
  hasMouseDown: boolean = false

  theme: string = 'erth'

  // Computed
  get classes (): object {
    return {
      'ert-input--has-state': this.hasState,
      'ert-input--hide-details': !this.showDetails,
      'ert-input--is-label-active': this.isLabelActive,
      'ert-input--is-dirty': this.isDirty,
      'ert-input--is-disabled': this.isDisabled,
      'ert-input--is-focused': this.isFocused,
      'ert-input--is-loading': this.loading !== false && this.loading != null,
      'ert-input--is-readonly': this.isReadonly
    }
  }

  get computedId (): string {
    return this.id || `ert-input-${this._uid}`
  }

  get hasDetails (): boolean {
    return this.messagesToDisplay.length > 0
  }

  get hasHint (): boolean {
    return !this.hasMessages &&
      !!this.hint &&
      (this.persistentHint || this.isFocused)
  }

  get hasLabel (): boolean {
    return !!(this.$slots.label || this.label)
  }

  get isDirty (): boolean {
    return !!this.lazyValue
  }

  get isLabelActive (): boolean {
    return this.isDirty
  }

  get messagesToDisplay (): string[] {
    if (this.hasHint) return [this.hint]

    if (!this.hasMessages) return []

    return this.validations.map((validation: string | InputValidationRule) => {
      if (typeof validation === 'string') return validation

      const validationResult = validation(this.internalValue)

      return typeof validationResult === 'string' ? validationResult : ''
    }).filter(message => message !== '')
  }

  get showDetails (): boolean {
    return this.hideDetails === false || (this.hideDetails === 'auto' && this.hasDetails)
  }

  // get theme () {
  //   const app = document.querySelector('.app')
  //   if (!app) return ''
  //   if (app.classList.contains('e-commerce')) return 'e-commerce'
  //
  //   return 'erth'
  // }

  // Proxy
  get internalValue () {
    return this.lazyValue
  }
  set internalValue (val: any) {
    this.lazyValue = val
    this.$emit(this.$_modelEvent, val)
  }

  // Hooks
  beforeCreate () {
    this.$_modelEvent = (this.$options.model && this.$options.model.event) || 'input'
  }

  // Methods
  genContent () {
    return [
      this.genPrependSlot(),
      this.genControl(),
      this.genAppendSlot()
    ]
  }
  genControl () {
    return this.h('div', {
      staticClass: 'ert-input__control'
    }, [
      this.genInputSlot(),
      this.genRequiredLabel(),
      this.genMessages()
    ])
  }
  genDefaultSlot () {
    return [
      this.genLabel(),
      this.$slots.default
    ]
  }

  genRequiredLabel () {
    if (!this.isShowRequiredLabel) {
      return null
    }

    return this.$createElement('div', {
      staticClass: 'ert-input__required-label'
    })
  }
  genIcon (type: string, cb?: (e: Event) => void, extraData: VNodeData = {}) {
    const icon = (this as any)[`${type}Icon`]
    const eventName = `click:${kebabCase(type)}`
    const hasListener = !!(this.listeners$[eventName] || cb)

    const data = mergeData({
      staticClass: 'ert-input__icon',
      class: type ? `ert-input__icon--${kebabCase(type)}` : undefined,
      attrs: {
        'aria-label': hasListener ? `${head(kebabCase(type).split('-'))} icon` : undefined,
        disabled: this.isDisabled
      },
      on: !hasListener
        ? undefined
        : {
          click: (e: Event) => {
            e.preventDefault()
            e.stopPropagation()

            this.$emit(eventName, e)
            cb && cb(e)
          },
          mouseup: (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
          }
        }
    }, extraData)

    return this.h('div', data, [
      this.h(ErtIcon, {
        props: {
          name: icon
        }
      })
    ])
  }
  genInputSlot () {
    return this.h('div', {
      staticClass: 'ert-input__slot',
      style: { height: convertToUnit(this.height) },
      on: {
        click: this.onClick,
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp
      },
      ref: 'input-slot'
    }, [this.genDefaultSlot()])
  }
  genLabel () {
    if (!this.hasLabel) return null

    return this.h(ErtLabel, {
      props: {
        disabled: this.isDisabled,
        focused: this.hasState,
        for: this.computedId
      }
    }, [this.$slots.label || this.label])
  }
  genMessages () {
    if (!this.showDetails) return null

    return this.h(ErtMessages, {
      props: {
        value: this.messagesToDisplay
      },
      attrs: {
        role: this.hasMessages ? 'alert' : null
      },
      scopedSlots: {
        default: props => getSlot(this, 'message', props)
      }
    })
  }
  genSlot (type: string, location: string, slot: (VNode | VNode[])[]) {
    if (!slot.length) return null

    const ref = `${type}-${location}`

    return this.h('div', {
      staticClass: `ert-input__${ref}`,
      ref
    }, slot)
  }
  genPrependSlot () {
    const slot = []

    if (this.$slots.prepend) {
      slot.push(this.$slots.prepend)
    } else if (this.prependIcon) {
      slot.push(this.genIcon('prepend'))
    }

    return this.genSlot('prepend', 'outer', slot)
  }
  genAppendSlot () {
    const slot = []

    if (this.$slots.append) {
      slot.push(this.$slots.append)
    } else if (this.appendIcon) {
      slot.push(this.genIcon('append'))
    }

    return this.genSlot('append', 'outer', slot)
  }
  onClick (e: Event) {
    this.$emit('click', e)
  }
  onMouseDown (e: Event) {
    this.hasMouseDown = true
    this.$emit('mousedown', e)
  }
  onMouseUp (e: Event) {
    this.hasMouseDown = false
    this.$emit('mouseup', e)
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-input',
      class: this.classes
    }, this.genContent())
  }
}

export { ErtInput }
export default ErtInput
