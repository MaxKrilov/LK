import './ErtListItemGroup.scss'

import { ErtItemGroupBase } from '@/components/UI2/ErtItemGroup/ErtItemGroup'

import Component, { mixins } from 'vue-class-component'

@Component({
  provide () {
    return {
      isInGroup: true,
      listItemGroup: this
    }
  }
})
export default class ErtListItemGroup extends mixins(ErtItemGroupBase) {
  // Computed
  get classes (): object {
    return {
      ...ErtItemGroupBase.options.computed.classes.get.call(this),
      'ert-list-item-group': true
    }
  }

  // Methods
  genData (): object {
    return {
      ...ErtItemGroupBase.options.methods.genData.call(this),
      attrs: {
        role: 'listbox'
      }
    }
  }
}
