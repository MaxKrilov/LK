import Component from 'vue-class-component'
import ErSelect from '../ErSelect'

@Component
export default class ErCombobox extends ErSelect {
  generateAddItem () {
    return this.$createElement('div', {
      staticClass: 'er-select__item',
      on: {
        click: e => {
          e.stopPropagation()
          this.selectItem(this.internalSearch)
        }
      }
    }, [
      this.$createElement('div', {
        staticClass: 'er-select__item--inner',
        class: 'add'
      }, [
        `Добавить значение «${this.internalSearch}»`
      ])
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
      }, mapped.length > 0 ? mapped : [this.generateAddItem()])
    ])
  }
}
