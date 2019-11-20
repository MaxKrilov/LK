import Validators from '@/mixins/ValidatorsMixin'
import Responsive from '@/mixins/ResponsiveMixin'

export default {
  name: 'edit-section',
  data: () => ({
    pre: 'edit-section'
  }),
  mixins: [ Validators, Responsive ],
  props: {
    value: { type: null },
    isUpdate: {
      type: Boolean,
      default: false
    }
  }
}
