import Operations from '../Operations/index.vue'
import { getFirstElement } from '../../../../../../functions/helper'

export default {
  name: 'action-month',
  components: {
    Operations
  },
  props: {
    item: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    pre: 'action-month'
  }),
  computed: {
    month () {
      return this.$moment(getFirstElement(this.item).timestamp).format('MMM')
    },
    year () {
      return this.$moment(getFirstElement(this.item).timestamp).format('YY')
    }
  }
}
