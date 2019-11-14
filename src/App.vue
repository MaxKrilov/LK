<template lang="pug">
  div.app(data-app="true")
    div.app__content
      router-view
</template>

<script>
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'

export default {
  name: 'app',
  data: () => ({
    model: 1
  }),
  methods: {},
  created () {},
  mounted () {
    this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    window.addEventListener('resize', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
    window.addEventListener('orientationchange', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
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
