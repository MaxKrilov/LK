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
    period: [moment().toDate(), moment().add(1, 'days').toDate()]
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
