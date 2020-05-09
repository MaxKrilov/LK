import { Vue, Component, Prop } from 'vue-property-decorator'
import { MISSED_CALL, INCOMING_CALL, OUTGOING_CALL } from '@/constants/telephony_statistic'

const ICONS = {
  [MISSED_CALL]: 'missed_call',
  [INCOMING_CALL]: 'incoming_call',
  [OUTGOING_CALL]: 'outgoing_call'
}

@Component
export default class ConnectionRow extends Vue {
  @Prop({ type: String, default: 'missed' }) type!: keyof typeof ICONS

  private pre = 'connection-row'
  region = 'Москва'

  get iconName () {
    return ICONS[this.type]
  }

  getCSSClass () {
    const classMod = `${this.pre}--missed`
    return [
      [classMod]
    ]
  }
}
