<template lang="pug">
  .payment-index-page.main-content--top-menu-fix.main-content--top-padding
    er-page-header.main-content--content(
      linkText="Назад на главную"
      title="Баланс"
      backlink="/lk"
    )

    //- Общая информация
    .payment-index-page__info.mb-24.mb-md-32.main-content--content
      .payment-index-page__info-item
        .payment-index-page__info-item__caption
          | На Вашем счете:
        .payment-index-page__info-item__value
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
          template(v-if="isLoadingBalance")
            PuSkeleton.loading
          template(v-else)
            .value(:class="{ 'is-debt': sumToPay > 0 }")
              | {{ sumToPay | priceFormatted }}
              span &nbsp;₽

      .payment-index-page__info-item
        .payment-index-page__info-item__caption
          | Следующее списание:
        .payment-index-page__info-item__value
          template(v-if="isLoadingBalance")
            PuSkeleton.loading
          template(v-else)
            .value
              | {{ nextDate }}

    //- Кнопки "быстрого перехода"
    .payment-index-page__buttons.mb-40.mb-xl-48.main-content--content
      .payment-index-page-buttons(
        :class="{ 'is-scroll': isSliderLongerContent, 'is-end': isEndScrollbar, 'is-start': isStartScrollbar }"
        ref="button-content"
      )
        .payment-index-page-buttons__slider(
          :style="sliderStyle"
          ref="button-slider"
          v-touch="{ left: onLeftHandler, right: onRightHandler }"
          @wheel="onScrollEvent"
        )
          button.payment-index-page-buttons__item(
            @click="onGetInvoicePaymentHandler"
            :disabled="isLoadingInvoicePayment"
          )
            .content
              .title {{ isLoadingInvoicePayment ? 'Подождите' : 'Счёт на оплату' }}
              .additional-info
              .icon
                ErtIcon(name="score")
          button.payment-index-page-buttons__item(
            @click="() => { $router.push('/lk/payments/card-payment') }"
          )
            .content
              .title Оплатить картой
              .additional-info(:class="{ 'is-autopay': isEnabledAutoPay }")
                template(v-if="isEnabledAutoPay")
                  .caption2 Подключен автоплатёж
                template(v-else)
                  .caption2 Подключить автоплатёж
              .icon
                ErtIcon(name="pay_card")
          button.payment-index-page-buttons__item(
            @click="() => { $router.push('/lk/payments/promise-payments') }"
          )
            .content
              .title Обещанный платёж
              .additional-info
                template(v-if="isHasPromisePayment")
                  .caption2 Осталось:
                  .value {{ beforePromisedPayEnd.d | leadingZero(2) }}д:{{ beforePromisedPayEnd.h | leadingZero(2) }}ч:{{ beforePromisedPayEnd.m | leadingZero(2) }}м
              .icon
                ErtIcon(name="trast_pay")
          button.payment-index-page-buttons__item(
            @click="() => { $router.push('/lk/support?form=erroneous_payment') }"
          )
            .content
              .title Заявление об ошибочном платеже
              .additional-info
              .icon
                ErtIcon(name="doc_edit")
    .payment-index-page__history
      h2.mb-16.main-content--content История операций
      .payment-index-page__history__filter
        ErFilterContainer(
          :active="isVisibleFilter"
          :icon-click="() => { isVisibleFilter = true }"
          @click-outside="() => { isVisibleFilter = false }"
        )
          // Выбранные для фильтрации данные
          div(slot="selected-filters" @click="() => { isVisibleFilter = true }")
            span.er-filter-container__active-filter.mr-16 {{ formatFilterPeriod }}
            span.er-filter-container__active-filter {{ payType.text }}
          .payment-index-page__filter-wrap
            .payment-index-page__filter-wrap__list.main-content.main-content--content
              ErContainer.full.container--no-padding
                ErRow(align-items-center)
                  ErFlex.xs12.sm8.md5.lg4.r-offset-sm4.r-offset-md0
                    ErDatePicker(
                      v-model="datePickerModel"
                      :disabledDate="disabledDateCallback"
                    )
                  ErFlex.xs12.sm8.md5.lg3.r-offset-sm6.r-offset-md0
                    ErtSelect(
                      label="Тип"
                      v-model="payType"
                      :items="listPayType"
                      returnObject
                      item-value="id"
                      item-text="text"
                    )
                  ErFlex.md1.lg3.d--flex.align-items-center
                    ErFilterClose(@click="isVisibleFilter = false")
      .payment-index-page__history__list.main-content--content
        template(v-if="loadingPaymentHistoryBill")
          .payment-index-page__history__loading
            ErtProgressCircular(indeterminate width="2")
            .title Загружаем историю операций
        template(v-else-if="paymentHistory.length === 0")
          .payment-index-page__history__list--not-found
            | За выбранный промежуток не найдены платежи или начисления
        template(v-else)
          template(v-for="(historyBillGroupByMonth) in paymentHistory")
            .payment-index-page__month-year
              span.month {{ getMonthByTimestamp(historyBillGroupByMonth[0].timestamp) }}&nbsp;
              span.year '{{ getYearByTimestamp(historyBillGroupByMonth[0].timestamp) }}
            template(
              v-if="historyBillGroupByMonth.filter(historyItem => payType.id === 'all' ? true : (payType.id === historyItem.type)).length === 0"
            )
              .payment-history-page__list--not-found За данный месяц не найдено {{ payType.id === 'replenishment' ? 'пополнений' : 'списаний' }}
            template(v-else)
              .payment-index-page__history-group-by-month
                PaymentHistoryItem.mb-4(
                  v-for="(historyItem, index) in historyBillGroupByMonth"
                  v-if="payType.id === 'all' ? true : (payType.id === historyItem.type)"
                  :key="`${index}_${historyItem.timestamp}`"
                  :data="historyItem"
                  :type="historyItem.type"
                  :hasErrorAutoPayment="historyItem.type === 'replenishment' && historyItem.description === 'Автоплатеж' && historyItem.accountPaymentStatus === 'Завершенный с ошибкой' "
                )

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
