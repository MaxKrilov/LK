<template lang="pug">
  .payment-result-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад"
      title="Статус платежа"
      backlink="/lk/payments"
    )

    .payment-result-page__row.mb-32.mb-md-40
      .payment-result-page__icon.mr-8.mr-sm-16.mr-lg-20(:class="[ defineIconClass ]")
        ErtIcon(:name="defineIcon")
      .payment-result-page__info
        .payment-result-page__title.mt-8.mt-md-16.mt-lg-24 {{ defineTitleText }}
        template(v-if="status === 0")
        template(v-if="status === 1")
          .payment-result-page__email
            .title Чек отправлен
            .subtitle на электронную почту:
            .value {{ email }}
        template(v-if="status === 2")
          .payment-result-page__description
            | Подождите, идет проверка статуса платежа
    .payment-result-page__actions
      template(v-if="status === 0")
        .payment-result-page__action
          ErButton(to="/lk/payments/card-payment") Попробовать снова
        .payment-result-page__action
          button.chat(@click="openChat")
            ErtIcon.mr-16(name="chat")
            span Спросить в чате
      template(v-if="status === 1")
        .payment-result-page__action
          ErButton(to="/lk/payments") В платежи
      template(v-if="status === 2")
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
