import { mapGetters, mapActions } from 'vuex'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import LPRContactForm from '../LPRContactForm'
import ContactsList from './components/ContactsList'
import { cloneDeep } from 'lodash'

const PAG_VISIBLE_ITEMS = 3

export default {
  name: 'contacts-section',
  components: {
    'lpr-contact-form': LPRContactForm,
    ContactsList
  },
  mixins: [ResponsiveMixin],
  data: () => {
    return {
      pre: 'contacts-section',
      isOpenContactForm: false,
      isOpenTitleHint: false,
      isOpenTitlePopupHint: false,
      isEditContactOpen: false,
      hasError: false,
      pagCurrentPage: 1,
      contactsList: []
    }
  },
  computed: {
    ...mapGetters('contacts', ['filteredContactsByName', 'getCreatedContactState']),
    isMobile () {
      return this.isXS || this.isSM
    },
    pagLength () {
      return Math.ceil(this.contactsList.length / PAG_VISIBLE_ITEMS) || 0
    },
    pagData () {
      const start = (this.pagCurrentPage - 1) * PAG_VISIBLE_ITEMS
      const end = start + PAG_VISIBLE_ITEMS
      return this.contactsList.slice(start, end)
    }
  },
  methods: {
    ...mapActions('contacts', ['resetCurrentClientContacts', 'resetCreatedContactState']),
    handleEditContactOpen (e) {
      this.isEditContactOpen = e === 'open'
      this.isOpenContactForm = false
    },
    handleClickAddContact () {
      this.resetCurrentClientContacts()
      this.isOpenContactForm = !this.isOpenContactForm
    },
    handleTitlePopup (state = 'open') {
      this.isOpenTitlePopupHint = state === 'open'
    },
    handleErrorPopup (state = 'open') {
      this.hasError = state === 'open'
      if (!this.hasError) {
        this.resetCreatedContactState()
      }
    }
  },
  watch: {
    filteredContactsByName: {
      immediate: true,
      handler (val, prevVal) {
        if (val && val !== prevVal) {
          this.contactsList = cloneDeep(val)
        }
      }
    },
    getCreatedContactState (val) {
      if (val.error) {
        this.hasError = true
      }
    }
  }
}
