export default {
  name: 'payments-on',
  data: () => ({
    pre: 'payments-on'
  }),
  methods: {
    tryAgain () {
      this.$emit('try')
    }
  }
}
