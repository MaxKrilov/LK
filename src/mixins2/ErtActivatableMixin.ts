import ErtDelayableMixin from './ErtDelaybleMixin'
import ErtToggleableMixin from './ErtToggleableMixin'

import { getSlot } from '@/functions/helper2'

import { VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'

type Listeners = Record<string, (e: MouseEvent & KeyboardEvent & FocusEvent) => void>

const baseMixins = mixins(
  ErtDelayableMixin,
  ErtToggleableMixin
)

const props = {
  activator: {
    default: null,
    validator: (val: string | object) => ['string', 'object'].includes(typeof val)
  },
  disabled: Boolean,
  internalActivator: Boolean,
  openOnHover: Boolean,
  openOnFocus: Boolean
}

const watch = {
  activator: 'resetActivator',
  openOnFocus: 'resetActivator',
  openOnHover: 'resetActivator'
}

@Component({ props, watch })
export default class ErtActivatableMixin extends baseMixins {
  // Props
  readonly activator!: string | HTMLElement | VNode | Element | null
  readonly disabled!: boolean
  readonly internalActivator!: boolean
  readonly openOnHover!: boolean
  readonly openOnFocus!: boolean

  // Data
  activatorElement: HTMLElement | null = null
  activatorNode: VNode[] = []
  events: string[] = ['click', 'mouseenter', 'mouseleave', 'focus']
  listeners: Listeners = {}

  // Hooks
  mounted () {
    this.addActivatorEvents()
  }

  beforeDestroy () {
    this.removeActivatorEvents()
  }

  // Methods
  addActivatorEvents () {
    if (
      !this.activator ||
      this.disabled ||
      !this.getActivator()
    ) return

    this.listeners = this.genActivatorListeners()
    const keys = Object.keys(this.listeners)

    for (const key of keys) {
      this.getActivator()!.addEventListener(key, this.listeners[key] as any)
    }
  }

  genActivator () {
    const node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
      on: this.genActivatorListeners(),
      attrs: this.genActivatorAttributes()
    })) || []

    this.activatorNode = node

    return node
  }

  genActivatorAttributes () {
    return {
      role: 'button',
      'aria-haspopup': true,
      'aria-expanded': String(this.isActive)
    }
  }

  genActivatorListeners () {
    if (this.disabled) return {}

    const listeners: Listeners = {}

    if (this.openOnHover) {
      listeners.mouseenter = (e: MouseEvent) => {
        this.getActivator(e)
        this.runDelay('open')
      }
      listeners.mouseleave = (e: MouseEvent) => {
        this.getActivator(e)
        this.runDelay('close')
      }
    } else {
      listeners.click = (e: MouseEvent) => {
        const activator = this.getActivator(e)
        if (activator) activator.focus()

        e.stopPropagation()

        this.isActive = !this.isActive
      }
    }

    if (this.openOnFocus) {
      listeners.focus = (e: FocusEvent) => {
        this.getActivator(e)

        e.stopPropagation()

        this.isActive = !this.isActive
      }
    }

    return listeners
  }

  getActivator (e?: Event): HTMLElement | null {
    if (this.activatorElement) return this.activatorElement

    let activator = null

    if (this.activator) {
      const target = this.internalActivator ? this.$el : document

      if (typeof this.activator === 'string') {
        activator = target.querySelector(this.activator)
      } else if ((this.activator as any).$el) {
        activator = (this.activator as any).$el
      } else {
        activator = this.activator
      }
    } else if (this.activatorNode.length === 1 || (this.activatorNode.length && !e)) {
      const vm = this.activatorNode[0].componentInstance
      if (
        vm &&
        vm.$options.mixins &&
        vm.$options.mixins.some((m: any) => m.options && ['activatable', 'menuable'].includes(m.options.name))
      ) {
        activator = (vm as any).getActivator()
      } else {
        activator = this.activatorNode[0].elm as HTMLElement
      }
    } else if (e) {
      activator = (e.currentTarget || e.target) as HTMLElement
    }

    this.activatorElement = activator

    return this.activatorElement
  }

  getContentSlot () {
    return getSlot(this, 'default', this.getValueProxy(), true)
  }

  getValueProxy (): object {
    const self = this
    return {
      get value () {
        return self.isActive
      },
      set value (isActive: boolean) {
        self.isActive = isActive
      }
    }
  }

  removeActivatorEvents () {
    if (
      !this.activator ||
      !this.activatorElement
    ) return

    const keys = Object.keys(this.listeners)

    for (const key of keys) {
      (this.activatorElement as any).removeEventListener(key, this.listeners[key])
    }

    this.listeners = {}
  }

  resetActivator () {
    this.removeActivatorEvents()
    this.activatorElement = null
    this.getActivator()
    this.addActivatorEvents()
  }
}
