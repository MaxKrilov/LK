import ErtPositionableMixin from './ErtPositionableMixin'
import ErtStackableMixin from './ErtStackableMixin'
import ErtActivatableMixin from './ErtActivatableMixin'

import Component, { mixins } from 'vue-class-component'

import { convertToUnit } from '@/functions/helper2'

const baseMixins = mixins(
  ErtPositionableMixin,
  ErtStackableMixin,
  ErtActivatableMixin
)

const props = {
  allowOverflow: Boolean,
  maxWidth: {
    type: [Number, String],
    default: 'auto'
  },
  minWidth: [Number, String],
  nudgeBottom: {
    type: [Number, String],
    default: 0
  },
  nudgeLeft: {
    type: [Number, String],
    default: 0
  },
  nudgeRight: {
    type: [Number, String],
    default: 0
  },
  nudgeTop: {
    type: [Number, String],
    default: 0
  },
  nudgeWidth: {
    type: [Number, String],
    default: 0
  },
  offsetOverflow: Boolean,
  openOnClick: Boolean,
  positionX: {
    type: Number,
    default: null
  },
  positionY: {
    type: Number,
    default: null
  },
  zIndex: {
    type: [Number, String],
    default: null
  }
}

@Component<InstanceType<typeof ErtMenuableMixin>>({
  props,
  watch: {
    disabled (val) {
      val && this.callDeactivate()
    },
    isActive (val) {
      if (this.disabled) return

      val ? this.callActivate() : this.callDeactivate()
    },
    positionX: 'updateDimensions',
    positionY: 'updateDimensions'
  }
})
export default class ErtMenuableMixin extends baseMixins {
  // Options
  attach!: boolean | string | Element
  offsetY!: boolean
  offsetX!: boolean
  $refs!: {
    content: HTMLElement
    activator: HTMLElement
  }

  // Props
  readonly allowOverflow!: boolean
  readonly maxWidth!: number | string
  readonly minWidth!: number | string
  readonly nudgeBottom!: number | string
  readonly nudgeLeft!: number | string
  readonly nudgeRight!: number | string
  readonly nudgeTop!: number | string
  readonly nudgeWidth!: number | string
  readonly offsetOverflow!: boolean
  readonly openOnClick!: boolean
  readonly positionX!: number
  readonly positionY!: number
  readonly zIndex!: number | string

  // Data
  absoluteX: number = 0
  absoluteY: number = 0
  activatedBy: EventTarget | null = null
  activatorFixed: boolean = false
  dimensions: Record<string, Record<string, number>> = {
    activator: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      offsetTop: 0,
      scrollHeight: 0,
      offsetLeft: 0
    },
    content: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      offsetTop: 0,
      scrollHeight: 0
    }
  }
  hasJustFocused: boolean = false
  hasWindow: boolean = false
  inputActivator: boolean = false
  isContentActive: boolean = false
  pageWidth: number = 0
  pageYOffset: number = 0
  stackClass: string = 'ert-menu__content--active'
  stackMinZIndex: number = 6

  // Computed
  get computedLeft () {
    const a = this.dimensions.activator
    const c = this.dimensions.content
    const activatorLeft = (this.attach !== false ? a.offsetLeft : a.left) || 0
    const minWidth = Math.max(a.width, c.width)
    let left = 0
    left += this.left ? activatorLeft - (minWidth - a.width) : activatorLeft
    if (this.offsetX) {
      const maxWidth = isNaN(Number(this.maxWidth))
        ? a.width
        : Math.min(a.width, Number(this.maxWidth))

      left += this.left ? -maxWidth : a.width
    }
    if (this.nudgeLeft) left -= parseInt(this.nudgeLeft)
    if (this.nudgeRight) left += parseInt(this.nudgeRight)

    return left
  }

  get computedTop () {
    const a = this.dimensions.activator
    const c = this.dimensions.content
    let top = 0

    if (this.top) top += a.height - c.height
    if (this.attach !== false) top += a.offsetTop
    else top += a.top + this.pageYOffset
    if (this.offsetY) top += this.top ? -a.height : a.height
    if (this.nudgeTop) top -= parseInt(this.nudgeTop)
    if (this.nudgeBottom) top += parseInt(this.nudgeBottom)

    return top
  }

  get hasActivator (): boolean {
    return !!this.$slots.activator || !!this.$scopedSlots.activator || !!this.activator || !!this.inputActivator
  }

  // Hooks
  beforeMount () {
    this.hasWindow = typeof window !== 'undefined'
  }

  // Methods
  absolutePosition () {
    return {
      offsetTop: 0,
      offsetLeft: 0,
      scrollHeight: 0,
      top: this.positionY || this.absoluteY,
      bottom: this.positionY || this.absoluteY,
      left: this.positionX || this.absoluteX,
      right: this.positionX || this.absoluteX,
      height: 0,
      width: 0
    }
  }

  activate () {}

  calcLeft (menuWidth: number) {
    return convertToUnit(this.attach !== false
      ? this.computedLeft
      : this.calcXOverflow(this.computedLeft, menuWidth))
  }

  calcTop () {
    return convertToUnit(this.attach !== false
      ? this.computedTop
      : this.calcYOverflow(this.computedTop))
  }

  calcXOverflow (left: number, menuWidth: number) {
    const xOverflow = left + menuWidth - this.pageWidth + 12

    if ((!this.left || this.right) && xOverflow > 0) {
      left = Math.max(left - xOverflow, 0)
    } else {
      left = Math.max(left, 12)
    }

    return left + this.getOffsetLeft()
  }

  calcYOverflow (top: number) {
    const documentHeight = this.getInnerHeight()
    const toTop = this.pageYOffset + documentHeight
    const activator = this.dimensions.activator
    const contentHeight = this.dimensions.content.height
    const totalHeight = top + contentHeight
    const isOverflowing = toTop < totalHeight

    if (isOverflowing && this.offsetOverflow && activator.top > contentHeight) {
      top = this.pageYOffset + (activator.top - contentHeight)
    } else if (isOverflowing && !this.allowOverflow) {
      top = toTop - contentHeight - 12
    } else if (top < this.pageYOffset && !this.allowOverflow) {
      top = this.pageYOffset + 12
    }

    return top < 12 ? 12 : top
  }

  callActivate () {
    if (!this.hasWindow) return

    this.activate()
  }

  callDeactivate () {
    this.isContentActive = false

    this.deactivate()
  }

  checkForPageYOffset () {
    if (this.hasWindow) {
      this.pageYOffset = this.activatorFixed ? 0 : this.getOffsetTop()
    }
  }

  checkActivatorFixed () {
    if (this.attach !== false) return
    let el = this.getActivator()
    while (el) {
      if (window.getComputedStyle(el).position === 'fixed') {
        this.activatorFixed = true
        return
      }
      el = el.offsetParent as HTMLElement
    }
    this.activatorFixed = false
  }

  deactivate () {}

  genActivatorListeners () {
    const listeners = ErtActivatableMixin.options.methods.genActivatorListeners.call(this)

    const onClick = listeners.click

    listeners.click = (e: MouseEvent & KeyboardEvent & FocusEvent) => {
      if (this.openOnClick) {
        onClick && onClick(e)
      }

      this.absoluteX = e.clientX
      this.absoluteY = e.clientY
    }

    return listeners
  }

  getInnerHeight () {
    if (!this.hasWindow) return 0

    return window.innerHeight ||
      document.documentElement.clientHeight
  }

  getOffsetLeft () {
    if (!this.hasWindow) return 0

    return window.pageXOffset ||
      document.documentElement.scrollLeft
  }

  getOffsetTop () {
    if (!this.hasWindow) return 0

    return window.pageYOffset ||
      document.documentElement.scrollTop
  }

  getRoundedBoundedClientRect (el: Element) {
    const rect = el.getBoundingClientRect()
    return {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      bottom: Math.round(rect.bottom),
      right: Math.round(rect.right),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    }
  }

  measure (el: HTMLElement) {
    if (!el || !this.hasWindow) return null

    const rect = this.getRoundedBoundedClientRect(el)

    if (this.attach !== false) {
      const style = window.getComputedStyle(el)

      rect.left = parseInt(style.marginLeft!)
      rect.top = parseInt(style.marginTop!)
    }

    return rect
  }

  sneakPeek (cb: () => void) {
    requestAnimationFrame(() => {
      const el = this.$refs.content

      if (!el || el.style.display !== 'none') {
        cb()
        return
      }

      el.style.display = 'inline-block'
      cb()
      el.style.display = 'none'
    })
  }

  startTransition () {
    return new Promise<void>(resolve => requestAnimationFrame(() => {
      this.isContentActive = this.hasJustFocused = this.isActive
      resolve()
    }))
  }

  updateDimensions () {
    this.hasWindow = typeof window !== 'undefined'
    this.checkActivatorFixed()
    this.checkForPageYOffset()
    this.pageWidth = document.documentElement.clientWidth

    const dimensions: any = {
      activator: { ...this.dimensions.activator },
      content: { ...this.dimensions.content }
    }

    // Activator should already be shown
    if (!this.hasActivator || this.absolute) {
      dimensions.activator = this.absolutePosition()
    } else {
      const activator = this.getActivator()
      if (!activator) return

      dimensions.activator = this.measure(activator)
      dimensions.activator.offsetLeft = activator.offsetLeft
      if (this.attach !== false) {
        dimensions.activator.offsetTop = activator.offsetTop
      } else {
        dimensions.activator.offsetTop = 0
      }
    }

    // Display and hide to get dimensions
    this.sneakPeek(() => {
      this.$refs.content && (dimensions.content = this.measure(this.$refs.content))

      this.dimensions = dimensions
    })
  }
}
