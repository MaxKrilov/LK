import './ErtListItem.scss'

import ErtRoutableMixin from '@/mixins2/ErtRoutableMixin'
import { factory as GroupableFactory } from '@/mixins2/ErtGroupableMixin'
import { factory as ToggleableFactory } from '@/mixins2/ErtToggleableMixin'

import Ripple from '@/directives/ripple'

import { keyCode as keyCodes } from '@/functions/keyCode'

import Component, { mixins } from 'vue-class-component'
import { CreateElement, VNode } from 'vue'

const baseMixins = mixins(
  ErtRoutableMixin,
  GroupableFactory('listItemGroup'),
  ToggleableFactory('inputValue')
)

const inheritAttrs = false

const directives = { Ripple }

const inject = {
  isInGroup: {
    default: false
  },
  isInList: {
    default: false
  },
  isInMenu: {
    default: false
  },
  isInNav: {
    default: false
  }
}

const props = {
  inactive: Boolean,
  link: Boolean,
  selectable: Boolean,
  tag: {
    type: String,
    default: 'div'
  },
  threeLine: Boolean,
  twoLine: Boolean,
  value: {
    required: false
  }
}

@Component<InstanceType<typeof ErtListItem>>({
  inheritAttrs,
  directives,
  inject,
  props: {
    activeClass: {
      type: String,
      default (): string | undefined {
        if (!this.listItemGroup) return ''

        return (this.listItemGroup as any).activeClass
      }
    },
    ...props
  }
})
export default class ErtListItem extends baseMixins {
  // Options
  $el!: HTMLElement
  isInGroup!: boolean
  isInList!: boolean
  isInMenu!: boolean
  isInNav!: boolean

  // Props
  readonly activeClass!: string
  readonly inactive!: boolean
  readonly selectable!: boolean
  readonly tag!: string
  readonly threeLine!: boolean
  readonly twoLine!: boolean
  readonly value!: any

  // Data
  proxyClass: string = 'ert-list-item--active'

  // Computed
  get classes (): object {
    return {
      'ert-list-item': true,
      ...ErtRoutableMixin.options.computed.classes.get.call(this),
      'ert-list-item--disabled': this.disabled,
      'ert-list-item--link': this.isClickable && !this.inactive,
      'ert-list-item--selectable': this.selectable,
      'ert-list-item--three-line': this.threeLine,
      'ert-list-item--two-line': this.twoLine
    }
  }
  get isClickable (): boolean {
    return Boolean(
      ErtRoutableMixin.options.computed.isClickable.get.call(this) ||
      this.listItemGroup
    )
  }

  // Methods
  click (e: MouseEvent | KeyboardEvent) {
    if (e.detail) this.$el.blur()

    this.$emit('click', e)

    this.to || this.toggle()
  }
  genAttrs () {
    const attrs: Record<string, any> = {
      'aria-disabled': this.disabled ? true : undefined,
      tabindex: this.isClickable && !this.disabled ? 0 : -1,
      ...this.$attrs
    }

    if (this.$attrs.hasOwnProperty('role')) {
    } else if (this.isInNav) {
    } else if (this.isInGroup) {
      attrs.role = 'listitem'
      attrs['aria-selected'] = String(this.isActive)
    } else if (this.isInMenu) {
      attrs.role = this.isClickable ? 'menuitem' : undefined
      attrs.id = attrs.id || `list-item-${this._uid}`
    } else if (this.isInList) {
      attrs.role = 'listitem'
    }

    return attrs
  }

  render (h: CreateElement): VNode {
    let { tag, data } = this.generateRouteLink()

    data.attrs = {
      ...data.attrs,
      ...this.genAttrs()
    }
    data[this.to ? 'nativeOn' : 'on'] = {
      ...data[this.to ? 'nativeOn' : 'on'],
      keydown: (e: KeyboardEvent) => {
        if (e.keyCode === keyCodes.DOM_VK_ENTER) this.click(e)

        this.$emit('keydown', e)
      }
    }

    if (this.inactive) tag = 'div'
    if (this.inactive && this.to) {
      data.on = data.nativeOn
      delete data.nativeOn
    }

    const children = this.$scopedSlots.default
      ? this.$scopedSlots.default({
        active: this.isActive,
        toggle: this.toggle
      })
      : this.$slots.default

    return h(tag, data, children)
  }
}
