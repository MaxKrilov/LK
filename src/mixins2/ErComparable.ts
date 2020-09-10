import Vue from 'vue'
import Component from 'vue-class-component'
import { deepEqual } from '@/functions/helper2'

const props = {
  valueComparator: {
    type: Function,
    default: deepEqual
  }
}

@Component({
  props
})
export default class ErComparable extends Vue {
  // Props
  readonly valueComparator!: typeof deepEqual
}
