import { mapActions } from 'vuex'
import Validators from '@/mixins/ValidatorsMixin'
import Responsive from '@/mixins/ResponsiveMixin'
import EditField from '../EditField'
import { toDefaultPhoneNumber, formatPhoneNumber } from '@/functions/helper'

export default {
  name: 'edit-contact-section',
  components: {
    EditField
  },
  data: () => ({
    pre: 'edit-contact-section',
    value: {
      emails: '',
      phones: ''
    }
  }),
  mixins: [ Validators, Responsive ],
  props: {
    data: { type: Object },
    isContactsChanged: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('contacts', ['updateCurrentClientContacts']),
    setPrefer (id) {
      this.updateCurrentClientContacts({ preferredContactMethodId: id })
    },
    addContact (val, type) {
      const isValid = this.$refs[type] && this.$refs[type].validate()
      const { data, updateCurrentClientContacts } = this
      if (val && isValid) {
        switch (type) {
          case 'phones':
            val = formatPhoneNumber(toDefaultPhoneNumber(val))
            updateCurrentClientContacts({ phones: [...data.phones, { value: val }] })
            break
          case 'emails':
            updateCurrentClientContacts({ emails: [...data.emails, { value: val }] })
            break
          default:
            break
        }
        this.value[type] = ''
      }
    },
    removeContact (arrayIdx, type) {
      const { data, updateCurrentClientContacts } = this
      const upd = [...data[type]]
      upd.splice(arrayIdx, 1)
      updateCurrentClientContacts({ [type]: upd })
    }
  }
}
