<template lang="pug">
  div.app(data-app="true")
    div.app__content
      div(style="width: 300px; padding: 50px; height: 500px")
        er-date-picker(v-model="model", placeholder="Выберите дату")
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    model: []
  }),
  mounted () {
    // this.model = new Date()
  }
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    background: map_get($gray, '3');
    min-height: 200vh;
    &.blur {
      filter: blur(32px);
    }
  }
}
</style>
