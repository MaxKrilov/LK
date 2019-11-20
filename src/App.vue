<template lang="pug">
  div.app(data-app="true")
    div.app__content
      template(v-if="isFetching")
        | Проверяем авторизацию
      template(v-else-if="!hasAccess")
        | Доступ закрыт
      template(v-else)
        router-view
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'

export default {
  name: 'app',
  data: () => ({
    model: 1
  }),
  async created () {
    if (!this.refreshedToken.isFetching && !this.serverErrorMessage) {
      this.$store.dispatch('auth/checkAuth', { api: this.$api })
    }
  },
  mounted () {
    this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    window.addEventListener('resize', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
    window.addEventListener('orientationchange', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
  },
  methods: {},
  computed: {
    ...mapGetters('auth', ['user', 'hasAccess']),
    ...mapState('auth', ['error', 'isFetching', 'isFetched', 'refreshedToken'])
  }
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
