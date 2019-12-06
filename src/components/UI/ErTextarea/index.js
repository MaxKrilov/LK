import './_style.scss'

import ErTextField from '../ErTextField'

export default {
  name: 'er-textarea',
  mixins: [ ErTextField ],
  data: () => ({
    pre: 'er-textarea'
  }),
  props: {
    rows: Number,
    autoHeight: Boolean
  },
  watch: {
    autoHeight (val) {
      val
        ? this.defineHeightTextarea()
        : this.undefineHeightTextarea()
    }
  },
  methods: {
    defineHeightTextarea () {
      const textarea = this.$refs.input
      const offset = textarea.offsetHeight - textarea.clientHeight
      textarea.style.height = 'auto'
      textarea.style.height = `${this.$refs.input.scrollHeight + offset}px`
    },
    undefineHeightTextarea () {
      this.$refs.input.removeAttribute('style')
    },
    onInput (e) {
      if (this.autoHeight) {
        this.defineHeightTextarea()
      }
      ErTextField.methods.onInput.apply(this, [e])
    },
    onKeyup () {
      if (this.autoHeight) {
        this.defineHeightTextarea()
      }
    },
    generateInput () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__wrapper`,
        directives: [
          {
            name: 'bar',
            rawName: 'v-bar'
          }
        ]
      }, [
        this.$createElement('textarea', {
          attrs: {
            rows: this.rows,
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
            input: this.onInput,
            keyup: this.onKeyup
          }
        })
      ])
    }
  },
  mounted () {
    if (this.autoHeight) {
      this.defineHeightTextarea()
    }
  }
}
