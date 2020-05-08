import './_style.scss'

import Component, { mixins } from 'vue-class-component'
import ErTextField from '../ErTextField'

import ClickOutside from '../../../directives/click-outside'
import { compareObject, regExpByStr } from '../../../functions/helper'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '../../../store/actions/variables'
import { BREAKPOINT_MD } from '../../../constants/breakpoint'

export const defaultMenuProps = {
  closeOnClick: false,
  closeOnContentClick: false,
  disableKeys: true,
  openOnClick: false,
  maxHeight: 304,
  offsetY: true,
  offsetOverflow: true,
  transition: false
}

export const defaultDialogProps = {
  fullscreen: true,
  transition: 'dialog-bottom-transition'
}

@Component({
  directives: {
    ClickOutside
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    trackId: {
      type: String,
      default: 'id'
    },
    label: {
      type: String,
      default: 'value'
    },
    placeholder: String,
    autocomplete: {
      type: String,
      default: 'off'
    },
    notFoundText: {
      type: String,
      default: 'Ничего не найдено'
    },
    deep: {
      type: Number,
      default: 1,
      validator: val => val === 1 || val === 2
    },
    loading: Boolean
  },
  computed: {
    ...mapState({
      screenWidth: state => state.variables[SCREEN_WIDTH]
    })
  },
  watch: {
    isMenuActive (val) {
      if (!val) {
        this.internalSearch = ''
        this.validate()
      }
    }
  }
})
export default class ErSelect extends mixins(ErTextField) {
  isMenuActive = false
  internalSearch = ''
  content = null
  isChanged = false
  multiselectStartValue = []

  get directives () {
    return this.hasFocus && !this.isMobile ? [{
      name: 'click-outside',
      value: this.blur,
      args: {
        closeConditional: this.closeConditional
      }
    }] : undefined
  }

  get isMultiple () {
    return Array.isArray(this.value)
  }

  get issetValue () {
    return this.isMultiple
      ? this.value.length > 0
      : !!this.value
  }

  get filteredItems () {
    return this.items.filter(item => this.getText(item)?.match(regExpByStr(this.internalSearch)))
  }

  get labelClasses () {
    return {
      [`${this.pre}--active`]: this.hasFocus || (Array.isArray(this.value) ? this.value.length > 0 : this.value)
    }
  }

  get classes () {
    return {
      ...ErTextField.computed.classes.call(this),
      'er-select': true
    }
  }

  get isMobile () {
    return this.screenWidth < BREAKPOINT_MD
  }

  blur (e) {
    ErTextField.methods.onBlur.call(this, e)
    this.isMenuActive = false
    this.hasFocus = false
    this.multiselectStartValue = []
    this.isChanged = false
  }

  onCancel (e) {
    this.$emit('input', this.multiselectStartValue)
    this.blur(e)
  }

  getText (item) {
    if (typeof item === 'string') {
      return item
    }
    return item ? item[this.label] : ''
  }

  isActiveItem (item) {
    if (this.isMultiple) {
      return this.value.findIndex(_item => typeof _item === 'string'
        ? _item === item
        : compareObject(_item, item)
      ) > -1
    }
    return typeof item === 'string'
      ? item === this.value
      : compareObject(item, this.value)
  }

  onClick () {
    if (this.disabled) {
      return
    }
    ErTextField.methods.onClick.call(this)
    this.isMenuActive = true
    this.multiselectStartValue = this.value
    if (!this.hasFocus) {
      this.hasFocus = true
      this.$emit('focus')
    }
  }

  onBlur (e) {
    e && this.$emit('blur', e)
  }

  onFocus (e) {
    this.$emit('focus', e)
  }

  onRemoveMultiple (e, item) {
    e.preventDefault()
    e.stopPropagation()
    const fIndex = this.value.findIndex(_item => typeof _item === 'string'
      ? _item === item
      : compareObject(_item, item)
    )
    const value = this.value
    value.splice(fIndex, 1)
    this.$emit('input', value)
  }

  generateCommaSelection () {
    if (this.value) {
      return this.$createElement('div', {
        staticClass: 'er-select__selections--comma'
      }, [
        this.getText(this.value)
      ])
    }
  }

  generateMultipleSelection () {
    return this.value.map((item, i) => {
      return this.$createElement('div', {
        staticClass: 'er-select__selections--chip',
        key: i
      }, [
        this.getText(item),
        this.$createElement('button', {
          on: {
            click: e => this.onRemoveMultiple(e, item)
          }
        }, [
          this.$createElement('er-icon', { props: { name: 'close' } })
        ])
      ])
    })
  }

  generateSelections () {
    const children = []
    let staticClass = 'er-select__selections'
    if (this.isMultiple) {
      children.push(...this.generateMultipleSelection())
      staticClass = staticClass + ' ' + staticClass + '_multiple'
    } else if (!this.hasFocus) {
      children.push(this.generateCommaSelection())
    }

    return this.$createElement('div', {
      staticClass: staticClass
    }, [
      ...children,
      this.generateInput()
    ])
  }

  generateInput () {
    const input = ErTextField.methods.generateInput.call(this)
    input.data.domProps.value = this.internalSearch
    input.data.on.input = e => { this.internalSearch = e.target.value }
    input.data.on.keypress = this.onKeyPress

    return input
  }

  generateDefaultSlot () {
    return [
      this.$createElement('div', {
        staticClass: 'er-select__slot',
        directives: this.directives
      }, [
        this.generateLabel(),
        this.generateSelections(),
        this.isMultiple && this.issetValue ? this.generateClearIcon() : null,
        this.generateToggleIcon()
      ]),
      !this.isMobile
        ? this.generateMenu()
        : this.generateDialog()
    ]
  }

  generateToggleIcon () {
    return this.loading
      ? this.$createElement('div', {
        staticClass: 'er-select__loading'
      }, [
        this.generateSlot('inner', 'append', [
          this.$createElement('er-progress-circular', {
            props: {
              indeterminate: true,
              width: 2,
              size: 16
            }
          })
        ])
      ])
      : this.$createElement('div', {
        staticClass: 'er-select__toggle',
        class: {
          'rotate': this.isMenuActive
        }
      }, [
        this.generateSlot('inner', 'append', [
          this.generateIcon('corner_down')
        ])
      ])
  }

  generateClearIcon () {
    return this.$createElement('div', {
      staticClass: 'er-select__clear',
      on: {
        click: e => {
          e.stopPropagation()
          this.$emit('input', [])
          this.$nextTick(() => {
            this.$refs.menu &&
            (this.$refs.menu.updateDimensions())
          })
        }
      }
    }, [
      this.$createElement('er-icon', { props: { name: 'cancel' } })
    ])
  }

  generateLabel () {
    if (this.$slots['placeholder'] || this.placeholder) {
      return this.$createElement('label', { class: this.labelClasses, for: this.id }, [
        this.$slots['placeholder'] ? this.$slots['placeholder'] : this.placeholder
      ])
    }
  }

  generateMenu () {
    const props = defaultMenuProps
    props.activator = this.$refs['input-slot']
    props.value = this.isMenuActive

    return this.$createElement('er-menu', {
      attrs: { role: undefined },
      props,
      on: {
        input: val => {
          this.hasFocus = val
          this.isMenuActive = val
        }
      },
      ref: 'menu'
    }, [this.generateList()])
  }

  generateDialog () {
    const props = defaultDialogProps
    props.activator = this.$refs['input-slot']
    props.value = this.isMenuActive

    return this.$createElement('er-dialog', {
      attrs: { role: undefined },
      props,
      on: {
        input: val => {
          this.hasFocus = val
          this.isMenuActive = val
        }
      }
    }, [this.generateDialogContent()])
  }

  generateDialogContent () {
    return this.$createElement('div', {
      staticClass: 'er-select__dialog'
    }, [
      this.generateDialogHead(),
      this.generateDialogBody()
    ])
  }

  generateDialogHead () {
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__head',
      class: ['d--flex', 'align-items-center', 'px-16']
    }, [
      h('div', { staticClass: 'title' }, [this.placeholder]),
      h('button', {
        on: {
          click: this.blur
        }
      }, [
        h('er-icon', { props: { name: 'close' } })
      ])
    ])
  }

  generateSearchMobile () {
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__search',
      class: ['pa-16']
    }, [
      h('er-text-field', {
        props: {
          appendInnerIcon: 'lens',
          value: this.internalSearch
        },
        on: {
          input: e => { this.internalSearch = e }
        }
      })
    ])
  }

  generateConfirmMobile () {
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__dialog-confirm',
      class: { 'show': this.isChanged }
    }, [
      h('er-button', {
        on: {
          click: this.blur
        }
      }, 'ОК')
    ])
  }

  generateDialogBody () {
    const listItem = this.generateListItem()
    const h = this.$createElement
    return h('div', {
      staticClass: 'er-select__body'
    }, [
      this.generateSearchMobile(),
      listItem.length > 0 ? listItem : this.generateEmptyItem(),
      this.generateConfirmMobile()
    ])
  }

  generateListItem () {
    if (this.deep === 1) {
      return this.filteredItems.map((item, i) => this.generateItem(item, i))
    } else {
      return this.items.map(item => {
        const filtered = item.items
          .filter(_item => this.getText(_item).match(regExpByStr(this.internalSearch)))
          .map((_item, i) => this.generateItem(_item, i))
        if (filtered.length > 0) {
          return this.$createElement('div', {}, [
            this.$createElement('div', { staticClass: 'er-select__caption', class: 'px-16' }, [item.caption]),
            ...filtered
          ])
        } else {
          return null
        }
      }).filter(item => item)
    }
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
      }, mapped.length > 0 ? mapped : [this.generateEmptyItem()])
    ])
  }

  generateEmptyItem () {
    return this.$createElement('div', {
      staticClass: 'er-select__item'
    }, [
      this.$createElement('div', {
        staticClass: 'er-select__item--inner',
        class: 'empty'
      }, [
        this.notFoundText
      ])
    ])
  }

  generateItem (item, i) {
    const content = []
    const isActive = this.isActiveItem(item)
    if (this.$scopedSlots['item']) {
      content.push(this.$scopedSlots['item']({ item }))
    } else {
      content.push(
        this.$createElement('div', {
          staticClass: 'er-select__item--inner',
          domProps: {
            innerHTML: this.getText(item).replace(regExpByStr(this.internalSearch), '<span>$&</span>')
          }
        })
      )
    }
    return this.$createElement('div', {
      staticClass: 'er-select__item',
      class: {
        'active': isActive
      },
      on: {
        click: e => {
          e.stopPropagation()
          this.selectItem(item)
        }
      }
    }, [
      content,
      isActive && this.$createElement('er-icon', { props: { name: 'ok' } })
    ])
  }

  closeConditional (e) {
    return (
      this.content &&
        !this.content.contains(e.target) &&
        this.$el &&
        !this.$el.contains(e.target) &&
        e.target !== this.$el
    )
  }

  selectItem (item) {
    if (!this.isMultiple) {
      this.$emit('input', item)
      this.isMenuActive = false
      this.hasFocus = false
    } else {
      const fIndex = this.value.findIndex(_item => typeof _item === 'string'
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
      this.internalSearch = ''
      this.$nextTick(() => {
        this.$refs.menu &&
          (this.$refs.menu.updateDimensions())
        !this.isChanged && (this.isChanged = true)
      })
    }
  }

  mounted () {
    this.content = this.$refs.menu && this.$refs.menu.$refs.content
  }

  onKeyDown (e) {}

  onKeyPress (e) {}
}
