<template lang="pug">
  .access-item
    .access-item__content
      slot

    .access-item__button
      template(v-if="showCloseButton")
        er-close-button(@click="onDelete")

      template(v-else-if="showLinkButton")
        router-link(:to="to")
          er-icon(name="link")

</template>

<script>
export default {
  name: 'access-item',
  props: {
    showCloseButton: Boolean,
    to: String,
    showLinkButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onDelete () {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss">
.access-item {
  $self: &;
  @extend %small-rounded-block;
  height: $padding-x8;
  display: flex;
  align-items: center;
  padding: 0 $padding-x3;

  &:hover {
    background-color: map_get($gray, '16');
  }

  &:not(:hover) {
    #{$self}__button {
      opacity: .4;
    }
  }

  &:active,
  &--active {
    background: map_get($red, "base");
  }

  &__content {
    display: flex;
    flex-grow: 1;
    user-select: none;
    @extend %body-font;
  }
}
</style>
