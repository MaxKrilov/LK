import DetailPay from '../DetailPay/index.vue'

export default {
  name: 'list-address',
  components: {
    DetailPay
  },
  props: ['index', 'month'],
  data: () => ({
    pre: 'list-address',
    items: [
      { icon: 'geolocation', date: '01.01.', city: 'Москва,', street: 'пр-т Мира, д.40', value: '-6000' },
      { icon: 'geolocation', date: '01.01.', city: 'Москва,', street: 'улица Большая Бронная, дом 29', value: '-4000' },

      { icon: 'internet', date: '01.01.', year: '19', time: '00:01', city: 'Интернет', street: '', value: '-3000' },
      { icon: 'watch', date: '01.01.', year: '19', time: '00:01', city: 'Видеонаблюдение', street: '', value: '-800' },
      { icon: 'wifi', date: '01.01.', year: '19', time: '00:01', city: 'Wi-Fi для бизнеса', street: '', value: '-1000' },
      { icon: 'deffence', date: '01.01.', year: '19', time: '00:01', city: 'Антивирусы', street: '', value: '-500' }
    ],
    title: 'title-row',
    geo: 'geo',
    border: '__border',
    subtmpActive: false,
    subarr_direct: 'corner_down',
    topDelimiter: '-2px',
    topTitle: '4px',
    heightDelimiter: '40px'
  }),
  computed: {
    item () {
      if (
        (this.index === '1' && this.month !== 'Адрес') ||
        (this.index === '5' && this.month === 'Адрес')
      ) {
        this.heightDelimiter = this.month === 'Адрес' ? '20px' : '40px'
        this.border = ''
      } else {
        this.border = '__border'
        this.heightDelimiter = '40px'
      }

      if (this.month === 'Адрес') {
        this.topDelimiter = '7px'
        this.topTitle = '-12px'

      } else {
        this.topDelimiter = '-2px'
        this.topTitle = '4px'
      }
      return this.items[this.index]
    }
  },
  methods: {
    subwork_internet () {
      if (this.subtmpActive === true) {
        this.title = 'title-row'
        this.geo = 'geo'
        this.subarr_direct = 'corner_down'
      } else {
        this.title = 'title-row-active'
        this.geo = 'geo-active'
        this.subarr_direct = 'corner_up'
      }
      this.subtmpActive = !this.subtmpActive
    }
  }
}
