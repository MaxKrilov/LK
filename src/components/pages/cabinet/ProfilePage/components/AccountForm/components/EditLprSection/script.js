import Validators from '@/mixins/ValidatorsMixin'
import Responsive from '@/mixins/ResponsiveMixin'

export default {
  name: 'edit-lpr-section',
  data: () => ({
    pre: 'edit-lpr-section',
    isSimilarAccount: false,
    windowWidth: 0
  }),
  mixins: [ Validators, Responsive ],
  props: {
    value: { type: null },
    isChanged: { type: Boolean, default: false },
    isAdding: { type: Boolean, default: false },
    isLPR: { type: Boolean, default: false }
  },
  methods: {
    handleToggle (e) {
      this.isSimilarAccount = !this.isSimilarAccount
    }
  }
}
