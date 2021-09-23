import './style.scss'
import '@/assets/scss/_selection-controls.scss'

import ErtIcon from '@/components/UI2/ErtIcon'
import ErtInput from '@/components/UI2/ErtInput'

import ErSelectable from '@/mixins2/ErSelectable'

import Component, { mixins } from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtCheckbox>>({})
class ErtCheckbox extends mixins(ErSelectable) {
  // Computed
  get classes (): object {
    return {
      ...ErtInput.options.computed.classes.get.call(this),
      'ert-input--selection-controls': true,
      'ert-input--checkbox': true
    }
  }

  // Methods
  genCheckbox () {
    return this.$createElement('div', {
      staticClass: 'ert-input--selection-controls__input'
    }, [
      this.genInput('checkbox', {
        ...this.attrs$,
        'aria-checked': this.isActive.toString()
      }),
      this.genThumb(),
      this.genRipple()
    ])
  }
  genThumb () {
    return this.$createElement('div', {
      staticClass: 'ert-input--checkbox__thumb'
    }, [
      this.$createElement('div', {
        staticClass: 'ert-input--checkbox__thumb--inner'
      }, !this.isActive
        ? []
        : [this.$createElement(ErtIcon, {
          props:
            { name: document.querySelector('.app')!.classList.contains('e-commerce') ? 'erth__check' : 'ok',
              small: true }
        })]
      )
    ])
  }
  genDefaultSlot () {
    return [
      this.genCheckbox(),
      this.genLabel()
    ]
  }
}

export { ErtCheckbox }
export default ErtCheckbox
