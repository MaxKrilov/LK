import { mapActions, mapGetters, mapState } from 'vuex'
import ProfileTable from '@/components/pages/cabinet/ProfilePage/components/ProfileTable/'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ContactsListItem from './components/Item'
import PreferMethodHint from './components/PreferMethodHint'
import LPRContactForm from '../../../LPRContactForm'
import columns, { tablet, desktop } from './columns'

export default {
  name: 'contacts-list',
  mixins: [ResponsiveMixin],
  props: {
    contactsList: {
      type: Array,
      default: () => ([])
    },
    contactsNum: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    ProfileTable,
    ContactsListItem,
    'prefer-hint': PreferMethodHint,
    'lpr-contact-form': LPRContactForm
  },
  data: () => ({
    pre: 'contacts-list',
    expandedId: null,
    isMobileEditContactOpen: false,
    preferHint: {
      open: false,
      pos: {}
    }
  }),
  computed: {
    ...mapGetters('auth', ['isLPR']),
    ...mapGetters('user', ['getPrimaryContact']),
    ...mapState('contacts', ['deleteContactState', 'createContactState']),
    stateClasses () {
      return {
        [`${this.pre}--deleted`]: this.deleteContactState.isFetched,
        [`${this.pre}--changed`]: this.createContactState.isFetched
      }
    },
    actionRowId () {
      return this.createContactState.id || this.deleteContactState.id
    },
    isMobile () {
      return this.isXS || this.isSM
    },
    isOpenEditContact () {
      return !this.isMobile || this.isMobileEditContactOpen
    },
    listColumns () {
      columns[0].showAmount = true
      let result = columns
      if (this.isMD) {
        result = [...columns, ...tablet]
      }
      if (this.isLG) {
        columns[0].showAmount = false
        result = [...columns, ...tablet, ...desktop]
      }
      return result
    }
  },
  methods: {
    ...mapActions('contacts', ['setCurrentClientContacts']),
    handlePreferHint (e) {
      if (e.type === 'mouseenter') {
        this.preferHint = {
          open: true,
          target: e.target
        }
      } else {
        this.preferHint.open = false
      }
    },
    handleMobileEditContact () {
      this.isMobileEditContactOpen = true
    },
    handleExpandContact (contactId) {
      if (!this.isLPR && this.isLG) {
        return false
      }
      if (contactId) {
        const { id } = contactId.item
        this.expandedId = this.expandedId === id ? null : id
        this.setCurrentClientContacts({ contactId: id })
        const isExpand = this.expandedId ? 'open' : 'close'
        this.$emit('editContactOpen', isExpand)
      } else {
        this.isMobileEditContactOpen = false
        this.expandedId = null
        this.$emit('editContactOpen', 'close')
      }
    }
  },
  watch: {
    deleteContactState: {
      deep: true,
      handler (val) {
        if (val.isFetched && !val.error) {
          this.handleExpandContact()
        }
      }
    }
  }
}
