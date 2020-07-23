import { Vue, Component } from 'vue-property-decorator'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

/*
  Диалог подтверждения оферты

  Параметры:
    title - текст заголовка
    actionButtonText - текст на кнопке, по умолчанию "Да"
    cancelButtonText - текст отмены, по умолчанию "Отмена"
    value - состояние отображается или нет

  Так же можно вписать пояснительный текст или вёрску в основном слоте

  Пример использования:
    offer-dialog(
      :title="Вы уверены, что хотите наказать рабов?"
      :value="true"
    ) Цена услуги: 20000₽
*/
const props = {
  title: String,
  actionButtonText: {
    type: String,
    default: 'Да'
  },
  cancelButtonText: {
    type: String,
    default: 'Отмена'
  },
  offerType: String,
  value: Boolean
}

const components = {
  ErActivationModal
}

@Component({
  props,
  components
})
export default class OfferDialog extends Vue {
  onCancel () {
    this.$emit('cancel')
  }
  onConfirm () {
    this.$emit('confirm')
  }
}
