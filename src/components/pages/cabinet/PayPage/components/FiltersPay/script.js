import ErFilterClose from '../ErFilterClose'

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
    typeFindLabel: 'По услуге',
    servicesLabel: 'Все услуги',
    cityLabel: 'Все города',
    typePayLabel: 'Все платежи',
    visService: 'visBlock',
    visTypePay: 'visBlock',
    service: true,
    period: ['2019-01-01', '2019-03-31'],
    isFiltersVisible: true,
    isCloseService: true,
    isCloseTypePay: true,
    date: '1-й квартал',
    year: "'19",
    topTypePay: "initial"
  }),
  components: {
    ErFilterClose
  },
  methods: {
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
/*
    dat (date) {
      let dayOfMonth = date.getDate()
      let month = date.getMonth() + 1
      let year = '2019'
      this.period = `${year}-${month}-${dayOfMonth}`
    },
*/
    dateName (payload) {
      this.date = payload
    },
    yearName (payload) {
      this.year = "'" + payload
    }
  }
}
