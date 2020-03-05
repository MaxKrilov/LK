<template lang="pug">
  div.er-number-field
    er-text-field(
      v-model="internalValue"
      :prepend-inner-icon="isShowPrevIconComputed ? 'no' : null"
      :append-inner-icon="isShowNextIconComputed ? 'circle_add' : null"
      readonly
      @click:prepend-inner="onClickPrev"
      @click:append-inner="onClickNext"
    )
</template>

<script lang="js" src="./script.js"></script>

<style lang="scss" src="./_style.scss"></style>
