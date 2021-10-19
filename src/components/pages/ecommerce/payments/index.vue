<template lang="pug">
  .e-commerce-payment-page(:class="{ 'e-commerce-payment-page--is-frame': isFramed }")
    template(v-if="isPopup")
      .e-commerce-payment-page__forward
        ErtProgressCircular.mb--s(indeterminate width="4" size="48" :style="{ color: '#7585A1' }")
        h4.title.mb--s Будет произведён переход на страницу оплаты
        ErButton(@click="openWindow") Перейти
    template(v-else)
      .e-commerce-payment-page__block
        .e-commerce-payment-page__block__content.main-content.main-content--h-padding.d--flex
          .e-commerce-payment-page__card-slider-block.ml-lg-32.mt-24.mt-md-0
            .swiper-container
              .swiper-wrapper
                PaymentCardComponent(
                  :isFrame="isFramed"
                  @change:remember-card="(val) => { isRememberCard = val }"
                )
                PaymentCardComponent(
                  v-for="(card, index) in cardList"
                  :key="index"
                  :card="card"
                  :isNew="false"
                  :isFrame="isFramed"
                  @change:autopay="onChangeAutoPay"
                  @change:remove="onRemoveCard(index + 1)"
                )
          .e-commerce-payment-page__actions-block.mt-40.mb-16.mt-md-48
            ErtForm(ref="amount-form")
              .e-commerce-payment-page__amount-input.mb-md-24
                ErtTextField(
                  v-model="amountToPay"
                  label="Введите сумму платежа"
                  ref="amount-to-pay"
                  suffix="₽"
                  :placeholder="amountPlaceholder"
                  :rules="validateRulesAmount"
                )
              .e-commerce-payment-page__email-input.mb-md-24
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
              .e-commerce-payment-page__submit.mb-24(v-if="!isFramed || !isHideButton")
                ErButton(@click="onPayment") Пополнить
              .e-commerce-payment-page__offer-terms(v-if="!isFramed || !isHideButton")
                | Нажимая на кнопку, Вы принимаете&nbsp;
                a(:href="offerLink" target="_blank" rel="noopener") условия оплаты и безопасности
      //- Диалоговое окно - оплата новой картой
      ErtDialog(
        v-model="isShowConfirmDialogNewCard"
        maxWidth="544"
        persistent
      )
        .e-commerce-payment-page__confirm-dialog
          .e-commerce-payment-page__confirm-dialog__icon.mb-16
            ErtIcon(name="question")
          .e-commerce-payment-page__confirm-dialog__title.mb-16
            | Вы уверены, что хотите оплатить&nbsp;
            span.amount(v-html="amountHTML")
            | &nbsp; новой картой?
          .e-commerce-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
            | {{ errorText }}
          .e-commerce-payment-page__confirm-dialog__actions
            .e-commerce-payment-page__confirm-dialog__action.mr-8
              ErButton(flat @click="() => { isShowConfirmDialogNewCard = false }" :disabled="isPayment") Отмена
            .e-commerce-payment-page__confirm-dialog__action.ml-8
              ErButton(:loading="isPayment" @click="onPaymentNewCard") Оплатить

      ErtDialog(
        v-model="isShowConfirmDialogBindCard"
        maxWidth="544"
        persistent
      )
        .e-commerce-payment-page__confirm-dialog
          .e-commerce-payment-page__confirm-dialog__icon.mb-16
            ErtIcon(name="question")
          .e-commerce-payment-page__confirm-dialog__title.mb-16
            | Вы уверены, что хотите оплатить&nbsp;
            span.amount(v-html="amountHTML")
            | &nbsp; картой {{ cardNumber }}
          .e-commerce-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
            | {{ errorText }}
          .e-commerce-payment-page__confirm-dialog__actions
            .e-commerce-payment-page__confirm-dialog__action.mr-8
              ErButton(flat @click="() => { isShowConfirmDialogBindCard = false }" :disabled="isPayment") Отмена
            .e-commerce-payment-page__confirm-dialog__action.ml-8
              ErButton(:loading="isPayment" @click="onPaymentBindCard") Оплатить
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
