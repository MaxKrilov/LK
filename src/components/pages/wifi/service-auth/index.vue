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
          :ref="`service-auth__${serviceAuth.code.toLowerCase()}`"
          @connect="(e) => onConnect(serviceAuth.code, e)"
          @disconnect="onDisconnect(serviceAuth.code, serviceAuth.productId)"
        )

    ErPlugProduct(
      v-model="isShowPlugProductPlugin"
      :orderData="getOrderData"
      isSendOrder
      :isUpdate="isActiveCurrentSLO"
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
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
