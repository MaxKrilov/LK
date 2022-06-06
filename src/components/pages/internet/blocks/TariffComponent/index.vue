<template lang="pug">
  .tariff-component
    .change-speed-component.d--flex.flex-column.flex-lg-row.align-items-lg-center.justify-content-lg-center(:class="{ visible: isBlur }")
      include ./blocks/change_speed_component
    .content(:class="{ blur: isBlur }")
      .tariff-component__tariff-name
        .activation-date
          template(v-if="isLoadingCustomerProduct")
            PuSkeleton
          template(v-else)
            | Тариф активен с:&nbsp;
            span {{ actualStartDate }}
        .name
          template(v-if="isLoadingCustomerProduct")
            PuSkeleton
          template(v-else)
            | {{ offerOriginalName }}
      .tariff-component__speed
        .chart-loading(v-show="isLoadingCustomerProduct || internalIsLoadingCustomerProduct")
        .chart(v-show="!isLoadingCustomerProduct && !internalIsLoadingCustomerProduct")
        template(v-if="isLoadingCustomerProduct || internalIsLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .title
            | Скорость соединения
        template(v-if="isLoadingCustomerProduct || internalIsLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .button(v-if="listAvailableSpeedIncrease.length > 0")
            button(
              @click="() => { openBlur(false) }"
              data-ga-category="internet"
              data-ga-label="tarifchange"
            )
              | Изменить
      .tariff-component__limit
        .chart-loading(v-show="isLoadingBillingPacket")
        .chart(v-show="!isLoadingBillingPacket")
        template(v-if="isLoadingBillingPacket")
          PuSkeleton
        template(v-else)
          .title
            | Порог доступного трафика
        template(v-if="isLoadingBillingPacket")
          PuSkeleton
        template(v-else)
      .tariff-component__turbo-activation
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          template(v-if="isOnTurbo")
            er-button.tariff-component__turbo-activation-button--active(
              pre-icon="speedup"
              color="green"
              :loading="isDisconnectionTurbo"
              @click="() => { isDisconnectionTurbo = true }"
            )
              | Отключить турбо-режим
            .date-activate.mt-24.mb-16
              .caption.mb-4
                | Активен на период
              .value
                er-icon.mr-8(name="calendar")
                | {{ getTurboPeriod }}
            .price
              .caption.mb-4
                | Стоимость за период
              .value
                span.mr-4 {{ turboPrice | price }}
                | {{ currencyCode }}
          template(v-else-if="isAvailableTurbo")
            er-button(
              pre-icon="speedup"
              :disabled="freeBonusValue !== 0"
              data-ga-category="internet"
              data-ga-label="tarifturbo"
              @click="() => { openBlur(true) }"
            )
              | Турбо-режим
            //- .caption2.error--text(v-if="freeBonusValue !== 0")
              | Вы не можете активировать &laquo;Скоростной бонус&raquo;, так как у вас уже активирована&nbsp;
              | услуга &laquo;Бесплатного бонуса&raquo;
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)

      .tariff-component__price
        template(v-if="isLoadingCustomerProduct || internalIsLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .caption
            | Абонентская плата
          .price
            span {{ recurrentTotal | price }}
            | &nbsp;{{ currencyCode }}/месяц
          .fb-text.caption2(v-if="freeBonusValue !== 0")
            | У вас активирован Бесплатный бонус скорости
      .tariff-component__turbo-price
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          template(v-if="isOnTurbo")
            .caption
              | Турбо-режим
            .price
              span {{ turboPrice }}
              | &nbsp;{{ currencyCode }}/период
      .tariff-component__settings
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          er-icon(name="settings")
          button(
            @click="getInfoList"
            data-ga-category="internet"
            data-ga-label="tarifsettings"
          )
            | Настройки соединения
      .tariff-component__auth-type
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .caption
            | Тип авторизации
          .value
            | {{ getAuthType }}&nbsp;
            button.ml-16(
              @click="() => { isShowModalForChangeAuthType = true }"
              data-ga-category="internet"
              data-ga-label="tarifipoe"
            )
              | Сменить на {{ getAuthTypeForChange }}
    infolist-viewer(
      v-model="isShowInfolistViewer"
      :id="parentId"
    )
    er-activation-modal(
      v-model="isShowOfferDialog"
      type="question"
      :title="connectTitle"
      persistent
      :action-button-text="connectActionButtonText"
      :disabled-action-button="!isOffer"
      :is-loading-confirm="isOfferAccepting"
      analyticConfirmCategory="internet"
      analyticCancelCategory="internet"
      analyticCloseCategory="internet"
      :analyticConfirmLabel="isTurboActivation ? 'turboconnectyes' : 'changespeedyeschange '"
      :analyticCancelLabel="isTurboActivation ? 'turboconnectdecline' : 'changespeedyescancel'"
      :analyticCloseLabel="isTurboActivation ? 'turboconnectclose' : 'changespeedyesclose'"
      @confirm="sendSailOrder"
    )
      template(slot="description")
        .tariff-component__offer.d--flex.align-items-center.mb-8
          er-toggle(
            view="radio-check"
            v-model="isOffer"
            data-ga-category="internet"
            :data-ga-label="isTurboActivation ? 'turboconnectagreeoffer' : 'changespeedyesagree'"
          )
          .text
            span
              | Вы должны принять
            | &nbsp;
            a(
              :href="offerLink"
              target="_blank"
              data-ga-category="internet"
              :data-ga-label="isTurboActivation ? 'turboconnectreadoffer' : 'changespeedyesoffer'"
            ) условия оферты
        .tariff-component__connect-price
          | Стоимость услуги составит <span>{{ (isTurboActivation ? turboPriceAfterIncrease : priceAfterIncrease) | price }}</span>&nbsp;{{ currencyCode }}/месяц
    er-activation-modal(
      v-model="isShowErrorDialog"
      type="error"
      title="Произошла ошибка"
      :is-show-action-button="false"
      cancel-button-text="Закрыть"
      analyticCancelCategory="internet"
      analyticCloseCategory="internet"
      :analyticCancelLabel="isTurboActivation ? 'turboconnectnoclosebutton' : ''"
      :analyticCloseLabel="isTurboActivation ? 'turboconnectnoclose' : ''"
    )
      template(slot="description")
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру
    er-activation-modal(
      v-model="isShowSuccessDialog"
      type="success"
      title="Заказ успешно сформирован"
      :is-show-action-button="false"
      cancel-button-text="Закрыть"
      analyticConfirmCategory="internet"
      analyticCloseCategory="internet"
      :analyticConfirmLabel="isTurboActivation ? 'turboconnectyesthankyou' : ''"
      :analyticCloseLabel="isTurboActivation ? 'turboconnectyesclose' : ''"
    )
      template(slot="description")
        | Заказ создан успешно. Выполнение заказа может занять некоторое время.&nbsp;
        | Актуальный статус можно узнать в&nbsp;
        router-link(to="/lk/orders") разделе Заказы.
    er-disconnect-product(
      v-model="isDisconnectionTurbo"
      :delete-order-data="turboDetails"
      is-send-order
    )

    ErActivationModal(
      type="info"
      v-model="isShowMoneyModal"
      actionButtonText="Пополнить  счёт"
      @confirm="onToPayment()"
      cancel-button-text="Закрыть"
    )
      template(v-slot:description)
        .h4 Уважаемый клиент, для завершения заказа на лицевом счете не достаточно денежных средств. Пополните лицевой счет и повторите покупку.
        .caption.text-color-black08 Стоимость подключения: <b>{{ lazyPriceIncrease }}</b> ₽
        .caption.text-color-black08 Ваши доступные средства: <b>{{ availableFundsAmt }}</b> ₽
    ErPlugProduct(
      v-model="isShowModalForChangeAuthType"
      isSendManagerRequest,
      :requestData="getRequestDataForChangeAuthType"
      analyticConfirmCategory="internet"
      analyticCancelCategory="internet"
      analyticCloseCategory="internet"
      analyticConfirmLabel="changeautsend"
      analyticCancelLabel="changeautcancel"
      analyticCloseLabel="changeautclose"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
