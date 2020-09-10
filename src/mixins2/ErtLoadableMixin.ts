import Vue, { VNode } from 'vue'
import Component from 'vue-class-component'
import ErtProgressLinear from '@/components/UI2/ErtProgressLinear'

const props = {
  loading: {
    type: [Boolean, String],
    default: false
  },
  loaderHeight: {
    type: [Number, String],
    default: 2
  }
}

@Component({ props })
export default class ErtLoadableMixin extends Vue {
  // Props
  readonly loading!: boolean | string
  readonly loaderHeight!: number | string

  // Methods
  genProgress (): VNode | VNode[] | null {
    if (this.loading === false) return null

    return this.$slots.progress || this.$createElement(ErtProgressLinear, {
      props: {
        absolute: true,
        height: this.loaderHeight,
        indeterminate: true
      }
    })
  }
}
