<template lang="pug">
.er-close-button(
  @click="$emit('click')"
)
  er-icon(name="close")
</template>

<style lang="scss">
.er-close-button {
  cursor: pointer;
  @include color-black(.5);

  width: 16px;
  transition: color $primary-transition;

  &:hover {
    @include color-black(.8);
  }

  .er-icon {
    svg {
      width: 16px
    }
  }
}
</style>
