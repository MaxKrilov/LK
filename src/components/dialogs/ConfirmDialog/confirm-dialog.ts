import { Vue, Component } from 'vue-property-decorator'

/*
  Диалог подтверждения

  Параметры:
    title - текст заголовка
    buttonText - текст на кнопке, по умолчанию "ОК"
    value - состояние отображается или нет

  Так же можно вписать пояснительный текст или вёрску в основном слоте

  Пример использования:
    confirm-dialog(
      :title="'При заказе возникла ошибка'"
      :buttonOkText="'Да'"
      :buttonCancelText="'Нет'"
      :active="true"
    ) Сейчас нет возможности заказать товар из-за технической ошибки
*/
const props = {
  title: String,
  buttonOkText: {
    type: String,
    default: 'Да'
  },
  buttonCancelText: {
    type: String,
    default: 'Отмена'
  },
  active: Boolean
}

@Component({
  props
})
export default class ConfirmDialog extends Vue {
  onPressOK () {
    this.$emit('ok')
  }
  onPressCancel () {
    this.$emit('cancel')
  }
}
