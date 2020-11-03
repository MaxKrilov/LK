<template lang="pug">
  .ert-gradient-card
    .ert-gradient-card__content(:class="contentClass")
      slot
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ert-gradient-card',
  props: {
    contentClass: {
      type: [String, Array, Object],
      default: ''
    }
  }
})
</script>

<style lang="scss">
.ert-gradient-card {
  width: 100%;
  background: $border-gradient;
  padding: 1px;
  border-radius: $border-radius;

  &__content {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}
</style>
