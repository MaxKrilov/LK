import './_style.scss'

import Vue, { CreateElement, VNode } from 'vue'

export default Vue.extend({
  name: 'er-skeleton-loader',
  props: {
    active: Boolean
  },
  methods: {
    genLoader (): VNode {
      return this.$createElement('div', {
        staticClass: 'er-skeleton-loader__loader'
      })
    }
  },
  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'er-skeleton-loader'
    }, [
      this.genLoader(),
      this.$slots.default
    ])
  }
})
