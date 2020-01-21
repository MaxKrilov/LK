export default {
  name: 'promise-off',
  data: () => ({
    pre: 'promise-off',
  }),
  methods: {
    paypage() {
      this.$router.push('/lk/payments')
    },
  }
}
