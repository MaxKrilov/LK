<template lang="pug">
  .not-access-page
    .head
      img(:src="require('@/assets/images/logo.png')")
    .content
      h2.title
        | Доступ закрыт
      .image
        img(:src="require('@/assets/images/not_access.png')")
      .text
        | Вы не имеете разрешения администратора для посещения запрашиваемой страницы. Попробуйте авторизоваться под другими данными.
        template(v-if="!isCombat")
          | Если Вы уверены, что у Вас есть доступ - попробуйте открыть консоль и принять сертификаты
      .button
        er-button(@click="onClick")
          | Переавторизация
</template>

<script lang="js">
import { isCombat } from '@/functions/helper'

export default {
  name: 'not-access-page',
  computed: {
    isCombat
  },
  methods: {
    onClick () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    }
  }
}
</script>

<style lang="scss" scoped>
.not-access-page {
  width: 100%;
  height: 100vh;
  background: map-get($gray, '2');
  padding: 24px;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h2.title {
    text-align: center;
    margin-bottom: 18px;
  }
  .image {
    margin: 0 auto 24px;
    width: 100%;
    max-width: 636px;
  }
  .text {
    @extend %body-font;
    @include color-black(0.7);
    width: 100%;
    max-width: 671px;
    text-align: center;
    margin: 0 auto 40px;
  }
  .button {
    width: 100%;
    max-width: 212px;
    margin: 0 auto;
  }
}
</style>
