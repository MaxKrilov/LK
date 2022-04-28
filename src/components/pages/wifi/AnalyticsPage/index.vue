<template lang="pug">
  .ert-analytics-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    ErPageHeader(
      linkText="Назад на главную"
      title="Аналитика"
      backlink="/lk"
    )

    template(v-if="isLoadingData")
      ErCardProducts(loading)
      ErCardProducts(loading)
      ErCardProducts(loading)

    template(v-else-if="isErrorLoaded")
      .ert-analytics-page__is-error
        .title При загрузке возникла ошибка! Повторите запрос позднее

    template(v-else-if="!hasLeastOneActiveOrSuspendedPoint")
      ErPromo(
        banner="wifi-analytics-promo.png"
        :featureList="analyticsFeatureList"
        :isLoadingConnectButton="isShowDialogOfListPoint"
        @click="onShowDialogOfListPointHandler"
      )

    template(v-else)
      ErCardProducts(
        v-for="(product, idx) in listCustomerProduct"
        :key="idx"
        :price="product.purchasedPrices.recurrentTotal.value"
        :date="actualStartDateFormat(product.actualStartDate)"
        :stoped="product.status === statusSuspended"
      )
        | {{ getAddressByBPI(product.parentId) }}
        template(v-slot:slider-content)
          .ert-analytics-page__slider-content
            template(v-if="product.status === statusSuspended")
              .ert-analytics-page__slider-content-action
                ErButton(
                  @click="$router.push('/lk/support?form=restoring_a_contract_or_service')"
                ) Восстановить
            template(v-else)
              .ert-analytics-page__slider-content-action.mb-8.mb-sm-0.mr-sm-12
                ErButton(
                  :disabled="flagRequestRadarLink[product.parentId]"
                  @click="() => { onGetRadarLinkHandler(product.parentId) }"
                ) {{ flagRequestRadarLink[product.parentId] ? 'Подождите' : 'Перейти на портал' }}
              .ert-analytics-page__slider-content-action.ml-sm-12
                ErButton(
                  :loading="flagDisconnect[product.parentId] || isShowDisconnectProduct"
                  flat
                  @click="() => { onDisconnectHandler(product.parentId) }"
                ) Отключить

      .ert-analytics-page__connect.promo-component__buttons.mt-40
        ErButton(
          color="blue"
          @click="onShowDialogOfListPointHandler"
        ) Подключить

      ErDisconnectProduct(
        v-model="isShowDisconnectProduct"
        :deleteOrderData="disconnectData"
        isSendOrder
        @cancelOrder="onCompletedDisconnect"
        @errorOrder="onCompletedDisconnect"
        @successOrder="onCompletedDisconnect"
      )

    // Выбор точки подключения
    ErtDialog(
      v-model="isShowDialogOfListPoint"
      maxWidth="599"
      persistent
    )
      .ert-analytics-page__list-point-dialog
        .ert-analytics-page__list-point-dialog-head.d--flex.justify-content-between.mb-24
          .title.h3 Выберите точку для подключения
          button.close(@click="onHideDialogOfListPointHandler")
            ErtIcon(name="close" small)
        .ert-analytics-page__list-point-dialog-body.mb-24
          template(v-if="listPointWithoutAnalytics.length")
            .ert-analytics-page__list-point-dialog__item(
              v-for="point in listPointWithoutAnalytics"
              :key="point.bpi"
            )
              ErtCheckbox(v-model="connectPoint" :value="point")
                template(v-slot:label)
                  | {{ point.fulladdress }}
          template(v-else)
            .body-font Нет доступных для подключения точек
        .ert-analytics-page__list-point-dialog-footer
          .action.mb-8.mb-sm-0.mr-sm-12
            ErButton(
              :disabled="connectPoint.length === 0"
              :loading="isCheckingMoney || isShowPlugProductPlugin"
              @click="onConnectHandler"
            ) Продолжить
          .action.ml-sm-12
            ErButton(flat @click="onHideDialogOfListPointHandler") Отмена

    ErActivationModal(
      type="info"
      v-model="isShowMoneyModal"
      actionButtonText="Пополнить счёт"
      @confirm="onToPayment()"
      cancel-button-text="Закрыть"
    )
      template(v-slot:description)
        .h4 Уважаемый клиент, для завершения заказа на лицевом счете не достаточно денежных средств. Пополните лицевой счет и повторите покупку.
        .caption.text-color-black08 Стоимость подключения: <b>{{ priceForConnection | priceFormatted }}</b> ₽
        .caption.text-color-black08 Ваши доступные средства: <b>{{ availableFundsAmt | priceFormatted }}</b> ₽

    ErActivationModal(
      type="error"
      v-model="isErrorMoney"
      title="Возникла ошибка"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
    )
      template(v-slot:description)
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру

    ErPlugProduct(
      v-model="isShowPlugProductPlugin"
      :orderData="orderData"
      isSendOrder
      @cancelOrder="() => { isShowDialogOfListPoint = false }"
      @errorOrder="() => { isShowDialogOfListPoint = false }"
      @successOrder="() => { isShowDialogOfListPoint = false }"
    )
      template(v-slot:offerDescription)
        div.caption1.my-8
          | Стоимость услуги составит {{ priceForConnection | priceFormatted }} ₽/мес
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
