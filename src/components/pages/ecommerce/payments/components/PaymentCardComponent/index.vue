<template lang="pug">
  .e-commerce-payment-card-component.swiper-slide(
    :class="[definePaymentSystem, { 'new': isNew, 'removed': isRemovedCard, 'frame': isFrame }]"
  )
    .e-commerce-payment-card-component__component
      .e-commerce-payment-card-component__front
        .content
          //- Содержимое для новой карты
          template(v-if="isNew")
            .active
              .logo
                img(:src="require('@/assets/images/logos/logo_mobile.svg')")
              .title
                | Оплата новой картой
              .remember-card
                ErtCheckbox(
                  v-model="isRememberNewCard"
                  hideDetails
                )
                  template(v-slot:label)
                    .remember-card__label
                      | Запомнить карту
            .prev
              ErtIcon.mr-16(name="add" small)
              .prev-title Оплата новой картой
          //- Содержимое для привязанных карт
          template(v-else)
            .next
              .logo
                img(:src="require(`@/assets/images/payment_card/${definePaymentSystem}.png`)")
              .card-number
                - for (let x = 0; x < 4; x++)
                  span
                    span
                | {{ getLastDigitsCardNumber }}
            .active
              .header
                .logo
                  img(:src="require(`@/assets/images/payment_card/${definePaymentSystem}.png`)")
                .autopay
                  //- ErtCheckbox(hideDetails :value="isAutoPay" @change="onChangeAutoPay" ref="autopay-checkbox")
                    template(v-slot:label)
                      .autopay__label.d--flex.justify-content-between.align-items-center
                        .autopay__label__title
                          | Автоплатёж
                        .autopay__label__hint.ml-16
                          ErHint
                            div(v-html="autoPayHTML")
              .card-number
                span.mr-4 {{ getFirstDigitsCardNumber }}
                span
                  | {{ getSecondDigitsCardNumber }}
                  - for (let x = 0; x < 2; x++)
                    span
                      span
                span
                  - for (let x = 0; x < 4; x++)
                    span
                      span
                span {{ getLastDigitsCardNumber }}
              .actions
                button.remove(@click="() => { isShowDialogRemoveCard = true }")
                  ErtIcon.mr-8(name="close" small)
                  span Удалить
              .background(:style="{ backgroundImage: `url(${require(`@/assets/images/payment_card/${definePaymentSystem}.png`)})` }")
            .prev
              .logo
                img(:src="require(`@/assets/images/payment_card/${definePaymentSystem}.png`)")
              .card-number
                - for (let x = 0; x < 4; x++)
                  span
                    span
                | {{ getLastDigitsCardNumber }}
            .removed
              .background
                ErtIcon(name="trashbox")
              .title Карта удалена
      .e-commerce-payment-card-component__back.pt-32(:class="{ 'error': !isValidCVV && !isNew }")
        .line
        template(v-if="!isNew")
          .cvc
            .caption.mr-8 {{ isValidCVV ? 'Введите' : 'Не введён' }} CVC/CVV
            .value
              ErtTextField(
                v-model="cvv"
                hideDetails
                ref="cvc"
                type="password"
              )
    ErtDialog(
      v-model="isShowDialogAutoPay"
      maxWidth="544"
      persistent
    )
      .card-payment-page__confirm-dialog
        .card-payment-page__confirm-dialog__icon.mb-16
          ErtIcon(name="question")
        .card-payment-page__confirm-dialog__title.mb-16
          | Вы уверены, что хотите {{ isAutoPay ? 'отключить' : 'подключить' }} автоплатёж?
        .card-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
          | {{ errorText }}
        .card-payment-page__confirm-dialog__actions
          .card-payment-page__confirm-dialog__action.mr-8
            ErButton(flat @click="onCancelAutoPay" :disabled="isChangingAutoPay") Отмена
          .card-payment-page__confirm-dialog__action.ml-8
            ErButton(:loading="isChangingAutoPay" @click="changeAutoPay") {{ isAutoPay ? 'Отключить' : 'Подключить' }}

    ErtDialog(
      v-model="isShowDialogRemoveCard"
      maxWidth="544"
      persistent
    )
      .card-payment-page__confirm-dialog
        .card-payment-page__confirm-dialog__icon.mb-16
          ErtIcon(name="question")
        .card-payment-page__confirm-dialog__title.mb-16
          | Вы уверены, что хотите удалить карту {{ card && card.maskedPan }}
        .card-payment-page__confirm-dialog__error-text.error--text(v-show="errorText")
          | {{ errorText }}
        .card-payment-page__confirm-dialog__actions
          .card-payment-page__confirm-dialog__action.mr-8
            ErButton(flat @click="() => { isShowDialogRemoveCard = false }" :disabled="isRemovingCard") Отмена
          .card-payment-page__confirm-dialog__action.ml-8
            ErButton(:loading="isRemovingCard" @click="onUnbindCard") Удалить
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
