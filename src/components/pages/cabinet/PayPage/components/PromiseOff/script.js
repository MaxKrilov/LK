import { mapGetters } from 'vuex'

export default {
  name: 'promise-off',
  data: () => ({
    pre: 'promise-off'
  }),
  computed: {
    ...mapGetters({
      getManagerInfo: 'user/getManagerInfo'
    })
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    }
  }
}
