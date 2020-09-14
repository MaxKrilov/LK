<template lang="pug">
er-button.sort-button(@click="onClick")
  er-icon(name="funnel")
</template>

<script>
export default {
  name: 'sort-button',
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.sort-button.er-button {
  border-radius: 50%;
  background: transparent;
  height: $padding-x6;
  width: $padding-x6;
  box-shadow: none !important;

  .er-icon.er-icon--funnel {
    svg {
      width: $padding-x4;
    }
  }
}
</style>
