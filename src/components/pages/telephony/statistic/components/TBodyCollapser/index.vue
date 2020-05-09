<template lang="pug">
tbody.tbody-collapser(
  :class="{'tbody-collapser--collapsed': !isVisible}"
)
  tr(
    @click="onToggle"
    ref="header"
  ).tbody-collapser__header
    td(:colspan="columns")
      .tbody-collapser__title-wrap
        er-icon(name="arrow_l")
        .tbody-collapser__title {{ title }}

  slot

</template>

<style lang="scss" src="./style.scss"></style>
<script lang="ts" src="./script.ts"></script>
