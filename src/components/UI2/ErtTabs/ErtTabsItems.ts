import ErtWindow from '@/components/UI2/ErtWindow/ErtWindow'

import { ErtItemGroupBase, GroupableInstance } from '@/components/UI2/ErtItemGroup/ErtItemGroup'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class ErtTabsItems extends ErtWindow {
  /// Props
  @Prop({ type: Boolean })
  readonly mandatory!: boolean

  /// Computed
  get classes (): object {
    return {
      ...ErtWindow.options.computed.classes.get.call(this),
      'ert-tabs-items': true
    }
  }

  /// Methods
  getValue (item: GroupableInstance, i: number) {
    return item.id || ErtItemGroupBase.options.methods.getValue.call(this, item, i)
  }
}
