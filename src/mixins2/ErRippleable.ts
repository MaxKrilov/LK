import ripple from '@/directives/ripple'

import Vue, { VNode, VNodeData, VNodeDirective } from 'vue'
import Component from 'vue-class-component'

const props = {
  ripple: {
    type: [Boolean, Object],
    default: true
  }
}

@Component({
  directives: { ripple },
  props
})
export default class ErRippleable extends Vue {
  // Props
  readonly ripple!: boolean | Dictionary<any>

  // Methods
  genRipple (data: VNodeData = {}): VNode | null {
    if (!this.ripple) return null

    data.staticClass = 'ert-input--selection-controls__ripple'

    data.directives = data.directives || []
    data.directives.push({
      name: 'ripple',
      value: { center: true }
    } as VNodeDirective)

    return this.$createElement('div', data)
  }
}
