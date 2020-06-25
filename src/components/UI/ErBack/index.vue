<template lang="pug">
.er-back
  router-link(
    :to="to"
    @click="onClick()"
  ).er-back__button
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
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
