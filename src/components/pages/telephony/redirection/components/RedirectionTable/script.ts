import { Vue, Component, Prop } from 'vue-property-decorator'
import CONST from '../../constants'

@Component({
  name: 'redirection-table'
})
export default class RedirectionTable extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: any[]

  onClickAdd () {
    this.$emit('add')
  }

  getRowCSSClass (row: any): string[] {
    const cssClass = []

    if (row.status === CONST.S_ADDED) {
      cssClass.push('t-b-row--added')
    }

    return cssClass
  }
}
