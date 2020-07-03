import ErDialog from '@/components/UI/ErDialog'
import OverlayableMixin from './OverlayableMixin'
import ErDependentMixin from '@/mixins/ErDependentMixin'
import ErDetachableMixin from '@/mixins/ErDetachableMixin'
import ErReturnableMixin from '@/mixins/ErReturnableMixin'
import ErStackableMixin from '@/mixins/ErStackableMixin'
import ErToggleableMixin from '@/mixins/ErToggleableMixin'

export default {
  ...ErDialog,
  name: 'wifi-analytics-user-dialog',
  mixins: [
    ErDependentMixin,
    ErDetachableMixin,
    OverlayableMixin,
    ErReturnableMixin,
    ErStackableMixin,
    ErToggleableMixin
  ]
}
