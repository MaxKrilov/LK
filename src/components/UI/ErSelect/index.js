import './_style.scss'
import { getFirstElement, isEmpty, isMobile } from '../../../functions/helper'

export default {
  name: 'er-select',
  data: () => ({
    tagList: 'er-menu',
    isMobile: false,
    isOpenDialog: false,
    filterMobile: '',
    isOnInput: false,
    internalValue: '',
    isSelected: false
  }),
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: 'Выберите значение'
    },
    readonly: Boolean,
    trackId: {
      type: String,
      default: 'id'
    },
    label: {
      type: String,
      default: 'value'
    },
    notFoundText: {
      type: String,
      default: 'Результатов не найдено'
    },
    value: {
      type: null
    },
    isSelectFirst: Boolean,
    isShowLabelRequired: Boolean,
    labelChanged: String,
    rules: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    getFilteredItems () {
      return this.items.filter(item => {
        return this.isOnInput
          ? typeof item === 'string'
            ? item.matchAll(new RegExp(this.internalValue, 'ig'))
            : item[this.label].matchAll(new RegExp(this.internalValue, 'ig'))
          : true
      })
    },
    getFilteredItemsMobile () {
      return this.items.filter(item => {
        return typeof item === 'string'
          ? item.match(new RegExp(this.filterMobile, 'ig'))
          : item[this.label].match(new RegExp(this.filterMobile, 'ig'))
      })
    },
    filterDesktop () {
      return this.isOnInput ? this.internalValue : ''
    }
  },
  watch: {
    value (val) {
      this.internalValue = typeof val === 'string' ? val : val[this.label]
    },
    items (val) {
      this.isSelectFirst && this.$emit('input', getFirstElement(val))
    }
  },
  methods: {
    __getClass () {
      return `er-select__list${this.isMobile ? '--mobile' : ''}`
    },
    __generateList () {
      return this.$createElement('div', {
        staticClass: this.__getClass(),
        class: {
          'er-select__list--mobile--readonly': this.isMobile && this.readonly
        }
      }, this.isMobile ? [
        this.generateHeaderMobile(),
        !this.readonly && this.generateSearchMobile(),
        this.generateItemsMobile()
      ] : [
        this.generateItems()
      ])
    },
    __generateItems () {
      return this.$createElement('div', {
        staticClass: `${this.__getClass()}__items`
      }, isEmpty(this[this.isMobile ? 'getFilteredItemsMobile' : 'getFilteredItems'])
        ? [this.$createElement('div', {
          staticClass: `${this.__getClass()}__item`,
          class: 'not-found'
        }, [this.notFoundText])]
        : this[this.isMobile ? 'getFilteredItemsMobile' : 'getFilteredItems']
          .map(item => this.isMobile ? this.generateItemMobile(item) : this.generateItem(item))
      )
    },
    __generateItem (item) {
      const isString = typeof item === 'string'
      const replaceArgs = [
        new RegExp(this[this.isMobile ? 'filterMobile' : 'filterDesktop'], 'ig'),
        '<span>$&</span>'
      ]
      return this.$createElement('a', {
        staticClass: `${this.__getClass()}__item`,
        class: {
          'active': isString
            ? item === this.value
            : this._.isEqual(item, this.value)
        },
        attrs: {
          'data-id': isString ? item : item[this.trackId]
        },
        on: {
          click: this.onSelectItem
        }
      }, [
        this.$createElement('div', {
          domProps: {
            innerHTML: this[this.isMobile ? 'filterMobile' : 'filterDesktop']
              ? isString
                ? item.replace(...replaceArgs)
                : item[this.label].replace(...replaceArgs)
              : isString
                ? item
                : item[this.label]
          }
        }),
        this.$createElement('er-icon', { props: { name: 'ok' } })
      ])
    },
    __getEventsForActivator (on) {
      return {
        ...on,
        input: e => {
          this.isOnInput = true
          this.internalValue = e
        },
        blur: this.onBlur,
        focus: (e) => {
          e.target.nextSibling.style.display = 'none'
          this.$refs.activator.$refs.input.select()
          setTimeout(function() {
            e.target.nextSibling.style.display = 'block'
          }, 500);
        }
      }
    },
    generateActivator (props) {
      return this.$createElement('er-text-field', {
        props: {
          value: this.internalValue,
          label: this.placeholder,
          appendInnerIcon: 'corner_down',
          autocomplete: 'off',
          readonly: this.readonly,
          labelChanged: this.labelChanged,
          isShowLabelRequired: this.isShowLabelRequired,
          rules: this.rules
        },
        on: this.__getEventsForActivator(props.on),
        ref: 'activator'
      })
    },
    generateList () {
      return this.__generateList()
    },
    generateListMobile () {
      return this.__generateList()
    },
    generateItems () {
      return this.__generateItems()
    },
    generateItemsMobile () {
      return this.__generateItems()
    },
    generateItem (item) {
      return this.__generateItem(item)
    },
    generateHeaderMobile () {
      return this.$createElement('div', {
        staticClass: 'er-select__list--mobile__header'
      }, [
        this.$createElement('div', {
          staticClass: 'er-select__list--mobile__title'
        }, [ this.placeholder || '' ]),
        this.$createElement('div', {
          staticClass: 'er-select__list--mobile__close',
          on: {
            click: () => { this.isOpenDialog = false; this.filterMobile = '' }
          }
        }, [
          this.$createElement('er-icon', { props: { name: 'close' } })
        ])
      ])
    },
    generateSearchMobile () {
      return this.$createElement('div', {
        staticClass: 'er-select__list--mobile__search'
      }, [
        this.$createElement('er-text-field', {
          props: {
            appendInnerIcon: 'lens',
            value: this.filterMobile
          },
          on: {
            input: e => { this.filterMobile = e }
          }
        })
      ])
    },
    generateItemMobile (item) {
      return this.__generateItem(item)
    },
    onSelectItem (e) {
      const id = e.target.closest('a').dataset.id
      const isString = typeof getFirstElement(this.items) === 'string'
      const result = this.items.find(item => {
        return isString
          ? id === item
          : id === item[this.trackId]
      })
      if (!result) {
        throw new Error('Unknow error')
      }
      this.$emit('input', result)
      this.isOpenDialog = false
      this.isSelected = true
      this.filterMobile = ''
    },
    onBlur () {
      setTimeout(() => {
        if (!this.isSelected) {
          this.internalValue = this.value
            ? typeof this.value === 'string'
              ? this.value
              : this.value[this.label]
            : ''
        }
        this.isSelected = false
        this.isOnInput = false
        this.$emit('blur')
      }, 100)
    }
  },
  render (h) {
    const scopedSlots = {
      activator: props => this.generateActivator(props)
    }
    const events = {
      input: () => { this.isOpenDialog = true }
    }
    const options = this.isMobile
      ? {
        props: {
          fullscreen: true,
          transition: 'dialog-bottom-transition',
          value: this.isOpenDialog
        }
      }
      : {
        props: {
          offsetY: true,
          nudgeBottom: -20
        }
      }
    return h('div', {
      staticClass: 'er-select'
    }, [
      h(this.tagList, {
        ...options,
        scopedSlots,
        on: events
      }, [
        this.isMobile
          ? this.generateListMobile()
          : this.generateList()
      ])
    ])
  },
  created () {
    this.isMobile = isMobile()
    this.isMobile && (this.tagList = 'er-dialog')
  }
}
