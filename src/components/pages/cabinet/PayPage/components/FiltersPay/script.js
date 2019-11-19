import ErFilterClose from '../ErFilterClose'

// var colorActive = 'white';
// var colorAct = '#E9E9E9';
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
    cities: ['Все города','Абакан', 'Москва', 'Санкт-Петербург'],
    typePay: ['Все платежи', 'Списание', 'Начисление'],
    years: [
      {month: 'январь', active: 'active'},
      {month: 'февраль', active: 'none'},
      {month: 'март', active: 'none'},
      {month: 'апрель', active: 'none'},
      {month: 'май', active: 'none'},
      {month: 'июнь', active: 'none'},
      {month: 'июль', active: 'none'},
      {month: 'август', active: 'none'},
      {month: 'сентябрь', active: 'none'},
      {month: 'октябрь', active: 'none'},
      {month: 'ноябрь', active: 'none'},
      {month: 'декабрь', active: 'none'},
    ],
    quarter1: [
      {month: 'январь', active: 'active'},
      {month: 'февраль', active: 'none'},
      {month: 'март', active: 'none'},
    ],
    quarter2: [
      {month: 'апрель', active: 'active'},
      {month: 'май', active: 'none'},
      {month: 'июнь', active: 'none'},
    ],
    quarter3: [
      {month: 'июль', active: 'active'},
      {month: 'август', active: 'none'},
      {month: 'сентябрь', active: 'none'},
    ],
    quarter4: [
      {month: 'октябрь', active: 'active'},
      {month: 'ноябрь', active: 'none'},
      {month: 'декабрь', active: 'none'},
    ],
    firstHalfYear: [
      {month: 'январь', active: 'active'},
      {month: 'февраль', active: 'none'},
      {month: 'март', active: 'none'},
      {month: 'апрель', active: 'none'},
      {month: 'май', active: 'none'},
      {month: 'июнь', active: 'none'}
    ],
    secondHalfYear: [
      {month: 'июль', active: 'active'},
      {month: 'август', active: 'none'},
      {month: 'сентябрь', active: 'none'},
      {month: 'октябрь', active: 'none'},
      {month: 'ноябрь', active: 'none'},
      {month: 'декабрь', active: 'none'},
    ],
    typeFindLabel: 'По услуге',
    servicesLabel: 'Все услуги',
    cityLabel: 'Все города',
    typePayLabel: 'Все платежи',
    visService: 'visBlock',
    visTypePay: 'visBlock',
    service: true,
    period: ['2019-01-01', '2019-03-31'],
    isFiltersVisible: true,
    isFiltersMonthVisible: true,
    isCloseService: true,
    isCloseTypePay: true,
    datePeriod: '',
    date: '1-й квартал',
    year: "'19",
    topTypePay: "initial",
    typePeriod: [
      {month: 'январь', active: 'active'},
      {month: 'февраль', active: 'none'},
      {month: 'март', active: 'none'},
    ],
  }),
  components: {
    ErFilterClose
  },
  methods: {
    selectMonth (e) {
      this.typePeriod = this.typePeriod.map(function(name) {
        if (e.target.innerHTML === name.month) {
          name.active = 'active'
        } else {
          name.active = 'none'
        }
        return name;
      });
    },
    closeService () {
      this.isCloseService = false
    },
    closeTypePay () {
      this.isCloseTypePay = false
    },
    typeFindValue (item) {
      this.typeFindLabel = item
      this.service = item === 'По услуге'
      this.isCloseService = true
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
    inp(payload) {
      const date1 = payload[0]
      const period1 = `${date1.getDate()}.${date1.getMonth() + 1}.${String(date1.getFullYear()).slice(-2)}`
      const date2 = payload[1]
      const period2 = `${date2.getDate()}.${date2.getMonth() + 1}.${String(date2.getFullYear()).slice(-2)}`


      // const period = new Date(payload[0]) - new Date(payload[1])
      this.datePeriod = `${period1} - ${period2}`
    },
    dateName (payload) {
      if (payload && payload.indexOf(" - ") === -1) {
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
    },
    yearName (payload) {
      this.year = "'" + payload
    },
  }
}


// this.isFiltersMonthVisible = (payload.indexOf(" - ") === -1)
// this.isFiltersMonthVisible = payload === undefined
