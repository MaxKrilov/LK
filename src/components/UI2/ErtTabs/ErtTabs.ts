import './ErtTabs.scss'

import ErtTabsBar from './ErtTabsBar'
import ErtTabsItems from './ErtTabsItems'
import ErtTabsSlider from './ErtTabsSlider'

import ErtProxyableMixin from '@/mixins2/ErtProxyableMixin'

import Resize from '@/directives/resize'

import { convertToUnit } from '@/functions/helper2'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { VNode } from 'vue/types'
import { CreateElement } from 'vue'

@Component<InstanceType<typeof ErtTabs>>({
  directives: { Resize },
  watch: {
    alignWithTitle: 'callSlider',
    centered: 'callSlider',
    centerActive: 'callSlider',
    fixedTabs: 'callSlider',
    grow: 'callSlider',
    iconsAndText: 'callSlider',
    right: 'callSlider',
    showArrows: 'callSlider',
    vertical: 'callSlider'
  }
})
export default class ErtTabs extends ErtProxyableMixin {
  /// Options
  $refs!: {
    items: InstanceType<typeof ErtTabsBar>
  }

  /// Props
  @Prop({ type: String, default: '' })
  readonly activeClass!: string

  @Prop({ type: Boolean })
  readonly alignWithTitle!: boolean

  @Prop({ type: Boolean })
  readonly centerActive!: boolean

  @Prop({ type: Boolean })
  readonly centered!: boolean

  @Prop({ type: Boolean })
  readonly fixedTabs!: boolean

  @Prop({ type: Boolean })
  readonly grow!: boolean

  @Prop({ type: [Number, String], default: undefined })
  readonly height!: number | string

  @Prop({ type: Boolean })
  readonly hideSlider!: boolean

  @Prop({ type: Boolean })
  readonly iconsAndText!: boolean

  @Prop({ type: [String, Number] })
  readonly mobileBreakpoint!: string | number

  @Prop({ type: String, default: 'right_big' })
  readonly nextIcon!: string

  @Prop({ type: Boolean })
  readonly optional!: boolean

  @Prop({ type: String, default: 'left_big' })
  readonly prevIcon!: string

  @Prop({ type: Boolean })
  readonly right!: boolean

  @Prop({ type: [Boolean, String] })
  readonly showArrows!: boolean | string

  @Prop({ type: [Number, String], default: 2 })
  readonly sliderSize!: number | string

  @Prop({ type: Boolean })
  readonly vertical!: boolean

  /// Data
  resizeTimeout: number = 0

  slider: Record<string, null | number> = {
    height: null,
    left: null,
    right: null,
    top: null,
    width: null
  }

  transitionTime: number = 300

  /// Computed
  get classes (): object {
    return {
      'ert-tabs--align-with-title': this.alignWithTitle,
      'ert-tabs--centered': this.centered,
      'ert-tabs--fixed-tabs': this.fixedTabs,
      'ert-tabs--grow': this.grow,
      'ert-tabs--icons-and-text': this.iconsAndText,
      'ert-tabs--right': this.right,
      'ert-tabs--vertical': this.vertical
    }
  }

  get isReversed (): boolean {
    return false
  }

  get sliderStyles (): object {
    return {
      height: convertToUnit(this.slider.height),
      left: this.isReversed ? undefined : convertToUnit(this.slider.left),
      right: this.isReversed ? convertToUnit(this.slider.right) : undefined,
      top: this.vertical ? convertToUnit(this.slider.top) : undefined,
      transition: this.slider.left != null ? null : 'none',
      width: convertToUnit(this.slider.width)
    }
  }

  get computedColor (): string {
    return ''
  }

  /// Methods
  callSlider () {
    if (
      this.hideSlider ||
      !this.$refs.items ||
      !this.$refs.items.selectedItems.length
    ) {
      this.slider.width = 0
      return false
    }

    this.$nextTick(() => {
      const activeTab = this.$refs.items.selectedItems[0]
      if (!activeTab || !activeTab.$el) {
        this.slider.width = 0
        this.slider.left = 0
        return
      }
      const el = activeTab.$el as HTMLElement

      this.slider = {
        height: !this.vertical ? Number(this.sliderSize) : el.scrollHeight,
        left: this.vertical ? 0 : el.offsetLeft,
        right: this.vertical ? 0 : el.offsetLeft + el.offsetWidth,
        top: el.offsetTop,
        width: this.vertical ? Number(this.sliderSize) : el.scrollWidth
      }
    })

    return true
  }

  genBar (items: VNode[], slider: VNode | null) {
    const data = {
      style: {
        height: convertToUnit(this.height)
      },
      props: {
        activeClass: this.activeClass,
        centerActive: this.centerActive,
        mandatory: !this.optional,
        mobileBreakpoint: this.mobileBreakpoint,
        nextIcon: this.nextIcon,
        prevIcon: this.prevIcon,
        showArrows: this.showArrows,
        value: this.internalValue
      },
      on: {
        'call:slider': this.callSlider,
        change: (val: any) => {
          this.internalValue = val
        }
      },
      ref: 'items'
    }

    return this.$createElement(ErtTabsBar, data, [
      this.genSlider(slider),
      items
    ])
  }

  genItems (items: VNode | null, item: VNode[]) {
    if (items) return items

    if (!item.length) return null

    return this.$createElement(ErtTabsItems, {
      props: {
        value: this.internalValue
      },
      on: {
        change: (val: any) => {
          this.internalValue = val
        }
      }
    }, item)
  }

  genSlider (slider: VNode | null) {
    if (this.hideSlider) return null

    if (!slider) {
      slider = this.$createElement(ErtTabsSlider, {})
    }

    return this.$createElement('div', {
      staticClass: 'ert-tabs-slider-wrapper',
      style: this.sliderStyles
    }, [slider])
  }

  onResize () {
    if (this._isDestroyed) return

    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(this.callSlider, 0)
  }

  parseNodes () {
    let items = null
    let slider = null
    const item = []
    const tab = []
    const slot = this.$slots.default || []
    const length = slot.length

    for (let i = 0; i < length; i++) {
      const vnode = slot[i]

      if (vnode.componentOptions) {
        switch (vnode.componentOptions.Ctor.options.name) {
          // case 'v-tabs-slider': slider = vnode
          case 'ErtTabsSlider': slider = vnode
            break
          // case 'v-tabs-items': items = vnode
          case 'ErtTabsItems': items = vnode
            break
          // case 'v-tab-item': item.push(vnode)
          case 'ErtTabItem': item.push(vnode)
            break
          // case 'v-tab' - intentionally omitted
          default: tab.push(vnode)
        }
      } else {
        tab.push(vnode)
      }
    }

    return { tab, slider, items, item }
  }

  /// Hooks
  render (h: CreateElement): VNode {
    const { tab, slider, items, item } = this.parseNodes()

    return h('div', {
      staticClass: 'ert-tabs',
      class: this.classes,
      directives: [{
        name: 'resize',
        modifiers: { quiet: true },
        value: this.onResize
      }]
    }, [
      this.genBar(tab, slider),
      this.genItems(items, item)
    ])
  }
}
