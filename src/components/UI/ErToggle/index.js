import ErInput from '../ErInput'
import './_style.scss'
import { eachArray, isEmpty } from '../../../functions/helper'

export default {
  name: 'er-toggle',
  mixins: [ ErInput ],
  model: {
    prop: 'modelValue',
    event: 'input'
  },
  data: () => ({
    pre: 'er-toggle'
  }),
  props: {
    view: {
      type: String,
      default: 'switch',
      validator: value => ~['switch', 'radio', 'radio-check'].indexOf(value)
    },
    type: {
      type: String,
      default: 'checkbox',
      validator: value => ~['checkbox', 'radio'].indexOf(value)
    },
    id: {
      type: String,
      default: function () {
        return `er-toggle__${this._uid}`
      }
    },
    modelValue: {
      default: undefined
    },
    value: {
      default: null
    },
    name: String,
    checked: Boolean,
    disabled: Boolean,
    label: String
  },
  computed: {
    classes () {
      return {
        [`${this.pre}`]: true,
        [`${this.pre}--${this.view}`]: true,
        [`${this.pre}--error`]: this.hasErrors
      }
    },
    state () {
      if (this.modelValue === undefined) {
        return this.checked
      }
      if (this.type === 'checkbox' && Array.isArray(this.modelValue)) {
        return ~this.modelValue.indexOf(this.value)
      } else if (this.type === 'checkbox') {
        return !!this.modelValue
      }
      return this.modelValue === this.value
    }
  },
  watch: {
    checked (val) {
      if (val !== this.state) {
        this.toggle()
      }
    }
  },
  methods: {
    generateToggle () {
      return this.$createElement('input', {
        attrs: {
          type: this.type,
          id: this.id,
          name: this.name,
          disabled: this.disabled
        },
        domProps: {
          value: this.value,
          checked: this.state
        },
        on: {
          change: this.onChange
        }
      })
    },
    generateLabel () {
      return this.$createElement('label', {
        attrs: {
          for: this.id
        }
      }, [
        this.view === 'switch' && this.generateSwitch(),
        this.view === 'radio' && this.generateRadio(),
        this.view === 'radio-check' && this.generateRadioCheck(),
        this.label && this.$createElement('div', {
          staticClass: `${this.pre}__label-text`
        }, [this.label])
      ])
    },
    generateSwitch () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__outer`
      }, [
        this.$createElement('div', {
          staticClass: `${this.pre}__inner-wrap`
        }, [
          this.$createElement('div', {
            staticClass: `${this.pre}__inner`
          }, [
            this.$createElement('er-icon', { props: { name: this.state ? 'ok' : 'close' } })
          ])
        ])
      ])
    },
    generateRadio () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__outer`
      }, [
        this.$createElement('div', {
          staticClass: `${this.pre}__inner-wrap`
        }, [
          this.$createElement('div', {
            staticClass: `${this.pre}__inner`
          })
        ])
      ])
    },
    generateRadioCheck () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__outer`
      }, [
        this.$createElement('div', {
          staticClass: `${this.pre}__inner`
        }, [
          this.$createElement('er-icon', { props: { name: 'ok' } })
        ])
      ])
    },
    generateDefaultSlot () {
      return [
        this.generateToggle(),
        this.generateLabel()
      ]
    },
    onChange () {
      this.toggle()
    },
    toggle () {
      let value
      if (this.type === 'checkbox') {
        if (Array.isArray(this.modelValue)) {
          value = this.modelValue.slice(0)
          this.state ? value.splice(value.indexOf(this.value), 1) : value.push(this.value)
        } else {
          value = !this.state
        }
        this.$emit('input', value)
      } else {
        this.$emit('input', this.state ? '' : this.value)
      }
    },
    validate () {
      this.messages = []
      eachArray(this.rules, rule => {
        const result = rule(this.modelValue)
        if (typeof result === 'string') {
          this.messages.push(result)
        } else if (typeof result !== 'boolean') {
          console.error('Правило должно возвращать строку или логическое значение')
        }
      })
      return isEmpty(this.messages)
    }
  },
  mounted () {
    if (this.checked && !this.state) {
      this.toggle()
    }
  }
}
