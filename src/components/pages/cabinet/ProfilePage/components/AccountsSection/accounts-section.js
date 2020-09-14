import { mapActions, mapGetters, mapState } from 'vuex'
import {
  accountTableColumnsMobile,
  accountTableColumnsTablet,
  accountTableColumnsDesktop
} from './columns'
import { BREAKPOINT_MD, BREAKPOINT_LG } from '@/constants/breakpoint'
import { USER_ROLES, ACCESS_ROLE_LIST } from '@/store/mock/profile'
import { lengthVar } from '@/functions/helper'
import AccountDetails from './components/AccountDetails'
import AccountForm from '../AccountForm'
import ProfileTable from '../ProfileTable'
import SearchField from '../SearchField'
import Alert from '../Alert'

export default {
  name: 'accounts-section',
  components: {
    SearchField,
    AccountDetails,
    AccountForm,
    ProfileTable,
    Alert
  },
  data: () => ({
    pre: 'accounts-section',
    isQuestionOpen: false,
    accountTableColumnsMobile,
    accountTableColumnsTablet,
    accountTableColumnsDesktop,
    expandedAccount: null,
    windowWidth: null,
    isShowAccountForm: false,
    alertMessage: null,
    expandedAccountAlert: null,
    requestStatus: {
      type: '',
      message: '',
      id: null
    },
    dialogInfoText: 'Учетные записи дают доступ в Личный кабинет Дом.ru Бизнес и в другие порталы'
  }),
  async created () {
    await this.fetchRolesDirectory({ api: this.$api })
    await this.fetchSystemsDirectory({ api: this.$api })
    this.getProfileAccounts({ api: this.$api })
    this.handleResize()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })
  },
  destroy () {
    window.removeEventListener('resize', this.handleResize)
    this.resetProfileAccounts()
  },
  methods: {
    ...mapActions('accounts', [
      'getProfileAccounts',
      'resetProfileAccounts',
      'searchProfileAccounts',
      'createUserLpr',
      'setModalInfoVisibility'
    ]),
    ...mapActions('directories', [
      'fetchRolesDirectory',
      'fetchSystemsDirectory'
    ]),
    handleSearch ({ query }) {
      this.searchProfileAccounts({ query })
    },
    handleAccountDetails ({ item }) {
      if (this.expandedAccount === item.userPostId) {
        this.expandedAccount = null
        return false
      }
      this.expandedAccount = item.userPostId
    },
    handleAddNewAccountClick () {
      this.isShowAccountForm = true
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
        this.getProfileAccounts({ api: this.$api })
      }, delay)

      setTimeout(() => {
        this.clearTableAlert()
      }, 3000)

      this.isShowAccountForm = false
      this.expandedAccount = null
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

      this.isShowAccountForm = false
      this.expandedAccount = null

      setTimeout(() => {
        this.clearTableAlert()
      }, 3000)
    },
    handleCancelForm () {
      this.isShowAccountForm = false
      this.expandedAccount = null
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
    clearTableAlert () {
      this.requestStatus = {
        type: '',
        message: '',
        id: null
      }
    }
  },
  computed: {
    ...mapState('accounts', [
      'usersInfo',
      'sortField',
      'sortAsc',
      'error',
      'isFetching',
      'isFetched'
    ]),
    ...mapGetters('accounts', [
      'filteredAccountsByName',
      'isDeletableUser',
      'getResourceAccessLabels'
    ]),
    ...mapGetters('directories', [
      'rolesDirectory',
      'systemsDirectory'
    ]),
    countRows () {
      return lengthVar(this.filteredAccountsByName)
    },
    preLoadingStyles () {
      return this.isFetching ? `${this.pre}__table--loading` : ''
    }
  },
  watch: {
    expandedAccount (val) {
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
