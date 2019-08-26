import './_style.scss'

import ErTextField from '../ErTextField'

export default {
  name: 'er-textarea',
  mixins: [ ErTextField ],
  data: () => ({
    pre: 'er-textarea'
  }),
  props: {
  },
  methods: {
    generateInput () {
      return this.$createElement('textarea', {
        attrs: {
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
    }
  }
}
