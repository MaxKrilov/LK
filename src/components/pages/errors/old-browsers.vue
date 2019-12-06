<template lang="pug">
div.old-browsers-page.d--flex.flex-column.px-24.py-32.background-color--gray-3
  div.old-browsers-page__head
    div.old-broswers-page__logo
      img(:src="require('@/assets/images/logo.png')")
  div.old-browsers-page__content.align-items-center.justify-content-center.d--flex.flex-column
    div.old-browsers-page__image.mb-32
      img(:src="require('@/assets/images/dinosaur.png')")
    div.old-browsers-page__text.mb-28
      | Для корректной работы Личного Кабинета установите актуальную версию браузера
    div.old-browsers-page__links.d--flex.justify-content-between.mb-16
      a(href="https://www.mozilla.org/ru/firefox/new/", target="_blank")
        img(:src="require('@/assets/images/browsers/firefox.svg')")
      a(href="https://www.google.ru/chrome/", target="_blank")
        img(:src="require('@/assets/images/browsers/chrome.svg')")
      a(href="https://www.opera.com/ru", target="_blank")
        img(:src="require('@/assets/images/browsers/opera.svg')")
    div.old-browsers-page__cancel
      a(href="#", @click.prevent="hide()") Продолжить работу в текущем браузере
</template>

<script>
import { Cookie } from '../../../functions/storage'

export default {
  name: 'old-browsers-page',
  methods: {
    hide () {
      Cookie.set('is_hide_update_browser', '1', { expires: 3600 * 24 * 365 })
      location.pathname = '/'
    }
  }
}
</script>

<style lang="scss">
.old-browsers-page {
  height: 100vh;
  &__logo img { width: 96px; }
  &__content { flex: 1; }
  &__image img {
    width: 100%;
    max-width: 576px;
  }
  &__text {
    width: 100%;
    max-width: 489px;
    font: 16px/21px $fedra-book;
    text-align: center;
    letter-spacing: -0.5px;
    @include color-black(0.8);
  }
  &__links {
    width: 100%;
    max-width: 220px;
    a {
      transition: $primary-transition;
      &:hover {
        transform: scale(1.5);
      }
    }
  }
}
</style>
