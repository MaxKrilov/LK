import { mapActions, mapState } from 'vuex'

export default {
  name: 'accounts-info',
  data: () => ({
    pre: 'accounts-info'
  }),
  methods: {
    ...mapActions('accounts', [
      'setModalInfoVisibility'
    ]),
    close () {
      this.setModalInfoVisibility({ isOpen: false })
    }
  },
  computed: {
    ...mapState('accounts', {
      isModalVisible: (state) => state.modalAccountsInfo.isOpen,
      modalType: (state) => state.modalAccountsInfo.type,
      modalMsg: (state) => state.modalAccountsInfo.msg
    })
  }
}
