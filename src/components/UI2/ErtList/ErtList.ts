import { CreateElement, VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'

import './ErtList.scss'

import ErtListGroup from './ErtListGroup'

import ErtBindAttrs from '@/mixins2/ErBindAttrs'

type ErtListGroupInstance = InstanceType<typeof ErtListGroup>

const props = {
  disabled: Boolean,
  expand: Boolean,
  nav: Boolean,
  subheader: Boolean,
  tag: {
    type: String,
    default: 'div'
  },
  threeLine: Boolean,
  twoLine: Boolean
}

@Component({
  provide (): object {
    return {
      isInList: true,
      list: this
    }
  },
  inject: {
    isInMenu: { default: false },
    isInNav: { default: false }
  },
  props
})
export default class ErtList extends mixins(ErtBindAttrs) {
  // Options
  isInMenu!: boolean
  isInNav!: boolean

  // Props
  readonly disabled!: boolean
  readonly expand!: boolean
  readonly nav!: boolean
  readonly subheader!: boolean
  readonly tag!: string
  readonly threeLine!: boolean
  readonly twoLine!: boolean

  // Data
  groups: ErtListGroupInstance[] = []

  // Computed
  get classes (): object {
    return {
      'ert-list--disabled': this.disabled,
      'ert-list--nav': this.nav,
      'ert-list--subheader': this.subheader,
      'ert-list--two-line': this.twoLine,
      'ert-list--three-line': this.threeLine
    }
  }

  // Methods
  register (content: ErtListGroupInstance) {
    this.groups.push(content)
  }
  unregister (content: ErtListGroupInstance) {
    const index = this.groups.findIndex(g => g._uid === content._uid)

    if (index > -1) this.groups.splice(index, 1)
  }
  listClick (uid: number) {
    if (this.expand) return

    for (const group of this.groups) {
      group.toggle(uid)
    }
  }

  // Hooks
  render (h: CreateElement): VNode {
    const data = {
      staticClass: 'ert-list',
      class: this.classes,
      attrs: {
        role: this.isInNav || this.isInMenu ? undefined : 'list',
        ...this.attrs$
      }
    }

    return h(this.tag, data, [this.$slots.default])
  }
}
