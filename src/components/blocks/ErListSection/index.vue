<template lang="pug">
  .er-list-section
    .er-list-section__title
      slot(name="title") {{ title }}
    .er-list-section__list
      slot
</template>

<script>
export default {
  name: 'er-list-section',
  props: {
    title: String
  }
}
</script>

<style lang="scss">
.er-list-section {

  &__title {
    @extend %h2;
    @extend %main-content-width;
    @extend %main-content-padding-h;
    margin-top: $padding-x12;

    @include min-breakpoint(md) {
      margin-top: $padding-x14;
    }
  }

  &__list {
    @extend %main-content-width;

    @include min-breakpoint("md") {
      margin-top: $padding-x8;
      padding: {
        left: map_get($main-content-padding, "md");
        right: map_get($main-content-padding, "md");
      }
    }

    @include min-breakpoint("lg") {
      padding: 0 map_get($main-content-padding, "lg");
    }

    @include min-breakpoint("xl") {
      padding: 0 map_get($main-content-padding, "xl");
    }

    @include min-breakpoint("xxl") {
      padding: 0 map_get($main-content-padding, "xxl");
    }

  }
}
</style>
