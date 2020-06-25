<template lang="pug" src="./template.pug"></template>

<script>
export default {
  props: {
    name: String,
    date: String,
    price: String,
    stopped: Boolean,
    loading: Boolean
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
