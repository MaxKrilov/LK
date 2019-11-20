import { mapGetters } from 'vuex'
import AccountForm from '../../components/AccountForm/index'

export default {
  name: 'edit-profile-page',
  components: {
    AccountForm
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
    ])
  }
}
