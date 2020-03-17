import './style.scss'

import Component, { mixins } from 'vue-class-component'
import ErSelect from '../../UI/ErSelect'
import Inputmask from 'inputmask'

// const PATTERN_RUSSIAN_PHONE_GLOBAL = /^((\s|8|\+7|)(-?|\s?))?\(?\d{3}\)?(-?|\s?)?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/g
const PATTERN_FORMAT_PHONE = /^([\d]{1})([\d]{3})([\d]{3})([\d]{2})([\d]{2})/g

@Component
export default class ErPhoneSelect extends mixins(ErSelect) {
  getText (item) {
    const text = ErSelect.options.methods.getText.call(this, item)
    return text
      .replace(/[\D]+/g, '')
      .replace(PATTERN_FORMAT_PHONE, '+7 ($2) $3-$4-$5')
  }
  generateSearchMobile () {
    // Дублирование кода, так как не получается установить mask
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__search',
      class: ['pa-16']
    }, [
      h('er-text-field', {
        props: {
          appendInnerIcon: 'lens',
          value: this.internalSearch,
          mask: 'phone'
        },
        on: {
          input: e => { this.internalSearch = e }
        }
      })
    ])
  }
  generateList () {
    const mapped = this.generateListItem()

    return this.$createElement('div', {
      staticClass: 'er-select__list',
      directives: [
        {
          name: 'bar',
          rawName: 'v-bar'
        }
      ]
    }, [
      this.$createElement('div', {
        staticClass: 'content'
      }, this.internalSearch ? mapped.concat([this.generateAddingValue()]) : mapped)
    ])
  }
  generateAddingValue () {
    return this.$createElement('div', {
      staticClass: 'er-select__item',
      on: {
        click: e => {
          if (this.internalSearch.replace(/[\D]+/g, '').match(PATTERN_FORMAT_PHONE)) {
            this.$emit('input', this.internalSearch)
            this.isMenuActive = false
            this.hasFocus = false
          }
        }
      }
    }, [
      this.$createElement('div', {
        staticClass: 'er-select__item--inner',
        class: 'adding'
      }, [
        `Добавить номер телефона «${this.internalSearch}»`
      ])
    ])
  }
  generateDialogBody () {
    const listItem = this.generateListItem()
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__body'
    }, [
      this.generateSearchMobile(),
      this.internalSearch ? listItem.concat([this.generateAddingValue()]) : listItem
    ])
  }
  mounted () {
    (new Inputmask('+7 (999) 999-99-99', { jitMasking: true })).mask(this.$refs.input)
  }
}
