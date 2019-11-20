import { mapActions } from 'vuex'

export default {
  name: 'profile-page',
  data: () => ({
    pre: 'profile-page'
  }),
  async created () {
    await this.fetchSystemsDirectory({ api: this.$api })
  },
  methods: {
    ...mapActions('directories', [
      'fetchSystemsDirectory'
    ])
  }
}
