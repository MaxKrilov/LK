<template lang="pug">
.go-to-wifi-radar.main-content.main-content--padding
  template(v-if="isLoading")
    .h2.loading-dots Переход на WiFi Радар

  form(id="radar-form" ref="form" :action="radarLink" method="POST")
    template(v-if="isDataNotEmpty")
      input(
        v-for="field in fieldsOrder"
        :key="field"
        type="hidden"
        :value='data[field]'
        :name="field"
      )
</template>

<script lang="ts" src="./go-to-radar.ts"></script>

<style lang="scss">
.loading-dots {
  @extend %wait-dots-animation;
}
</style>
