<template lang="pug">
  .promise-payment-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад"
      title="Обещанный платёж"
      backlink="/lk/payments"
    )

    //- Загружаем информацию об Обещанном платеже
    template(v-if="loadingPromisedPayment")
      .promise-payment-page__loading
        ErtProgressCircular(indeterminate width="2")
        .title Загружаем информацию об Обещанном платеже

    //- Обещанный платёж может быть активирован
    template(v-else-if="!isHasPromisePayment && isCanActivatePromisePayment")
      .promise-payment-page__info.mb-24.mb-md-32(v-html="infoText")

      ErPromo.mb-32.mb-md-40(onlyFeature :featureList="promo")

      .promise-payment-page__activation-button
        ErButton.mb-8(
          :loading="isActivatingPromisePayment"
          @click="onActivatePromisePayment"
        ) Активировать

        .error--text.caption2(v-if="errorText") {{ errorText }}

      ErtDialog(
        v-model="isShowConfirmDialog"
        maxWidth="544"
        persistent
      )
        .promise-payment-page__confirm-dialog
          .promise-payment-page__confirm-dialog__icon.mb-16
            ErtIcon(name="question")
          .promise-payment-page__confirm-dialog__title.mb-16
            | Вы уверены, что хотите активировать Обещанный платёж?
          .promise-payment-page__confirm-dialog__warning
            | Не забудьте пополнить счёт!
          .promise-payment-page__confirm-dialog__actions
            .promise-payment-page__confirm-dialog__action.mr-8
              ErButton(flat @click="onCancelPromisePayment" :disabled="isConfirmingPromisePayment") Отмена
            .promise-payment-page__confirm-dialog__action.ml-8
              ErButton(:loading="isConfirmingPromisePayment" @click="onConfirmPromisePayment") Активировать

      ErtDialog(
        v-model="isShowSuccessDialog"
        maxWidth="544"
      )
        .promise-payment-page__success-dialog
          .promise-payment-page__success-dialog__icon.mb-16
            ErtIcon(name="circle_ok")
          .promise-payment-page__success-dialog__title.mb-16
            | Заказ на активацию Обещанного платежа успешно принят
          .promise-payment-page__success-dialog__description
            | Статус заказа можно отследить в разделе «Заказы»
          .promise-payment-page__success-dialog__actions
            .promise-payment-page__confirm-dialog__action.mr-8
            .promise-payment-page__confirm-dialog__action.ml-8
              ErButton(flat @click="() => { isShowSuccessDialog = false }") Закрыть

      ErtDialog(
        v-model="isShowErrorDialog"
        maxWidth="544"
      )
        .promise-payment-page__error-dialog
          .promise-payment-page__error-dialog__icon.mb-16
            ErtIcon(name="cancel")
          .promise-payment-page__error-dialog__title.mb-16
            | При активации Обещанного платежа произошла ошибка
          .promise-payment-page__error-dialog__description
            | Повторите попытку позже или отправьте обращение. Статус обращения вы сможете отслеживать в разделе «Поддержка».
            .caption2 В случае отправки обращения оно будет отправлено в фоновом режиме и данное окно будет закрыто
          .promise-payment-page__error-dialog__actions
            .promise-payment-page__error-dialog__action.mr-8
              ErButton(@click="() => { createOpenedRequest('CN_PROMISED_PAYMENT'); isShowErrorDialog = false }")
                | Отправить
            .promise-payment-page__error-dialog__action.ml-8
              ErButton(flat @click="() => { isShowErrorDialog = false }") Закрыть

    //- Обещанный платёж просрочен
    template(v-else-if="isHasPromisePayment && isExpiredPromisePay")
      .promise-payment-page__card.error
        .wrapper
          .sub-wrapper
            .icon.mr-8.mr-md-16
              ErtIcon(name="cancel")
            .title
              | Обещанный платёж просрочен

    //- Обещанный платёж уже активирован
    template(v-else-if="isHasPromisePayment")

      .promise-payment-page__card.success
        .wrapper
          .sub-wrapper
            .icon.mr-8.mr-md-16
              ErtIcon(name="circle_ok")
            .title
              | Обещанный платёж активирован
          .timer
            .caption Осталось:
            .value
              .days.mr-8.mr-md-16
                | {{ beforePromisedPayEnd.d | leadingZero(2) }}
                span {{ getNoun(beforePromisedPayEnd.d, 'день', 'дня', 'дней') }}
              .hours.mr-8.mr-md-16
                | {{ beforePromisedPayEnd.h | leadingZero(2) }}
                span {{ getNoun(beforePromisedPayEnd.h, 'час', 'часа', 'часов') }}
              .minutes
                | {{ beforePromisedPayEnd.m | leadingZero(2) }}
                span {{ getNoun(beforePromisedPayEnd.m, 'минута', 'минуты', 'минут') }}

    //- Невозможно активировать Обещанный платёж
    template(v-else)
      .promise-payment-page__error
        .icon.mb-16.mb-sm-0.mr-sm-16.mr-lg-20.mr-xl-24
          ErtIcon(name="cancel")
        .info
          .title.mb-4
            | Не может быть активирован
          .description.mb-8.mb-md-16
            | Причина: {{ reasonCanntActivatePromisePayment || 'Неизвестная причина' }}
          .personal-manager
            .caption.mb-4 Ваш персональный менеджер:
            .value.name.mb-8.mb-md-16 {{ getManagerInfo.name }}
            .caption.mb-4 Телефон:
            .value.phone.mb-8.mb-md-16 {{ getManagerInfo.phone }}
            .caption.mb-4 E-mail:
            .value.email {{ getManagerInfo.email }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
