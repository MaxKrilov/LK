import { Vue, Component, Prop } from 'vue-property-decorator'

const components = {}

@Component({
  name: 'period-list',
  components
})
export default class PeriodList extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: any[]
}
