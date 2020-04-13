
export default {
  name: 'edit-company-success',
  data: () => ({
    pre: 'edit-company-success'
  }),
  methods: {
    onReturnToProfile () {
      this.$router.push({ name: 'profile' })
    }
  }
}
