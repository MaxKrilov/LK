import './_style.scss'

import ErActivatableMixin from '../../../mixins/ErActivatableMixin'
import ErDelayableMixin from '../../../mixins/ErDelayableMixin'
import ErDependentMixin from '../../../mixins/ErDependentMixin'
import ErDetachableMixin from '../../../mixins/ErDetachableMixin'
import ErMenuableMixin from '../../../mixins/ErMenuableMixin'
import ErToggleableMixin from '../../../mixins/ErToggleableMixin'
import { convertToUnit } from '../../../functions/helper'
import mixins from '../../../utils/mixins'
import { keyCode } from '../../../functions/keyCode'

export default mixins(
  ErActivatableMixin,
  ErDelayableMixin,
  ErDependentMixin,
  ErDetachableMixin,
  ErMenuableMixin,
  ErToggleableMixin
).extend({
  name: 'er-tooltip',
  data: () => ({
    pre: 'er-tooltip',
    calculatedMinWidth: 0,
    closeDependents: false
  }),
  props: {
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
    transition: String,
    zIndex: {
      default: null
    }
  },
  computed: {
    calculatedLeft () {
      const { activator, content } = this.dimensions
      const unknown = !this.bottom && !this.left && !this.top && !this.right
      const activatorLeft = this.attach !== false ? activator.offsetLeft : activator.left
      let left = 0
      if (this.top || this.bottom || unknown) {
        left = (activatorLeft + (activator.width / 2) - (content.width / 2))
      } else if (this.left || this.right) {
        left = (activatorLeft + (this.right ? activator.width : -content.width) + (this.right ? 10 : -10))
      }
      if (this.nudgeLeft) left -= parseInt(this.nudgeLeft)
      if (this.nudgeRight) left += parseInt(this.nudgeRight)
      return `${this.calcXOverflow(left, this.dimensions.content.width)}px`
    },
    calculatedTop () {
      const { activator, content } = this.dimensions
      const activatorTop = this.attach !== false ? activator.offsetTop : activator.top
      let top = 0
      if (this.top || this.bottom) {
        top = activatorTop + (this.bottom ? activator.height : -content.height) + (this.bottom ? 10 : -10)
      } else if (this.left || this.right) {
        top = activatorTop + activator.height / 2 - content.height / 2
      }
      if (this.nudgeTop) top -= parseInt(this.nudgeTop)
      if (this.nudgeBottom) top += parseInt(this.nudgeBottom)
      return `${this.calcYOverflow(top + this.pageYOffset)}px`
    },
    classes () {
      return {
        [`${this.pre}--top`]: this.top,
        [`${this.pre}--right`]: this.right,
        [`${this.pre}--bottom`]: this.bottom,
        [`${this.pre}--left`]: this.left
      }
    },
    classesForContent () {
      return {
        [`${this.pre}__content--top`]: this.top,
        [`${this.pre}__content--right`]: this.right,
        [`${this.pre}__content--bottom`]: this.bottom,
        [`${this.pre}__content--left`]: this.left
      }
    },
    computedTransition () {
      if (this.transition) return this.transition
      return this.isActive ? 'scale-transition' : 'fade-transition'
    },
    offsetY () {
      return this.top || this.bottom
    },
    offsetX () {
      return this.left || this.right
    },
    styles () {
      return {
        left: this.calculatedLeft,
        top: this.calculatedTop,
        maxWidth: convertToUnit(this.maxWidth),
        minWidth: convertToUnit(this.minWidth),
        opacity: this.isActive ? 0.9 : 0,
        zIndex: this.zIndex || this.activeZIndex
      }
    }
  },
  methods: {
    activate () {
      this.updateDimensions()
      requestAnimationFrame(this.startTransition)
    },
    deactivate () {
      this.runDelay('close')
    },
    genActivatorListeners () {
      const listeners = ErActivatableMixin.methods.genActivatorListeners.call(this)
      listeners.focus = e => {
        this.getActivator(e)
        this.runDelay('open')
      }
      listeners.blur = e => {
        this.getActivator(e)
        this.runDelay('close')
      }
      listeners.keydown = e => {
        if (e.keyCode === keyCode.DOM_VK_ESCAPE) {
          this.getActivator(e)
          this.runDelay('close')
        }
      }
      return listeners
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      this.value && this.callActivate()
    })
  },
  render (h) {
    const tooltip = h('div', {
      staticClass: `${this.pre}__content`,
      class: {
        [this.contentClass]: true,
        'menuable__content__active': this.isActive,
        [`${this.pre}__content--fixed`]: this.activatorFixed,
        ...this.classesForContent
      },
      style: this.styles,
      attrs: this.getScopeIdAttrs(),
      directives: [{
        name: 'show',
        value: this.isContentActive
      }],
      ref: 'content'
    }, this.showLazyContent(this.getContentSlot()))
    return h(this.tag, {
      staticClass: this.pre,
      class: this.classes
    }, [
      h('transition', {
        props: {
          name: this.computedTransition
        }
      }, [tooltip]),
      this.genActivator()
    ])
  }
})
