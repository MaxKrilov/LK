import { factory as GroupableMixin } from '@/mixins2/ErtGroupableMixin'

import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'
import { VNode, ScopedSlotChildren } from 'vue/types/vnode'

const props = {
  activeClass: String,
  value: {
    required: false
  }
}

@Component({ props })
export class ErtItemBase extends Vue {
  // Props
  readonly activeClass!: string
  readonly value!: any

  // Data
  isActive: boolean = false

  // Methods
  toggle () {
    this.isActive = !this.isActive
  }

  render (): VNode {
    if (!this.$scopedSlots.default) return null as any
    let element: VNode | ScopedSlotChildren
    if (this.$scopedSlots.default) {
      element = this.$scopedSlots.default({
        active: this.isActive,
        toggle: this.toggle
      })
    }

    if (Array.isArray(element) && element.length === 1) {
      element = element[0]
    }

    if (!element || Array.isArray(element) || !element.tag) return element as any

    element.data = this._b(element.data || {}, element.tag!, {
      class: { [this.activeClass]: this.isActive }
    })

    return element
  }
}

@Component
export default class ErtItem extends mixins(
  ErtItemBase,
  GroupableMixin('itemGroup', 'ert-item', 'ert-item-group')
) {}
