export default {
  name: 'promise-on',
  data: () => ({
    pre: 'promise-on',
  }),
  methods: {
    paypage() {
      this.$router.push('/lk/payments')
    },
  }
}
