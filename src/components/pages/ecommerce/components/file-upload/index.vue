<template lang="pug">
  form.ecommerce-file-upload(ref="ecommerce-file-upload")
    input(
      :id="computedID"
      ref="file-input"
      type="file"
      @change="onChange"
    )
    label.ecommerce-file-upload__wrapper(
      :for="computedID"
    )
      span.label-text
        | {{ labelText }}
    .caption2.error--text(v-if="isError")
      | {{ errorText }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
