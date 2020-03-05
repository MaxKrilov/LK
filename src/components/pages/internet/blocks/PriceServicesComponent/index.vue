<template lang="pug">
  .price-services-component
    .price-services-component__total.d--flex.align-items-center(@click="toggleList")
      .title
        | Итого по услуге
      .price.ml-auto
        span 37 500&nbsp;
        | ₽/месяц
      .toggle.ml-8
        er-icon(name="corner_down")
    er-slide-up-down(:active="isOpenList")
      .price-services-component__detail
        .price-services-component__detail-item.d--flex.align-items-center
          .name Тариф «Бизнес драйв 2»
          .price.ml-auto
            span 27 500&nbsp;
            | ₽/месяц
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
