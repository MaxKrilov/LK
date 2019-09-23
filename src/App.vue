<template lang="pug">
  div.app(data-app="true")
    div.app__content
      router-view
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    model: 1
  }),
  methods: {
    fakeAuth () {
      const data = {
        username: '79197001816',
        password: 'Qwerty1!',
        domain: 'ekat'
      }
      this.$api
        .setData(data)
        .query('/auth/login')
        .then(response => {
          this.$api.setHeaderAuthorization(response.token)
        })
    }
  },
  created () {
    this.fakeAuth()
  }
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    min-height: 100vh;
    &.blur {
      filter: blur(32px);
    }
  }
}
</style>
