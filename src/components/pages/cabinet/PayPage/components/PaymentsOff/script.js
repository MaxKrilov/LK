export default {
  name: 'payments-off',
  data: () => ({
    pre: 'payments-off'
  }),
  methods: {
    tryAgain () {
      this.$emit('try')
    }
  }
}
