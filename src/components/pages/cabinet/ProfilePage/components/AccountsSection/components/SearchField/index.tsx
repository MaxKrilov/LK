import { CreateElement, VNode } from 'vue'
import { Vue, Component } from 'vue-property-decorator'
import './_style.scss'
import { getNoun } from '@/functions/helper'

const SearchFieldProp = Vue.extend({
  name: 'search-field',
  props: {
    placeholder: { type: String, default: 'Искать' },
    countRows: { type: Number, default: 0 }
  }
})

@Component
export default class SearchField extends SearchFieldProp {
  pre: string = 'search-field'
  modelSearch: string = ''
  hasFocus: boolean = false

  get styleSearchFormFocused () {
    return this.hasFocus ? `${this.pre}__form--active` : ''
  }

  handleSearchSubmit (e: any) {
    e.preventDefault()

    this.$emit('search', { query: this.modelSearch.toLowerCase().trim() })
  }

  toggleFocus (value: boolean) {
    this.hasFocus = value
  }

  handleSearchChange (value: any) {
    this.modelSearch = value
  }

  render (h: CreateElement): VNode {
    const pluralText = getNoun(this.countRows, 'учетная запись', 'учетные записи', 'учетных записей')
    return (
      <div class={this.pre}>
        {this.countRows > 0 && (
          <div class={`${this.pre}__count`}>Всего: {this.countRows} {pluralText}</div>
        )}
        <er-form
          class={`${this.pre}__form ${this.styleSearchFormFocused}`}
          onSubmit={this.handleSearchSubmit}
        >
          <er-text-field
            label={this.placeholder}
            value={this.modelSearch}
            appendInnerIcon="lens"
            class={`${this.pre}__form__input`}
            onFocus={() => this.toggleFocus(true)}
            onBlur={() => this.toggleFocus(false)}
            onInput={this.handleSearchChange}
          />
        </er-form>
      </div>
    )
  }
}
