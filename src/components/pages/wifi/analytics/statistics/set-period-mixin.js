import moment from 'moment'

const DATE_FORMAT = 'DD.MM.YYYY'

export default {
  data: () => ({
    period: ''
  }),
  methods: {
    setPeriod (val) {
      let result = val[0] ? moment(val[0]).format(DATE_FORMAT) : ''
      result = val[1] ? result + ' - ' + moment(val[1]).format(DATE_FORMAT) : result
      this.period = result
      return result
    }
  }
}
