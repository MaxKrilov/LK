<template lang="pug">
.er-back
  .er-back__button(@click="onClick()")
    er-icon(name="arrow_l", width="12").lg-show.arrow
    er-icon(name="corner_down", width="12").lg-hide.corner
    .er-back__title.lg-show {{ title }}
</template>

<script lang="js">
export default {
  props: {
    title: {
      type: String,
      default: 'Назад'
    },
    to: String
  },
  methods: {
    onClick () {
      this.$emit('click', this.to)
      this.$router.push({ path: this.to })
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
