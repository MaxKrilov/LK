import '@/components/UI2/ErtTextField/style.scss'
import './style.scss'

import Component, { mixins } from 'vue-class-component'
import { VNode, VNodeDirective, VNodeData } from 'vue'
import { SelectItemKey } from '@/types'

import ErtChip from '@/components/UI2/ErtChip'
import ErtMenu from '@/components/UI2/ErtMenu'
import ErtSelectList from './ErtSelectList'

import ErtInput from '@/components/UI2/ErtInput'
import ErtTextField from '@/components/UI2/ErtTextField'

import ErtComparableMixin from '@/mixins2/ErtComparableMixin'
import ErtFilterableMixin from '@/mixins2/ErtFilterableMixin'

import ClickOutside from '@/directives2/click-outside'

import mergeData from '@/utils/mergeData'
import { getPropertyFromItem, getObjectValueByPath } from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

export const defaultMenuProps = {
  closeOnClick: false,
  closeOnContentClick: false,
  disableKeys: true,
  openOnClick: false,
  maxHeight: 304,
  offsetY: true
}

const baseMixins = mixins(
  ErtTextField,
  ErtComparableMixin,
  ErtFilterableMixin
)

const directives = { ClickOutside }

const props = {
  appendIcon: {
    type: String,
    default: 'corner_down'
  },
  attach: {
    default: false
  },
  cacheItems: Boolean,
  chips: Boolean,
  clearable: Boolean,
  deletableChips: Boolean,
  disableLookup: Boolean,
  eager: Boolean,
  hideSelected: Boolean,
  items: {
    type: Array,
    default: () => ([])
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
  menuProps: {
    type: [String, Array, Object],
    default: () => defaultMenuProps
  },
  multiple: Boolean,
  openOnClear: Boolean,
  returnObject: Boolean,
  smallChips: Boolean
}

@Component<InstanceType<typeof ErtSelect>>({
  directives,
  props,
  watch: {
    internalValue (val) {
      this.initialValue = val
      this.setSelectedItems()
    },
    isMenuActive (val) {
      setTimeout(() => { this.onMenuActiveChange(val) })
    },
    items: {
      immediate: true,
      handler (val) {
        this.cacheItems && this.$nextTick(() => {
          this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val))
        })
        this.setSelectedItems()
      }
    }
  }
})
export default class ErtSelect extends baseMixins {
  // Options
  $refs!: InstanceType<typeof baseMixins> & {
    menu: InstanceType<typeof ErtMenu>
    label: HTMLElement
    input: HTMLInputElement
    'prepend-inner': HTMLElement
    'append-inner': HTMLElement
    prefix: HTMLElement
    suffix: HTMLElement
  }

  // Props
  readonly appendIcon!: string
  readonly attach!: string | boolean | Element | VNode
  readonly cacheItems!: boolean
  readonly chips!: boolean
  readonly clearable!: boolean
  readonly deletableChips!: boolean
  readonly disableLookup!: boolean
  readonly eager!: boolean
  readonly hideSelected!: boolean
  readonly items!: any[]
  readonly itemDisabled!: SelectItemKey
  readonly itemText!: SelectItemKey
  readonly itemValue!: SelectItemKey
  readonly menuProps!: string | any[] | Record<string, any>
  readonly multiple!: boolean
  readonly openOnClear!: boolean
  readonly returnObject!: boolean
  readonly smallChips!: boolean

  // Data
  cachedItems: any[] = this.cacheItems ? this.items : []
  menuIsBooted: boolean = false
  isMenuActive: boolean = false
  lastItem: number = 20
  lazyValue: any | any[] = this.value !== undefined
    ? this.value
    : this.multiple ? [] : undefined
  selectedIndex: number = -1
  selectedItems: any[] = []
  keyboardLookupPrefix: string = ''
  keyboardLookupLastTime: number = 0

  // Computed
  get allItems (): object[] {
    return this.filterDuplicates(this.cachedItems.concat(this.items))
  }
  get classes (): object {
    return {
      ...ErtTextField.options.computed.classes.get.call(this),
      'ert-select': true,
      'ert-select--chips': this.hasChips,
      'ert-select--chips--small': this.smallChips,
      'ert-select--is-menu-active': this.isMenuActive,
      'ert-select--is-multi': this.multiple
    }
  }
  get computedItems (): object[] {
    return this.allItems
  }
  get computedOwns (): string {
    return `list-${this._uid}`
  }
  get computedCounterValue (): number {
    return this.multiple
      ? this.selectedItems.length
      : (this.getText(this.selectedItems[0]) || '').toString().length
  }
  get directives (): VNodeDirective[] | undefined {
    return this.isFocused ? [{
      name: 'click-outside',
      value: {
        handler: this.blur,
        closeConditional: this.closeConditional
      }
    }] : undefined
  }
  get dynamicHeight () {
    return 'auto'
  }
  get hasChips (): boolean {
    return this.chips || this.smallChips
  }
  get hasSlot (): boolean {
    return Boolean(this.hasChips || this.$scopedSlots.selection)
  }
  get isDirty (): boolean {
    return this.selectedItems.length > 0
  }
  get listData (): object {
    const scopeId = this.$vnode && (this.$vnode.context!.$options as { [key: string]: any })._scopeId
    const attrs = scopeId ? {
      [scopeId]: true
    } : {}

    return {
      attrs: {
        ...attrs,
        id: this.computedOwns
      },
      props: {
        action: this.multiple,
        hideSelected: this.hideSelected,
        items: this.virtualizedItems,
        itemDisabled: this.itemDisabled,
        itemText: this.itemText,
        itemValue: this.itemValue,
        noDataText: this.noDataText,
        selectedItems: this.selectedItems
      },
      on: {
        select: this.selectItem
      },
      scopedSlots: {
        item: this.$scopedSlots.item
      }
    }
  }
  get staticList (): VNode {
    return this.$createElement(ErtSelectList, this.listData)
  }
  get virtualizedItems (): object[] {
    return (this.$_menuProps as any).auto
      ? this.computedItems
      : this.computedItems.slice(0, this.lastItem)
  }
  get menuCanShow () {
    return true
  }
  // eslint-disable-next-line camelcase
  get $_menuProps (): object {
    let normalisedProps = typeof this.menuProps === 'string'
      ? this.menuProps.split(',')
      : this.menuProps

    if (Array.isArray(normalisedProps)) {
      normalisedProps = normalisedProps.reduce((acc, p) => {
        acc[p.trim()] = true
        return acc
      }, {})
    }

    return {
      ...defaultMenuProps,
      eager: this.eager,
      value: this.menuCanShow && this.isMenuActive,
      nudgeBottom: normalisedProps.offsetY ? 1 : 0,
      ...normalisedProps
    }
  }

  // Methods
  blur (e?: Event) {
    ErtTextField.options.methods.blur.call(this, e)
    this.isMenuActive = false
    this.isFocused = false
    this.selectedIndex = -1
  }
  /** @public */
  activateMenu () {
    if (!this.isInteractive || this.isMenuActive) return

    this.isMenuActive = true
  }
  clearableCallback () {
    this.setValue(this.multiple ? [] : undefined)
    this.setMenuIndex(-1)
    this.$nextTick(() => this.$refs.input && this.$refs.input.focus())

    if (this.openOnClear) this.isMenuActive = true
  }
  closeConditional (e: Event) {
    if (!this.isMenuActive) return true

    return (!this._isDestroyed &&
      (!this.getContent() || !this.getContent().contains(e.target as Node)) &&
      this.$el &&
      !this.$el.contains(e.target as Node) &&
      e.target !== this.$el
    )
  }
  filterDuplicates (arr: any[]) {
    const uniqueValues = new Map()
    for (let index = 0; index < arr.length; ++index) {
      const item = arr[index]
      const val = this.getValue(item)
      !uniqueValues.has(val) && uniqueValues.set(val, item)
    }
    return Array.from(uniqueValues.values())
  }
  findExistingIndex (item: object) {
    const itemValue = this.getValue(item)

    return (this.internalValue || []).findIndex((i: object) => this.valueComparator(this.getValue(i), itemValue))
  }
  getContent () {
    return this.$refs.menu && this.$refs.menu.$refs.content
  }
  genChipSelection (item: object, index: number) {
    const isDisabled = (
      !this.isInteractive ||
      this.getDisabled(item)
    )

    return this.$createElement(ErtChip, {
      staticClass: 'ert-chip--select',
      attrs: { tabindex: -1 },
      props: {
        close: this.deletableChips && !isDisabled,
        disabled: isDisabled,
        inputValue: index === this.selectedIndex,
        small: this.smallChips
      },
      on: {
        click: (e: MouseEvent) => {
          if (isDisabled) return

          e.stopPropagation()

          this.selectedIndex = index
        },
        'click:close': () => this.onChipInput(item)
      },
      key: JSON.stringify(this.getValue(item))
    }, this.getText(item))
  }
  genCommaSelection (item: object, index: number, last: boolean) {
    const isDisabled = (
      !this.isInteractive ||
      this.getDisabled(item)
    )

    return this.$createElement('div', {
      staticClass: 'ert-select__selection ert-select__selection--comma',
      class: {
        'ert-select__selection--disabled': isDisabled
      },
      key: JSON.stringify(this.getValue(item))
    }, `${this.getText(item)}${last ? '' : ', '}`)
  }
  genDefaultSlot (): (VNode | VNode[] | null)[] {
    const selections = this.genSelections()
    const input = this.genInput()

    if (Array.isArray(selections)) {
      selections.push(input)
    } else {
      selections.children = selections.children || []
      selections.children.push(input)
    }

    return [
      this.genFieldset(),
      this.$createElement('div', {
        staticClass: 'ert-select__slot',
        directives: this.directives
      }, [
        this.genLabel(),
        this.prefix ? this.genAffix('prefix') : null,
        selections,
        this.suffix ? this.genAffix('suffix') : null,
        this.genClearIcon(),
        this.genIconSlot(),
        this.genHiddenInput()
      ]),
      this.genMenu(),
      this.genProgress()
    ]
  }
  genIcon (
    type: string,
    cb?: (e: Event) => void,
    extraData?: VNodeData
  ) {
    const icon = ErtInput.options.methods.genIcon.call(this, type, cb, extraData)

    if (type === 'append') {
      // Don't allow the dropdown icon to be focused
      icon.children![0].data = mergeData(icon.children![0].data!, {
        attrs: {
          tabindex: icon.children![0].componentOptions!.listeners && '-1',
          'aria-hidden': 'true',
          'aria-label': undefined
        }
      })
    }

    return icon
  }
  genInput (): VNode {
    const input = ErtTextField.options.methods.genInput.call(this)

    delete input.data!.attrs!.name

    input.data = mergeData(input.data!, {
      domProps: { value: null },
      attrs: {
        readonly: true,
        type: 'text',
        'aria-readonly': String(this.isReadonly),
        'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
        autocomplete: getObjectValueByPath(input.data!, 'attrs.autocomplete', 'off')
      },
      on: { keypress: this.onKeyPress }
    })

    return input
  }
  genHiddenInput (): VNode {
    return this.$createElement('input', {
      domProps: { value: this.lazyValue },
      attrs: {
        type: 'hidden',
        name: this.attrs$.name
      }
    })
  }
  genInputSlot (): VNode {
    const render = ErtTextField.options.methods.genInputSlot.call(this)

    render.data!.attrs = {
      ...render.data!.attrs,
      role: 'button',
      'aria-haspopup': 'listbox',
      'aria-expanded': String(this.isMenuActive),
      'aria-owns': this.computedOwns
    }

    return render
  }
  genList (): VNode {
    if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
      return this.genListWithSlot()
    } else {
      return this.staticList
    }
  }
  genListWithSlot (): VNode {
    const slots = ['prepend-item', 'no-data', 'append-item']
      .filter(slotName => this.$slots[slotName])
      .map(slotName => this.$createElement('template', {
        slot: slotName
      }, this.$slots[slotName]))
    return this.$createElement(ErtSelectList, {
      ...this.listData
    }, slots)
  }
  genMenu (): VNode {
    const props = this.$_menuProps as any
    props.activator = (this.$refs as any)['input-slot']

    if (this.attach === '' || this.attach === true || this.attach === 'attach') {
      props.attach = this.$el
    } else {
      props.attach = this.attach
    }

    return this.$createElement(ErtMenu, {
      attrs: { role: undefined },
      props,
      on: {
        input: (val: boolean) => {
          this.isMenuActive = val
          this.isFocused = val
        },
        scroll: this.onScroll
      },
      ref: 'menu'
    }, [this.genList()])
  }
  genSelections (): VNode {
    let length = this.selectedItems.length
    const children = new Array(length)

    let genSelection
    if (this.$scopedSlots.selection) {
      genSelection = this.genSlotSelection
    } else if (this.hasChips) {
      genSelection = this.genChipSelection
    } else {
      genSelection = this.genCommaSelection
    }

    while (length--) {
      children[length] = genSelection(
        this.selectedItems[length],
        length,
        length === children.length - 1
      )
    }

    return this.$createElement('div', {
      staticClass: 'ert-select__selections'
    }, children)
  }
  genSlotSelection (item: object, index: number): VNode[] | undefined {
    return this.$scopedSlots.selection!({
      attrs: {
        class: 'ert-chip--select'
      },
      parent: this,
      item,
      index,
      select: (e: Event) => {
        e.stopPropagation()
        this.selectedIndex = index
      },
      selected: index === this.selectedIndex,
      disabled: !this.isInteractive
    })
  }
  getMenuIndex () {
    return this.$refs.menu ? (this.$refs.menu as { [key: string]: any }).listIndex : -1
  }
  getDisabled (item: object) {
    return getPropertyFromItem(item, this.itemDisabled, false)
  }
  getText (item: object) {
    return getPropertyFromItem(item, this.itemText, item)
  }
  getValue (item: object) {
    return getPropertyFromItem(item, this.itemValue, this.getText(item))
  }
  onBlur (e?: Event) {
    e && this.$emit('blur', e)
  }
  onChipInput (item: object) {
    if (this.multiple) this.selectItem(item)
    else this.setValue(null)
    this.isMenuActive = this.selectedItems.length === 0
    this.selectedIndex = -1
  }
  onClick (e: MouseEvent) {
    if (!this.isInteractive) return

    if (!this.isAppendInner(e.target)) {
      this.isMenuActive = true
    }

    if (!this.isFocused) {
      this.isFocused = true
      this.$emit('focus')
    }

    this.$emit('click', e)
  }
  onEscDown (e: Event) {
    e.preventDefault()
    if (this.isMenuActive) {
      e.stopPropagation()
      this.isMenuActive = false
    }
  }
  onKeyPress (e: KeyboardEvent) {
    if (
      this.multiple ||
      !this.isInteractive ||
      this.disableLookup
    ) return

    const KEYBOARD_LOOKUP_THRESHOLD = 1000 // milliseconds
    const now = performance.now()
    if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
      this.keyboardLookupPrefix = ''
    }
    this.keyboardLookupPrefix += e.key.toLowerCase()
    this.keyboardLookupLastTime = now

    const index = this.allItems.findIndex(item => {
      const text = (this.getText(item) || '').toString()

      return text.toLowerCase().startsWith(this.keyboardLookupPrefix)
    })
    const item = this.allItems[index]
    if (index !== -1) {
      this.lastItem = Math.max(this.lastItem, index + 5)
      this.setValue(this.returnObject ? item : this.getValue(item))
      this.$nextTick(() => this.$refs.menu.getTiles())
      setTimeout(() => this.setMenuIndex(index))
    }
  }
  onKeyDown (e: KeyboardEvent) {
    if (this.isReadonly && e.keyCode !== keyCodes.DOM_VK_TAB) return

    const keyCode = e.keyCode
    const menu = this.$refs.menu

    // If enter, space, open menu
    if ([
      keyCodes.DOM_VK_ENTER,
      keyCodes.DOM_VK_SPACE
    ].includes(keyCode)) this.activateMenu()

    this.$emit('keydown', e)

    if (!menu) return

    if (this.isMenuActive && keyCode !== keyCodes.DOM_VK_TAB) {
      this.$nextTick(() => {
        menu.changeListIndex(e)
        this.$emit('update:list-index', menu.listIndex)
      })
    }

    if (
      !this.isMenuActive &&
      [keyCodes.DOM_VK_UP, keyCodes.DOM_VK_DOWN].includes(keyCode)
    ) return this.onUpDown(e)

    if (keyCode === keyCodes.DOM_VK_ESCAPE) return this.onEscDown(e)

    if (keyCode === keyCodes.DOM_VK_TAB) return this.onTabDown(e)

    if (keyCode === keyCodes.DOM_VK_SPACE) return this.onSpaceDown(e)
  }
  onMenuActiveChange (val: boolean) {
    if ((this.multiple && !val) || this.getMenuIndex() > -1) return

    const menu = this.$refs.menu

    if (!menu || !this.isDirty) return

    for (let i = 0; i < menu.tiles.length; i++) {
      if (menu.tiles[i].getAttribute('aria-selected') === 'true') {
        this.setMenuIndex(i)
        break
      }
    }
  }
  onMouseUp (e: MouseEvent) {
    if (
      this.hasMouseDown &&
      e.which !== 3 &&
      this.isInteractive
    ) {
      if (this.isAppendInner(e.target)) {
        this.$nextTick(() => (this.isMenuActive = !this.isMenuActive))
      } else {
        this.isMenuActive = true
      }
    }

    ErtTextField.options.methods.onMouseUp.call(this, e)
  }
  onScroll () {
    if (!this.isMenuActive) {
      requestAnimationFrame(() => (this.getContent().scrollTop = 0))
    } else {
      if (this.lastItem > this.computedItems.length) return

      const showMoreItems = (
        this.getContent().scrollHeight -
        (this.getContent().scrollTop +
          this.getContent().clientHeight)
      ) < 200

      if (showMoreItems) {
        this.lastItem += 20
      }
    }
  }
  onSpaceDown (e: KeyboardEvent) {
    e.preventDefault()
  }
  onTabDown (e: KeyboardEvent) {
    const menu = this.$refs.menu

    if (!menu) return

    const activeTile = menu.activeTile

    if (!this.multiple && activeTile && this.isMenuActive) {
      e.preventDefault()
      e.stopPropagation()

      activeTile.click()
    } else {
      this.blur(e)
    }
  }
  onUpDown (e: KeyboardEvent) {
    const menu = this.$refs.menu

    if (!menu) return

    e.preventDefault()

    if (this.multiple) return this.activateMenu()

    const keyCode = e.keyCode

    menu.isBooted = true

    window.requestAnimationFrame(() => {
      menu.getTiles()
      keyCodes.DOM_VK_UP === keyCode ? menu.prevTile() : menu.nextTile()
      menu.activeTile && menu.activeTile.click()
    })
  }
  selectItem (item: object) {
    if (!this.multiple) {
      this.setValue(this.returnObject ? item : this.getValue(item))
      this.isMenuActive = false
    } else {
      const internalValue = (this.internalValue || []).slice()
      const i = this.findExistingIndex(item)

      i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item)
      this.setValue(internalValue.map((i: object) => {
        return this.returnObject ? i : this.getValue(i)
      }))

      this.$nextTick(() => {
        this.$refs.menu &&
        (this.$refs.menu as { [key: string]: any }).updateDimensions()
      })

      if (!this.multiple) return

      const listIndex = this.getMenuIndex()

      this.setMenuIndex(-1)

      if (this.hideSelected) return

      this.$nextTick(() => this.setMenuIndex(listIndex))
    }
  }
  setMenuIndex (index: number) {
    this.$refs.menu && ((this.$refs.menu as { [key: string]: any }).listIndex = index)
  }
  setSelectedItems () {
    const selectedItems = []
    const values = !this.multiple || !Array.isArray(this.internalValue)
      ? [this.internalValue]
      : this.internalValue

    for (const value of values) {
      const index = this.allItems.findIndex(v => this.valueComparator(
        this.getValue(v),
        this.getValue(value)
      ))

      if (index > -1) {
        selectedItems.push(this.allItems[index])
      }
    }

    this.selectedItems = selectedItems
  }
  setValue (value: any) {
    const oldValue = this.internalValue
    this.internalValue = value
    value !== oldValue && this.$emit('change', value)
  }
  isAppendInner (target: any) {
    const appendInner = this.$refs['append-inner']

    return appendInner && (appendInner === target || appendInner.contains(target))
  }
}
