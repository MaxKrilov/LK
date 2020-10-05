import '../ErtAutocomplete/style.scss'

import ErtSelect from '@/components/UI2/ErtSelect'
import ErtAutocomplete from '@/components/UI2/ErtAutocomplete'

import { keyCode as keyCodes } from '@/functions/keyCode'

import Component, { mixins } from 'vue-class-component'

const props = {
  delimiters: {
    type: Array,
    default: () => ([])
  },
  returnObject: {
    type: Boolean,
    default: true
  }
}

@Component({ props })
class ErtCombobox extends mixins(ErtAutocomplete) {
  // Props
  readonly delimiters!: string[]
  readonly returnObject!: boolean

  // Data
  editingIndex: number = -1

  // Computed
  get computedCounterValue (): number {
    return this.multiple
      ? this.selectedItems.length
      : (this.internalSearch || '').toString().length
  }
  get hasSlot (): boolean {
    return ErtSelect.options.computed.hasSlot.get.call(this) || this.multiple
  }
  get isAnyValueAllowed (): boolean {
    return true
  }
  get menuCanShow (): boolean {
    if (!this.isFocused) return false

    return this.hasDisplayedItems ||
      (!!this.$slots['no-data'] && !this.hideNoData)
  }

  // Methods
  onInternalSearchChanged (val: any) {
    if (val && this.multiple && this.delimiters.length) {
      const delimiter = this.delimiters.find(d => val.endsWith(d))
      if (delimiter != null) {
        this.internalSearch = val.slice(0, val.length - delimiter.length)
        this.updateTags()
      }
    }

    this.updateMenuDimensions()
  }
  genInput () {
    const input = ErtAutocomplete.options.methods.genInput.call(this)

    delete input.data!.attrs!.name
    input.data!.on!.paste = this.onPaste

    return input
  }
  genChipSelection (item: object, index: number) {
    const chip = ErtSelect.options.methods.genChipSelection.call(this, item, index)

    if (this.multiple) {
      chip.componentOptions!.listeners! = {
        ...chip.componentOptions!.listeners!,
        dblclick: () => {
          this.editingIndex = index
          this.internalSearch = this.getText(item)
          this.selectedIndex = -1
        }
      }
    }

    return chip
  }
  onChipInput (item: object) {
    ErtSelect.options.methods.onChipInput.call(this, item)

    this.editingIndex = -1
  }
  onEnterDown (e: Event) {
    e.preventDefault()
    if (this.getMenuIndex() > -1) return

    this.$nextTick(this.updateSelf)
  }
  onFilteredItemsChanged (val: never[], oldVal: never[]) {
    if (!this.autoSelectFirst) return

    ErtAutocomplete.options.methods.onFilteredItemsChanged.call(this, val, oldVal)
  }
  onKeyDown (e: KeyboardEvent) {
    const keyCode = e.keyCode

    ErtSelect.options.methods.onKeyDown.call(this, e)

    if (this.multiple &&
      keyCode === keyCodes.DOM_VK_LEFT &&
      this.$refs.input.selectionStart === 0
    ) {
      this.updateSelf()
    } else if (keyCode === keyCodes.DOM_VK_ENTER) {
      this.onEnterDown(e)
    }

    this.changeSelectedIndex(keyCode)
  }
  onTabDown (e: KeyboardEvent) {
    if (this.multiple &&
      this.internalSearch &&
      this.getMenuIndex() === -1
    ) {
      e.preventDefault()
      e.stopPropagation()

      return this.updateTags()
    }

    ErtAutocomplete.options.methods.onTabDown.call(this, e)
  }
  selectItem (item: object) {
    if (this.editingIndex > -1) {
      this.updateEditing()
    } else {
      ErtAutocomplete.options.methods.selectItem.call(this, item)
    }
  }
  setSelectedItems () {
    if (this.internalValue == null ||
      this.internalValue === ''
    ) {
      this.selectedItems = []
    } else {
      this.selectedItems = this.multiple ? this.internalValue : [this.internalValue]
    }
  }
  setValue (value?: any) {
    ErtSelect.options.methods.setValue.call(this, value || this.internalSearch)
  }
  updateEditing () {
    const value = this.internalValue.slice()
    value[this.editingIndex] = this.internalSearch

    this.setValue(value)

    this.editingIndex = -1
  }
  updateCombobox () {
    const isUsingSlot = Boolean(this.$scopedSlots.selection) || this.hasChips

    if (isUsingSlot && !this.searchIsDirty) return

    if (this.internalSearch !== this.getText(this.internalValue)) this.setValue()

    if (isUsingSlot) this.internalSearch = undefined
  }
  updateSelf () {
    this.multiple ? this.updateTags() : this.updateCombobox()
  }
  updateTags () {
    const menuIndex = this.getMenuIndex()

    if (menuIndex < 0 &&
      !this.searchIsDirty
    ) return

    if (this.editingIndex > -1) {
      return this.updateEditing()
    }

    const index = this.selectedItems.indexOf(this.internalSearch)

    if (index > -1) {
      const internalValue = this.internalValue.slice()
      internalValue.splice(index, 1)

      this.setValue(internalValue)
    }

    if (menuIndex > -1) return (this.internalSearch = null)

    this.selectItem(this.internalSearch)
    this.internalSearch = null
  }
  onPaste (event: ClipboardEvent) {
    if (!this.multiple || this.searchIsDirty) return

    const pastedItemText = event.clipboardData!.getData('text/vnd.autocomplete.item+plain')
    if (pastedItemText && this.findExistingIndex(pastedItemText as any) === -1) {
      event.preventDefault()
      ErtSelect.options.methods.selectItem.call(this, pastedItemText as any)
    }
  }
}

export { ErtCombobox }
export default ErtCombobox
