import './style.scss'

import Vue, { VNode } from 'vue'
import { convertToUnit } from '@/functions/helper2'

const ErtLabel = Vue.extend({
  name: 'ert-label',
  functional: true,
  props: {
    absolute: Boolean,
    disabled: Boolean,
    focused: Boolean,
    for: String,
    left: {
      type: [Number, String],
      default: 0
    },
    right: {
      type: [Number, String],
      default: 'auto'
    },
    value: Boolean
  },
  render (h, ctx): VNode {
    const { children, listeners, props } = ctx
    const data = {
      staticClass: 'ert-label',
      class: {
        'ert-label--active': props.value,
        'ert-label--is-disabled': props.disabled
      },
      attrs: {
        for: props.for,
        'aria-hidden': !props.for
      },
      on: listeners,
      style: {
        left: convertToUnit(props.left),
        right: convertToUnit(props.right),
        position: props.absolute ? 'absolute' : 'relative'
      },
      ref: 'label'
    }

    return h('label', data, children)
  }
})

export { ErtLabel }
export default ErtLabel
