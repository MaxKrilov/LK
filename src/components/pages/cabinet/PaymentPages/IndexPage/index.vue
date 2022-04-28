<template lang="pug">
  .payment-index-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="Баланс"
      backlink="/lk"
    )

    //- Общая информация
    .payment-index-page__info.mb-24.mb-md-48
      .payment-index-page__info-item
        .payment-index-page__info-item__caption
          | На Вашем счете:
        .payment-index-page__info-item__value
          .icon
            ErtIcon(name="wallet")
          template(v-if="isLoadingBalance")
            PuSkeleton.loading
          template(v-else)
            .value
              | {{ balance | priceFormatted }}
              span &nbsp;₽

      .payment-index-page__info-item
        .payment-index-page__info-item__caption
          | Сумма к оплате:
        .payment-index-page__info-item__value
          .icon
            ErtIcon(name="rouble")
          template(v-if="isLoadingBalance")
            PuSkeleton.loading
          template(v-else)
            .value
              | {{ sumToPay | priceFormatted }}
              span &nbsp;₽

      .payment-index-page__info-item
        .payment-index-page__info-item__caption
          | Следующее списание:
        .payment-index-page__info-item__value
          .icon
            ErtIcon(name="calendar")
          template(v-if="isLoadingBalance")
            PuSkeleton.loading
          template(v-else)
            .value
              | {{ nextDate }}

    //- Кнопки "быстрого перехода"
    ErRow.payment-index-page__buttons.mb-48.mb-md-56
      ErFlex(xs6 lg3)
        .payment-index-page__button(
          @click="() => { $router.push('/lk/payments/card-payment'); dataLayerPush({ category: 'payments', label: 'paybycard' }) }"
        )
          .wrapper
            .title Оплата картой
            .description(:class="{ 'enabled': isEnabledAutoPay }") Автоплатёж {{ isEnabledAutoPay ? '' : 'не' }} подключен
            .icon
              ErtIcon(name="pay_card")
      ErFlex(xs6 lg3)
        ErDocumentViewer(
          :list-document="[listInvoicePayment[activeBillingAccount] || emptyDocument]"
          :is-digital-signing="false"
          :is-manual-signing="false"
          v-model="isShowInvoicePayment"
        )
          template(v-slot:activator="{ on }")
            .payment-index-page__button(v-on="getInvoicePaymentsEvents(on)")
              .wrapper(@click="dataLayerPush({ category: 'payments', label: 'bill' })")
                .title Счёт на оплату
                .icon
                  ErtIcon(name="score")
      ErFlex(xs6 lg3)
        .payment-index-page__button(
          :class="{ 'promised-payment': isHasPromisePayment }"
          @click="() => { $router.push('/lk/payments/promise-payments'); dataLayerPush({ category: 'payments', label: 'futurepayment' }) }"
        )
          .wrapper
            .title Обещанный платёж
            template(v-if="!isHasPromisePayment")
              .icon
                ErtIcon(name="trast_pay")
            template(v-else)
              .promised-payment__caption Осталось (дд:чч:мм)
              .promised-payment__value
                span {{ beforePromisedPayEnd.d | leadingZero(2) }}
                span :
                span {{ beforePromisedPayEnd.h | leadingZero(2) }}
                span :
                span {{ beforePromisedPayEnd.m | leadingZero(2) }}
              .promised-payment__line
                .promised-payment__before-line(:style="{ width: `${beforePromisedPayEndLine}%` }")
      ErFlex(xs6 lg3)
        .payment-index-page__button(
          @click="() => {$router.push('/lk/support?form=erroneous_payment'); dataLayerPush({ category: 'payments', label: 'falsepayment' }) }"
        )
          .wrapper
            .title Заявление об ошибочном платеже
            .icon
              ErtIcon(name="doc_edit")
    .payment-index-page__history
      h2.mb-16 Последние платежи и начисления
      .payment-index-page__history__current-month-year.mb-16
        span.month {{ currentMonthYear.m }}&nbsp;
        span.year '{{ currentMonthYear.y }}
      .payment-index-page__history__list
        template(v-if="loadingPaymentHistoryBill")
          PaymentHistoryItem(loading :data="{}" type="replenishment").mb-4
          PaymentHistoryItem(loading :data="{}" type="write_off")
        template(v-else-if="paymentHistory.length === 0")
          .payment-index-page__history__list--not-found
            | За выбранный промежуток не найдены платежи или начисления
        template(v-else)
          PaymentHistoryItem.mb-4(
            v-for="(paymentItem, index) in paymentHistory[0]"
            :key="index"
            :data="paymentItem"
            :type="paymentItem.type"
          )

    .payment-index-page__navigation.mt-32.mt-md-40
      ErButton(
        flat
        to="/lk/payments/history"
        @click="dataLayerPush({ category: 'payments', label: 'history' })"
      ) История

    ErtDialog(
      v-model="isNotAccessInvoicePayment"
      maxWidth="544"
    )
      .payment-index-page__success-dialog
        .payment-index-page__success-dialog__icon.mb-16
          ErtIcon(name="circle_ok")
        .payment-index-page__success-dialog__title.mb-16
          | Запрос счёта на оплату недоступен
        .payment-index-page__success-dialog__description
          | У вас положительный баланс, поэтому запрос информационного счёта недоступен! Приятного пользования услугами Дом.ru
        .payment-index-page__success-dialog__actions
          .payment-index-page__success-dialog__action.mr-8
          .payment-index-page__success-dialog__action.ml-8
            ErButton(flat @click="() => { isNotAccessInvoicePayment = false }") Закрыть
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
