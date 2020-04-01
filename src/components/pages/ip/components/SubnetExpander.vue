<template lang="pug">
  .subnet
    er-corner-button(
      :active="isOpene"
      @click="isOpen = !isOpen"
    )
      | Подсеть {{ list.length }} адресов
    er-slide-up-down(:active="isOpen")
      .subnet__list
        er-container
          er-row.justify-content-start
            er-flex.d--flex.xs6.sm4.md3(v-for="ip in list")
              .subnet__ip {{ ip }}
</template>

<script>
import ErCornerButton from '@/components/blocks/ErCornerButton/index'

export default {
  components: {
    ErCornerButton
  },
  props: {
    list: Array
  },
  data () {
    return {
      isOpen: false
    }
  }
}
</script>

<style lang="scss">
.subnet {
  &__list {
    margin-top: $padding-x2;
    margin-left: $padding-x4;
    max-width: 532px;

    @include min-breakpoint('md') {
      margin-left: $padding-x6;
    }

    .container {
      @extend %container-20;
    }
  }

  &__ip {
    @extend %h4;
    margin-bottom: $padding-x2;
  }
}
</style>
