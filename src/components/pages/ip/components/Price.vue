<template lang="pug">
  .price
    span.price__sum {{ sum }}
    span.price__units
      span.rub
      span.price__month месяц
</template>

<script>
export default {
  props: {
    sum: Number
  }
}
</script>

<style lang="scss">
.price {
  display: inline-block;

  &__sum {
    @extend %h2;
  }

  &__units {
    white-space: nowrap;
    @extend %caption2;

    margin-left: $padding-x1;
  }

  &__month {
    &::before {
      content: '/'
    }
  }
}
</style>
