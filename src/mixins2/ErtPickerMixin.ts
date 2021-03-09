import ErtPicker from '@/components/UI2/ErtPicker'

import Vue, { VNode } from 'vue'
import Component from 'vue-class-component'

const props = {
  flat: Boolean,
  fullWidth: Boolean,
  landscape: Boolean,
  noTitle: Boolean,
  width: {
    type: [Number, String],
    default: 290
  }
}

@Component({ props })
export default class ErtPickerMixin extends Vue {
  // Props
  readonly flat!: boolean
  readonly fullWidth!: boolean
  readonly landscape!: boolean
  readonly noTitle!: boolean
  readonly width!: number | string

  // Methods
  genPickerTitle (): VNode | null {
    return null
  }
  genPickerBody (): VNode | null {
    return null
  }
  genPickerActionsSlot () {
    return this.$scopedSlots.default
      ? this.$scopedSlots.default({
        save: (this as any).save,
        cancel: (this as any).cancel
      })
      : this.$slots.default
  }
  genPicker (staticClass: string) {
    const children: VNode[] = []

    if (!this.noTitle) {
      const title = this.genPickerTitle()
      title && children.push(title)
    }

    const body = this.genPickerBody()
    body && children.push(body)

    children.push(this.$createElement('template', { slot: 'actions' }, [this.genPickerActionsSlot]))

    return this.$createElement(ErtPicker, {
      staticClass,
      props: {
        flat: this.flat,
        fullWidth: this.fullWidth,
        landscape: this.landscape,
        width: this.width,
        noTitle: this.noTitle
      }
    }, children)
  }
}
