<template lang="pug">
  .total-block
    .total-block__label {{ label }}
    .total-block__sum
      template(v-if="!loading")
        er-price
          slot
      template(v-else)
        pu-skeleton(width="80px")
</template>

<script>
export default {
  name: 'total-block',
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
.total-block {
  border-radius: $padding-x3;
  align-items: center;

  height: $padding-x12;
  @include max-breakpoint("md") {
    border-radius: 0;
  }

  @include content-padding-breakpoint("left", "md");
  @include content-padding-breakpoint("right", "md");

  &__label {
    @extend %body;
  }
}
</style>
