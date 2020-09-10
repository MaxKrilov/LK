import './ErtListGroup.scss'

import ErtIcon from '../ErtIcon'
import ErtList from './ErtList'
import ErtListItem from './ErtListItem'
import ErtListItemIcon from './ErtListItemIcon'

import ErtBindAttrs from '@/mixins2/ErBindAttrs'
import ErtBootable from '@/mixins2/ErtBootableMixin'
import ErtToggleable from '@/mixins2/ErtToggleableMixin'
import { inject as RegistrableInject } from '@/mixins2/ErRegistrableMixin'

import Ripple from '@/directives/ripple'

import { ErtExpandTransition } from '@/functions/transitions'

import Component, { mixins } from 'vue-class-component'
import { getSlot } from '@/functions/helper2'

import { CreateElement, VNode } from 'vue'
import { Route } from 'vue-router'

const baseMixins = mixins(
  ErtBindAttrs,
  ErtBootable,
  RegistrableInject('list'),
  ErtToggleable
)

type ErtListInstance = InstanceType<typeof ErtList>

const directives = { Ripple }

const props = {
  activeClass: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: 'corner_down'
  },
  disabled: Boolean,
  group: String,
  noAction: Boolean,
  prependIcon: String,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  subGroup: Boolean
}

@Component<InstanceType<typeof ErtListGroup>>({
  directives,
  props,
  watch: {
    isActive (val: boolean) {
      if (!this.subGroup && val) {
        this.list && this.list.listClick(this._uid)
      }
    },
    $route: 'onRouteChange'
  }
})
export default class ErtListGroup extends baseMixins {
  // Options
  list!: ErtListInstance
  $refs!: {
    group: HTMLElement
  }
  $route!: Route

  // Props
  readonly activeClass!: string
  readonly appendIcon!: string
  readonly disabled!: boolean
  readonly group!: string
  readonly noAction!: boolean
  readonly prependIcon!: string
  readonly ripple!: boolean | object
  readonly subGroup!: boolean

  // Computed
  get classes (): object {
    return {
      'ert-list-group--active': this.isActive,
      'ert-list-group--disabled': this.disabled,
      'ert-list-group--no-action': this.noAction,
      'ert-list-group--sub-group': this.subGroup
    }
  }

  // Methods
  click (e: Event) {
    if (this.disabled) return

    this.isBooted = true

    this.$emit('click', e)
    this.$nextTick(() => (this.isActive = !this.isActive))
  }
  genIcon (icon: string | false): VNode | null {
    return icon ? this.$createElement(ErtIcon, { props: { name: icon } }) : null
  }
  genAppendIcon (): VNode | null {
    const icon = !this.subGroup ? this.appendIcon : false

    if (!icon && !this.$slots.appendIcon) return null

    return this.$createElement(ErtListItemIcon, {
      staticClass: 'ert-list-group__header__append-icon'
    }, [
      this.$slots.appendIcon || this.genIcon(icon)
    ])
  }
  genHeader (): VNode {
    return this.$createElement(ErtListItem, {
      staticClass: 'ert-list-group__header',
      attrs: {
        'aria-expanded': String(this.isActive),
        role: 'button'
      },
      class: {
        [this.activeClass]: this.isActive
      },
      props: {
        inputValue: this.isActive
      },
      directives: [{
        name: 'ripple',
        value: this.ripple
      }],
      on: {
        ...this.listeners$,
        click: this.click
      }
    }, [
      this.genPrependIcon(),
      this.$slots.activator,
      this.genAppendIcon()
    ])
  }
  genItems (): VNode[] {
    return this.showLazyContent(() => [
      this.$createElement('div', {
        staticClass: 'ert-list-group__items',
        directives: [{
          name: 'show',
          value: this.isActive
        }]
      }, getSlot(this))
    ])
  }
  genPrependIcon (): VNode | null {
    const icon = this.subGroup && this.prependIcon == null
      ? 'corner_down'
      : this.prependIcon

    if (!icon && !this.$slots.prependIcon) return null

    return this.$createElement(ErtListItemIcon, {
      staticClass: 'ert-list-group__header__prepend-icon'
    }, [
      this.$slots.prependIcon || this.genIcon(icon)
    ])
  }
  onRouteChange (to: Route) {
    if (!this.group) return

    const isActive = this.matchRoute(to.path)

    /* istanbul ignore else */
    if (isActive && this.isActive !== isActive) {
      this.list && this.list.listClick(this._uid)
    }

    this.isActive = isActive
  }
  toggle (uid: number) {
    const isActive = this._uid === uid

    if (isActive) this.isBooted = true
    this.$nextTick(() => (this.isActive = isActive))
  }
  matchRoute (to: string) {
    return to.match(this.group) !== null
  }

  // Hooks
  created () {
    this.list && this.list.register(this)

    if (this.group && this.$route && this.value == null) {
      this.isActive = this.matchRoute(this.$route.path)
    }
  }
  beforeDestroy () {
    this.list && this.list.unregister(this)
  }
  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-list-group',
      class: this.classes
    }, [
      this.genHeader(),
      h(ErtExpandTransition, this.genItems())
    ])
  }
}
