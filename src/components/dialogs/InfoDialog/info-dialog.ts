import { Vue, Component } from 'vue-property-decorator'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

/*
  Диалог с информационным сообщением

  Параметры:
    title - текст заголовка
    actionButtonText - текст на кнопке, по умолчанию "ОК"
    value - состояние отображается или нет

  Так же можно вписать пояснительный текст или вёрску в основном слоте

  Пример использования:
    info-dialog(
      title="При заказе возникла ошибка"
      :action-button-text="'Приду позже'"
      v-model="isErrorMode"
    ) Сейчас нет возможности заказать товар из-за технической ошибки
*/
const components = {
  ErActivationModal
}

const props = {
  title: String,
  actionButtonText: {
    type: String,
    default: 'OK'
  },
  value: Boolean
}

@Component({
  components,
  props
})
export default class InfoDialog extends Vue {
  onInput (value: boolean) {
    if (!value) {
      this.$emit('close')
    }
  }
}
