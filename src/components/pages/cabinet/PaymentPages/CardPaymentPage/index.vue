<template lang="pug">
  .card-payment-page
    er-page-header.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding(
      linkText="Назад"
      title="Пополнить счёт"
      backlink="/lk/payments"
      @onBack="dataLayerPush({ category: 'payments', label: 'paybycardreturn' })"
    )
    .card-payment-page__block
      .card-payment-page__block__content.main-content.main-content--h-padding.d--flex.flex-column.flex-lg-row
        .card-payment-page__card-slider-block.ml-lg-32.mt-24.mt-md-0
          .swiper-container
            .swiper-wrapper
              PaymentCardComponent(
                @change:remember-card="(val) => { isRememberCard = val }"
                @click="onCardClick(0)"
              )
              PaymentCardComponent(
                v-for="(card, index) in cardList"
                :key="index"
                :card="card"
                :isNew="false"
                @change:autopay="onChangeAutoPay"
                @change:remove="onRemoveCard(index + 1)"
                @click="onCardClick(index + 1)"
              )
        .card-payment-page__actions-block.mt-40.mb-32.mt-md-48
          ErtForm(ref="amount-form")
            .card-payment-page__amount-input.mb-24
              ErtTextField(
                v-model="amountToPay"
                label="Введите сумму платежа"
                ref="amount-to-pay"
                suffix="₽"
                :placeholder="amountPlaceholder"
                :rules="validateRulesAmount"
              )
            .card-payment-page__email-input.mb-24
              ErtCombobox(
                v-model="email"
                :items="lazyListEmail"
                label="Эл. почта для чека"
                :search-input.sync="searchEmail"
                :rules="validateRulesEmail"
              )
                template(v-slot:no-data)
                  ErtListItem
                    ErtListItemContent
                      ErtListItemTitle
                        | Нажмите <kbd>Enter</kbd> для добавления &laquo;{{ searchEmail }}&raquo;
            .card-payment-page__submit.mb-24
              ErButton(
                @click="onPayment"
                data-ga-tag-id="payment"
                data-ga-category="payments"
                data-ga-label="paybycardtopup"
              ) Пополнить
            .card-payment-page__offer-terms
              | Нажимая на кнопку, Вы принимаете&nbsp;
              a(
                :href="offerLink"
                target="_blank"
                rel="noopener"
                data-ga-category="payments"
                data-ga-label="paybycardpolicy"
              ) условия оплаты и безопасности
    //- Диалоговое окно - оплата новой картой
    ErtDialog(
      v-model="isShowConfirmDialogNewCard"
      maxWidth="544"
      persistent
    )
      .card-payment-page__confirm-dialog
        .card-payment-page__confirm-dialog__icon.mb-16
          ErtIcon(name="question")
        .card-payment-page__confirm-dialog__title.mb-16
          | Вы уверены, что хотите оплатить&nbsp;
          span.amount(v-html="amountHTML")
          | &nbsp; новой картой?
        .card-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
          | {{ errorText }}
        .card-payment-page__confirm-dialog__actions
          .card-payment-page__confirm-dialog__action.mr-8
            ErButton(
              data-ga-category="payments"
              data-ga-label="paybycardconfirmno"
              :disabled="isPayment"
              flat
              @click="() => { isShowConfirmDialogNewCard = false }"
            ) Отмена
          .card-payment-page__confirm-dialog__action.ml-8
            ErButton(
              data-ga-category="payments"
              data-ga-label="paybycardconfirmyes"
              :loading="isPayment"
              @click="onPaymentNewCard"
            ) Оплатить

    ErtDialog(
      v-model="isShowConfirmDialogBindCard"
      maxWidth="544"
      persistent
    )
      .card-payment-page__confirm-dialog
        .card-payment-page__confirm-dialog__icon.mb-16
          ErtIcon(name="question")
        .card-payment-page__confirm-dialog__title.mb-16
          | Вы уверены, что хотите оплатить&nbsp;
          span.amount(v-html="amountHTML")
          | &nbsp; картой {{ cardNumber }}
        .card-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
          | {{ errorText }}
        .card-payment-page__confirm-dialog__actions
          .card-payment-page__confirm-dialog__action.mr-8
            ErButton(
              flat
              @click="() => { isShowConfirmDialogBindCard = false }"
              :disabled="isPayment"
              data-ga-category="payments"
              data-ga-label="paybycardconfirmno"
            ) Отмена
          .card-payment-page__confirm-dialog__action.ml-8
            ErButton(
              :loading="isPayment"
              @click="onPaymentBindCard"
              data-ga-category="payments"
              data-ga-label="paybycardconfirmyes"
            ) Оплатить

</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
