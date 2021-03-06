import { getSlotType } from '../../../../functions/helper'

export default {
  methods: {
    genActivator () {
      if (!this.$slots.activator && !this.$scopedSlots.activator) {
        return null
      }
      const listeners = {}
      if (!this.disabled) {
        if (this.openOnHover) {
          listeners.mouseenter = this.mouseEnterHandler
          listeners.mouseleave = this.mouseLeaveHandler
        } else if (this.openOnClick) {
          listeners.click = this.activatorClickHandler
        }
      }
      if (getSlotType(this, 'activator') === 'scoped') {
        listeners.keydown = this.onKeyDown
        const activator = this.$scopedSlots.activator({ on: listeners })
        this.activatorNode = activator
        return activator
      }
      return this.$createElement('div', {
        staticClass: 'er-menu__activator',
        class: {
          'er-menu__activator--active': this.hasJustFocused || this.isActive,
          'er-menu__activator--disabled': this.disabled
        },
        ref: 'activator',
        on: listeners
      }, this.$slots.activator)
    },
    genTransition () {
      if (!this.transition) {
        return this.genContent()
      }
      return this.$createElement('transition', {
        props: {
          name: this.transition
        }
      }, [this.genContent()])
    },
    genDirectives () {
      const directives = !this.openOnHover && this.closeOnClick ? [{
        name: 'click-outside',
        value: () => { this.isActive = false },
        args: {
          closeConditional: this.closeConditional,
          include: () => [this.$el, ...this.getOpenDependentElements()]
        }
      }] : []
      directives.push({
        name: 'show',
        value: this.isContentActive
      })
      return directives
    },
    genContent () {
      const options = {
        attrs: this.getScopeIdAttrs(),
        staticClass: 'er-menu__content',
        class: {
          'er-menu__content--auto': this.auto,
          'er-menu__content--fixed': this.activatorFixed,
          'menuable__content__active': this.isActive,
          [this.contentClass.trim()]: true
        },
        style: this.styles,
        directives: this.genDirectives(),
        ref: 'content',
        on: {
          click: e => {
            e.stopPropagation()
            if (e.target.getAttribute('disabled')) return
            if (this.closeOnContentClick) {
              this.isActive = false
            }
          },
          keydown: this.onKeyDown
        }
      }
      !this.disabled && this.openOnHover && (options.on.mouseenter = this.mouseEnterHandler)
      this.openOnHover && (options.on.mouseleave = this.mouseLeaveHandler)
      return this.$createElement('div', options, this.showLazyContent(this.$slots.default))
    }
  }
}
