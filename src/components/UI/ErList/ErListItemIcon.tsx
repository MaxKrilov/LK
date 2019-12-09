import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, VNodeData, VNode } from 'vue'

// @ts-ignore
@Component({
  functional: true
})
export default class ErListItemIcon extends Vue {
  render (h: CreateElement, { data, children }): VNode {
    data.staticClass = (`er-list-item__icon ${data.staticClass || ''}`).trim()
    return h('div', data, children)
  }
}
