import './style.scss'

import ErSelectable from '@/mixins2/ErSelectable'
import ErtInput from '@/components/UI2/ErtInput'

import Touch from '@/directives/touch'

import { ErtFabTransition } from '@/functions/transitions'
import ErtProgressCircular from '@/components/UI2/ErtProgressCircular'
import ErtIcon from '@/components/UI2/ErtIcon'

import { keyCode as keyCodes } from '@/functions/keyCode'

import { VNode, VNodeData } from 'vue'
import Component, { mixins } from 'vue-class-component'

const directives = { Touch }

const props = {
  loading: {
    type: Boolean,
    default: false
  }
}

@Component({
  directives,
  props
})
class ErtSwitch extends mixins(ErSelectable) {
  // Props
  readonly loading!: boolean

  // Computed
  get classes (): object {
    return {
      ...ErtInput.options.computed.classes.get.call(this),
      'ert-input--selection--controls': true,
      'ert-input--switch': true
    }
  }
  get attrs (): object {
    return {
      'aria-checked': String(this.isActive),
      'aria-disabled': String(this.isDisabled),
      role: 'switch'
    }
  }
  get validationState (): string | undefined {
    if (this.hasError && this.shouldValidate) return 'error'
    if (this.hasSuccess) return 'success'
    return undefined
  }
  get switchData (): VNodeData {
    return {}
  }

  // Methods
  genDefaultSlot (): (VNode | null)[] {
    return [
      this.genSwitch(),
      this.genLabel()
    ]
  }
  genSwitch (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-input--selection-controls__input'
    }, [
      this.genInput('checkbox', {
        ...this.attrs,
        ...this.attrs$
      }),
      this.genRipple({
        directives: [{
          name: 'touch',
          value: {
            left: this.onSwipeLeft,
            right: this.onSwipeRight
          }
        }]
      }),
      this.$createElement('div', {
        staticClass: 'ert-input--switch__track',
        ...this.switchData
      }),
      this.$createElement('div', {
        staticClass: 'ert-input--switch__thumb',
        ...this.switchData
      }, [this.genThumb()])
    ])
  }
  genProgress (): VNode | VNode[] {
    return this.$slots.progress || this.$createElement(ErtProgressCircular, {
      props: {
        size: 16,
        width: 2,
        indeterminate: true
      }
    })
  }
  genThumb () {
    return this.$createElement('div', {
      staticClass: 'ert-input--switch__thumb--inner'
    }, [
      this.$createElement(ErtFabTransition, {}, [
        this.loading !== false
          ? this.genProgress()
          : this.$createElement(ErtIcon, {
            props: {
              name: this.isActive ? 'ok' : 'close',
              small: true
            }
          })
      ])
    ])
  }
  onSwipeLeft () {
    this.isActive && this.onChange()
  }
  onSwipeRight () {
    !this.isActive && this.onChange()
  }
  onKeydown (e: KeyboardEvent) {
    if (
      (e.keyCode === keyCodes.DOM_VK_LEFT && this.isActive) ||
      (e.keyCode === keyCodes.DOM_VK_RIGHT && !this.isActive)
    ) this.onChange()
  }
}

export { ErtSwitch }
export default ErtSwitch
