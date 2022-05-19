<template lang="pug">
  div.internet-index-page.main-content.main-content--h-padding
    template(v-if="bundle")
      er-bundle-info(
        :name="bundle.name"
        :id="bundle.id"
        :showInfo="false"
        :showIcon="true"
      )

    tariff-component.mb-48(
      :customer-product="customerProduct"
      :is-loading-customer-product="isLoadingCustomerProduct"
      :location-id="locationId"
      :addressId="addressId"
      :fullAddress="fullAddress"
      :marketId="marketId"
      @update="updateData"
    )

    services-component(:customer-product="customerProduct" :is-loading-customer-product="isLoadingCustomerProduct")
    InternetDeviceComponent(:productId="getProductId", :listOfDevices="DEVICES")
    price-services-component(:customer-product="customerProduct" :is-loading-customer-product="isLoadingCustomerProduct")
    .internet-index-page__footer
      template(v-if="isStopped")
        er-button(
          color="blue"
          data-ga-category="internet"
          data-ga-label="serviceconnect"
          :loading="isRecovering"
          @click="recover"
        )
          | Восстановить
      template(v-else)
        er-button(
          color="blue"
          data-ga-category="internet"
          data-ga-label="serviceconnect"
          @click="onClickPlug"
        )
          | Подключить

    er-activation-modal(
    type="question"
    v-model="isShowResumeModal"
    title="Вы уверены, что хотите восстановить услугу?"
    @confirm="sendResumeOrder"
    @close="cancelOrder"
    :isLoadingConfirm="isSendingOrderResume"
    actionButtonText="Восстановить"
  )

    er-activation-modal(
    type="error"
    v-model="isShowErrorModal"
    title="Ошибка"
    cancel-button-text="Закрыть"
    :isShowActionButton="false"
    )
      template(slot="description")
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру

    er-activation-modal(
    type="success"
    v-model="isShowSuccessModal"
    title="Заказ создан успешно"
    :isShowActionButton="false"
    cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Заказ создан успешно. Выполнение заказа может занять некоторое время. Актуальный статус можно узнать в разделе Заказы.
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
