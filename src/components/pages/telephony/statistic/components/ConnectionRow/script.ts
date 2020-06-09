import { Vue, Component, Prop } from 'vue-property-decorator'
import { MISSED_CALL, INCOMING_CALL, OUTGOING_CALL } from '@/constants/telephony_statistic'
import { IBillingStatisticResponse } from '@/tbapi'
import moment from 'moment'
import { formatPhone, price } from '@/functions/filters'

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * 60

const ICONS = {
  [MISSED_CALL]: 'missed_call',
  [INCOMING_CALL]: 'incoming_call',
  [OUTGOING_CALL]: 'outgoing_call'
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ConnectionRow>>({
  filters: {
    formatPhone,
    price
  },
  props: {
    statistic: {
      type: Object,
      default: () => ({})
    }
  }
})
export default class ConnectionRow extends Vue {
  // Props
  readonly statistic!: IBillingStatisticResponse
  @Prop({ type: String, default: 'missed' }) type!: keyof typeof ICONS

  private pre = 'connection-row'
  region = 'Москва'

  get computedDate () {
    return moment(this.statistic.createdDate).format('DD.MM.YY')
  }

  get computedTime () {
    return moment(this.statistic.createdDate).format('HH:mm')
  }

  get computedDuration () {
    let duration = Number(this.statistic.duration)

    let hours: number = duration / SECONDS_IN_HOUR
    hours = hours > 1 ? Math.floor(hours) : 0
    duration = duration - hours * SECONDS_IN_HOUR

    let minutes: number = duration / SECONDS_IN_MINUTE
    minutes = minutes > 1 ? Math.floor(minutes) : 0
    duration = duration - minutes * SECONDS_IN_MINUTE

    const seconds = duration

    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
  }

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
