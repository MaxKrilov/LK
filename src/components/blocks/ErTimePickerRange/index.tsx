import './_style.scss'

import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'

@Component
export default class ErTimePickerRange extends Vue {
  @Prop({ type: String, default: 'Удобное время для звонка' }) readonly label!: string
  @Prop({ type: Array, default: () => ([]) }) readonly value!: any[]

  disabled = false
  // eslint-disable-next-line
  render (h: CreateElement): VNode {
    return (
      <div class={'er-time-picker-range'}>
        <div class={'label'}>{this.label}</div>
        <div class={['timepicker', 'mr-8', 'first']}>
          <er-time-picker vModel={this.value[0]} max={this.value[1]} disabled={this.disabled} />
        </div>
        <div class={'timepicker'}>
          <er-time-picker vModel={this.value[1]} min={this.value[0]} disabled={this.disabled} />
        </div>
        <div class={['doesnt-matter', 'ml-16']}>
          <er-toggle
            view={'radio-check'}
            label={'Не важно'}
            vModel={this.disabled}
          />
        </div>
      </div>
    )
  }
}
