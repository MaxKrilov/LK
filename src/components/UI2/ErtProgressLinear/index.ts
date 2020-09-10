import './style.scss'

import { CreateElement, VNode } from 'vue'
import { FunctionalComponentOptions } from 'vue/types'

import Component, { mixins } from 'vue-class-component'

import { ErtFadeTransition, ErtSlideXTransition } from '@/functions/transitions'

import { factory as PositionableFactory } from '@/mixins2/ErtPositionableMixin'
import ErtProxyableMixin from '@/mixins2/ErtProxyableMixin'

import { convertToUnit, getSlot } from '@/functions/helper2'

const baseMixins = mixins(
  PositionableFactory(['absolute', 'fixed', 'top', 'bottom']),
  ErtProxyableMixin
)

const props = {
  active: {
    type: Boolean,
    default: true
  },
  bufferValue: {
    type: [Number, String],
    default: 100
  },
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  query: Boolean,
  reverse: Boolean,
  rounded: Boolean,
  stream: Boolean,
  striped: Boolean,
  value: {
    type: [Number, String],
    default: 0
  }
}

@Component({ props })
class ErtProgressLinear extends baseMixins {
  // Props
  readonly active!: boolean
  readonly bufferValue!: number | string
  readonly height!: number | string
  readonly indeterminate!: boolean
  readonly query!: boolean
  readonly reverse!: boolean
  readonly rounded!: boolean
  readonly stream!: boolean
  readonly striped!: boolean
  readonly value!: number | string

  // Data
  internalLazyValue = this.value || 0

  // Computed
  get __cachedBackground (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__background', // todo background
      style: this.backgroundStyle
    })
  }
  get __cachedBar (): VNode {
    return this.$createElement(this.computedTransition, [this.__cachedBarType])
  }
  get __cachedBarType (): VNode {
    return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate
  }
  get __cachedBuffer (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__buffer',
      style: this.styles
    })
  }
  get __cachedDeterminate (): VNode {
    return this.$createElement('div', {
      staticClass: `ert-progress-linear__determinate`, // todo color
      style: {
        width: convertToUnit(this.normalizedValue, '%')
      }
    })
  }
  get __cachedIndeterminate (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__indeterminate',
      class: {
        'ert-progress-linear__indeterminate--active': this.active
      }
    }, [
      this.genProgressBar('long'),
      this.genProgressBar('short')
    ])
  }
  get __cachedStream (): VNode | null {
    if (!this.stream) return null

    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__stream', // todo color
      style: {
        width: convertToUnit(100 - this.normalizedBuffer, '%')
      }
    })
  }
  get backgroundStyle (): object {
    return {
      'left': convertToUnit(this.normalizedValue, '%'),
      width: convertToUnit(this.normalizedBuffer - this.normalizedValue, '%')
    }
  }
  get classes (): object {
    return {
      'ert-progress-linear--absolute': this.absolute,
      'ert-progress-linear--fixed': this.fixed,
      'ert-progress-linear--query': this.query,
      'ert-progress-linear--reactive': this.reactive,
      'ert-progress-linear--rounded': this.rounded,
      'ert-progress-linear--striped': this.striped
    }
  }
  get computedTransition (): FunctionalComponentOptions {
    return this.indeterminate ? ErtFadeTransition : ErtSlideXTransition
  }
  get isReversed (): boolean {
    return false
  }
  get normalizedBuffer (): number {
    return this.normalize(this.bufferValue)
  }
  get normalizedValue (): number {
    return this.normalize(this.internalLazyValue)
  }
  get reactive (): boolean {
    return Boolean(this.$listeners.change)
  }
  get styles (): object {
    const styles: Record<string, any> = {}

    if (!this.active) {
      styles.height = 0
    }

    if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
      styles.width = convertToUnit(this.normalizedBuffer, '%')
    }

    return styles
  }

  // Methods
  genContent () {
    const slot = getSlot(this, 'default', { value: this.internalLazyValue })

    if (!slot) return null

    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__content'
    }, slot)
  }
  genListeners () {
    const listeners = this.$listeners

    if (this.reactive) {
      listeners.click = this.onClick
    }

    return listeners
  }
  genProgressBar (name: 'long' | 'short') {
    return this.$createElement('div', {
      staticClass: 'ert-progress-linear__indeterminate', // todo color
      class: {
        [name]: true
      }
    })
  }
  onClick (e: MouseEvent) {
    if (!this.reactive) return

    const { width } = this.$el.getBoundingClientRect()

    this.internalValue = e.offsetX / width * 100
  }
  normalize (value: string | number) {
    if (value < 0) return 0
    if (value > 100) return 100
    return parseFloat(value)
  }

  render (h: CreateElement): VNode {
    const data = {
      staticClass: 'ert-progress-linear',
      attrs: {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': this.normalizedBuffer,
        'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
      },
      class: this.classes,
      style: {
        bottom: this.bottom ? 0 : undefined,
        height: this.active ? convertToUnit(this.height) : 0,
        top: this.top ? 0 : undefined
      },
      on: this.genListeners()
    }

    return h('div', data, [
      this.__cachedStream,
      this.__cachedBackground,
      this.__cachedBuffer,
      this.__cachedBar,
      this.genContent()
    ])
  }
}

export { ErtProgressLinear }
export default ErtProgressLinear
