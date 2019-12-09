<template lang="pug">
  div.app(data-app="true")
   router-view
</template>

<script>
// import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'
// import { GET_CLIENT_INFO, GET_MANAGER_INFO, GET_UNSIGNED_DOCUMENTS } from '@/store/actions/user'
// import { GET_REQUEST } from '@/store/actions/request'

export default {
  name: 'app',
  data: () => ({
    model: 1
  }),
  /*
  async created () {
    if (!this.refreshedToken.isFetching && !this.serverErrorMessage) {
      this.$store.dispatch('auth/checkAuth', { api: this.$api })
      const clientInfo = await this.$store.dispatch(`user/${GET_CLIENT_INFO}`, { api: this.$api })
      if (clientInfo) {
        this.$store.dispatch(`user/${GET_MANAGER_INFO}`, { api: this.$api })
        this.$store.dispatch(`request/${GET_REQUEST}`, { api: this.$api })
        this.$store.dispatch(`user/${GET_UNSIGNED_DOCUMENTS}`, { api: this.$api })
      }
    }
  },
  */
  mounted () {
    this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    window.addEventListener('resize', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
    window.addEventListener('orientationchange', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
  }
  /*
    methods: {} /*
    computed: {
      ...mapGetters('auth', ['user', 'hasAccess']),
      ...mapState('auth', ['error', 'isFetching', 'isFetched', 'refreshedToken'])
    }
  */
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    min-height: 100vh;
    &.blur {
      /*filter: blur(32px);*/
    }
  }
}
</style>
