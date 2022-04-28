<template lang="pug">
  .ert-card-payment-page.main-content--top-menu-fix.main-content--top-padding.main-content--content
    ErPageHeader(
      linkText="Назад к балансу"
      title="Оплата картой"
      backlink="/lk/payments"
    )
    .ert-card-payment-page__description.mb-32.mb-xl-40
      | Вы можете подключить автоплатеж только на сохраненную карту, которой уже совершали платеж. В целях вашей безопасности мы храним только ссылку на данные карты. Данные карты хранит банк.
    .ert-card-payment-page__list-card.mb-48
      .ert-card-payment-page-list-card(
        :class="{ 'is-scroll': isSliderLongerContent, 'is-end': isEndScrollbar, 'is-start': isStartScrollbar }"
        ref="button-content"
      )
        .ert-card-payment-page-list-card__slider(
          :style="sliderStyle"
          ref="button-slider"
          v-touch="{ left: onLeftHandler, right: onRightHandler }"
          @wheel="onScrollEvent"
        )
          .ert-card-payment-page-list-card__item.is-new(
            :class="{ 'is-active': activeCardNumber === 0 }"
            @click="() => { activeCardNumber = 0 }"
          )
            .content
              .new-card-title Оплатить новой картой
              .new-card-is-remember(@click.stop="() => {}")
                ErtCheckbox(
                  v-model="isRememberNewCard"
                  hideDetails
                )
                  template(v-slot:label)
                    .new-card-is-remember__label Запомнить
          .ert-card-payment-page-list-card__item(
            v-for="(card, idx) in cardList"
            :key="idx + 1"
            :class="{ 'is-active': activeCardNumber === (idx + 1), [definePaymentCardSystem(card.maskedPan)]: true }"
            @click="() => { activeCardNumber = (idx + 1) }"
          )
            .content
              .top-info
                .logo
                  img(:src="require(`@/assets/images/payment_card/${definePaymentCardSystem(card.maskedPan)}.svg`)")
                .card-number
                  | &#8226;&#8226;&#8226; {{ card.maskedPan.slice(-4) }}
              .autopay(@click.stop="() => {}")
                ErtSwitch(
                  :hideDetails="true"
                  :value="card.autopay"
                  ref="autopay-switch"
                  @change="() => { autoPayCardHandler(idx) }"
                )
                  template(v-slot:label)
                    .autopay-label
                      | Автоплатёж
              button.remove(@click.stop="() => { removeCardHandler(idx) }")
                ErtIcon(name="close" small)
                span Удалить
    ErtForm(ref="amount-form")
      .ert-card-payment-page__amount-to-pay.mb-16
        ErtTextField(
          v-model="amountToPay"
          label="Сумма платежа"
          ref="amount-to-pay"
          suffix="₽"
          mask="money"
          :placeholder="amountPlaceholder"
          :rules="validateRulesAmount"
        )
      .body-font.mb-12.mb-md-20
        | Кассовый чек будет отправлен на указанную почту.
      .ert-card-payment-page__list-email.mb-16
        ErtCombobox(
          v-model="email"
          :items="lazyListEmail"
          label="Эл. почта"
          :search-input.sync="searchEmail"
          :rules="validateRulesEmail"
        )
          template(v-slot:no-data)
            ErtListItem
              ErtListItemContent
                ErtListItemTitle
                  | Нажмите <kbd>Enter</kbd> для добавления &laquo;{{ searchEmail }}&raquo;
      .ert-card-payment-page__actions
        .ert-card-payment-page__action.mb-24.mb-sm-0.mr-sm-24
          ErButton(
            :disabled="isDisablePaymentButton"
            @click="onClickPaymentHandler"
          )
            | Оплатить
        .ert-card-payment-page__terms
          | Нажимая на кнопку, Вы принимаете&nbsp;
          a(
            :href="offerLink"
            target="_blank"
            rel="noopener"
            data-ga-category="payments"
            data-ga-label="paybycardpolicy"
          ) условия оплаты и безопасности

    ErtDialog(
      v-model="isShowDialogConfirmNewCard"
      :persistent="isPaymentNewCardRequest"
      maxWidth="561"
    )
      .ert-card-payment-page__dialog-content
        .h3.mb-24 Оплата новой картой
        .body-font Вы уверены, что хотите оплатить {{ amountToPay }} ₽ новой картой?
        .caption2.mb-40 Вы будете перенаправлены на платёжный шлюз
        .ert-card-payment-page__dialog-footer
          .ert-card-payment-page__dialog-action.mb-8.mb-sm-0.mr-sm-12
            ErButton(
              :loading="isPaymentNewCardRequest"
              @click="onPaymentNewCardHandler"
            ) Оплатить
          .ert-card-payment-page__dialog-action.mb-8.mb-sm-0.ml-sm-12.mr-sm-12
            ErButton(
              :disabled="isPaymentNewCardRequest"
              :flat="true"
              @click="() => { isShowDialogConfirmNewCard = false }"
            ) Отмена
          .ert-card-payment-page__dialog-terms.ml-sm-12
            | Нажимая на кнопку, Вы принимаете&nbsp;
            a(
              :href="offerLink"
              target="_blank"
              rel="noopener"
              data-ga-category="payments"
              data-ga-label="paybycardpolicy"
            ) условия оплаты и безопасности

    ErtDialog(
      v-model="isShowDialogConfirmBindCard"
      maxWidth="561"
      :persistent="isPaymentBindCardRequest"
    )
      .ert-card-payment-page__dialog-content
        .h3.mb-24 Введите CVC/CVV
        .body-font.mb-24 Для оплаты {{ amountToPay }} ₽ введите код безопасности карты&nbsp;
          | {{ getPaymentCardSystemOfActiveCard }} {{ getCardNumberOfActiveCard }}
        .ert-card-payment-page__dialog-cvv.mb-40
          ErtOtpInput(
            v-model="cvc"
            type="number"
            length="3"
            inputmode="numeric"
          )
        .ert-card-payment-page__dialog-footer
          .ert-card-payment-page__dialog-action.mb-8.mb-sm-0.mr-sm-12
            ErButton(
              :disabled="!cvc || cvc.length !== 3"
              :loading="isPaymentBindCardRequest"
              @click="onPaymentBindCardHandler"
            ) Оплатить
          .ert-card-payment-page__dialog-action.mb-8.mb-sm-0.ml-sm-12.mr-sm-12
            ErButton(
              :disabled="isPaymentBindCardRequest"
              :flat="true"
              @click="() => { isShowDialogConfirmBindCard = false }"
            ) Отмена
          .ert-card-payment-page__dialog-terms.ml-sm-12
            | Нажимая на кнопку, Вы принимаете&nbsp;
            a(
              :href="offerLink"
              target="_blank"
              rel="noopener"
              data-ga-category="payments"
              data-ga-label="paybycardpolicy"
            ) условия оплаты и безопасности

    ErActivationModal(
      v-model="isErrorOfPayment"
      type="error"
      title="При оплате картой произошла ошибка!"
      actionButtonText="Отправить"
      cancelButtonText="Закрыть"
      @confirm="() => { createOpenedRequest('CN_CARD_PAYMENT'); isErrorOfPayment = false }"
    )
      template(v-slot:description)
        .caption Повторите попытку позже или отправьте обращение. Статус обращения вы сможете отслеживать в разделе «Поддержка».
        .caption2 В случае отправки обращения оно будет отправлено в фоновом режиме и данное окно будет закрыто

    // Удаление карты
    ErActivationModal(
      v-model="isShowDialogUnbindCard"
      type="question"
      :title="`Вы уверены, что хотите удалить карту ${definePaymentCardSystem(unbindingCard.maskedPan).toUpperCase()} ${unbindingCard.maskedPan}?`"
      actionButtonText="Удалить"
      cancelButtonText="Отмена"
      :isLoadingConfirm="isUnbindCardRequest"
      @confirm="removeCardRequestHandler"
    )

    ErActivationModal(
      v-model="isDialogUnbindCardError"
      type="error"
      title="При удалении карты произошла ошибка"
      :isShowActionButton="false"
      cancelButtonText="Закрыть"
    )
      template(v-slot:description)
        .caption Повторите попытку позднее

    ErActivationModal(
      v-model="isDialogUnbindCardSuccess"
      title="Карта успешно удалена"
      type="success"
      :isShowCancelButton="false"
      actionButtonText="Закрыть"
      @confirm="() => { isDialogUnbindCardSuccess = false }"
    )

    // Подключение/Отключение автоплатежа
    ErActivationModal(
      v-model="isShowDialogSwitchAutoPay"
      type="question"
      :title="titleAutoPayDialog"
      :actionButtonText="cardList[autoPayCardNumber] && cardList[autoPayCardNumber].autopay ? 'Отключить' : 'Подключить'"
      cancelButtonText="Отмена"
      :persistent="true"
      :isLoadingConfirm="isAutoPayRequest"
      @close="onCloseAutoPayDialogHandler"
      @confirm="onAutoPayHandler"
    )

    ErActivationModal(
      v-model="isShowDialogSwitchAutoPayError"
      type="error"
      :title="`При ${cardList[autoPayCardNumber] && cardList[autoPayCardNumber].autopay ? 'отключении' : 'подключении'} автоплатежа произошла ошибка`"
      actionButtonText="Отправить"
      cancelButtonText="Закрыть"
      @confirm="() => { createOpenedRequest('CN_AUTO_PAY'); isShowDialogSwitchAutoPayError = false }"
    )
      template(v-slot:description)
        .caption Повторите попытку позже или отправьте обращение. Статус обращения вы сможете отслеживать в разделе «Поддержка».
        .caption2 В случае отправки обращения оно будет отправлено в фоновом режиме и данное окно будет закрыто

    ErActivationModal(
      v-model="isShowDialogSwitchAutoPaySuccess"
      :title="`Автоплатёж успешно ${cardList[autoPayCardNumber] && cardList[autoPayCardNumber].autopay ? 'подключён' : 'отключён'}`"
      type="success"
      :isShowCancelButton="false"
      actionButtonText="Закрыть"
      @confirm="() => { isShowDialogSwitchAutoPaySuccess = false }"
    )

    // Попытка оплатить или подключить/отключить автоплатёж на закрытом л/с
    ErActivationModal(
      v-model="isCloseBillingAccount"
      type="error"
      title="Вы пытаетесь совершить операцию на закрытом лицевом счете"
      :isShowActionButton="false"
      cancelButtonText="Закрыть"
    )
      template(v-slot:description)
        .caption Выберите другой лицевой счёт и повторите попытку
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
