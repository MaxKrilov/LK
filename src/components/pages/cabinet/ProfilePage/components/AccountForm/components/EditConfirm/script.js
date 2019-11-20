import { mapState } from 'vuex'

export default {
  name: 'edit-confirm',
  data: () => ({
    pre: 'edit-confirm'
  }),
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      this.$emit('save')
    }
  },
  computed: {
    ...mapState('accountForm', {
      isModalVisible: (state) => state.modal.isOpen,
      isFetching: (state) => state.modal.isFetching,
      error: (state) => state.modal.error
    })
  }
}
