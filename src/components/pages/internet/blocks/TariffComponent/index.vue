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
        .chart-loading(v-show="isLoadingCustomerProduct")
        .chart(v-show="!isLoadingCustomerProduct")
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .title
            | Скорость соединения
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .button
            button(@click="() => { openBlur(false) }")
              | Изменить
      .tariff-component__limit
        .chart-loading(v-show="isLoadingCustomerProduct")
        .chart(v-show="!isLoadingCustomerProduct")
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .title
            | Порог доступного трафика
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
      .tariff-component__turbo-activation
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          template(v-if="isOnTurbo")
            er-button(
              pre-icon="speedup"
              color="green"
              @click="() => { isDisconnectionTurbo = true }"
            )
              | Отключить турбо-режим
            .date-activate.mt-24.mb-16
              .caption.mb-4
                | Активен на период
              .value
                er-icon.mr-8(name="calendar")
                | 10.08.18 - 11.08.18
            .price
              .caption.mb-4
                | Стоимость за период
              .value
                span.mr-4 {{ turboPrice | price }}
                | {{ currencyCode }}
          template(v-else)
            er-button(pre-icon="speedup" @click="() => { openBlur(true) }" :disabled="!isAvailableTurbo")
              | Турбо-режим
      .tariff-component__price
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .caption
            | Абонентская плата
          .price
            span {{ recurrentTotal | price }}
            | &nbsp;{{ currencyCode }}/месяц
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
          button(@click="getInfoList")
            | Настройки соединения
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
      @confirm="sendSailOrder"
    )
      template(slot="description")
        .tariff-component__offer.d--flex.align-items-center.mb-8
          er-toggle(
            view="radio-check"
            v-model="isOffer"
          )
          .text
            span
              | Вы должны принять
            | &nbsp;
            a(href="#") условия оферты
        .tariff-component__connect-price
          | Стоимость услуги составит <span>{{ (isTurboActivation ? turboPriceAfterIncrease : priceAfterIncrease) | price }}</span>&nbsp;{{ currencyCode }}/месяц
    er-activation-modal(
      v-model="isShowErrorDialog"
      type="error"
      title="Произошла ошибка! Повторите попытку позже"
      :is-show-action-button="false"
      cancel-button-text="Закрыть"
    )
      template(slot="description")
        | {{ errorText }}
    er-activation-modal(
      v-model="isShowSuccessDialog"
      type="success"
      title="Подключение успешно выполнено"
      :is-show-action-button="false"
      cancel-button-text="Закрыть"
    )
    er-disconnect-product(
      v-model="isDisconnectionTurbo"
      :delete-order-data="turboDetails"
      is-send-order
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
