import { mapActions, mapGetters } from 'vuex'
import ProfileTable from '@/components/pages/cabinet/ProfilePage/components/ProfileTable/'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ContactsListItem from './components/Item'
import LPRContactForm from '../../../LPRContactForm'
import columns, { tablet, desktop } from './columns'

export default {
  name: 'contacts-list',
  mixins: [ResponsiveMixin],
  props: {
    contactsList: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    ProfileTable,
    ContactsListItem,
    'lpr-contact-form': LPRContactForm
  },
  data: () => ({
    pre: 'contacts-list',
    expandedId: null
  }),
  computed: {
    ...mapGetters('user', ['getPrimaryContact']),
    isMobile () {
      return this.isXS || this.isSM
    },
    listColumns () {
      let result = columns
      if (this.isMD) {
        result = [...columns, ...tablet]
      }
      if (this.isLG) {
        result = [...columns, ...tablet, ...desktop]
      }
      return result
    },
    showListAmount () {
      return this.isLG
    }
  },
  methods: {
    ...mapActions('contacts', ['setCurrentClientContacts']),
    handleExpandContact (contactId) {
      if (contactId) {
        const { id } = contactId.item
        this.expandedId = this.expandedId === id ? null : id
        this.setCurrentClientContacts({ contactId: id })
        const isExpand = this.expandedId ? 'open' : 'close'
        this.$emit('editContactOpen', isExpand)
      } else {
        this.expandedId = null
        this.$emit('editContactOpen', 'close')
      }
    }
  }
}
