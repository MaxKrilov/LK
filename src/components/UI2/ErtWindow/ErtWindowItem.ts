import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ErtWindow from './ErtWindow'

import ErtBootableMixin from '@/mixins2/ErtBootableMixin'
import { factory as GroupableFactory } from '@/mixins2/ErtGroupableMixin'

import Touch from '@/directives/touch'

import { convertToUnit } from '@/functions/helper2'

import { CreateElement, VNode } from 'vue'

const baseMixin = mixins(
  ErtBootableMixin,
  GroupableFactory('windowGroup', 'ert-window-item', 'ert-window')
)

@Component<InstanceType<typeof ErtWindowItem>>({
  directives: { Touch }
})
export default class ErtWindowItem extends baseMixin {
  /// Options
  $el!: HTMLElement
  windowGroup!: InstanceType<typeof ErtWindow>

  /// Props
  @Prop({ type: Boolean })
  readonly disabled!: boolean

  @Prop({ type: [Boolean, String], default: undefined })
  readonly reverseTransition!: boolean | string

  @Prop({ type: [Boolean, String], default: undefined })
  readonly transition!: boolean | string

  @Prop({ required: false })
  readonly value!: any

  /// Data
  isActive: boolean = false
  inTransition: boolean = false

  /// Computed
  get classes (): object {
    return this.groupClasses
  }

  get computedTransition (): string | boolean {
    if (!this.windowGroup.internalReverse) {
      return typeof this.transition !== 'undefined'
        ? this.transition || ''
        : this.windowGroup.computedTransition
    }

    return typeof this.reverseTransition !== 'undefined'
      ? this.reverseTransition || ''
      : this.windowGroup.computedTransition
  }

  /// Methods
  genDefaultSlot () {
    return this.$slots.default
  }

  genWindowItem () {
    return this.$createElement('div', {
      staticClass: 'ert-window-item',
      class: this.classes,
      directives: [{
        name: 'show',
        value: this.isActive
      }],
      on: this.$listeners
    }, this.genDefaultSlot())
  }

  onAfterTransition () {
    if (!this.inTransition) {
      return
    }

    this.inTransition = false
    if (this.windowGroup.transitionCount > 0) {
      this.windowGroup.transitionCount--

      if (this.windowGroup.transitionCount === 0) {
        this.windowGroup.transitionHeight = undefined
      }
    }
  }

  onBeforeTransition () {
    if (this.inTransition) {
      return
    }

    this.inTransition = true
    if (this.windowGroup.transitionCount === 0) {
      this.windowGroup.transitionHeight = convertToUnit(this.windowGroup.$el.clientHeight)
    }
    this.windowGroup.transitionCount++
  }

  onTransitionCancelled () {
    this.onAfterTransition()
  }

  onEnter (el: HTMLElement) {
    if (!this.inTransition) {
      return
    }

    this.$nextTick(() => {
      // Do not set height if no transition or cancelled.
      if (!this.computedTransition || !this.inTransition) {
        return
      }

      // Set transition target height.
      this.windowGroup.transitionHeight = convertToUnit(el.clientHeight)
    })
  }

  /// Hooks
  render (h: CreateElement): VNode {
    return h('transition', {
      props: {
        name: this.computedTransition
      },
      on: {
        beforeEnter: this.onBeforeTransition,
        afterEnter: this.onAfterTransition,
        enterCancelled: this.onTransitionCancelled,

        beforeLeave: this.onBeforeTransition,
        afterLeave: this.onAfterTransition,
        leaveCancelled: this.onTransitionCancelled,

        enter: this.onEnter
      }
    }, this.showLazyContent(() => [this.genWindowItem()]))
  }
}
