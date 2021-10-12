<template lang="pug">
.er-delete-button(@click="onClick")
  er-icon(name="trashbox")
  template(v-if="label")
    .er-delete-button__label {{ label }}
</template>

<script lang="js">
export default {
  name: 'er-delete-button',
  props: {
    label: {
      type: String,
      default: 'Удалить'
    }
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
