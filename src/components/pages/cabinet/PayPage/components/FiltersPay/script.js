import { mapGetters } from 'vuex'
import ErFilterClose from '../ErFilterClose'
import ErReportFilter from '../ErReportFilter'
import ListAddress from '../ListAddress/index.vue'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
import { BREAKPOINT_XL } from '@/constants/breakpoint'

export default {
  name: 'filters-pay',
  data: () => ({
    pre: 'filters-pay',
    monthsNames: [
      'январь',
      'февраль',
      'март',
      'апрель',
      'май',
      'июнь',
      'июль',
      'август',
      'сентябрь',
      'октябрь',
      'ноябрь',
      'декабрь'
    ],
    typeFind: [
      { 'value': 'По услуге' },
      { 'value': 'По адресу' }
    ],
    services: [
      { 'value': 'Интернет' },
      { 'value': 'Видеонаблюдение' },
      { 'value': 'Wi-Fi для бизнеса' },
      { 'value': 'Антивирусы' },
      { 'value': 'Все услуги' }
    ],
    cities: [
      { 'value': 'Все города' },
      { 'value': 'Абакан' },
      { 'value': 'Москва' },
      { 'value': 'Санкт-Петербург' }
    ],
    typePay: [
      { 'value': 'Списание' },
      { 'value': 'Начисление' },
      { 'value': 'Все платежи' }
    ],
    isFiltersMonthVisible: true,

    xs1: '',
    xs2: '',
    isCloseService: true,
    isCloseTypePay: true,
    zero: '',
    topTypePay: 'initial',
    typePeriod: [],
    openFilterMob: false,
    visArr: false,
    padding: '',
    margLeft: '0px',
    topFilter: '',
    widthContainer: '113%',
    reportPeriod: [],
    firstTypeFind: { 'id': '-1', 'value': 'По услуге' },
    firstTypePay: { 'id': '-1', 'value': 'Все платежи' },
    typeSelect: { 'id': '-1', 'value': 'Все услуги' },
    selected: [],
    isFiltersVisible: false
  }),
  components: {
    ErFilterClose,
    ErReportFilter,
    ListAddress
  },
  mounted () {
    this.selected = this.services
    this.changeWidth()
    const today = new Date()
    const beforeMonth = new Date(new Date().setDate(1))
    this.reportPeriod = [
      beforeMonth,
      today
    ]
    this.changePeriod(this.reportPeriod)
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    periodInfo () {
      return this.isFiltersMonthVisible ? this.date + this.year : this.datePeriod
    }
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeArr()
      // todo-er убрать в css
/*
      this.widthContainer = (this[SCREEN_WIDTH] >= 1600) ? this.widthContainer = '62% !important'
        : (this[SCREEN_WIDTH] >= 1440) ? this.widthContainer = '80% !important'
          : (this[SCREEN_WIDTH] >= 900) ? this.widthContainer = '109% !important'
            : (this[SCREEN_WIDTH] >= 770) ? this.widthContainer = '110% !important'
              : (this[SCREEN_WIDTH] > 680) ? this.widthContainer = '112% !important'
                : this.widthContainer = '113% !important'
*/
    }
  },
  methods: {
    changeType (e) {
      this.reportType1 = { 'id': '-1', 'value': 'Все услуги' }
      this.reportType11 = { 'id': '-1', 'value': 'Все города' }
      if (e.value === 'По услуге') {
        this.typeSelect = this.reportType1
        this.selected = this.services
        this.servicesValue('services')
      } else {
        this.typeSelect = this.reportType11
        this.selected = this.cities
        this.citiesValue('cities')
      }
      this.typeFindValue(e.value)
      this.firstTypeFind = Object.assign({}, e)
    },
    changeArr () {
      this.isFiltersVisible = this[SCREEN_WIDTH] >= BREAKPOINT_MD
      const delta = this[SCREEN_WIDTH] >= BREAKPOINT_XL ? 378 : 72
      if (this.typePeriod.length * 82 > this[SCREEN_WIDTH] - delta) {
        this.visArr = true
        this.padding = '__padding'
      } else {
        this.visArr = false
        this.padding = ''
      }
    },
    changeWidth () {
      if (this[SCREEN_WIDTH] < 480) {
        this.xs1 = '__xs1'
        this.xs2 = '__xs2'
      } else {
        this.xs1 = ''
        this.xs2 = ''
      }
    },
    filtersVisible (select) {
      this.openFilterMob = this[SCREEN_WIDTH] < 640 ? select : false
      this.isFiltersVisible = select
      if (select === false) {
        this.topFilter = '__top'
        this.$emit('topOperation', false)
      } else {
        this.topFilter = ''
        this.$emit('topOperation', true)
      }
    },
    selectMonth (e) {
      this.typePeriod = this.typePeriod.map(function (name) {
        if (e.target.innerHTML === name.month) {
          name.active = 'active'
        } else {
          name.active = 'none'
        }
        return name
      })
    },
    closeService () {
      this.isCloseService = false
      this.zero = '__zero'
    },
    closeTypePay () {
      this.isCloseTypePay = false
    },
    typeFindValue (item) {
      this.typeFindLabel = item
      this.isCloseService = true
      this.$emit('typeFind', item)
      this.servicesLabel = 'Все услуги'
      this.cityLabel = 'Все города'
    },
    servicesValue (item) {
      this.servicesLabel = item
      this.isCloseService = true
    },
    citiesValue (item) {
      this.cityLabel = item
      this.isCloseService = true
    },
    typePayValue (item) {
      this.typePayLabel = item
      this.topTypePay = 'active'
      this.isCloseTypePay = true
    },
    visTitleTypePay () {
      this.topTypePay = 'initial'
    },
    changePeriod (payload) {
      this.typePeriod = []
      this.reportPeriod = [payload[0], payload[1]]
      this.selectMonth(this.reportPeriod)
      this.dateName(this.reportPeriod)
    },
    dateName (payload) {
      const data1 = payload[0].getMonth()
      const data2 = payload[1].getMonth() + 1
      let n = 0
      for (let i = 0; i < this.monthsNames.length + 1; i++) {
        if (i >= data1 && i < data2) {
          let active = i === data1 ? 'active' : 'none'
          this.typePeriod[n] = { month: this.monthsNames[i], active: active }
          n++
        }
      }

      // todo-er ??? разобраться
      if (payload && payload.indexOf(' - ') === -1) {
        this.isFiltersMonthVisible = true
      } else {
        this.isFiltersMonthVisible = false
      }
      this.changeArr()
    },
    yearName (payload) {
      this.year = "'" + payload
    },
    moveMonth (direct) {
      let marg = +this.margLeft.slice(0, this.margLeft.indexOf('px'))
      if (direct === 'left') {
        if (this.margLeft !== '0px') this.margLeft = (marg + 85).toString() + 'px'
      } else {
        this.margLeft = (marg - 85).toString() + 'px'
      }
    }
  }
}
