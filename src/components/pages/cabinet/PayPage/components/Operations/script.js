import { price as priceFormatted } from '../../../../../../functions/filters'

export default {
  name: 'operations',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    pre: 'operations'
  }),
  computed: {
    year () {
      return this.$moment(this.item.timestamp).format('YY')
    },
    date () {
      return this.$moment(this.item.timestamp).format('DD.MM')
    },
    color () {
      return this.item.type === 'replenishment'
        ? 'green'
        : 'red'
    },
    value () {
      return `${this.item.type === 'replenishment' ? '+' : '-'} ${priceFormatted(this.item.value)}`
    }
  }
}
