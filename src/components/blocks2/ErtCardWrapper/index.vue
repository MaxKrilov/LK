<template lang="pug">
  .ert-card-wrapper
    slot
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ert-card-wrapper'
})
</script>

<style lang="scss">
.ert-card-wrapper {
  width: calc(100% + 64px);
  margin: 0 -32px;

  @include min-breakpoint('md') {
    width: 100%;
    margin: 0;
  }
}
</style>
