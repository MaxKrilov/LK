import './style.scss'

import { VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'

import ErBindAttrs from '@/mixins2/ErBindAttrs'
import ErtColorableMixin from '@/mixins2/ErtColorableMixin'
import ErtShadowMixin from '@/mixins2/ErtShadowMixin'
import ErtMeasurableMixin from '@/mixins2/ErtMeasurableMixin'
import ErtRoundableMixin from '@/mixins2/ErtRoundableMixin'
import { CreateElement } from 'vue/types'

const baseMixins = mixins(
  ErBindAttrs,
  ErtColorableMixin,
  ErtShadowMixin,
  ErtMeasurableMixin,
  ErtRoundableMixin
)

@Component({
  props: {
    outlined: Boolean,
    shaped: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  }
})
class ErtSheet extends baseMixins {
  // Props
  readonly outlined!: boolean
  readonly shaped!: boolean
  readonly tag!: string

  // Computed
  get classes (): object {
    return {
      'ert-sheet': true,
      'ert-sheet--outlined': this.outlined,
      'ert-sheet--shaped': this.shaped,
      ...this.shadowClasses,
      ...this.roundedClasses
    }
  }

  get styles () {
    return {
      ...this.measurableStyles
    }
  }

  render (h: CreateElement): VNode {
    const data = {
      class: this.classes,
      style: this.styles,
      on: this.listeners$
    }

    return h(
      this.tag,
      this.setBackgroundColor(this.color, data),
      this.$slots.default
    )
  }
}

export { ErtSheet }
export default ErtSheet
