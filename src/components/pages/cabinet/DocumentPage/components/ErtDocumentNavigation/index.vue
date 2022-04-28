<template lang="pug">
  .ert-document-navigation(
    ref="component"
    :class="componentsClasses"
  )
    .ert-document-navigation__list-item(
      ref="list"
      :style="listStyle"
      v-touch="{ left: onLeftHandler, right: onRightHandler }"
      @wheel="onScrollEvent"
    )
      template(v-for="(item, idx) in items")
        button.ert-document-navigation__item(
          :class="{ 'is-active': internalValue === idx }"
          @click="() => { internalValue = idx }"
        )
          | {{ item }}
      .ert-document-navigation__slider(
        :style="sliderStyle"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
