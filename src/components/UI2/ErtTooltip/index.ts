import './style.scss'

import ErtActivatableMixin from '@/mixins2/ErtActivatableMixin'
import ErtDelayableMixin from '@/mixins2/ErtDelaybleMixin'
import ErtDependentMixin from '@/mixins2/ErtDependentMixin'
import ErtDetachableMixin from '@/mixins2/ErtDetachableMixin'
import ErtMenuableMixin from '@/mixins2/ErtMenuableMixin'
import ErtToggleableMixin from '@/mixins2/ErtToggleableMixin'

import { convertToUnit } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

import Component, { mixins } from 'vue-class-component'

const baseMixins = mixins(
  ErtDelayableMixin,
  ErtDependentMixin,
  ErtDetachableMixin,
  ErtMenuableMixin,
  ErtToggleableMixin
)

const props = {
  closeDelay: {
    type: [Number, String],
    default: 0
  },
  disabled: Boolean,
  fixed: {
    type: Boolean,
    default: true
  },
  openDelay: {
    type: [Number, String],
    default: 0
  },
  openOnHover: {
    type: Boolean,
    default: true
  },
  tag: {
    type: String,
    default: 'span'
  },
  transition: String
}

@Component({ props })
class ErtTooltip extends baseMixins {
  // Props
  readonly closeDelay!: number | string
  readonly disabled!: boolean
  readonly fixed!: boolean
  readonly openDelay!: number | string
  readonly openOnHover!: boolean
  readonly tag!: string
  readonly transition!: string

  // Data
  calculatedMinWidth: number = 0
  closeDependents: boolean = false

  // Computed
  get calculatedLeft (): string {
    const { activator, content } = this.dimensions
    const unknown = !this.bottom && !this.left && !this.top && !this.right
    const activatorLeft = this.attach !== false ? activator.offsetLeft : activator.left
    let left = 0

    if (this.top || this.bottom || unknown) {
      left = (
        activatorLeft +
        (activator.width / 2) -
        (content.width / 2)
      )
    } else if (this.left || this.right) {
      left = (
        activatorLeft +
        (this.right ? activator.width : -content.width) +
        (this.right ? 10 : -10)
      )
    }

    if (this.nudgeLeft) left -= parseInt(this.nudgeLeft)
    if (this.nudgeRight) left += parseInt(this.nudgeRight)

    return `${this.calcXOverflow(left, this.dimensions.content.width)}px`
  }

  get calculatedTop (): string {
    const { activator, content } = this.dimensions
    const activatorTop = this.attach !== false ? activator.offsetTop : activator.top
    let top = 0

    if (this.top || this.bottom) {
      top = (
        activatorTop +
        (this.bottom ? activator.height : -content.height) +
        (this.bottom ? 10 : -10)
      )
    } else if (this.left || this.right) {
      top = (
        activatorTop +
        (activator.height / 2) -
        (content.height / 2)
      )
    }

    if (this.nudgeTop) top -= parseInt(this.nudgeTop)
    if (this.nudgeBottom) top += parseInt(this.nudgeBottom)

    return `${this.calcYOverflow(top + this.pageYOffset)}px`
  }

  get classes (): object {
    return {
      'ert-tooltip--top': this.top,
      'ert-tooltip--right': this.right,
      'ert-tooltip--bottom': this.bottom,
      'ert-tooltip--left': this.left,
      'ert-tooltip--attached':
        this.attach === '' ||
        this.attach === true ||
        this.attach === 'attach'
    }
  }

  get computedTransition (): string {
    if (this.transition) return this.transition

    return this.isActive ? 'scale-transition' : 'fade-transition'
  }

  get offsetY (): boolean {
    return this.top || this.bottom
  }

  get offsetX (): boolean {
    return this.left || this.right
  }

  get styles (): object {
    return {
      left: this.calculatedLeft,
      maxWidth: convertToUnit(this.maxWidth),
      minWidth: convertToUnit(this.minWidth),
      opacity: this.isActive ? 0.9 : 0,
      top: this.calculatedTop,
      zIndex: this.zIndex || this.activeZIndex
    }
  }

  // Hooks
  beforeMount () {
    this.$nextTick(() => {
      this.value && this.callActivate()
    })
  }

  // Methods
  activate () {
    this.updateDimensions()
    requestAnimationFrame(this.startTransition)
  }

  deactivate () {
    this.runDelay('close')
  }

  genActivatorListeners () {
    const listeners = ErtActivatableMixin.options.methods.genActivatorListeners.call(this)

    listeners.focus = (e: Event) => {
      this.getActivator(e)
      this.runDelay('open')
    }
    listeners.blur = (e: Event) => {
      this.getActivator(e)
      this.runDelay('close')
    }
    listeners.keydown = (e: KeyboardEvent) => {
      if (e.keyCode === keyCodes.DOM_VK_ESCAPE) {
        this.getActivator(e)
        this.runDelay('close')
      }
    }

    return listeners
  }

  genTransition () {
    const content = this.genContent()

    if (!this.computedTransition) return content

    return this.$createElement('transition', {
      props: {
        name: this.computedTransition
      }
    }, [content])
  }

  genContent () {
    return this.$createElement('div', {
      staticClass: 'ert-tooltip__content',
      class: {
        [this.contentClass]: true,
        'menuable__content__active': this.isActive,
        'ert-tooltip__content--fixed': this.activatorFixed
      },
      style: this.styles,
      attrs: this.getScopeIdAttrs(),
      directives: [{
        name: 'show',
        value: this.isContentActive
      }],
      ref: 'content'
    }, this.getContentSlot())
  }
}

export { ErtTooltip }
export default ErtTooltip
