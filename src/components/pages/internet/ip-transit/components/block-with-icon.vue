<template lang="pug">
.block-with-icon
  .block-with-icon__icon
    er-icon(:name="icon")
  .block-with-icon__wrap-text
    .block-with-icon__label {{ label }}:
    .block-with-icon__value {{ value }}
</template>

<script>
export default {
  name: 'block-with-icon',
  props: ['icon', 'label', 'value']
}
</script>

<style lang="scss" scoped>
.block-with-icon {
  display: flex;
  flex-direction: row;
  gap: $padding-x2;

  &__wrap-text {
    display: flex;
    flex-direction: column;
    gap: $padding-x1;
  }

  &__icon {
    @include color-black(0.2);

    svg {
      width: $padding-x6;
      height: $padding-x6;

      @include min-breakpoint(md) {
        width: $padding-x8;
        height: $padding-x8;
      }
    }
  }
  &__label {
    @extend %caption2;
  }
  &__value {
    @extend %h4;
  }
}
</style>
