<template lang="pug">
  .main-content--padding-top.main-content--padding.main-content
    h2.loading-dots Редирект на портал ОАТС
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GoToOATSPortal',
  methods: {
    ...mapActions('oats', [
      'fetchPortalLink'
    ])
  },
  mounted () {
    this.fetchPortalLink().then(({ loginLink }) => {
      if (loginLink) { window.location.href = loginLink }
    })
  }
}
</script>

<style lang="scss">
.loading-dots {
  @extend %wait-dots-animation;
}
</style>
