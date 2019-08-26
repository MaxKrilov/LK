import './_style.scss'

import ErDependentMixin from '../../../mixins/ErDependentMixin'
import ErDetachableMixin from '../../../mixins/ErDetachableMixin'
import ErOverlaybleMixin from '../../../mixins/ErOverlayableMixin'
import ErReturnableMixin from '../../../mixins/ErReturnableMixin'
import ErStackableMixin from '../../../mixins/ErStackableMixin'
import ErToggleableMixin from '../../../mixins/ErToggleableMixin'

import ClickOutside from '../../../directives/click-outside'
import { addClass, getFirstElement, lengthVar, getSlotType, convertToUnit } from '../../../functions/helper'
import { keyCode } from '../../../functions/keyCode'
import { SELECTOR_APP_CONTENT } from '../../../constants/selectors'

export default {
  name: 'er-dialog',
  directives: {
    ClickOutside
  },
  mixins: [
    ErDependentMixin,
    ErDetachableMixin,
    ErOverlaybleMixin,
    ErReturnableMixin,
    ErStackableMixin,
    ErToggleableMixin
  ],
  data: () => ({
    pre: 'er-dialog',
    animate: false,
    animateTimeout: null,
    stackClass: 'er-dialog__content--active',
    stackMinZIndex: 200
  }),
  props: {
    disabled: Boolean,
    persistent: Boolean,
    fullscreen: Boolean,
    fullWidth: Boolean,
    noClickAnimation: Boolean,
    maxWidth: {
      type: [String, Number],
      default: 'none'
    },
    origin: {
      type: String,
      default: 'center center'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    scrollable: Boolean,
    transition: {
      type: [String, Boolean],
      default: 'dialog-transition'
    }
  },
  computed: {
    classes () {
      return {
        [(`${this.pre} ${this.contentClass}`).trim()]: true,
        [`${this.pre}--active`]: this.isActive,
        [`${this.pre}--persistent`]: this.persistent,
        [`${this.pre}--fullscreen`]: this.fullscreen,
        [`${this.pre}--scrollable`]: this.scrollable,
        [`${this.pre}--animated`]: this.animate
      }
    },
    contentClasses () {
      return {
        [`${this.pre}__content`]: true,
        [`${this.pre}__content--active`]: this.isActive
      }
    },
    hasActivator () {
      return Boolean(!!this.$slots.activator || !!this.$scopedSlots.activator)
    }
  },
  watch: {
    isActive (val) {
      if (val) {
        this.show()
        this.hideScroll()
      } else {
        this.removeOverlay()
        this.unbind()
      }
      this.toggleBlurOnContent()
    },
    fullscreen (val) {
      if (!this.isActive) return
      if (val) {
        this.hideScroll()
        this.removeOverlay(false)
      } else {
        this.showScroll()
        this.genOverlay()
      }
    }
  },
  methods: {
    toggleBlurOnContent () {
      document.querySelector(SELECTOR_APP_CONTENT).classList.toggle('blur')
    },
    animateClick () {
      this.animate = false
      this.$nextTick(() => {
        this.animate = true
        clearTimeout(this.animateTimeout)
        this.animateTimeout = setTimeout(() => {
          this.animate = false
        }, 150)
      })
    },
    closeConditional (e) {
      if (!this.isActive || this.$refs.content.contains(e.target)) {
        return false
      }
      if (this.persistent) {
        if (!this.noClickAnimation && this.overlay === e.target) {
          this.animateClick()
        }
        return false
      }
      return this.activeZIndex >= this.getMaxZIndex()
    },
    hideScroll () {
      if (this.fullscreen) {
        addClass(document.documentElement, 'overflow-y-hidden')
      } else {
        ErOverlaybleMixin.methods.hideScroll.call(this)
      }
    },
    show () {
      !this.fullscreen && !this.hideOverlay && this.genOverlay()
      this.$refs.content.focus()
      this.bind()
    },
    bind () {
      window.addEventListener('focusin', this.onFocusin)
    },
    unbind () {
      window.removeEventListener('focusin', this.onFocusin)
    },
    onKeydown (e) {
      if (e.keyCode === keyCode.DOM_VK_ESCAPE && !this.getOpenDependents().length) {
        if (!this.persistent) {
          this.isActive = false
          const activator = this.getActivator()
          this.$nextTick(() => activator && activator.focus())
        } else if (!this.noClickAnimation) {
          this.animateClick()
        }
      }
      this.$emit('keydown', e)
    },
    onFocusin (e) {
      const { target } = event
      if (
        ![document, this.$refs.content].includes(target) &&
        !this.$refs.content.contains(target) &&
        this.activeZIndex >= this.getMaxZIndex() &&
        !this.getOpenDependentElements().some(el => el.contains(target))
      ) {
        const focusable = this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        focusable.length && getFirstElement(focusable).focus()
      }
    },
    getActivator (e) {
      if (this.$refs.activator) {
        return lengthVar(this.$refs.activator.children) > 0
          ? getFirstElement(this.$refs.activator.children)
          : this.$refs.actiavtor
      }
      if (e) {
        this.activatedBy = e.currentTarget || e.target
      }
      if (this.activatedBy) {
        return this.activatedBy
      }
      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode)
          ? getFirstElement(this.activatorNode)
          : this.activatorNode
        const el = activator && activator.elm
        if (el) {
          return el
        }
      }
    },
    genActivator () {
      if (!this.hasActivator) {
        return null
      }
      const listeners = this.disabled ? {} : {
        click: e => {
          e.stopPropagation()
          this.getActivator(e)
          if (!this.disabled) {
            this.isActive = !this.isActive
          }
        }
      }
      if (getSlotType(this, 'activator') === 'scoped') {
        const activator = this.$scopedSlots.activator({ on: listeners })
        this.activatorNode = activator
        return activator
      }
      return this.$createElement('div', {
        staticClass: `${this.pre}__activator`,
        class: {
          [`${this.pre}__activator--disabled`]: this.disabled
        },
        ref: 'activator',
        on: listeners
      }, this.$slots.activator)
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      this.isBooted = this.isActive
      this.isActive && this.show()
    })
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      this.unbind()
    }
  },
  render (h) {
    const children = []
    const data = {
      class: this.classes,
      ref: 'dialog',
      directives: [
        {
          name: 'click-outside',
          value: () => { this.isActive = false },
          args: {
            closeConditional: this.closeConditional,
            include: this.getOpenDependentElements
          }
        },
        {
          name: 'show',
          value: this.isActive
        }
      ],
      on: {
        click: e => { e.stopPropagation() }
      }
    }
    if (!this.fullscreen) {
      data.style = {
        maxWidth: this.maxWidth === 'none' ? undefined : convertToUnit(this.maxWidth),
        width: this.width === 'auto' ? undefined : convertToUnit(this.width)
      }
    }
    children.push(this.genActivator())
    let dialog = h('div', data, this.showLazyContent(this.$slots.default))
    if (this.transition) {
      dialog = h('transition', {
        props: {
          name: this.transition,
          origin: this.origin
        }
      }, [dialog])
    }
    children.push(h('div', {
      class: this.contentClasses,
      attrs: {
        tabIndex: '-1',
        ...this.getScopeIdAttrs()
      },
      on: {
        keydown: this.onKeydown
      },
      style: { zIndex: this.activeZIndex },
      ref: 'content'
    }, [
      dialog
    ]))
    return h('div', {
      staticClass: `${this.pre}__container`,
      style: {
        display: (!this.hasActivator || this.fullWidth) ? 'block' : 'inline-block'
      }
    }, children)
  }
}
