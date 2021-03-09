import Vue, { VNodeChildren } from 'vue'
import Component from 'vue-class-component'
import { kebabCase } from '@/functions/helper2'

@Component
export default class ErtPickerButton extends Vue {
  // Methods
  genPickerButton (
    prop: string,
    value: any,
    content: VNodeChildren,
    readonly = false,
    staticClass = ''
  ) {
    const active = (this as any)[prop] === value
    const click = (e: Event) => {
      e.stopPropagation()
      this.$emit(`update:${kebabCase(prop)}`, value)
    }

    return this.$createElement('div', {
      staticClass: `ert-picker__title__btn ${staticClass}`.trim(),
      class: {
        'ert-picker__title__btn--active': active,
        'ert-picker__title__btn--readonly': readonly
      },
      on: (active || readonly) ? undefined : { click }
    }, Array.isArray(content) ? content : [content])
  }
}
