<template lang="pug">
  .er-total-block
    .er-total-block__label {{ label }}
    .er-total-block__sum
      template(v-if="!loading")
        er-price
          slot
      template(v-else)
        pu-skeleton(width="80px")
</template>

<script>
/*
  Блок с ценником и надписью «Итого»

  Пример использования:

  ErTotalPrice {{ price }}
*/

export default {
  name: 'ErTotalPrice',
  props: {
    label: {
      type: String,
      default: 'Итого'
    },
    loading: Boolean
  }
}
</script>

<style lang="scss">
.er-total-block {
  border-radius: $padding-x3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $padding-x12;
  background-color: map-get($gray, '4');

  padding: 0 $padding-x4;

  @include min-breakpoint(sm) {
    padding: 0 $padding-x6;
  }

  @include min-breakpoint(xl) {
    padding: 0 $padding-x8;
  }

  @include max-breakpoint("md") {
    border-radius: 0;
  }

  &__label {
    @extend %body;
  }
}
</style>
