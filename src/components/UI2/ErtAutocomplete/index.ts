import './style.scss'

import Component, { mixins } from 'vue-class-component'
import { VNode } from 'vue'

import ErtSelect, { defaultMenuProps as ErtSelectMenuProps } from '@/components/UI2/ErtSelect/ErtSelect'
import ErtTextField from '@/components/UI2/ErtTextField'

import mergeData from '@/utils/mergeData'
import {
  getObjectValueByPath,
  getPropertyFromItem
} from '@/functions/helper2'

import { keyCode as keyCodes } from '@/functions/keyCode'

const defaultMenuProps = {
  ...ErtSelectMenuProps,
  offsetY: true,
  offsetOverflow: true,
  transition: false
}

const props = {
  allowOverflow: {
    type: Boolean,
    default: true
  },
  autoSelectFirst: {
    type: Boolean,
    default: false
  },
  filter: {
    type: Function,
    default: (item: any, queryText: string, itemText: string) => {
      return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
    }
  },
  hideNoData: Boolean,
  menuProps: {
    type: ErtSelect.options.props.menuProps.type,
    default: () => defaultMenuProps
  },
  noFilter: Boolean,
  searchInput: {
    type: String,
    default: undefined
  }
}

@Component<InstanceType<typeof ErtAutocomplete>>({
  props,
  data () {
    return {
      lazySearch: this.searchInput
    }
  },
  watch: {
    filteredItems: 'onFilteredItemsChanged',
    internalValue: 'setSearch',
    isFocused (val) {
      if (val) {
        document.addEventListener('copy', this.onCopy)
        this.$refs.input && this.$refs.input.select()
      } else {
        document.removeEventListener('copy', this.onCopy)
        this.updateSelf()
      }
    },
    isMenuActive (val) {
      if (val || !this.hasSlot) return

      this.lazySearch = undefined
    },
    items (val, oldVal) {
      if (
        !(oldVal && oldVal.length) &&
        this.hideNoData &&
        this.isFocused &&
        !this.isMenuActive &&
        val.length
      ) this.activateMenu()
    },
    searchInput (val: string) {
      this.lazySearch = val
    },
    internalSearch: 'onInternalSearchChanged',
    itemText: 'updateSelf'
  }
})
class ErtAutocomplete extends mixins(ErtSelect) {
  // Props
  readonly allowOverflow!: boolean
  readonly autoSelectFirst!: boolean
  readonly filter!: (item: any, queryText: string, itemText: string) => boolean
  readonly hideNoData!: boolean
  readonly menuProps!: string | any[] | Record<string, any>
  readonly noFilter!: boolean
  readonly searchInput!: string | undefined

  // Data
  lazySearch!: string | undefined

  // Computed
  get classes (): object {
    return {
      ...ErtSelect.options.computed.classes.get.call(this),
      'ert-autocomplete': true,
      'ert-autocomplete--is-selecting-index': this.selectedIndex > -1
    }
  }
  get computedItems (): object[] {
    return this.filteredItems
  }
  get selectedValues (): object[] {
    return this.selectedItems.map(item => this.getValue(item))
  }
  get hasDisplayedItems (): boolean {
    return this.hideSelected
      ? this.filteredItems.some(item => !this.hasItem(item))
      : this.filteredItems.length > 0
  }
  get currentRange (): number {
    if (this.selectedItem == null) return 0

    return String(this.getText(this.selectedItem)).length
  }
  get filteredItems (): object[] {
    if (!this.isSearching || this.noFilter || this.internalSearch == null) return this.allItems

    return this.allItems.filter(item => {
      const value = getPropertyFromItem(item, this.itemText)
      const text = value != null ? String(value) : ''

      return this.filter(item, String(this.internalSearch), text)
    })
  }
  get isAnyValueAllowed (): boolean {
    return false
  }
  get isDirty (): boolean {
    return this.searchIsDirty || this.selectedItems.length > 0
  }
  get isSearching (): boolean {
    return (
      this.multiple &&
      this.searchIsDirty
    ) || (
      this.searchIsDirty &&
      this.internalSearch !== this.getText(this.selectedItem)
    )
  }
  get menuCanShow (): boolean {
    if (!this.isFocused) return false

    return this.hasDisplayedItems || !this.hideNoData
  }
  // eslint-disable-next-line camelcase
  get $_menuProps (): object {
    const props = ErtSelect.options.computed.$_menuProps.get.call(this);
    (props as any).contentClass = `ert-autocomplete__content ${(props as any).contentClass || ''}`.trim()
    return {
      ...defaultMenuProps,
      ...props
    }
  }
  get searchIsDirty (): boolean {
    return this.internalSearch != null &&
      this.internalSearch !== ''
  }
  get selectedItem (): any {
    if (this.multiple) return null

    return this.selectedItems.find(i => {
      return this.valueComparator(this.getValue(i), this.getValue(this.internalValue))
    })
  }
  get listData () {
    const data = ErtSelect.options.computed.listData.get.call(this) as any

    data.props = {
      ...data.props,
      items: this.virtualizedItems,
      noFilter: (
        this.noFilter ||
        !this.isSearching ||
        !this.filteredItems.length
      ),
      searchInput: this.internalSearch
    }

    return data
  }

  // Proxy
  get internalSearch (): any {
    return this.lazySearch
  }
  set internalSearch (val: any) {
    this.lazySearch = val

    this.$emit('update:search-input', val)
  }

  // Hooks
  created () {
    this.setSearch()
  }

  destroyed () {
    document.removeEventListener('copy', this.onCopy)
  }

  // Methods
  onFilteredItemsChanged (val: never[], oldVal: never[]) {
    if (val === oldVal) return

    this.setMenuIndex(-1)

    this.$nextTick(() => {
      if (!this.internalSearch || (val.length !== 1 && !this.autoSelectFirst)) return

      this.$refs.menu.getTiles()
      this.setMenuIndex(0)
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInternalSearchChanged (val: any) {
    this.updateMenuDimensions()
  }
  updateMenuDimensions () {
    this.isMenuActive && this.$refs.menu && this.$refs.menu.updateDimensions()
  }
  changeSelectedIndex (keyCode: number) {
    if (this.searchIsDirty) return

    if (this.multiple && keyCode === keyCodes.DOM_VK_LEFT) {
      if (this.selectedIndex === -1) {
        this.selectedIndex = this.selectedItems.length - 1
      } else {
        this.selectedIndex--
      }
    } else if (this.multiple && keyCode === keyCodes.DOM_VK_RIGHT) {
      if (this.selectedIndex >= this.selectedItems.length - 1) {
        this.selectedIndex = -1
      } else {
        this.selectedIndex++
      }
    } else if (keyCode === keyCodes.DOM_VK_BACK_SPACE || keyCode === keyCodes.DOM_VK_DELETE) {
      this.deleteCurrentItem()
    }
  }
  deleteCurrentItem () {
    const curIndex = this.selectedIndex
    const curItem = this.selectedItems[curIndex]

    if (!this.isInteractive || this.getDisabled(curItem)) return

    const lastIndex = this.selectedItems.length - 1

    if (this.selectedIndex === -1 && lastIndex !== 0) {
      this.selectedIndex = lastIndex

      return
    }

    const length = this.selectedItems.length
    const nextIndex = curIndex !== length - 1
      ? curIndex
      : curIndex - 1
    const nextItem = this.selectedItems[nextIndex]

    if (!nextItem) {
      this.setValue(this.multiple ? [] : undefined)
    } else {
      this.selectItem(curItem)
    }

    this.selectedIndex = nextIndex
  }
  clearableCallback () {
    this.internalSearch = undefined

    ErtSelect.options.methods.clearableCallback.call(this)
  }
  genInput () {
    const input = ErtTextField.options.methods.genInput.call(this)

    input.data = mergeData(input.data!, {
      attrs: {
        'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
        autocomplete: getObjectValueByPath(input.data!, 'attrs.autocomplete', 'off')
      },
      domProps: { value: this.internalSearch }
    })

    return input
  }
  genInputSlot () {
    const slot = ErtSelect.options.methods.genInputSlot.call(this)

    slot.data!.attrs!.role = 'combobox'

    return slot
  }
  genSelections (): VNode {
    return this.hasSlot || this.multiple
      ? ErtSelect.options.methods.genSelections.call(this)
      : [] as VNode[]
  }
  onClick (e: MouseEvent) {
    if (!this.isInteractive) return

    this.selectedIndex > -1
      ? (this.selectedIndex = -1)
      : this.onFocus()

    if (!this.isAppendInner(e.target)) this.activateMenu()
  }
  onInput (e: Event) {
    if (this.selectedIndex > -1 || !e.target) return

    const target = e.target as HTMLInputElement
    const value = target.value

    if (target.value) this.activateMenu()

    this.internalSearch = value
    this.badInput = target.validity && target.validity.badInput
  }
  onKeyDown (e: KeyboardEvent) {
    const keyCode = e.keyCode

    ErtSelect.options.methods.onKeyDown.call(this, e)

    this.changeSelectedIndex(keyCode)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSpaceDown (e: KeyboardEvent) { /* noop */ }
  onTabDown (e: KeyboardEvent) {
    ErtSelect.options.methods.onTabDown.call(this, e)
    this.updateSelf()
  }
  onUpDown (e: Event) {
    e.preventDefault()

    this.activateMenu()
  }
  selectItem (item: object) {
    ErtSelect.options.methods.selectItem.call(this, item)
    this.setSearch()
  }
  setSelectedItems () {
    ErtSelect.options.methods.setSelectedItems.call(this)

    if (!this.isFocused) this.setSearch()
  }
  setSearch () {
    this.$nextTick(() => {
      if (!this.multiple || !this.internalSearch || !this.isMenuActive) {
        this.internalSearch = (
          !this.selectedItems.length ||
          this.multiple ||
          this.hasSlot
        )
          ? null
          : this.getText(this.selectedItem)
      }
    })
  }
  updateSelf () {
    if (!this.searchIsDirty && !this.internalValue) return

    if (!this.valueComparator(
      this.internalSearch,
      this.getValue(this.internalValue)
    )) {
      this.setSearch()
    }
  }
  hasItem (item: any): boolean {
    return this.selectedValues.indexOf(this.getValue(item)) > -1
  }
  onCopy (event: ClipboardEvent) {
    if (this.selectedIndex === -1) return

    const currentItem = this.selectedItems[this.selectedIndex]
    const currentItemText = this.getText(currentItem)
    event.clipboardData!.setData('text/plain', currentItemText)
    event.clipboardData!.setData('text/vnd.ert.autocomplete.item+plain', currentItemText)
    event.preventDefault()
  }
}

export { ErtAutocomplete }
export default ErtAutocomplete
