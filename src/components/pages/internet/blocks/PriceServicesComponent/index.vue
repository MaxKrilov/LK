<template lang="pug">
  .price-services-component
    .price-services-component__total.d--flex.align-items-center(
      @click="toggleList"
      data-ga-category="internet"
      data-ga-label="servicedetalization"
    )
      .title
        | Итого по услуге
      .price.ml-auto
        span {{ totalSummary | price }}&nbsp;
        | {{ currency }}
      .toggle.ml-8
        er-icon(name="corner_down")
    er-slide-up-down(:active="isOpenList")
      .price-services-component__detail
        .price-services-component__detail-item.d--flex.align-items-center(
          v-for="service in priceOfServices"
          :key="service.name"
        )
          .name {{ service.name }}
          .price.ml-auto
            span {{ service.price | price }}&nbsp;
            | {{ service.currency }}
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
