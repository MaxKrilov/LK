import { mapGetters } from 'vuex'
import ErFilterClose from '../ErFilterClose'
import ListAddress from '../ListAddress/index.vue'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'filters-pay',
  data: () => ({
    pre: 'filters-pay',
    typeFind: ['По услуге', 'По адресу'],
    services: [
      'Все услуги',
      'Интернет',
      'Видеонаблюдение',
      'Wi-Fi для бизнеса',
      'Антивирусы'
    ],
    cities: ['Все города', 'Абакан', 'Москва', 'Санкт-Петербург'],
    typePay: ['Все платежи', 'Списание', 'Начисление'],
    years: [
      { month: 'Январь', active: 'active' },
      { month: 'Февраль', active: 'none' },
      { month: 'Март', active: 'none' },
      { month: 'Апрель', active: 'none' },
      { month: 'Май', active: 'none' },
      { month: 'Июнь', active: 'none' },
      { month: 'Июль', active: 'none' },
      { month: 'Август', active: 'none' },
      { month: 'Сентябрь', active: 'none' },
      { month: 'Октябрь', active: 'none' },
      { month: 'Ноябрь', active: 'none' },
      { month: 'Декабрь', active: 'none' }
    ],
    quarter1: [
      { month: 'Январь', active: 'active' },
      { month: 'Февраль', active: 'none' },
      { month: 'Март', active: 'none' }
    ],
    quarter2: [
      { month: 'Апрель', active: 'active' },
      { month: 'Май', active: 'none' },
      { month: 'Июнь', active: 'none' }
    ],
    quarter3: [
      { month: 'Июль', active: 'active' },
      { month: 'Август', active: 'none' },
      { month: 'Сентябрь', active: 'none' }
    ],
    quarter4: [
      { month: 'Октябрь', active: 'active' },
      { month: 'Ноябрь', active: 'none' },
      { month: 'Декабрь', active: 'none' }
    ],
    firstHalfYear: [
      { month: 'Январь', active: 'active' },
      { month: 'Февраль', active: 'none' },
      { month: 'Март', active: 'none' },
      { month: 'Апрель', active: 'none' },
      { month: 'Май', active: 'none' },
      { month: 'Июнь', active: 'none' }
    ],
    secondHalfYear: [
      { month: 'Июль', active: 'active' },
      { month: 'Август', active: 'none' },
      { month: 'Сентябрь', active: 'none' },
      { month: 'Октябрь', active: 'none' },
      { month: 'Ноябрь', active: 'none' },
      { month: 'Декабрь', active: 'none' }
    ],
    typeFindLabel: 'По услуге',
    servicesLabel: 'Все услуги',
    cityLabel: 'Все города',
    typePayLabel: 'Все платежи',
    visService: 'visBlock',
    visTypePay: 'visBlock',
    service: true,
    period: ['2019-01-01', '2019-03-31'],
    isFiltersVisible: false,
    isFiltersMonthVisible: true,
    isCloseService: true,
    isCloseTypePay: true,
    datePeriod: '',
    date: '1-й квартал',
    year: " 2019",
    zero: '',
    topTypePay: 'initial',
    typePeriod: [
      { month: 'Январь', active: 'active' },
      { month: 'Февраль', active: 'none' },
      { month: 'Март', active: 'none' }
    ],
    openFilterMob: false,
    visArr: false,
    padding: '',
    margLeft: '0px',
    topFilter: '',
    // visMonth: true
  }),
  components: {
    ErFilterClose,
    ListAddress
  },
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    periodInfo () {
      return this.isFiltersMonthVisible ? this.date + this.year : this.datePeriod
    }
  },
  watch: {
    SCREEN_WIDTH () {
      this.isFiltersVisible = this[SCREEN_WIDTH] >= 640
      const delta = this[SCREEN_WIDTH] >= 1200 ? 378 : 72
      if (this.typePeriod.length * 82 > this[SCREEN_WIDTH] - delta) {
        this.visArr = true
        this.padding = '__padding'
      } else {
        this.visArr = false
        this.padding = ''
      }
    }
  },
  methods: {
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
      this.service = item === 'По услуге'
      this.isCloseService = true
      this.$emit('typeFind', item)
    },
    servicesValue (item) {
      this.servicesLabel = item
      this.visService = 'visBlock'
      this.isCloseService = true
    },
    citiesValue (item) {
      this.cityLabel = item
      this.visService = 'visBlock'
      this.isCloseService = true
    },
    visTitleService () {
      this.visService = 'visNone'
    },
    typePayValue (item) {
      this.typePayLabel = item
      this.visTypePay = 'visBlock'
      this.topTypePay = 'active'
      this.isCloseTypePay = true
    },
    visTitleTypePay () {
      this.visTypePay = 'visNone'
      this.topTypePay = 'initial'
    },
    inp (payload) {
      // if (typeof payload[0] !== "string") {
        const date1 = payload[0]
        const zeroDay1 = date1.getDate() > 10 ? '' : '0'
        const zeroMonth1 = date1.getMonth() + 1 > 10 ? '' : '0'
        const period1 = `${zeroDay1}${date1.getDate()}.${zeroMonth1}${date1.getMonth() + 1}.${String(date1.getFullYear()).slice(-2)}`
      // } else {
      //   const period1 ='31-03-2019'
      // }
      const date2 = payload[1]
      const zeroDay2 = date2.getDate() > 10 ? '' : '0'
      const zeroMonth2 = date2.getMonth() + 1 > 10 ? '' : '0'
      const period2 = `${zeroDay2}${date2.getDate()}.${zeroMonth2}${date2.getMonth() + 1}.${String(date2.getFullYear()).slice(-2)}`
      this.datePeriod = `${period1} - ${period2}`
    },
    dateName (payload) {
      if (payload && payload.indexOf(' - ') === -1) {
        this.date = payload
        if (payload === '1-й квартал') this.typePeriod = this.quarter1
        if (payload === '2-й квартал') this.typePeriod = this.quarter2
        if (payload === '3-й квартал') this.typePeriod = this.quarter3
        if (payload === '4-й квартал') this.typePeriod = this.quarter4
        if (payload === '1-е полугодие') this.typePeriod = this.firstHalfYear
        if (payload === '2-е полугодие') this.typePeriod = this.secondHalfYear
        if (payload === 'За год') this.typePeriod = this.years

        this.isFiltersMonthVisible = true
      } else {
        this.isFiltersMonthVisible = false
      }
      const delta = this[SCREEN_WIDTH] >= 1200 ? 378 : 72
      if (this.typePeriod.length * 82 > this[SCREEN_WIDTH] - delta) {
        this.visArr = true
        this.padding = '__padding'
      } else {
        this.visArr = false
        this.padding = ''
      }
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
