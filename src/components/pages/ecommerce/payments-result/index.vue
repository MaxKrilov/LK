<template lang="pug">
  .e-commerce-e-commerce-payment-result-page
    .e-commerce-payment-result-page__info
      template(v-if="status === 0")
        .e-commerce-payment-result-page__title.mb--m.error--text
          | Оплата не прошла
        .e-commerce-payment-result-page__description.mb--s
          | Произошла ошибка. попробуйте оплатить позднее
        .e-commerce-payment-result-page__button
          ErButton.px--s(@click="backToPayment") Попробовать ещё раз
      template(v-if="status === 1")
        .e-commerce-payment-result-page__title.mb--m.success--text
          | Оплата успешно прошла
        .e-commerce-payment-result-page__description.mb--s
          | Кассовый чек отправлен на указанную почту: {{ email }}
        .e-commerce-payment-result-page__button
          ErButton.px--s(@click="closeWindow") Вернуться
      template(v-if="status === 2")
        .e-commerce-payment-result-page__preloader
          .icon
            ErtProgressCircular.mr-16(indeterminate width="4" size="48")
          .title
            | Платёж в обработке
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
