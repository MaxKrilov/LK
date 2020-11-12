<template lang="pug">
  .camera-config
    .camera-config__input
      template(v-if="value")
        er-icon(name="circle_ok")
      template(v-else)
        er-toggle(
          :id="`camera-${camera.id}`"
          :view="'radio-check'"
          :modelValue="value"
          @input="onInput"
        )
    label(:for="`camera-${camera.id}`").camera-config__label
      | {{ camera.name }}
</template>

<script>
export default {
  props: {
    camera: Object,
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onInput (value) {
      this.$emit('input', {
        id: this.camera.id,
        parentId: this.camera.parentId,
        value: !this.value
      })
    }
  }
}
</script>

<style lang="scss">
.camera-config {
  &__input {
    margin-bottom: $padding-x1;

    .er-input__slot {
      margin-bottom: 0;
    }

    .er-icon {
      color: map_get($green, "base");
      svg {
        width: $padding-x6;
        height: $padding-x6;
      }
    }
  }
}
</style>
