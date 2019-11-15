import ErContractFilter from '../ErContractFilter'
import ErFilterGroup from '../ErFilterGroup'
import ErFilterClose from '../ErFilterClose'

export default {
  name: 'filters-pay',
  data: () => ({
    pre: 'filters-pay',
    items1: ['По услуге', 'По адресу'],
    items21: [
      'Все услуги',
      'Интернет',
      'Видеонаблюдение',
      'Wi-Fi для бизнеса',
      'Антивирусы'
    ],
    items22: ['Абакан', 'Москва', 'Санкт-Петербург'],
    items4: ['Списание', 'Начисление'],
/*
    itt: [
      new Date("2017-01-26"),
      new Date("2018-01-15")
    ],
*/
    label: 'По услуге',
    label2: 'Все услуги',
    label21: 'Абакан',
    label4: 'Списание',
    vis: 'visblock',
    vis4: 'visblock',
    service: true,
    valu: "2017-01-26"
  }),
  components: {
    ErContractFilter,
    ErFilterGroup,
    ErFilterClose
  },
  methods: {
    val (item) {
      this.label = item
      this.service =  item === "По услуге" ? true : false
    },
    val1 (item2) {
      this.label2 = item2
      this.vis = 'visblock'
    },
    val21 (item2) {
      this.label21 = item2
      this.vis = 'visblock'
    },
    val4 (item4) {
      this.label4 = item4
      this.vis4 = 'visblock4'
    },
    vistitle () {
      this.vis = 'visnone'
    },
    vistitle4 () {
      this.vis4 = 'visnone4'
    },
    dat (date) {
      console.log('date ->', date)
      let dayOfMonth = date.getDate();
      let month = date.getMonth() + 1;
      let year = '2019';
      let dd = `${year}-${month}-${dayOfMonth}`
      // console.log(dd)
      // dd=this.itt
      this.valu = dd
    },

  }
}
