<template lang="pug">
  form.ecommerce-file-upload(ref="ecommerce-file-upload")
    input(
      type="file"
      :id="computedID"
      @change="onChange"
    )
    label.ecommerce-file-upload__wrapper(
      :for="computedID"
    )
      span.label-text
        | {{ labelText }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
