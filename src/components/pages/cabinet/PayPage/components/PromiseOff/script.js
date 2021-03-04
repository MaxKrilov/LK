import { mapState, mapGetters } from 'vuex'

export default {
  name: 'promise-off',
  data: () => ({
    pre: 'promise-off'
  }),
  computed: {
    ...mapGetters({
      getManagerInfo: 'user/getManagerInfo'
    }),
    ...mapState({
      reasonCanntActivatePromisePayment: state => state.user.reasonCanntActivatePromisePayment
    })
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    }
  }
}
