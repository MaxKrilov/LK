import './ErtItemGroup.scss'

import ErtGroupableMixin from '@/mixins2/ErtGroupableMixin'
import ErtProxyableMixin from '@/mixins2/ErtProxyableMixin'

import Component, { mixins } from 'vue-class-component'
import { CreateElement, VNode } from 'vue/types'

export type GroupableInstance = InstanceType<typeof ErtGroupableMixin> & {
  id?: string
  to?: any
  value?: any
}

const props = {
  activeClass: {
    type: String,
    default: 'ert-item--active'
  },
  mandatory: Boolean,
  max: {
    type: [Number, String],
    default: null
  },
  multiple: Boolean
}

const watch = {
  internalValue: 'updateItemsState',
  items: 'updateItemsState'
}

@Component({ props, watch })
export class ErtItemGroupBase extends mixins(ErtProxyableMixin) {
  // Props
  readonly activeClass!: string
  readonly mandatory!: boolean
  readonly max!: number | string
  readonly multiple!: boolean

  // Data
  internalLazyValue = this.value !== undefined
    ? this.value
    : this.multiple ? [] : undefined
  items: GroupableInstance[] = []

  // Computed
  get classes (): object {
    return {
      'ert-item-group': true
    }
  }
  get selectedIndex (): number {
    return (this.selectedItem && this.items.indexOf(this.selectedItem)) || -1
  }
  get selectedItem (): GroupableInstance | undefined {
    if (this.multiple) return undefined

    return this.selectedItems[0]
  }
  get selectedItems (): GroupableInstance[] {
    return this.items.filter((item, index) => {
      return this.toggleMethod(this.getValue(item, index))
    })
  }
  get selectedValues (): any[] {
    if (this.internalValue == null) return []

    return Array.isArray(this.internalValue)
      ? this.internalValue
      : [this.internalValue]
  }
  get toggleMethod (): (v: any) => boolean {
    if (!this.multiple) {
      return (v: any) => this.internalValue === v
    }

    const internalValue = this.internalValue
    if (Array.isArray(internalValue)) {
      return (v: any) => internalValue.includes(v)
    }

    return () => false
  }

  // Methods
  genData (): object {
    return {
      class: this.classes
    }
  }
  getValue (item: GroupableInstance, i: number): unknown {
    return item.value == null || item.value === ''
      ? i
      : item.value
  }
  onClick (item: GroupableInstance) {
    this.updateInternalValue(
      this.getValue(item, this.items.indexOf(item))
    )
  }
  register (item: GroupableInstance) {
    const index = this.items.push(item) - 1

    item.$on('change', () => this.onClick(item))

    if (this.mandatory && !this.selectedValues.length) {
      this.updateMandatory()
    }

    this.updateItem(item, index)
  }
  unregister (item: GroupableInstance) {
    if (this._isDestroyed) return

    const index = this.items.indexOf(item)
    const value = this.getValue(item, index)

    this.items.splice(index, 1)

    const valueIndex = this.selectedValues.indexOf(value)

    if (valueIndex < 0) return

    if (!this.mandatory) {
      return this.updateInternalValue(value)
    }

    if (this.multiple && Array.isArray(this.internalValue)) {
      this.internalValue = this.internalValue.filter(v => v !== value)
    } else {
      this.internalValue = undefined
    }

    if (!this.selectedItems.length) {
      this.updateMandatory(true)
    }
  }
  updateItem (item: GroupableInstance, index: number) {
    const value = this.getValue(item, index)

    item.isActive = this.toggleMethod(value)
  }
  updateItemsState () {
    this.$nextTick(() => {
      if (this.mandatory &&
        !this.selectedItems.length
      ) {
        return this.updateMandatory()
      }

      this.items.forEach(this.updateItem)
    })
  }
  updateInternalValue (value: any) {
    this.multiple
      ? this.updateMultiple(value)
      : this.updateSingle(value)
  }
  updateMandatory (last?: boolean) {
    if (!this.items.length) return

    const items = this.items.slice()

    if (last) items.reverse()

    const item = items.find(item => !item.disabled)

    if (!item) return

    const index = this.items.indexOf(item)

    this.updateInternalValue(
      this.getValue(item, index)
    )
  }
  updateMultiple (value: any) {
    const defaultValue = Array.isArray(this.internalValue)
      ? this.internalValue
      : []
    const internalValue = defaultValue.slice()
    const index = internalValue.findIndex(val => val === value)

    if (this.mandatory && index > -1 && internalValue.length - 1 < 1) return

    if (this.max != null && index < 0 && internalValue.length + 1 > this.max) return

    index > -1
      ? internalValue.splice(index, 1)
      : internalValue.push(value)

    this.internalValue = internalValue
  }
  updateSingle (value: any) {
    const isSame = value === this.internalValue

    if (this.mandatory && isSame) return

    this.internalValue = isSame ? undefined : value
  }

  render (h: CreateElement): VNode {
    return h('div', this.genData(), this.$slots.default)
  }
}

@Component({
  provide (): object {
    return {
      itemGroup: this
    }
  }
})
export default class ErtItemGroup extends mixins(ErtItemGroupBase) {}
