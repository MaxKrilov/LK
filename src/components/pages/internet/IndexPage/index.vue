<template lang="pug">
  div.internet-index-page.main-content.main-content--padding
    tariff-component.mb-48(:customer-product="customerProduct")
    services-component(:customer-product="customerProduct")
    price-services-component(:customer-product="customerProduct")
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
