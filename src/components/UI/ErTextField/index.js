import ErInput from '../ErInput'
import './_style.scss'
import Inputmask from 'inputmask'

export default {
  name: 'er-text-field',
  mixins: [ ErInput ],
  data: () => ({
    pre: 'er-text-field',
    hasFocus: false,
    isSuccess: false
  }),
  props: {
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: null
    },
    disabled: Boolean,
    mask: String,
    id: {
      type: String,
      default: function () {
        return `er-text-field__${this._uid}`
      }
    },
    autocomplete: String,
    isShowSuccess: Boolean,
    readonly: Boolean
  },
  computed: {
    classes () {
      return {
        [`${this.pre}`]: true,
        [`${this.pre}--focus`]: this.hasFocus,
        [`${this.pre}--disabled`]: this.disabled,
        [`${this.pre}--error`]: this.hasErrors,
        [`${this.pre}--success`]: this.isShowSuccess && this.isSuccess
      }
    },
    labelClasses () {
      return {
        [`${this.pre}--active`]: this.hasFocus || this.value
      }
    }
  },
  watch: {
    mask (value) {
      this.defineMask(value)
    }
  },
  methods: {
    generateTextFieldSlot () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__slot`
      }, [
        this.generateInput(),
        this.generateLabel(),
        this.isShowSuccess && this.isSuccess && this.generateSuccessIcon()
      ])
    },
    generateSuccessIcon () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__success-icon`
      }, [
        this.$createElement('er-icon', { props: { name: 'ok' } })
      ])
    },
    generatePrependInner () {
      const slot = []
      if (this.$slots['prepend-inner']) {
        slot.push(this.$slots['prepend-inner'])
      } else if (this.prependInnerIcon) {
        slot.push(this.generateIcon(this.prependInnerIcon))
      }
      return this.generateSlot('inner', 'prepend', slot)
    },
    generateAppendInner () {
      const slot = []
      if (this.$slots['append-inner']) {
        slot.push(this.$slots['append-inner'])
      } else if (this.appendInnerIcon) {
        slot.push(this.generateIcon(this.appendInnerIcon))
      }
      return this.generateSlot('inner', 'append', slot)
    },
    generateDefaultSlot () {
      return [
        this.generatePrependInner(),
        this.generateTextFieldSlot(),
        this.generateAppendInner()
      ]
    },
    generateInput () {
      return this.$createElement('input', {
        attrs: {
          type: this.type,
          disabled: this.disabled,
          id: this.id,
          autocomplete: this.autocomplete,
          readonly: this.readonly
        },
        domProps: {
          value: this.value
        },
        ref: 'input',
        on: {
          focus: this.onFocus,
          blur: this.onBlur,
          input: this.onInput
        }
      })
    },
    generateLabel () {
      if (this.$slots['label'] || this.label) {
        return this.$createElement('label', { class: this.labelClasses, for: this.id }, [
          this.$slots['label'] ? this.$slots['label'] : this.label
        ])
      }
    },
    onClick (e) {
      if (!this.hasFocus) {
        this.$refs.input.focus()
      }
    },
    onFocus (e) {
      this.hasFocus = true
      this.$emit('focus', e)
    },
    onBlur (e) {
      this.hasFocus = false
      this.isSuccess = this.validate()
      this.$emit('blur', e)
    },
    onMouseDown (e) {
      if (e.target !== this.$refs.input) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    onKeyDown (e) {
      this.$emit('keydown', e)
    },
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    defineMask (mask) {
      if (!mask) {
        return false
      }
      let data = {}
      switch (mask) {
        case 'phone':
          mask = '+7 (999) 999-99-99'
          break
        case 'money':
          mask = 'currency'
          data = {
            groupSeparator: ' ',
            radixPoint: ',',
            autoGroup: true,
            digits: 2,
            prefix: '',
            suffix: ' ₽',
            rightAlign: false
          }
      }
      data['jitMasking'] = true;
      (new Inputmask(mask, data)).mask(this.$refs.input)
    }
  },
  mounted () {
    this.defineMask(this.mask)
  }
}
