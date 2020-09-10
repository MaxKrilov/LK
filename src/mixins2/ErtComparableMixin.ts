import Vue from 'vue'
import Component from 'vue-class-component'
import { deepEqual } from '@/functions/helper2'

@Component({
  props: {
    valueComparator: {
      type: Function,
      default: deepEqual
    }
  }
})
export default class ErtComparableMixin extends Vue {
  // Props
  readonly valueComparator!: typeof deepEqual
}
