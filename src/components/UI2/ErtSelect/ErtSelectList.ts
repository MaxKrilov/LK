import Vue, { VNode, VNodeChildren } from 'vue'
import Component from 'vue-class-component'

import {
  ErtList,
  ErtListItem,
  ErtListItemContent,
  ErtListItemTitle,
  ErtListItemIcon
} from '@/components/UI2/ErtList'

import Ripple from '@/directives/ripple'

import {
  escapeHTML,
  getPropertyFromItem
} from '@/functions/helper2'

import { SelectItemKey } from '@/types'
import ErtIcon from '@/components/UI2/ErtIcon'

type ListTile = { item: any, disabled?: null | boolean, value?: boolean, index: number }

const directives = { Ripple }

const props = {
  action: Boolean,
  hideSelected: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  itemDisabled: {
    type: [String, Array, Function],
    default: 'disabled'
  },
  itemText: {
    type: [String, Array, Function],
    default: 'text'
  },
  itemValue: {
    type: [String, Array, Function],
    default: 'value'
  },
  noDataText: String,
  noFilter: Boolean,
  searchInput: {
    required: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  }
}

@Component({ directives, props })
export default class ErtSelectList extends Vue {
  // Props
  readonly action!: boolean
  readonly hideSelected!: boolean
  readonly items!: any[]
  readonly itemDisabled!: SelectItemKey
  readonly itemText!: SelectItemKey
  readonly itemValue!: SelectItemKey
  readonly noDataText!: string
  readonly noFilter!: boolean
  readonly searchInput!: any
  readonly selectedItems!: any[]

  // Computed
  get parsedItems (): any[] {
    return this.selectedItems.map(item => this.getValue(item))
  }
  get tileActiveClass (): string {
    return Object.keys({}).join(' ')
  }
  get staticNoDataTile (): VNode {
    const tile = {
      attrs: {
        role: undefined
      },
      on: {
        mousedown: (e: Event) => e.preventDefault()
      }
    }

    return this.$createElement(ErtListItem, tile, [
      this.genTileContent(this.noDataText)
    ])
  }

  // Methods
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  genAction (item: object, inputValue: any): VNode | null {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  genDivider (props: { [key: string]: any }) {
    return null
  }

  genFilteredText (text: string) {
    text = text || ''

    if (!this.searchInput || this.noFilter) return escapeHTML(text)

    const { start, middle, end } = this.getMaskedCharacters(text)

    return `${escapeHTML(start)}${this.genHighlight(middle)}${escapeHTML(end)}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  genHeader (props: { [key: string]: any }): VNode | null {
    return null
  }

  genHighlight (text: string): string {
    return `<span class="ert-list-item__mask">${escapeHTML(text)}</span>`
  }

  getMaskedCharacters (text: string): {
    start: string
    middle: string
    end: string
  } {
    const searchInput = (this.searchInput || '').toString().toLocaleLowerCase()
    const index = text.toLocaleLowerCase().indexOf(searchInput)

    if (index < 0) return { start: '', middle: text, end: '' }

    const start = text.slice(0, index)
    const middle = text.slice(index, index + searchInput.length)
    const end = text.slice(index + searchInput.length)
    return { start, middle, end }
  }

  genTile ({ item, index, disabled = null, value = false }: ListTile): VNode | VNode[] | undefined {
    if (!value) value = this.hasItem(item)

    if (item === Object(item)) {
      disabled = disabled !== null
        ? disabled
        : this.getDisabled(item)
    }

    const tile = {
      attrs: {
        'aria-selected': String(value),
        id: `list-item-${this._uid}-${index}`,
        role: 'option'
      },
      on: {
        mousedown: (e: Event) => {
          e.preventDefault()
        },
        click: () => disabled || this.$emit('select', item)
      },
      props: {
        activeClass: this.tileActiveClass,
        disabled,
        ripple: true,
        inputValue: value
      }
    }

    if (!this.$scopedSlots.item) {
      return this.$createElement(ErtListItem, tile, [
        this.action && !this.hideSelected && this.items.length > 0
          ? this.genAction(item, value)
          : null,
        this.genTileContent(item, index),
        value && this.$createElement(ErtListItemIcon, {}, [
          this.$createElement(ErtIcon, { props: { name: 'ok' } })
        ])
      ])
    }

    const parent = this
    const scopedSlot = this.$scopedSlots.item({
      parent,
      item,
      attrs: {
        ...tile.attrs,
        ...tile.props
      },
      on: tile.on
    })

    return this.needsTile(scopedSlot)
      ? this.$createElement(ErtListItem, tile, scopedSlot)
      : scopedSlot
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  genTileContent (item: any, index = 0): VNode {
    const innerHTML = this.genFilteredText(this.getText(item))

    return this.$createElement(ErtListItemContent,
      [this.$createElement(ErtListItemTitle, {
        domProps: { innerHTML }
      })]
    )
  }

  hasItem (item: object) {
    return this.parsedItems.indexOf(this.getValue(item)) > -1
  }

  needsTile (slot: VNode[] | undefined) {
    return slot!.length !== 1 ||
      slot![0].componentOptions == null ||
      slot![0].componentOptions.Ctor.options.name !== 'ert-list-item'
  }

  getDisabled (item: object) {
    return Boolean(getPropertyFromItem(item, this.itemDisabled, false))
  }

  getText (item: object) {
    return String(getPropertyFromItem(item, this.itemText, item))
  }

  getValue (item: object) {
    return getPropertyFromItem(item, this.itemValue, this.getText(item))
  }

  render (): VNode {
    const children: VNodeChildren = []
    const itemsLength = this.items.length
    for (let index = 0; index < itemsLength; index++) {
      const item = this.items[index]

      if (this.hideSelected &&
        this.hasItem(item)
      ) continue

      if (item == null) children.push(this.genTile({ item, index }))
      else if (item.header) children.push(this.genHeader(item))
      else if (item.divider) children.push(this.genDivider(item))
      else children.push(this.genTile({ item, index }))
    }

    children.length || children.push(this.$slots['no-data'] || this.staticNoDataTile)

    this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item'])

    this.$slots['append-item'] && children.push(this.$slots['append-item'])

    return this.$createElement(ErtList, {
      staticClass: 'ert-select-list',
      attrs: {
        role: 'listbox',
        tabindex: -1
      }
    }, children)
  }
}
