export default {
  name: 'remove-account',
  data: () => ({
    pre: 'remove-account'
  }),
  props: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    isFetching: { type: String, default: '' },
    error: { type: String, default: '' },
    value: { type: null }
  },
  methods: {
    onRemove () {
      this.$emit('remove')
    },
    onCancel () {
      this.$emit('cancel')
    }
  },
  computed: {
  }
}
