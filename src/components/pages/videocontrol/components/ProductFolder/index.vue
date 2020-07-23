<template lang="pug" src="./product-folder.pug"></template>

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

<style lang="scss" src="./product-folder.scss"></style>
