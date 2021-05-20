<template lang="pug">
  div.internet-index-page.main-content.main-content--padding
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
    price-services-component(:customer-product="customerProduct" :is-loading-customer-product="isLoadingCustomerProduct")
    .internet-index-page__footer
      er-button(color="blue" @click="onClickPlug")
        | Подключить
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
