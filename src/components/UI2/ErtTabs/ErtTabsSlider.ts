import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'

@Component
export default class ErtTabsSlider extends Vue {
  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-tabs-slider'
    })
  }
}
