<template lang="pug">
  .rename-field
    .rename-field__label {{ label }}
    .rename-field__body
      er-text-field.rename-field__input(v-model="newValue")
      er-button(
        :loading="isLoading"
        v-if="isValueChanged"
        @click="onSave"
      ) Переименовать
</template>

<script>
export default {
  name: 'rename-field',
  props: ['value', 'label', 'isLoading'],
  data () {
    return {
      newValue: this.$props.value
    }
  },
  computed: {
    isValueChanged () {
      return this.$props.value !== this.newValue
    }
  },
  methods: {
    onSave () {
      this.$emit('save', this.newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.rename-field {
  $buttonWidth: 170px;
  margin-bottom: $padding-x4;

  &__label {
    @extend %caption2;
    margin-bottom: $padding-x1;
  }

  &__input {
    max-width: 50%;
  }

  &__body {
    display: flex;
    flex-direction: row;

    .er-button {
      display: inline-block;
      width: $buttonWidth;

      padding: 0 $padding-x4;
      margin-left: $padding-x4;
      @include min-breakpoint(lg) {
        height: 40px;
      }
    }
  }
}
</style>
