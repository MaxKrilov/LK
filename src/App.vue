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
  })
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    background: map_get($gray, '3');
    min-height: 100vh;
    &.blur {
      filter: blur(32px);
    }
  }
}
</style>
