<template lang="pug">
.wip
  .header
    .header__logo
      img(src="../../../assets/images/logos/logo_desktop.svg" alt="Логотип Дом.ru Бизнес")

  .work-in-progress
    .content
      .wip-block
        .wip-block__bg

        .wip-block__content
          .wip-block__title(v-html="userMessage")

          .wip-block__action(v-if="$props.showLogoutButton && $props.isAfterAuth")
            er-button(@click="onLogout") Выйти
</template>

<script>
export default {
  name: 'WorkInProgress',
  props: {
    showLogoutButton: {
      type: Boolean,
      default: true
    },
    userMessage: {
      type: String,
      default: `
        Уважаемый клиент, в данный момент в личном кабинете Дом.ru Бизнес ведутся технические работы!
        <p>
          Обратитесь пожалуйста в техническую поддержку по номеру <a class="phone-link" href="tel:88003339000">8&nbsp;800&nbsp;333&nbsp;9000</a>
        </p>
      `
    },
    isAfterAuth: Boolean
  },
  created () {
    console.log('props', this.$props)
  },
  methods: {
    onLogout () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    }
  }
}
</script>

<style lang="scss">
$padding-x15: 4 * 15px;

.wip {
  .header {
    padding-top: $padding-x4;
    padding-left: $padding-x4;
    position: absolute;

    @include min-breakpoint(sm) {
      position: relative;
    }

    @include min-breakpoint(md) {
      position: absolute;
    }

    @include min-breakpoint(lg) {
      padding-top: $padding-x8;
      padding-left: $padding-x8;
    }

    &__logo img {
      height: $padding-x8;

      @include min-breakpoint(xl) {
        height: $padding-x12;
      }
    }
  }
}

.work-in-progress {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  background-image: url(../../../assets/images/wip/bg.png);
  background-position-x: right;
  background-repeat: no-repeat;
  background-size: 90%;

  @include min-breakpoint(sm) {
    background-image: none;
    padding-left: 0;
  }

  .content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;

    @include min-breakpoint(sm) {
      justify-content: flex-start;
    }

    @include min-breakpoint(md) {
      justify-content: center;
    }

    @include min-breakpoint(xxl) {
      align-items: center;
    }
  }

  .wip-block {
    display: block;
    align-items: flex-start;

    @include min-breakpoint(sm) {
      display: flex;
      flex-direction: row;
    }

    @include min-breakpoint(lg) {
      align-items: center;
    }

    &__bg {
      background-image: url(../../../assets/images/wip/bg.png);
      background-repeat: no-repeat;
      background-position-x: right;
      background-size: contain;

      @include min-breakpoint(sm) {
        min-width: 160px;
        height: 100%;
      }

      @include min-breakpoint(md) {
        min-width: 255px;
      }

      @include min-breakpoint(lg) {
        min-width: 387px;
        height: 455px;
      }

      @include min-breakpoint(xl) {
        min-width: 448px;
      }

      @include min-breakpoint(xxl) {
        min-width: 320px;
      }
    }

    &__title {
      @extend %h2;
      text-align: left;
      margin-bottom: 18px;
    }

    &__content {
      padding: 0 $padding-x6 $padding-x6;

      @include min-breakpoint(sm) {
        padding-left: 24px;
      }

      @include min-breakpoint(lg) {
        width: 374px;
      }
    }

    &__action {
      margin-top: $padding-x6;
      display: flex;
      justify-content: center;

      @include min-breakpoint(sm) {
        justify-content: flex-start;
      }

      @include min-breakpoint(lg) {
        margin-top: $padding-x15;
      }

      .er-button {
        //@extend %button;
        display: inline-block;
        width: 100%;
        padding: 0 $padding-x8;

        @include min-breakpoint(sm) {
          width: 50%;
        }
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
