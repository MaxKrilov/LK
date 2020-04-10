import { mapActions, mapState } from 'vuex'

export default {
  name: 'contacts-info',
  data: () => ({
    pre: 'contacts-info'
  }),
  methods: {
    ...mapActions('contacts', [
      'setModalInfoVisibility'
    ]),
    close () {
      this.setModalInfoVisibility({ isOpen: false })
    }
  },
  computed: {
    ...mapState('contacts', {
      isModalVisible: (state) => state.modalContactsInfo.isOpen,
      modalType: (state) => state.modalContactsInfo.type,
      modalMsg: (state) => state.modalContactsInfo.msg
    })
  }
}
