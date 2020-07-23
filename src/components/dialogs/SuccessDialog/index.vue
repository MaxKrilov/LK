<template lang="pug">
  er-dialog-advanced(
    :contentClass="'er-success-dialog'"
    :active="active"
    :icon="'circle_ok'"
    @close="onPressOK"
  )
    template(slot="title") {{ title }}

    template
      slot

    template(slot="actions")
      er-button(
        @click="onPressOK"
        color="yellow"
      ) {{ buttonText }}
</template>

<script>
/*
  Диалог с сообщением и зелёной иконкой "ОК"
  Просто информация что всё прошло удачно.

  Параметры:
    title - текст заголовка
    buttonText - текст на кнопке, по умолчанию "ОК"
    active - состояние отображается или нет

  Так же можно вписать пояснительный текст или вёрску в основном слоте

  Пример использования:
    success-dialog(
      :title="'Кредит одобрен'"
      :buttonText="'Буду знать'"
      :active="true"
    ) Теперь вы можете купить новый iPhone
*/
export default {
  props: {
    title: String,
    buttonText: {
      type: String,
      default: 'OK'
    },
    active: Boolean,
    value: Boolean
  },
  methods: {
    onPressOK () {
      this.$emit('input', this.$props.active)
    }
  }
}
</script>

<style lang="scss">
.er-success-dialog {
  @extend %dialog-block;
}
</style>
