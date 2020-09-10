import './style.scss'

import Component, { mixins } from 'vue-class-component'

import ErtToggleableMixin from '@/mixins2/ErtToggleableMixin'

import { VNode } from 'vue'

const props = {
  absolute: Boolean,
  opacity: {
    type: [Number, String],
    default: 0.46
  },
  value: {
    default: true
  },
  zIndex: {
    type: [Number, String],
    default: 5
  }
}

@Component({ props })
class ErtOverlay extends mixins(ErtToggleableMixin) {
  // Props
  readonly absolute!: boolean
  readonly opacity!: number | string
  readonly value!: boolean
  readonly zIndex!: number | string

  // Computed
  get __scrim (): VNode {
    return this.$createElement('div', {
      staticClass: 'er-overlay__scrim',
      style: {
        opacity: this.computedOpacity
      }
    })
  }

  get classes (): object {
    return {
      'ert-overlay--absolute': this.absolute,
      'ert-overlay--active': this.isActive
    }
  }

  get computedOpacity (): number {
    return Number(this.isActive ? this.opacity : 0)
  }

  get styles (): object {
    return {
      zIndex: this.zIndex
    }
  }

  // Methods
  genContent (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-overlay__content'
    }, this.$slots.default)
  }

  // Hooks
  render (): VNode {
    const children = [this.__scrim]

    if (this.isActive) children.push(this.genContent())

    return this.$createElement('div', {
      staticClass: 'ert-overlay',
      class: this.classes,
      style: this.styles
    }, children)
  }
}

export { ErtOverlay }
export default ErtOverlay
