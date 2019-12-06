<template lang="pug">
  .page-header
    er-back(:title="linkText", :to="backlink")
    er-page-title(class="title" @click="$router.push(backlink)") {{ title }}
</template>

<style lang="scss" src="./styles.scss"></style>
<script lang="js" src="./index.js"></script>
