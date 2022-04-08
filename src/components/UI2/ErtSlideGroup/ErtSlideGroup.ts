import './ErtSlideGroup.scss'

import ErtIcon from '@/components/UI2/ErtIcon'
import { ErtFadeTransition } from '@/functions/transitions'

import { ErtItemGroupBase } from '@/components/UI2/ErtItemGroup/ErtItemGroup'

import ErtMobileMixin from '@/mixins2/ErtMobileMixin'

import Resize from '@/directives/resize'
import Touch from '@/directives/touch'

import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { CreateElement, VNode } from 'vue'
import { composedPath } from '@/functions/helper2'

interface TouchEvent {
  touchstartX: number
  touchstartY: number
  touchmoveX: number
  touchmoveY: number
  stopPropagation: Function
}

interface Widths {
  content: number
  wrapper: number
}

const bias = (val: number) => {
  const c = 0.501
  const x = Math.abs(val)
  return Math.sign(val) * (x / ((1 / c - 2) * (1 - x) + 1))
}

export const calculateUpdatedOffset = (
  selectedElement: HTMLElement,
  widths: Widths,
  currentScrollOffset: number
): number => {
  const clientWidth = selectedElement.clientWidth
  const offsetLeft = selectedElement.offsetLeft

  const totalWidth = widths.wrapper + currentScrollOffset
  const itemOffset = clientWidth + offsetLeft
  const additionalOffset = clientWidth * 0.4

  if (offsetLeft <= currentScrollOffset) {
    currentScrollOffset = Math.max(offsetLeft - additionalOffset, 0)
  } else if (totalWidth <= itemOffset) {
    currentScrollOffset = Math.min(currentScrollOffset - (totalWidth - itemOffset - additionalOffset), widths.content - widths.wrapper)
  }

  return currentScrollOffset
}

export const calculateCenteredOffset = (
  selectedElement: HTMLElement,
  widths: Widths
) => {
  const { offsetLeft, clientWidth } = selectedElement

  const offsetCentered = offsetLeft + clientWidth / 2 - widths.wrapper / 2
  return Math.min(widths.content - widths.wrapper, Math.max(0, offsetCentered))
}

@Component<InstanceType<typeof ErtBaseSlideGroup>>({
  directives: {
    Resize,
    Touch
  },
  watch: {
    internalValue: 'setWidths',
    isOverflowing: 'setWidths',
    scrollOffset (val) {
      let scroll =
        val <= 0
          ? bias(-val)
          : val > this.widths.content - this.widths.wrapper
            ? -(this.widths.content - this.widths.wrapper) + bias(this.widths.content - this.widths.wrapper - val)
            : -val

      this.$refs.content.style.transform = `translateX(${scroll}px)`
    }
  }
})
export class ErtBaseSlideGroup extends mixins(ErtItemGroupBase, ErtMobileMixin) {
  /// Options
  $refs!: {
    content: HTMLElement
    wrapper: HTMLElement
  }

  /// Props
  @Prop({ type: String, default: 'ert-slide-item--active' })
  readonly activeClass!: string

  @Prop({ type: Boolean })
  readonly centerActive!: boolean

  @Prop({ type: String, default: 'right_big' })
  readonly nextIcon!: string

  @Prop({ type: String, default: 'left_big' })
  readonly prevIcon!: string

  @Prop({
    type: [Boolean, String],
    validator: v => (
      typeof v === 'boolean' || [
        'always',
        'desktop',
        'mobile'
      ].includes(v)
    )
  })
  readonly showArrows!: string | boolean

  /// Data
  internalItemsLength: number = 0
  isOverflowing: boolean = false
  resizeTimeout: number = 0
  startX: number = 0
  isSwipingHorizontal: boolean = false
  isSwiping: boolean = false
  scrollOffset: number = 0
  widths = {
    content: 0,
    wrapper: 0
  }

  /// Computed
  get canTouch (): boolean {
    return typeof window !== 'undefined'
  }

  get __cachedNext (): VNode {
    return this.genTransition('next')
  }

  get __cachedPrev (): VNode {
    return this.genTransition('prev')
  }

  get classes (): object {
    return {
      ...ErtItemGroupBase.options.computed.classes.get.call(this),
      'ert-slide-group': true,
      'ert-slide-group--has-affixes': this.hasAffixes,
      'ert-slide-group--is-overflowing': this.isOverflowing
    }
  }

  get hasAffixes (): Boolean {
    switch (this.showArrows) {
      case 'always': return true

      case 'desktop': return !this.isMobile

      case true: return this.isOverflowing || Math.abs(this.scrollOffset) > 0

      case 'mobile': return (
        this.isMobile ||
        (this.isOverflowing || Math.abs(this.scrollOffset) > 0)
      )

      default: return (
        !this.isMobile &&
        (this.isOverflowing || Math.abs(this.scrollOffset) > 0)
      )
    }
  }

  get hasNext (): boolean {
    if (!this.hasAffixes) return false

    const { content, wrapper } = this.widths

    return content > Math.abs(this.scrollOffset) + wrapper
  }

  get hasPrev (): boolean {
    return this.hasAffixes && this.scrollOffset !== 0
  }

  /// Methods
  onScroll () {
    this.$refs.wrapper.scrollLeft = 0
  }
  onFocusin (e: FocusEvent) {
    if (!this.isOverflowing) return

    for (const el of composedPath(e)) {
      for (const vm of this.items) {
        if (vm.$el === el) {
          this.scrollOffset = calculateUpdatedOffset(
            vm.$el as HTMLElement,
            this.widths,
            this.scrollOffset
          )
          return
        }
      }
    }
  }

  genNext (): VNode | null {
    const slot = this.$scopedSlots.next
      ? this.$scopedSlots.next({})
      : this.$slots.next || this.__cachedNext

    return this.$createElement('div', {
      staticClass: 'ert-slide-group__next',
      class: {
        'ert-slide-group__next--disabled': !this.hasNext
      },
      on: {
        click: () => this.onAffixClick('next')
      },
      key: 'next'
    }, [slot])
  }
  genContent (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-slide-group__content',
      ref: 'content',
      on: {
        focusin: this.onFocusin
      }
    }, this.$slots.default)
  }
  genData (): object {
    return {
      class: this.classes,
      directives: [{
        arg: '500',
        name: 'resize',
        value: this.onResize
      }]
    }
  }
  genIcon (location: 'prev' | 'next'): VNode | null {
    let icon = location

    const upperLocation = `${location[0].toUpperCase()}${location.slice(1)}`
    const hasAffix = (this as any)[`has${upperLocation}`]

    if (
      !this.showArrows &&
      !hasAffix
    ) return null

    return this.$createElement(ErtIcon, {
      props: {
        disabled: !hasAffix,
        name: (this as any)[`${icon}Icon`],
        small: true
      }
    })
  }
  // Always generate prev for scrollable hint
  genPrev (): VNode | null {
    const slot = this.$scopedSlots.prev
      ? this.$scopedSlots.prev({})
      : this.$slots.prev || this.__cachedPrev

    return this.$createElement('div', {
      staticClass: 'ert-slide-group__prev',
      class: {
        'ert-slide-group__prev--disabled': !this.hasPrev
      },
      on: {
        click: () => this.onAffixClick('prev')
      },
      key: 'prev'
    }, [slot])
  }
  genTransition (location: 'prev' | 'next') {
    return this.$createElement(ErtFadeTransition, [this.genIcon(location)])
  }
  genWrapper (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-slide-group__wrapper',
      directives: [{
        name: 'touch',
        value: {
          start: (e: TouchEvent) => this.overflowCheck(e, this.onTouchStart),
          move: (e: TouchEvent) => this.overflowCheck(e, this.onTouchMove),
          end: (e: TouchEvent) => this.overflowCheck(e, this.onTouchEnd)
        }
      }],
      ref: 'wrapper',
      on: {
        scroll: this.onScroll
      }
    }, [this.genContent()])
  }
  calculateNewOffset (direction: 'prev' | 'next', widths: Widths, currentScrollOffset: number) {
    const sign = 1
    const newAbosluteOffset = sign * currentScrollOffset +
      (direction === 'prev' ? -1 : 1) * widths.wrapper

    return sign * Math.max(Math.min(newAbosluteOffset, widths.content - widths.wrapper), 0)
  }
  onAffixClick (location: 'prev' | 'next') {
    this.$emit(`click:${location}`)
    this.scrollTo(location)
  }
  onResize () {
    if (this._isDestroyed) return

    this.setWidths()
  }
  onTouchStart (e: TouchEvent) {
    const { content } = this.$refs

    this.startX = this.scrollOffset + e.touchstartX as number

    content.style.setProperty('transition', 'none')
    content.style.setProperty('willChange', 'transform')
  }
  onTouchMove (e: TouchEvent) {
    if (!this.canTouch) return

    if (!this.isSwiping) {
      const diffX = e.touchmoveX - e.touchstartX
      const diffY = e.touchmoveY - e.touchstartY
      this.isSwipingHorizontal = Math.abs(diffX) > Math.abs(diffY)
      this.isSwiping = true
    }

    if (this.isSwipingHorizontal) {
      this.scrollOffset = this.startX - e.touchmoveX
      document.documentElement.style.overflowY = 'hidden'
    }
  }
  onTouchEnd () {
    if (!this.canTouch) return

    const { content, wrapper } = this.$refs
    const maxScrollOffset = content.clientWidth - wrapper.clientWidth

    content.style.setProperty('transition', null)
    content.style.setProperty('willChange', null)

    if (this.scrollOffset < 0 || !this.isOverflowing) {
      this.scrollOffset = 0
    } else if (this.scrollOffset >= maxScrollOffset) {
      this.scrollOffset = maxScrollOffset
    }

    this.isSwiping = false
    document.documentElement.style.removeProperty('overflow-y')
  }
  overflowCheck (e: TouchEvent, fn: (e: TouchEvent) => void) {
    e.stopPropagation()
    this.isOverflowing && fn(e)
  }
  scrollIntoView /* istanbul ignore next */ () {
    if (!this.selectedItem && this.items.length) {
      const lastItemPosition = this.items[this.items.length - 1].$el.getBoundingClientRect()
      const wrapperPosition = this.$refs.wrapper.getBoundingClientRect()

      if (wrapperPosition.left > lastItemPosition.left) {
        this.scrollTo('prev')
      }
    }

    if (!this.selectedItem) {
      return
    }

    if (
      this.selectedIndex === 0 ||
      (!this.centerActive && !this.isOverflowing)
    ) {
      this.scrollOffset = 0
    } else if (this.centerActive) {
      this.scrollOffset = calculateCenteredOffset(
        this.selectedItem.$el as HTMLElement,
        this.widths
      )
    } else if (this.isOverflowing) {
      this.scrollOffset = calculateUpdatedOffset(
        this.selectedItem.$el as HTMLElement,
        this.widths,
        this.scrollOffset
      )
    }
  }
  scrollTo /* istanbul ignore next */ (location: 'prev' | 'next') {
    this.scrollOffset = this.calculateNewOffset(location, {
      // Force reflow
      content: this.$refs.content ? this.$refs.content.clientWidth : 0,
      wrapper: this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 0
    }, this.scrollOffset)
  }
  setWidths () {
    window.requestAnimationFrame(() => {
      if (this._isDestroyed) return

      const { content, wrapper } = this.$refs

      this.widths = {
        content: content ? content.clientWidth : 0,
        wrapper: wrapper ? wrapper.clientWidth : 0
      }

      this.isOverflowing = this.widths.wrapper + 1 < this.widths.content

      this.scrollIntoView()
    })
  }

  /// Hooks
  beforeUpdate () {
    this.internalItemsLength = (this.$children || []).length
  }

  updated () {
    if (this.internalItemsLength === (this.$children || []).length) return
    this.setWidths()
  }

  render (h: CreateElement): VNode {
    return h('div', this.genData(), [
      this.genPrev(),
      this.genWrapper(),
      this.genNext()
    ])
  }
}

@Component({
  provide (): object {
    return {
      slideGroup: this
    }
  }
})
export default class ErtSlideGroup extends ErtBaseSlideGroup {}
