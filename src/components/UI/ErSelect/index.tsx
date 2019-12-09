import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
import './_style.scss'
import { compareObject, regExpByStr } from '@/functions/helper'

// @ts-ignore
@Component({
  computed: {
    ...mapGetters({
      screenWidth: SCREEN_WIDTH
    })
  }
})
export default class ErSelect extends Vue {
  screenWidth!: number

  isOpenDialog: boolean = false
  searchInput: string = ''

  $refs!: {
    input: HTMLFormElement
  }

  @Prop({ type: Array, default: () => ([]) }) readonly items!: any[]
  @Prop({ type: undefined }) readonly value!: any
  @Prop({ type: String }) readonly placeholder!: string
  @Prop({ type: Number, default: 1, validator: (val: number) => [1, 2].includes(val) }) readonly deep!: number
  @Prop({ type: String, default: 'id' }) readonly trackId!: string
  @Prop({ type: String, default: 'value' }) readonly label!: string
  @Prop({ type: String, default: 'Ничего не найдено (；⌣̀_⌣́)' }) readonly notFoundText!: string
  @Prop({ type: Boolean, default: true }) readonly readonly!: boolean
  @Prop({ type: Boolean }) readonly isTagging!: boolean
  @Prop({ type: Function }) readonly taggingFunction!: (item: string) => boolean
  @Prop({ type: Boolean }) readonly isShowLabelRequired!: boolean
  @Prop({ type: Array, default: () => ([]) }) readonly rules!: (string | boolean)[]

  get isDesktop () {
    return this.screenWidth >= BREAKPOINT_MD
  }

  get issetValue (): boolean {
    return Array.isArray(this.value)
      ? this.value.length !== 0
      : !!this.value
  }

  get isMultiselect () {
    return Array.isArray(this.value)
  }

  @Watch('isOpenDialog')
  onIsOpenDialogChanged (val: boolean, oldVal: boolean) {
    if (val) {
      this.$refs.input?.focus()
    } else {
      this.$refs.input?.blur()
    }
    this.searchInput = ''
  }

  isActiveItem (item: any) {
    return this.isMultiselect
      ? ~this.value.findIndex((_item: any) => typeof _item === 'string'
        ? _item === item
        : compareObject(_item, item)
      )
      : typeof this.value === 'string'
        ? this.value === item
        : compareObject(this.value, item)
  }

  genChip (h: CreateElement, item: any) {
    return (
      <div class={['er-select__chip', 'd--flex', 'align-items-center', 'mr-4', 'mb-8']}>
        <div class={'content'}>{typeof item === 'string' ? item : item[this.label]}</div>
        <button
          class={'close'}
          onClick={(e: MouseEvent) => {
            e.stopPropagation()
            this.onRemoveChip(item)
          }}>
          <er-icon name={'close'} />
        </button>
      </div>
    )
  }

  onRemoveChip (item: any) {
    const fIndex = this.value.findIndex((_item: any) => typeof _item === 'string'
      ? _item === item
      : compareObject(_item, item)
    )
    const value = this.value
    value.splice(fIndex, 1)
    this.$emit('input', value)
  }

  // Переопределяем, так как стандартный не подходит
  genActivator (h: CreateElement, props: any): VNode {
    return (
      <div class={['er-input', 'er-text-field', { 'er-text-field--focus': this.isOpenDialog }]}>
        <div class={'er-input__control'}>
          <div class={'er-input__slot'} on={props.on}>
            <div class={'er-text-field__slot'}>
              {
                this.isMultiselect && (
                  this.value.map((item: any) => this.genChip(h, item))
                )
              }
              {
                !this.isMultiselect && !this.isOpenDialog
                  ? (
                    <input
                      value={typeof this.value === 'string' ? this.value : this.value[this.label]}
                      ref={'input'}
                    />
                  )
                  : (
                    <input
                      vModel={this.searchInput}
                      ref={'input'}
                      readonly={this.readonly}
                      autocomplete={'off'}
                    />
                  )
              }
              <label class={{ 'er-text-field--active': this.isOpenDialog || this.issetValue }}>{this.placeholder}</label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  genSearchMobile (h: CreateElement): VNode {
    return (
      <div class={['er-select__search', 'px-16', 'pt-32', 'pb-8']}>
        <er-text-field
          autocomplete={'off'}
          vModel={this.searchInput}
        />
      </div>
    )
  }

  genItem (h: CreateElement, item: any): VNode {
    return (
      <div class={['er-select__item', 'px-16', { 'active': this.isActiveItem(item) }]}
        domPropsInnerHTML={
          typeof item === 'string'
            ? item.replace(regExpByStr(this.searchInput), '<span>$&</span>')
            : item[this.label].replace(regExpByStr(this.searchInput), '<span>$&</span>')
        }
           onClick={() => this.onSelect(item)}
      />
    )
  }

  genEmptyItems (h: CreateElement): VNode {
    return (
      <div class={['er-select__item', 'empty', 'px-16']}>
        {this.notFoundText}
      </div>
    )
  }

  genTaggingItems (h: CreateElement): VNode {
    return (
      <div
        class={['er-select__item', 'tagging', 'px-16']}
        onClick={() => {
          this.taggingFunction(this.searchInput) && (this.isOpenDialog = false)
        }}
      >
        Добавить &laquo;{this.searchInput}&raquo;
      </div>
    )
  }

  genItems (h: CreateElement) {
    const funcFilter = (item: any) => typeof item === 'string'
      ? item.match(regExpByStr(this.searchInput))
      : item[this.label].match(regExpByStr(this.searchInput))

    if (this.deep === 1) {
      const mapped = this.items
        .filter((item: any) => funcFilter(item))
        .map((item: any) => this.genItem(h, item))
      if (!this.readonly && this.isTagging) {
        mapped.push(this.genTaggingItems(h))
      }
      return mapped.length > 0 ? mapped : [this.genEmptyItems(h)]
    }

    const mapped = this.items.map(item => {
      const filtered = item.items
        .filter((_item: any) => funcFilter(_item))
        .map((_item: any) => this.genItem(h, _item))

      if (filtered.length > 0) {
        return (
          <div>
            <div class={['er-select__caption', 'px-16']}>{item.caption}</div>
            {filtered}
          </div>
        )
      } else {
        return null
      }
    }).filter(item => item)
    return mapped.length > 0 ? mapped : [this.genEmptyItems(h)]
  }

  genSelectMobile (h: CreateElement): VNode {
    return (
      <div class={'er-select--mobile'}>
        <er-dialog
          fullscreen={true}
          transition={'dialog-bottom-transition'}
          vModel={this.isOpenDialog}
          scopedSlots={{
            activator: (props: any) => this.genActivator(h, props)
          }}
        >
          <div class={['er-select__modal', 'background-color--gray-9']}>
            <div class={['er-select__head', 'd--flex', 'align-items-center', 'px-16', 'background-color--shades-white']}>
              <div class={'title'}>{this.placeholder}</div>
              <button class={['d--block', 'ml-auto']} onClick={this.closeSelect}>
                <er-icon name={'close'} />
              </button>
            </div>
            <div class={'er-select__body'}>
              {!this.readonly && this.genSearchMobile(h)}
              {this.genItems(h)}
            </div>
          </div>
        </er-dialog>
      </div>
    )
  }

  genSelectDesktop (h: CreateElement): VNode {
    return (
      <div class={'er-select--desktop'}>
        <er-menu
          vModel={this.isOpenDialog}
          scopedSlots={{
            activator: (props: any) => this.genActivator(h, props)
          }}
          offsetY={true}
          closeOnContentClick={false}
          onClick={(e: MouseEvent) => { e.stopPropagation() }}
          maxHeight={300}
        >
          <div class={'er-select__menu'}>
            <div class={'content'}>
              {this.genItems(h)}
            </div>
          </div>
        </er-menu>
      </div>
    )
  }

  onSelect (item: any) {
    if (this.isMultiselect) {
      const fIndex = this.value.findIndex((_item: any) => typeof _item === 'string'
        ? _item === item
        : compareObject(_item, item)
      )
      if (fIndex === -1) {
        this.$emit('input', this.value.concat([item]))
      } else {
        const value = this.value
        value.splice(fIndex, 1)
        this.$emit('input', value)
      }
      this.searchInput = ''
    } else {
      this.$emit('input', item)
      this.closeSelect()
    }
  }

  closeSelect () {
    this.isOpenDialog = false
  }

  openSelect (e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.isOpenDialog = true
  }

  render (h: CreateElement): VNode {
    return (
      <div class={'er-select'}>
        {
          this.isDesktop
            ? this.genSelectDesktop(h)
            : this.genSelectMobile(h)
        }
      </div>
    )
  }
}
