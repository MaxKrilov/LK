import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    noDataText: {
      type: String,
      default: 'Ничего не найдено'
    }
  }
})
export default class ErtFilterableMixin extends Vue {
  // Props
  readonly noDataText!: string
}
