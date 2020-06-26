import { mapGetters } from 'vuex'
import ErFilterClose from '../ErFilterClose'
import ErReportFilter from '../ErReportFilter'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import moment from 'moment'

export default {
  name: 'filters-pay',
  data: () => ({
    pre: 'filters-pay',
    monthsNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ],
    typePay: [
      { 'value': 'Списание' },
      { 'value': 'Начисление' },
      { 'value': 'Все платежи' }
    ],
    reportPeriod: [],
    typePeriod: [],
    visArr: false,
    padding: '',
    margLeft: '0px',
    topFilter: '',
    firstTypePay: { 'id': '-1', 'value': 'Все платежи' },
    selected: [],
    isVisibleListMonth: false
  }),
  components: {
    ErFilterClose,
    ErReportFilter
  },
  props: ['year'],
  mounted () {
    this.firstPeriod()
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeArr()
    }
  },
  methods: {
    changeArr () {
      const delta = this[SCREEN_WIDTH] >= BREAKPOINT_XL ? 378 : 72
      if (this.typePeriod.length * 82 > this[SCREEN_WIDTH] - delta) {
        this.visArr = true
        this.padding = '__padding'
      } else {
        this.visArr = false
        this.padding = ''
      }
    },
    selectMonth (e) {
      let month
      this.typePeriod = this.typePeriod.map((item) => {
        if (e.target.innerHTML === item.month) {
          item.active = 'active'
          month = item.month
        } else {
          item.active = 'none'
        }
      })
      let dateFirst, dateLast
      for (let i = 0; i < this.monthsNames.length; i++) {
        if (month === this.monthsNames[i]) {
          dateFirst = new Date(+moment(`20${this.year}-${i + 1}-01`).startOf('month'))
          dateLast = new Date(+moment(`20${this.year}-${i + 1}-01`).endOf('month'))
        }
      }
      this.changePeriod([dateFirst, dateLast])
    },
    changePeriod (payload) {
      this.typePeriod = []
      this.reportPeriod = [payload[0], payload[1]]
      this.$emit('period', [this.firstTypePay.value, this.reportPeriod])
      this.dateName(this.reportPeriod)
    },
    firstPeriod () {
      const today = new Date()
      const beforeMonth = new Date(moment().startOf('month'))
      this.reportPeriod = [
        beforeMonth,
        today
      ]
      this.changePeriod(this.reportPeriod)
    },
    clearFilterType () {
      this.firstTypePay = Object.assign({}, { value: 'Все платежи' })
      this.$emit('typePay', ['Все платежи', this.reportPeriod])
    },
    changeTypePay (e) {
      this.firstTypePay = Object.assign({}, e)
      this.$emit('typePay', [e.value, this.reportPeriod])
    },
    dateName (payload) {
      this.isVisibleListMonth = moment(payload[1]).diff(moment(payload[0]), 'months') > 1
      const numMonthFirst = payload[0].getMonth()
      const numMonthLast = payload[1].getMonth() + 1
      let n = 0
      for (let i = 0; i < this.monthsNames.length + 1; i++) {
        if (i >= numMonthFirst && i < numMonthLast) {
          let active = i === numMonthLast - 1 ? 'active' : 'none'
          this.typePeriod[n] = { month: this.monthsNames[i], active: active }
          n++
        }
      }
      this.typePeriod = this.typePeriod.reverse()
      this.changeArr()
    },
    moveMonth (direct) {
      const move = 85
      let marg = +this.margLeft.slice(0, this.margLeft.indexOf('px'))
      if (direct === 'left') {
        if (this.margLeft !== '0px') this.margLeft = (marg + move).toString() + 'px'
      } else {
        this.margLeft = (marg - move).toString() + 'px'
      }
    }
  }
}
