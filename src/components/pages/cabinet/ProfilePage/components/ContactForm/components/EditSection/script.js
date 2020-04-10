import Validators from '@/mixins/ValidatorsMixin'
import Responsive from '@/mixins/ResponsiveMixin'
import EditField from '../EditField'

export default {
  name: 'edit-section',
  components: {
    EditField
  },
  data: () => ({
    pre: 'edit-section',
    editablePhone: '',
    editableEmail: '',
    chosenAssignRight: ''
  }),
  mixins: [ Validators, Responsive ],
  props: {
    value: { type: null },
    isUpdate: {
      type: Boolean,
      default: false
    },
    isLastNameChanged: { type: Boolean, default: false },
    isFirstNameChanged: { type: Boolean, default: false },
    isMiddleNameChanged: { type: Boolean, default: false },
    isPhonesChanged: { type: Boolean, default: false },
    isEmailsChanged: { type: Boolean, default: false },
    isRolesChanged: { type: Boolean, default: false }
  }
}
