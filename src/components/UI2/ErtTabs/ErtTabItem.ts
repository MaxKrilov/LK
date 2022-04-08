import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ErtWindowItem from '@/components/UI2/ErtWindow/ErtWindowItem'

@Component
export default class ErtTabItem extends ErtWindowItem {
  /// Props
  @Prop({ type: String })
  readonly id!: string

  /// Methods
  genWindowItem () {
    const item = ErtWindowItem.options.methods.genWindowItem.call(this)

    item.data!.domProps = item.data!.domProps || {}
    item.data!.domProps.id = this.id || this.value

    return item
  }
}
