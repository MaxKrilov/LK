import './_style.scss'

import ErDetachableMixin from '@/mixins/ErDetachableMixin'

export default {
  name: 'er-overlays',
  mixins: [ ErDetachableMixin ],
  data: () => ({
    pre: 'er-overlays'
  }),
  props: {
    absolute: Boolean,
    value: null,
    zIndex: {
      type: [Number, String],
      default: 5
    },
    closeOnContent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
  },
  render (h) {
    return h('div', {
      staticClass: `${this.pre}`
    }, [
      h('div', {
        staticClass: `${this.pre}__content`,
        class: {
          'visible': this.value
        },
        style: {
          zIndex: this.zIndex
        },
        ref: 'content',
        on: {
          click: () => {
            this.closeOnContent && this.$emit('input', false)
          }
        }
      })
    ])
  }
}
