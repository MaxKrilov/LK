import { kebabCase } from '../functions/helper'

export default {
  methods: {
    genPickerButton (prop, value, content, readonly = false, staticClass = '') {
      const active = this[prop] === value
      const click = e => {
        e.stopPropagation()
        this.$emit(`update:${kebabCase(prop)}`, value)
      }
      return this.$createElement('div', {
        staticClass: `er-picker__title__btn ${staticClass}`.trim(),
        class: {
          'er-picker__title__btn--active': active,
          'er-picker__title__btn--readonly': readonly
        },
        on: (active || readonly) ? undefined : { click }
      }, Array.isArray(content) ? content : [content])
    }
  }
}
