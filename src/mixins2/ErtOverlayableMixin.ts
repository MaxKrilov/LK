import ErtOverlay from '@/components/UI2/ErtOverlay'

import ErtResponsiveMixin from './ErtResponsiveMixin'

import { keyCode as keyCodes } from '@/functions/keyCode'
import { addOnceEventListener, addPassiveEventListener, getZIndex } from '@/functions/helper2'

import Component, { mixins } from 'vue-class-component'

const props = {
  hideOverlay: Boolean,
  overlayOpacity: [Number, String]
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtOverlayableMixin>>({
  props,
  watch: {
    hideOverlay (value) {
      if (!this.isActive) return

      if (value) this.removeOverlay()
      else this.genOverlay()
    }
  }
})
export default class ErtOverlayableMixin extends mixins(ErtResponsiveMixin) {
  // Options
  isActive!: boolean
  activeZIndex!: number
  absolute!: boolean
  $refs!: {
    dialog: HTMLElement,
    content: HTMLElement
  }

  // Props
  readonly hideOverlay!: boolean
  readonly overlayOpacity!: number | string

  // Data
  animationFrame: number = 0
  overlay: InstanceType<typeof ErtOverlay> | null = null

  // Hooks
  beforeDestroy () {
    this.removeOverlay()
  }

  // Methods
  createOverlay () {
    const overlay = new ErtOverlay({
      propsData: {
        absolute: this.absolute,
        value: false,
        opacity: this.overlayOpacity
      }
    })

    overlay.$mount()

    const parent = this.absolute
      ? this.$el.parentNode
      : document.querySelector('[data-app]')

    parent && parent.insertBefore(overlay.$el, parent.firstChild)

    this.overlay = overlay
  }

  genOverlay () {
    this.hideScroll()

    if (this.hideOverlay) return

    if (!this.overlay) this.createOverlay()

    this.animationFrame = requestAnimationFrame(() => {
      if (!this.overlay) return

      if (this.activeZIndex !== undefined) {
        // @ts-ignore
        this.overlay.zIndex = String(this.activeZIndex - 1)
      } else if (this.$el) {
        // @ts-ignore
        this.overlay.zIndex = getZIndex(this.$el)
      }

      // @ts-ignore
      this.overlay.value = true
    })

    return true
  }

  removeOverlay (showScroll = true) {
    if (this.overlay) {
      addOnceEventListener(this.overlay.$el, 'transitionend', () => {
        if (
          !this.overlay ||
          !this.overlay.$el ||
          !this.overlay.$el.parentNode ||
          this.overlay.value
        ) return

        this.overlay.$el.parentNode.removeChild(this.overlay.$el)
        this.overlay.$destroy()
        this.overlay = null
      })

      cancelAnimationFrame(this.animationFrame)

      // @ts-ignore
      this.overlay.value = false
    }

    showScroll && this.showScroll()
  }

  scrollListener (e: WheelEvent & KeyboardEvent) {
    if (e.type === 'keydown') {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as Element).tagName) ||
        (e.target as HTMLElement).isContentEditable
      ) return

      const up = [keyCodes.DOM_VK_UP, keyCodes.DOM_VK_PAGE_UP]
      const down = [keyCodes.DOM_VK_DOWN, keyCodes.DOM_VK_PAGE_DOWN]

      if (up.includes(e.keyCode)) {
        (e as any).deltaY = -1
      } else if (down.includes(e.keyCode)) {
        (e as any).deltaY = 1
      } else {
        return
      }
    }

    if (e.target === this.overlay ||
      (e.type !== 'keydown' && e.target === document.body) ||
      this.checkPath(e)) e.preventDefault()
  }

  hasScrollbar (el?: Element) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false

    const style = window.getComputedStyle(el)
    return ['auto', 'scroll'].includes(style.overflowY!) && el.scrollHeight > el.clientHeight
  }

  shouldScroll (el: Element, delta: number) {
    if (el.scrollTop === 0 && delta < 0) return true
    return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0
  }

  isInside (el: Element, parent: Element): boolean {
    if (el === parent) {
      return true
    } else if (el === null || el === document.body) {
      return false
    } else {
      return this.isInside(el.parentNode as Element, parent)
    }
  }

  checkPath (e: WheelEvent) {
    // @ts-ignore
    const path = e.path || this.composedPath(e)
    const delta = e.deltaY

    if (e.type === 'keydown' && path[0] === document.body) {
      const dialog = this.$refs.dialog
      const selected = window.getSelection()!.anchorNode as Element
      if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
        return this.shouldScroll(dialog, delta)
      }
      return true
    }

    for (let index = 0; index < path.length; index++) {
      const el = path[index]

      if (el === document) return true
      if (el === document.documentElement) return true
      if (el === this.$refs.content) return true

      if (this.hasScrollbar(el as Element)) return this.shouldScroll(el as Element, delta)
    }

    return true
  }

  composedPath (e: WheelEvent): EventTarget[] {
    if (e.composedPath) return e.composedPath()

    const path = []
    let el = e.target as Element

    while (el) {
      path.push(el)

      if (el.tagName === 'HTML') {
        path.push(document)
        path.push(window)

        return path
      }

      el = el.parentElement!
    }
    return path
  }

  hideScroll () {
    if (this.isSM) {
      document.documentElement!.classList.add('overflow-y-hidden')
    } else {
      addPassiveEventListener(window, 'wheel', this.scrollListener as EventHandlerNonNull, { passive: false })
      window.addEventListener('keydown', this.scrollListener as EventHandlerNonNull)
    }
  }

  showScroll () {
    document.documentElement!.classList.remove('overflow-y-hidden')
    window.removeEventListener('wheel', this.scrollListener as EventHandlerNonNull)
    window.removeEventListener('keydown', this.scrollListener as EventHandlerNonNull)
  }
}
