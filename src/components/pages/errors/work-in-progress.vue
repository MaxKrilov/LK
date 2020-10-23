<template lang="pug">
  .work-in-progress
    .content
      .wip-block

        p Уважаемый клиент, в данный момент в личном кабине Дом.Ру Бизнес ведутся технические работы.
        p Обратитесь пожалуйста в техническую поддержку по номеру <a class="phone-link" href="tel:88003339000">8&nbsp;800&nbsp;333&nbsp;9000</a>
        p Просим прощение за доставленные неудобства.

        .wip-block__action
          er-button(@click="onLogout") Выйти
</template>

<script>
export default {
  name: 'work-in-progress',
  methods: {
    onLogout () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    }
  }
}
</script>

<style lang="scss">
.work-in-progress {
  width: 100%;
  height: 100vh;
  background: map-get($gray, '2');
  padding: $padding-x6;
  display: flex;
  flex-direction: column;

  .content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .wip-block {
    display: block;
    align-items: flex-start;

    &__title {
      text-align: center;
      margin-bottom: 18px;
    }

    &__action {
      margin-top: $padding-x10;
      display: flex;
      justify-content: center;

      .er-button {
        display: inline-block;
        width: initial;
        padding: 0 $padding-x8;
      }
    }
  }

  p {
    @extend %body-font;
    @include color-black(0.7);
    width: 100%;
    max-width: 680px;
    margin-top: $padding-x4;
  }

  .phone-link {
    @extend %link-behaviour;
    text-decoration: none;
  }
}
</style>
