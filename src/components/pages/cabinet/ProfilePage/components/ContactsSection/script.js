import { mapActions, mapGetters, mapState } from 'vuex'
import {
  contactTableColumnsMobile,
  contactTableColumnsTablet,
  contactTableColumnsDesktop
} from './columns'
import { BREAKPOINT_MD, BREAKPOINT_LG } from '@/constants/breakpoint'
import { USER_ROLES, ACCESS_ROLE_LIST } from '@/store/mock/profile'
import { lengthVar } from '@/functions/helper'
import ContactDetails from './components/ContactDetails'
import ContactForm from '../ContactForm'
import ProfileTable from '../ProfileTable'
import SearchField from '../SearchField'
import Alert from '../Alert'

export default {
  name: 'contacts-section',
  components: {
    SearchField,
    ContactDetails,
    ContactForm,
    ProfileTable,
    Alert
  },
  data: () => ({
    pre: 'contacts-section',
    isQuestionOpen: false,
    contactTableColumnsMobile,
    contactTableColumnsTablet,
    contactTableColumnsDesktop,
    expandedContact: null,
    windowWidth: null,
    isShowContactForm: false,
    alertMessage: null,
    expandedContactAlert: null,
    requestStatus: {
      type: '',
      message: '',
      id: null
    },
    dialogInfoText: 'Вы можете добавить контакты сотрудников, чтобы они были в курсе Ваших сервисов Дом.ru Бизнес'
  }),
  async created () {
    await this.fetchRolesDirectory({ api: this.$api })
    this.handleResize()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })
  },
  destroy () {
    window.removeEventListener('resize', this.handleResize)
    this.resetProfileContacts()
  },
  methods: {
    ...mapActions('contacts', [
      'resetProfileContacts',
      'searchProfileContacts',
      'createUserLpr',
      'setModalInfoVisibility'
    ]),
    ...mapActions('directories', [
      'fetchRolesDirectory',
      'fetchSystemsDirectory'
    ]),
    handleSearch ({ query }) {
      this.searchProfileContacts({ query })
    },
    handleContactDetails ({ item }) {
      // TODO
    },
    handleAddNewContactClick () {
      this.isShowContactForm = true
    },
    handleSuccessForm (val) {
      let delay = 600
      if (!this.isCurrentBreakpoint('sm')) {
        this.requestStatus = {
          type: val.type,
          message: val.msg,
          id: val.id
        }
        if (val.type === 'error') {
          delay = 3000
        }
      } else {
        this.setModalInfoVisibility({ type: val.type, isOpen: true, msg: val.msg })
      }

      setTimeout(() => {
        this.getProfileContacts({ api: this.$api })
      }, delay)

      setTimeout(() => {
        this.clearTableAlert()
      }, 3000)

      this.isShowContactForm = false
      this.expandedContact = null
    },
    handleFailForm (val) {
      if (!this.isCurrentBreakpoint('sm')) {
        this.requestStatus = {
          type: 'error',
          message: val.msg,
          id: val.id
        }
      } else {
        this.setModalInfoVisibility({ type: 'error', isOpen: true, msg: val.msg })
      }

      this.isShowContactForm = false
      this.expandedContact = null

      setTimeout(() => {
        this.clearTableAlert()
      }, 3000)
    },
    handleCancelForm () {
      this.isShowContactForm = false
      this.expandedContact = null
    },
    realmRole (roleName) {
      return USER_ROLES[roleName]?.label || roleName
    },
    systemRole (systemRoleName) {
      return ACCESS_ROLE_LIST[systemRoleName]?.label || systemRoleName
    },
    handleResize () {
      this.windowWidth = window.innerWidth
    },
    isCurrentBreakpoint (bp) {
      switch (bp) {
        case 'sm':
          return this.windowWidth < BREAKPOINT_MD
        case 'md':
          return this.windowWidth >= BREAKPOINT_MD && this.windowWidth < BREAKPOINT_LG
        case 'lg':
          return this.windowWidth >= BREAKPOINT_LG
        default:
          return false
      }
    },
    openInfoModal () {
      this.setModalInfoVisibility({ type: 'info', isOpen: true, msg: this.dialogInfoText })
    },
    openPreferHint () {

    },
    clearTableAlert () {
      this.requestStatus = {
        type: '',
        message: '',
        id: null
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'isLPR']),
    ...mapGetters('user', ['getClientInfo']),
    ...mapState('contacts', [
      'sortField',
      'sortAsc',
      'error',
      'isFetching',
      'isFetched'
    ]),
    ...mapGetters('contacts', [
      'filteredContactsByName',
      'isDeletableUser',
      'getResourceAccessLabels'
    ]),
    ...mapGetters('directories', [
      'rolesDirectory',
      'systemsDirectory'
    ]),
    countRows () {
      return lengthVar(this.filteredContactsByName)
    },
    preLoadingStyles () {
      return this.isFetching ? `${this.pre}__table--loading` : ''
    }
  },
  watch: {
    expandedContact (val) {
      if (val) {
        this.requestStatus = {
          type: '',
          message: '',
          id: null
        }
      }
    }
  }
}
