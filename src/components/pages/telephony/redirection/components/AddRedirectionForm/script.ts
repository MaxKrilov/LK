import { Vue, Component } from 'vue-property-decorator'
import PeriodSelect from '../PeriodSelect/index.vue'
import PeriodList from '../PeriodList/index.vue'

const mockupPeriodList = [
  {
    days: 'Вт, Ср, Чт, Пт, Сб, Вс',
    time: '00:00 - 24:00'
  },
  {
    days: 'Пн',
    time: '00:30 - 08:00'
  }
]

const components = {
  PeriodSelect,
  PeriodList
}

@Component({
  name: 'add-redirection-form',
  components
})
export default class AddRedirectionForm extends Vue {
  periodList = mockupPeriodList
  onClickAdd () {
    this.$emit('add')
  }

  onCancel () {
    this.$emit('cancel')
  }
}
