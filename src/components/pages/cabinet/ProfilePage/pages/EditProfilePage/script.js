import { mapGetters } from 'vuex'
import AccountForm from '../../components/AccountForm/index'
import ContactForm from '../../components/ContactForm/index'

export default {
  name: 'edit-profile-page',
  components: {
    AccountForm,
    ContactForm
  },
  data: () => ({
    pre: 'edit-profile-page'
  }),
  methods: {
    handleEventForm () {
      this.$nextTick(() => {
        this.$router.push({ name: 'profile' })
      })
    },
    handleSaveProfileClick () {
      this.$nextTick(() => {
        this.$router.push({ name: 'profile' })
      })
    }
  },
  computed: {
    ...mapGetters('auth', [
      'isLPR',
      'hasAccess',
      'user',
      'userResourceAccess',
      'serverErrorMessage'
    ]),
    ...mapGetters('contacts', ['getCurrentClientContacts']),
    computedLastname () {
      return this.user.lastName ||
        this.user.givenName?.split(' ')?.[0] ||
        ''
    },
    computedFirstName () {
      return this.user.firstName ||
        this.user.givenName?.split(' ')?.[1] ||
        ''
    },
    computedMiddleName () {
      return this.user.middleName ||
        this.user.givenName?.split(' ')?.[2] ||
        ''
    }
  }
}
