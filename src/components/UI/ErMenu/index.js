import './_style.scss'

import Delayable from '../../../mixins/ErDelayableMixin'
import Dependent from '../../../mixins/ErDependentMixin'
import Detachable from '../../../mixins/ErDetachableMixin'
import Menuable from '../../../mixins/ErMenuableMixin'
import Returnable from '../../../mixins/ErReturnableMixin'
import Toggleable from '../../../mixins/ErToggleableMixin'

import Activator from './mixins/menu-activator'
import Generators from './mixins/menu-generator'
import Keyable from './mixins/menu-keyable'
import Position from './mixins/menu-position'

import { ClickOutside, Resize } from '../../../directives/index'
import { convertToUnit } from '../../../functions/helper'

export default {
  name: 'er-menu',
  directives: {
    ClickOutside,
    Resize
  },
  mixins: [
    Delayable,
    Dependent,
    Detachable,
    Menuable,
    Returnable,
    Toggleable,
    Activator,
    Generators,
    Keyable,
    Position
  ],
  data: () => ({
    pre: 'er-menu',
    defaultOffset: 8,
    hasJustFocused: false,
    resizeTimeout: null
  }),
  props: {
    auto: Boolean,
    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnContentClick: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    fullWidth: Boolean,
    maxHeight: { default: 'auto' },
    openOnClick: {
      type: Boolean,
      default: true
    },
    offsetX: Boolean,
    offsetY: Boolean,
    openOnHover: Boolean,
    origin: {
      type: String,
      default: 'top left'
    },
    transition: {
      type: [Boolean, String],
      default: 'menu-transition'
    }
  },
  computed: {
    calculatedLeft () {
      const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth))
      if (!this.auto) {
        return this.calcLeft(menuWidth)
      }
      return convertToUnit(this.calcXOverflow(this.calcLeftAuto(), menuWidth))
    },
    calculatedMaxHeight () {
      return this.auto ? '200px' : convertToUnit(this.maxHeight)
    },
    calculatedMaxWidth () {
      return isNaN(this.maxWidth)
        ? this.maxWidth
        : convertToUnit(this.maxWidth)
    },
    calculatedMinWidth () {
      if (this.minWidth) {
        return isNaN(this.minWidth)
          ? this.minWidth
          : convertToUnit(this.minWidth)
      }
      const minWidth = Math.min(
        this.dimensions.activator.width +
        this.nudgeWidth +
        (this.auto ? 16 : 0),
        Math.max(this.pageWidth - 24, 0)
      )
      const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth))
        ? minWidth
        : parseInt(this.calculatedMaxWidth)
      return `${Math.min(
        calculatedMaxWidth,
        minWidth
      )}px`
    },
    calculatedTop () {
      if (!this.auto || this.isAttached) {
        return this.calcTop()
      }
      return `${this.calcYOverflow(this.calculatedTopAuto)}px`
    },
    styles () {
      return {
        maxHeight: this.calculatedMaxHeight,
        minWidth: this.calculatedMinWidth,
        maxWidth: this.calculatedMaxWidth,
        top: this.calculatedTop,
        left: this.calculatedLeft,
        transformOrigin: this.origin,
        zIndex: this.zIndex || this.activeZIndex
      }
    }
  },
  watch: {
    activator (newActivator, oldActivator) {
      this.removeActivatorEvents(oldActivator)
      this.addActivatorEvents(newActivator)
    },
    disabled (disabled) {
      if (!this.activator) {
        return false
      }
      if (disabled) {
        this.removeActivatorEvents(this.activator)
      } else {
        this.addActivatorEvents(this.activator)
      }
    },
    isContentActive (val) {
      this.hasJustFocused = val
    }
  },
  methods: {
    activate () {
      this.getTiles()
      this.updateDimensions()
      requestAnimationFrame(() => {
        this.startTransition().then(() => {
          if (this.$refs.content) {
            this.calculatedTopAuto = this.calcTopAuto()
            this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition())
          }
        })
      })
    },
    closeConditional (e) {
      return this.isActive &&
        this.closeOnClick &&
        !this.$refs.content.contains(e.target)
    },
    onResize () {
      if (!this.isActive) {
        return false
      }
      // eslint-disable-next-line no-unused-expressions
      this.$refs.content.offsetWidth
      this.updateDimensions()
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(this.updateDimensions(), 100)
    }
  },
  mounted () {
    this.isActive && this.activate()
  },
  render (h) {
    const data = {
      staticClass: this.pre,
      class: {
        [`${this.pre}--inline`]: !this.fullWidth && this.$slots.activator
      },
      directives: [{
        arg: 500,
        name: 'resize',
        value: this.onResize
      }],
      on: this.disableKeys ? undefined : {
        keydown: this.onKeyDown
      }
    }
    return h('div', data, [
      this.genActivator(),
      this.genTransition()
    ])
  }
}
