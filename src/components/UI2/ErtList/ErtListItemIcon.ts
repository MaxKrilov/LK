import Vue, { VNode } from 'vue'

export default Vue.extend({
  name: 'ert-list-item-icon',
  functional: true,
  render (h, { data, children }): VNode {
    data.staticClass = (`ert-list-item__icon ${data.staticClass || ''}`).trim()

    return h('div', data, children)
  }
})
