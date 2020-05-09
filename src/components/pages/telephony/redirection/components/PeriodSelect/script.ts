import { Vue, Component } from 'vue-property-decorator'

const components = {}

@Component({
  name: 'period-select',
  components
})
export default class PeriodSelect extends Vue {
  period = {}
  active = false

  onOpen () {
    this.active = true
    this.$emit('open')
  }

  onAddPeriod () {
    this.$emit('add', this.period)
  }

  onCancel () {
    this.$emit('cancel')
  }
}
