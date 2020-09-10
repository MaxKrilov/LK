import './style.scss'

import ErtActivatableMixin from '@/mixins2/ErtActivatableMixin'
import ErtDependentMixin from '@/mixins2/ErtDependentMixin'
import ErtDetachableMixin from '@/mixins2/ErtDetachableMixin'
import ErtOverlayableMixin from '@/mixins2/ErtOverlayableMixin'
import ErtReturnableMixin from '@/mixins2/ErtReturnableMixin'
import ErtStackableMixin from '@/mixins2/ErtStackableMixin'
import ErtToggleableMixin from '@/mixins2/ErtToggleableMixin'

import ClickOutside from '@/directives/click-outside'

import Component, { mixins } from 'vue-class-component'
import { CreateElement, VNode, VNodeData } from 'vue'

import { convertToUnit } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

const baseMixins = mixins<
  InstanceType<typeof ErtActivatableMixin> &
  InstanceType<typeof ErtDependentMixin> &
  InstanceType<typeof ErtDetachableMixin> &
  InstanceType<typeof ErtOverlayableMixin> &
  InstanceType<typeof ErtReturnableMixin> &
  InstanceType<typeof ErtStackableMixin> &
  InstanceType<typeof ErtToggleableMixin>
  >(
    ErtActivatableMixin,
    ErtDependentMixin,
    ErtDetachableMixin,
    ErtOverlayableMixin,
    ErtReturnableMixin,
    ErtStackableMixin,
    ErtToggleableMixin
  )

const props = {
  disabled: Boolean,
  fullscreen: Boolean,
  maxWidth: {
    type: [String, Number],
    default: 'none'
  },
  noClickAnimation: Boolean,
  origin: {
    type: String,
    default: 'center center'
  },
  persistent: Boolean,
  retainFocus: {
    type: Boolean,
    default: true
  },
  scrollable: Boolean,
  transition: {
    type: [String, Boolean],
    default: 'dialog-transition'
  },
  width: {
    type: [String, Number],
    default: 'auto'
  }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtDialog>>({
  directives: { ClickOutside },
  props,
  watch: {
    isActive (val) {
      if (val) {
        this.show()
        this.hideScroll()
      } else {
        this.removeOverlay()
        this.unbind()
      }
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
  }
})
class ErtDialog extends baseMixins {
  // Props
  readonly disabled!: boolean
  readonly fullscreen!: boolean
  readonly maxWidth!: string | number
  readonly noClickAnimation!: boolean
  readonly origin!: string
  readonly persistent!: boolean
  readonly retainFocus!: boolean
  readonly scrollable!: boolean
  readonly transition!: string | boolean
  readonly width!: string | number

  // Data
  activatedBy: EventTarget | null = null
  animate: boolean = false
  animateTimeout: number = -1
  isActive: boolean = !!this.value
  stackMinZIndex: number = 200

  // Computed
  get classes (): object {
    return {
      [(`ert-dialog ${this.contentClass}`).trim()]: true,
      'ert-dialog--active': this.isActive,
      'ert-dialog--persistent': this.persistent,
      'ert-dialog--fullscreen': this.fullscreen,
      'ert-dialog--scrollable': this.scrollable,
      'ert-dialog--animated': this.animate
    }
  }

  get contentClasses (): object {
    return {
      'ert-dialog__content': true,
      'ert-dialog__content--active': this.isActive
    }
  }

  get hasActivator (): boolean {
    return Boolean(
      !!this.$slots.activator ||
      !!this.$scopedSlots.activator
    )
  }

  // Hooks
  beforeMount () {
    this.$nextTick(() => {
      this.isBooted = this.isActive
      this.isActive && this.show()
    })
  }

  beforeDestroy () {
    if (typeof window !== 'undefined') this.unbind()
  }

  // Methods
  animateClick () {
    this.animate = false
    this.$nextTick(() => {
      this.animate = true
      window.clearTimeout(this.animateTimeout)
      this.animateTimeout = window.setTimeout(() => (this.animate = false), 150)
    })
  }

  closeConditional (e: Event) {
    const target = e.target as HTMLElement
    return !(
      this._isDestroyed ||
      !this.isActive ||
      this.$refs.content.contains(target) ||
      (this.overlay && target && !this.overlay.$el.contains(target))
    ) && this.activeZIndex >= this.getMaxZIndex()
  }

  hideScroll () {
    if (this.fullscreen) {
      document.documentElement.classList.add('overflow-y-hidden')
    } else {
      ErtOverlayableMixin.options.methods.hideScroll.call(this)
    }
  }

  show () {
    !this.fullscreen && !this.hideOverlay && this.genOverlay()
    this.$nextTick(() => {
      this.$refs.content.focus()
      this.bind()
    })
  }

  bind () {
    window.addEventListener('focusin', this.onFocusin)
  }

  unbind () {
    window.removeEventListener('focusin', this.onFocusin)
  }

  onClickOutside (e: Event) {
    this.$emit('click:outside', e)

    if (this.persistent) {
      this.noClickAnimation || this.animateClick()
    } else {
      this.isActive = false
    }
  }

  onKeydown (e: KeyboardEvent) {
    if (e.keyCode === keyCodes.DOM_VK_ESCAPE && !this.getOpenDependents().length) {
      if (!this.persistent) {
        this.isActive = false
        const activator = this.getActivator()
        this.$nextTick(() => activator && (activator as HTMLElement).focus())
      } else if (!this.noClickAnimation) {
        this.animateClick()
      }
    }
    this.$emit('keydown', e)
  }

  onFocusin (e: Event) {
    if (!e || !this.retainFocus) return

    const target = e.target as HTMLElement

    if (
      !!target &&
      ![document, this.$refs.content].includes(target) &&
      !this.$refs.content.contains(target) &&
      this.activeZIndex >= this.getMaxZIndex() &&
      !this.getOpenDependentElements().some(el => el.contains(target))
    ) {
      const focusable = this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const el = [...focusable].find(el => !el.hasAttribute('disabled')) as HTMLElement | undefined
      el && el.focus()
    }
  }

  genContent () {
    return this.showLazyContent(() => [
      this.$createElement('div', {
        class: this.contentClasses,
        attrs: {
          role: 'document',
          tabindex: this.isActive ? 0 : undefined,
          ...this.getScopeIdAttrs()
        },
        on: { keydown: this.onKeydown },
        style: { zIndex: this.activeZIndex },
        ref: 'content'
      }, [this.genTransition()])
    ])
  }

  genTransition () {
    const content = this.genInnerContent()

    if (!this.transition) return content

    return this.$createElement('transition', {
      props: {
        name: this.transition,
        origin: this.origin,
        appear: true
      }
    }, [content])
  }

  genInnerContent () {
    const data: VNodeData = {
      class: this.classes,
      ref: 'dialog',
      directives: [
        {
          name: 'click-outside',
          value: {
            handler: this.onClickOutside,
            closeConditional: this.closeConditional,
            include: this.getOpenDependentElements
          }
        },
        { name: 'show', value: this.isActive }
      ],
      style: {
        transformOrigin: this.origin
      }
    }

    if (!this.fullscreen) {
      data.style = {
        ...data.style as object,
        maxWidth: this.maxWidth === 'none' ? undefined : convertToUnit(this.maxWidth),
        width: this.width === 'auto' ? undefined : convertToUnit(this.width)
      }
    }

    return this.$createElement('div', data, this.getContentSlot())
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-dialog__container',
      class: {
        'ert-dialog__container--attached':
          this.attach === '' ||
          this.attach === true ||
          this.attach === 'attach'
      },
      attrs: { role: 'dialog' }
    }, [
      this.genActivator(),
      this.genContent()
    ])
  }
}

export { ErtDialog }
export default ErtDialog
