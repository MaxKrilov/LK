<template lang="pug">
  .ert-wifi-service-auth-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="Сервисы авторизации"
      backlink="/lk"
    )

    .ert-wifi-service-auth-page__list-point
      ErListPoints(
        :list="listPoint"
        v-model="activePoint"
        :isLoading="isLoadingListPoint"
      )
    transition(name="fade" mode="out-in")
      .ert-wifi-service-auth-page__loading(v-if="isLoadingCustomerProduct")
        ErtProgressCircular(indeterminate width="2")
        .title Загружаем сервисы авторизации
      .ert-wifi-service-auth-page__restore(v-else-if="isStopped")
        .ert-wifi-personalization-page__suspended.mb-24
          | Услуга приостановлена! Восстановите услугу для дальнейшего использования
        er-button.ert-wifi-personalization-page__restore-button(
          color="yellow"
          @click="$router.push('/lk/support?form=restoring_a_contract_or_service')"
        ) Восстановить
      .ert-wifi-service-auth-page__list(v-else)
        ErtWifiServiceAuthItem.mb-4(
          v-for="serviceAuth in getListServiceAuth"
          :key="serviceAuth.code"
          :code="serviceAuth.code"
          :description="serviceAuth.description"
          :saName="serviceAuth.name"
          :status="serviceAuth.status"
          :price="getSLOPrice(serviceAuth)"
          :chars="serviceAuth.chars"
          :bpi="activePoint.bpi"
          :ref="`service-auth__${serviceAuth.code.toLowerCase()}`"
          @connect="(e) => onConnect(serviceAuth.code, e)"
          @disconnect="onDisconnect(serviceAuth.code, serviceAuth.productId)"
        )

    ErPlugProduct(
      v-model="isShowPlugProductPlugin"
      :orderData="getOrderData"
      isSendOrder
      :isUpdate="isActiveCurrentSLO"
      :plugButtonName="isActiveCurrentSLO ? 'Изменить' : 'Подключить'"
      @cancelOrder="onCancelOrder"
      @errorOrder="onErrorOrder"
      @successOrder="onSuccessOrder"
    )
      template(v-slot:offerDescription)
        div.caption1.my-8(v-if="!isActiveCurrentSLO")
          | Стоимость услуги составит {{ (getOrderTitleNPrice ? getOrderTitleNPrice.price : 0) | priceFormatted }} ₽/мес

    ErDisconnectProduct(
      v-model="isShowDisconnectProductPlugin"
      :deleteOrderData="getDisconnectData"
      isSendOrder
      @cancelOrder="onCancelOrder"
      @errorOrder="onErrorOrder"
      @successOrder="onSuccessOrder"
    )
    //- Используется для подключения, отключения и модификации услуги "Закрытая сеть"
    ErPlugProduct(
      v-model="isShowPlugProductPluginManager"
      :requestData="getRequestData"
      isSendManagerRequest
      @cancelOrder="onCancelOrder"
      @errorOrder="onErrorOrder"
      @successOrder="onSuccessOrder"
    )

    //- Выводим в случае, если денежных средств недостаточно
    ErActivationModal(
      type="info"
      v-model="isShowMoneyModal"
      actionButtonText="Пополнить  счёт"
      @confirm="onToPayment()"
      cancel-button-text="Закрыть"
    )
      template(v-slot:description)
        .h4 Уважаемый клиент, для завершения заказа на лицевом счете не достаточно денежных средств. Пополните лицевой счет и повторите покупку.
        .caption.text-color-black08 Стоимость подключения: <b>{{ getOrderTitleNPrice && getOrderTitleNPrice.price }}</b> ₽
        .caption.text-color-black08 Ваши доступные средства: <b>{{ availableFundsAmt }}</b> ₽

    ErActivationModal(
      type="error"
      v-model="isErrorMoney"
      title="Возникла ошибка"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
    )
    template(slot="description")
      div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
