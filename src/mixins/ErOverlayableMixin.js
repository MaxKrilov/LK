import '@/assets/scss/components/UI/_er-overlay.scss'
import { addClass, eachArray, getFirstElement, getScreenWidth, removeClass, setStyle } from '../functions/helper'
import { keyCode } from '../functions/keyCode'
import { BREAKPOINT_SM } from '../constants/breakpoint'

export default {
  name: 'overlayable',
  data: () => ({
    overlay: null,
    overlayOffset: 0,
    overlayTimeout: undefined,
    overlayTransitionDuration: 500 + 150
  }),
  props: {
    hideOverlay: Boolean
  },
  watch: {
    hideOverlay (value) {
      if (value) {
        this.removeOverlay()
      } else {
        this.genOverlay()
      }
    }
  },
  methods: {
    genOverlay () {
      if ((!this.isActive || this.hideOverlay) || (this.isActive && this.overlayTimeout) || this.overlay) {
        clearTimeout(this.overlayTimeout)
        return this.overlay && this.overlay.classList.add('er-overlay--active')
      }
      this.overlay = document.createElement('div')
      addClass(this.overlay, 'er-overlay')
      if (this.absolute) {
        addClass(this.overlay, 'er-overlay--absolute')
      }
      this.hideScroll()
      const parent = this.absolute ? this.$el.parentNode : document.querySelector('[data-app]')
      parent && parent.insertBefore(this.overlay, parent.firstChild)
      // eslint-disable-next-line no-unused-expressions
      this.overlay.clientHeight
      requestAnimationFrame(() => {
        if (!this.overlay) return
        addClass(this.overlay, 'er-overlay--active')
      })
      if (this.activeZIndex !== undefined) {
        setStyle(this.overlay, 'zIndex', String(this.activeZIndex - 1))
      }
      return true
    },
    removeOverlay (showScroll = true) {
      if (!this.overlay) {
        return showScroll && this.showScroll()
      }
      removeClass(this.overlay, 'er-overlay--active')
      this.overlayTimeout = window.setTimeout(() => {
        try {
          if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay)
          }
          this.overlay = null
          showScroll && this.showScroll()
        } catch (e) {
          console.log(e)
        }
        clearTimeout(this.overlayTimeout)
        this.overlayTimeout = undefined
      }, this.overlayTransitionDuration)
    },
    scrollListener (e) {
      if (e.type === 'keydown') {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.isContentEditable) return
        const up = [keyCode.DOM_VK_UP, keyCode.DOM_VK_PAGE_UP]
        const down = [keyCode.DOM_VK_DOWN, keyCode.DOM_VK_PAGE_DOWN]
        if (up.includes(e.keyCode)) {
          e.deltaY = -1
        } else if (down.includes(e.keyCode)) {
          e.deltaY = 1
        } else return
      }
      if (e.target === this.overlay || (e.type !== 'keydown' && e.target === document.body) || this.checkPath(e)) {
        e.preventDefault()
      }
    },
    hasScrollbar (el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return false
      }
      // eslint-disable-next-line
      const style = style(el)
      return ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight
    },
    shouldScroll (el, delta) {
      if (el.scrollTop === 0 && delta < 0) {
        return true
      }
      return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0
    },
    isInside (el, parent) {
      return el === parent
        ? true
        : el === null || el === document.body
          ? false
          : this.isInside(el.parentNode, parent)
    },
    checkPath (e) {
      const path = e.path || this.composedPath(e)
      const delta = e.deltaY
      if (e.type === 'keydown' && getFirstElement(path) === document.body) {
        const dialog = this.$refs.dialog
        const selected = window.getSelection().anchorNode
        if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
          return this.shouldScroll(dialog, delta)
        }
        return true
      }
      eachArray(path, el => {
        if (el === document || el === document.documentElement || el === this.$refs.content) {
          return true
        }
        if (this.hasScrollbar(el)) {
          return this.shouldScroll(el, delta)
        }
      })
      return true
    },
    composedPath (e) {
      if (e.composedPath) {
        return e.composedPath()
      }
      const path = []
      let el = e.target
      while (el) {
        path.push(el)
        if (el.tagName === 'HTML') {
          path.push(document)
          path.push(window)
          return path
        }
        el = el.parentNode
      }
      return path
    },
    hideScroll () {
      if (getScreenWidth() <= BREAKPOINT_SM) {
        addClass(document.documentElement, 'overflow-y-hidden')
      } else {
        window.addEventListener('while', this.scrollListener, { passive: false })
        window.addEventListener('keydown', this.scrollListener)
      }
    },
    showScroll () {
      removeClass(document.documentElement, 'overflow-y-hidden')
      window.removeEventListener('wheel', this.scrollListener)
      window.removeEventListener('keydown', this.scrollListener)
    }
  },
  beforeDestroy () {
    this.removeOverlay()
  }
}
