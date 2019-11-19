<template lang="pug">
  .er-ripple-s(
    :class="{'er-ripple-s--active': active }"
    :style="styleObject"
    ref="parent"
  )
    .er-ripple-s__background(ref="background")
</template>

<script lang="js" src="./script.js"></script>
<style lang="scss" src="./style.scss"></style>
