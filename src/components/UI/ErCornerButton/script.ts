import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ErCornerButton extends Vue {
/*
  Кнопка с уголком, при value == true уголок разворачивается на 180 градусов

  Параметры:
    activeDown - когда кнопка активна
      true -> уголок вниз
      false -> уголок вверх
    value - активна/не активна
    reversed - поменять местами текст и уголок (по-умолчанию сначала текст, потом уголок)
  Пример:
    er-corner-button(v-model="isOpened")
*/
  @Prop({ type: Boolean, default: false }) readonly value!: boolean
  @Prop({ type: Boolean, default: true }) readonly activeDown!: boolean
  @Prop({ type: Boolean, default: false }) readonly reversed!: boolean

  onClick () {
    this.$emit('input', !this.value)
  }
}
