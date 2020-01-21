export default {
  name: 'promise-expired',
  data: () => ({
    pre: 'promise-expired',
  }),
  methods: {
    paypage() {
      this.$router.push('/lk/payments')
    },
  }
}
