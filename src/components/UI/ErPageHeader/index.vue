<template lang="pug">
.page-header
  .page-header__body
    er-back(:title="linkText", :to="backlink")
    er-page-title(class="page-header__title" @click="$router.push(backlink)") {{ title }}

  .page-header__info
    slot(name="info")

</template>

<style lang="scss" src="./styles.scss"></style>
<script lang="js" src="./index.js"></script>
