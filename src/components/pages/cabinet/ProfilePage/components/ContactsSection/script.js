import { mapGetters, mapActions, mapState } from 'vuex'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import LPRContactForm from '../LPRContactForm'
import ContactsList from './components/ContactsList'
import { cloneDeep } from 'lodash'
import { getNoun } from '@/functions/helper'

const PAG_VISIBLE_ITEMS = 10

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
      hasError: {
        state: false,
        message: null
      },
      pagCurrentPage: 1,
      contactsList: [],
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters('contacts', ['filteredContactsByName', 'getCreatedContactState']),
    ...mapState('contacts', ['deleteContactState']),
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
    },
    showContactsTotalNum () {
      const num = this.contactsList.length
      return `Всего: ${num} ${getNoun(num, 'контакт', 'контакты', 'контактов')}`
    }
  },
  methods: {
    ...mapActions('contacts', [
      'resetCurrentClientContacts',
      'resetCreatedContactState',
      'searchContactsByName'
    ]),
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
      this.hasError.state = state === 'open'
      if (!this.hasError.state) {
        this.hasError.message = null
      }
    },
    async handleSearch (query) {
      if (query && query.length >= 3) {
        let searchResult = await this.searchContactsByName(query)
        if (searchResult.length) {
          this.contactsList = searchResult
        }
      } else {
        this.contactsList = await this.searchContactsByName()
      }
    }
  },
  watch: {
    filteredContactsByName: {
      immediate: true,
      handler (val) {
        if (val) {
          this.contactsList = cloneDeep(val)
        }
      }
    },
    getCreatedContactState (val) {
      if (val.error) {
        this.hasError.state = true
        this.hasError.message = val.error
      }
    },
    deleteContactState: {
      deep: true,
      handler (val) {
        if (val.error) {
          this.hasError.state = true
          this.hasError.message = val.error
        }
      }
    }
  }
}
