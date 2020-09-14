import moment from 'moment'

export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    pre: 'statpage-header',
    period: [moment().subtract(1, 'months').toDate(), moment().toDate()]
  }),
  mounted () {
    this.$emit('onPeriodSet', this.period)
  },
  watch: {
    period (val, prevVal) {
      if (val && val !== prevVal) {
        this.$emit('onPeriodSet', val)
      }
    }
  }
}
