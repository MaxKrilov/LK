<template lang="pug">
  div.internet-index-page.main-content.main-content--padding
    tariff-component.mb-48(
      :customer-product="customerProduct"
      :is-loading-customer-product="isLoadingCustomerProduct"
      :location-id="locationId"
      )
    services-component(:customer-product="customerProduct" :is-loading-customer-product="isLoadingCustomerProduct")
    price-services-component(:customer-product="customerProduct" :is-loading-customer-product="isLoadingCustomerProduct")
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
