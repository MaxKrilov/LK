import { mapMutations, mapState } from 'vuex'

export default {
  name: 'person-card',
  props: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    roles: { type: String, default: '' },
    canEdit: { type: Boolean, default: false }
  },
  data: () => ({
    pre: 'person-card'
  }),
  methods: {
    ...mapMutations('modal', ['setModalVisibility', 'resetChangePassword']),
    handleOpenPasswordChange () {
      this.setModalVisibility(true)
      this.resetChangePassword()
    }
  },
  computed: {
    ...mapState({
      isPasswordChanged: state => state.modal.isFetched,
      message: state => state.modal.message,
      isManager: state => state.auth.isManager
    }),
    roleText () {
      return this.roles
    },
    hasMessage () {
      return this.message && Object.entries(this.message).length > 0
    }
  },
  // очистить все сообщения страницы после её покидания
  beforeDestroy () {
    this.resetChangePassword()
  }
}
