import './ErtWindow.scss'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { VNode } from 'vue/types/vnode'
import { TouchHandlers } from '@/types'

import Touch from '@/directives/touch'

import ErtIcon from '@/components/UI2/ErtIcon'
import { ErtItemGroupBase } from '@/components/UI2/ErtItemGroup/ErtItemGroup'
import { CreateElement, VNodeDirective } from 'vue'

@Component<InstanceType<typeof ErtWindow>>({
  directives: { Touch },
  provide () {
    return {
      windowGroup: this
    }
  },
  watch: {
    internalIndex (val, oldVal) {
      this.isReverse = this.updateReverse(val, oldVal)
    }
  }
})
export default class ErtWindow extends ErtItemGroupBase {
  /// Props
  @Prop({ type: String, default: 'ert-window-item--active' })
  readonly activeClass!: string

  @Prop({ type: Boolean })
  readonly continuous!: boolean

  @Prop({ type: Boolean, default: true })
  readonly mandatory!: boolean

  @Prop({ type: [Boolean, String], default: 'right_big' })
  readonly nextIcon!: string | boolean

  @Prop({ type: [Boolean, String], default: 'left_big' })
  readonly prevIcon!: string | boolean

  @Prop({ type: Boolean })
  readonly reverse!: boolean

  @Prop({ type: Boolean })
  readonly showArrows!: boolean

  @Prop({ type: Boolean })
  readonly showArrowsOnHover!: boolean

  @Prop({ type: Object })
  readonly touch!: TouchHandlers

  @Prop({ type: Boolean })
  readonly touchless!: boolean

  @Prop({ required: false })
  readonly value!: any

  @Prop({ type: Boolean })
  readonly vertical!: boolean

  /// Data
  changeByDelimiters: boolean = false
  internalHeight: undefined | string = undefined
  transitionHeight: undefined | string = undefined
  transitionCount: number = 0
  isBooted: boolean = false
  isReverse: boolean = false

  /// Computed
  get isActive (): boolean {
    return this.transitionCount > 0
  }

  get classes (): object {
    return {
      ...ErtItemGroupBase.options.computed.classes.get.call(this),
      'ert-window--show-arrows-on-hover': this.showArrowsOnHover
    }
  }

  get computedTransition (): string {
    if (!this.isBooted) return ''

    const axis = this.vertical ? 'y' : 'x'
    const reverse = this.internalReverse ? !this.isReverse : this.isReverse
    const direction = reverse ? '-reverse' : ''

    return `ert-window-${axis}${direction}-transition`
  }

  get hasActiveItems (): boolean {
    return Boolean(
      this.items.find(item => !item.disabled)
    )
  }

  get hasNext (): boolean {
    return this.continuous || this.internalIndex < this.items.length - 1
  }

  get hasPrev (): boolean {
    return this.continuous || this.internalIndex > 0
  }

  get internalIndex (): number {
    return this.items.findIndex((item, i) => {
      return this.internalValue === this.getValue(item, i)
    })
  }

  get internalReverse (): boolean {
    return this.reverse
  }

  /// Methods
  genDefaultSlot () {
    return this.$slots.default
  }

  genContainer () {
    const children = [this.genDefaultSlot()]

    if (this.showArrows) {
      children.push(this.genControlIcons())
    }

    return this.$createElement('div', {
      staticClass: 'ert-window__container',
      class: {
        'ert-window__container--is-active': this.isActive
      },
      style: {
        height: this.internalHeight || this.transitionHeight
      }
    }, children)
  }

  genIcon (direction: 'prev' | 'next', icon: string, click: () => void) {
    const on = {
      click: (e: Event) => {
        e.stopPropagation()
        this.changeByDelimiters = true
        click()
      }
    }

    const attrs = {
      'aria-label': direction === 'prev'
        ? 'Предыдущий слайд'
        : 'Следующий слайд'
    }

    const children = this.$scopedSlots[direction]?.({ on, attrs }) ||
      [
        this.$createElement('button', {
          on,
          attrs
        }, [
          this.$createElement(ErtIcon, {
            props: { name: icon, small: true }
          })
        ])
      ]

    return this.$createElement('div', {
      staticClass: `ert-window__${direction}`
    }, children)
  }

  genControlIcons () {
    const icons = []

    const prevIcon = this.prevIcon

    if (
      this.hasPrev &&
      prevIcon &&
      typeof prevIcon === 'string'
    ) {
      const icon = this.genIcon('prev', prevIcon, this.prev)
      icon && icons.push(icon)
    }

    const nextIcon = this.nextIcon

    if (
      this.hasNext &&
      nextIcon &&
      typeof nextIcon === 'string'
    ) {
      const icon = this.genIcon('next', nextIcon, this.next)
      icon && icons.push(icon)
    }

    return icons
  }

  getNextIndex (index: number): number {
    const nextIndex = (index + 1) % this.items.length
    const item = this.items[nextIndex]

    if (item.disabled) return this.getNextIndex(nextIndex)

    return nextIndex
  }

  getPrevIndex (index: number): number {
    const prevIndex = (index + this.items.length - 1) % this.items.length
    const item = this.items[prevIndex]

    if (item.disabled) return this.getPrevIndex(prevIndex)

    return prevIndex
  }

  next () {
    if (!this.hasActiveItems || !this.hasNext) return

    const nextIndex = this.getNextIndex(this.internalIndex)
    const item = this.items[nextIndex]

    this.internalValue = this.getValue(item, nextIndex)
  }

  prev () {
    if (!this.hasActiveItems || !this.hasPrev) return

    const lastIndex = this.getPrevIndex(this.internalIndex)
    const item = this.items[lastIndex]

    this.internalValue = this.getValue(item, lastIndex)
  }

  updateReverse (val: number, oldVal: number) {
    const itemsLength = this.items.length
    const lastIndex = itemsLength - 1

    if (itemsLength <= 2) return val < oldVal

    if (val === lastIndex && oldVal === 0) {
      return true
    } else if (val === 0 && oldVal === lastIndex) {
      return false
    } else {
      return val < oldVal
    }
  }

  /// Hooks
  mounted () {
    window.requestAnimationFrame(() => (this.isBooted = true))
  }

  render (h: CreateElement): VNode {
    const data = {
      staticClass: 'ert-window',
      class: this.classes,
      directives: [] as VNodeDirective[]
    }

    if (!this.touchless) {
      const value = this.touch || {
        left: () => { this.next() },
        right: () => { this.prev() },
        end: (e: TouchEvent) => { e.stopPropagation() },
        start: (e: TouchEvent) => { e.stopPropagation() }
      }

      data.directives.push({ name: 'touch', value })
    }

    return h('div', data, [this.genContainer()])
  }
}
