import ListAddress from '../ListAddress/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'operations',
  components: {
    ListAddress
  },
  props: ['index', 'month'],
  data: () => ({
    pre: 'operations',
    items: [
      { icon: 'internet', date: '01.01.', year: '19', time: '00:01', title: 'Интернет', link: true, descr: 'Подключено 2 офиса', value: '-10 000' },
      { icon: 'watch', date: '01.01.', year: '19', time: '00:01', title: 'Видеонаблюдение', link: true, descr: 'Подключено 3 объекта', value: '-10 000' },
      { icon: 'wifi', date: '01.01.', year: '19', time: '00:01', title: 'Wi-Fi для бизнеса', link: true, descr: 'Подключен 1 объект', value: '-10 000' },
      { icon: 'deffence', date: '01.01.', year: '19', time: '00:01', title: 'Антивирусы', link: true, descr: '1 подписка', value: '-10 000' },
      { icon: 'rouble', date: '01.01.', year: '19', time: '00:01', title: 'Пополнение счета', link: true, descr: 'С банковской карты ****1234', value: '+200 000' },

      { icon: 'geolocation', date: '01.01.', year: '19', time: '00:01', title: 'Москва, пр-т Мира, д.40', link: true, descr: 'Подключено 4 услуги', value: '-5 300' },
      { icon: 'geolocation', date: '01.01.', year: '19', time: '00:01', title: 'Москва, улица Большая Бронная, дом 29', link: true, descr: 'Подключено 3 услуги', value: '-11 030' },
      { icon: 'geolocation', date: '01.01.', year: '19', time: '00:01', title: 'Санкт-Петербург, Большая Константинопольская, 100', link: true, descr: 'Подключена 1 услуга', value: '-1 300' },
      { icon: 'geolocation', date: '01.01.', year: '19', time: '00:01', title: 'Санкт-Петербург, Большая Константинопольская, 100, корп 2', link: true, descr: '1 подписка', value: '-1 000' },
      { icon: 'geolocation', date: '01.01.', year: '19', time: '00:01', title: 'Санкт-Петербург, пр-т Невский, 5', link: true, descr: 'Подключено 3 услуги', value: '-8 100' }
    ],
    wrapper: 'red',
    color: 'red',
    iconBg: 'gray',
    tmpActive_internet: false,
    arr_direct: 'corner_down',
    screenWidth: 0,
    address: '',
    topPrice: '40px',
    topTitle: '15px',
    topToggle: '0',
    heightOperation: '80px'
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    item () {
      let len = this.items[this.index].title.length
      if (this.month === 'Адрес') {
        this.address = '__address'
        this.heightOperation = '97px'
        this.topPrice = '47px'
        this.topTitle = '22px'
        this.topToggle = '13px'
        if (len > 24 && len < 50) {
          this.topPrice = '60px'
          this.topTitle = '14px'
          this.topToggle = '11px'
        }
        if (len > 49) {
          this.topPrice = '80px'
          this.heightOperation = '120px'
          this.topTitle = '14px'
          this.topToggle = '21px'
        }
      } else {
        this.address = '',
        this.topPrice = '40px',
        this.topTitle = '15px',
        this.topToggle = '0',
        this.heightOperation = this[SCREEN_WIDTH] >= 640 ? '96px' : '80px'
      }
      if (this.items[this.index].title === 'Пополнение счета') {
        this.wrapper = 'green'
        this.color = 'green'
      } else {
        this.wrapper = 'red'
        this.color = 'red'
      }
      return this.items[this.index]
    }
  },
  methods: {
    active_internet (e) {
      if (this.tmpActive_internet === true) {
        this.iconBg = 'gray'
        this.arr_direct = 'corner_down'
      } else {
        this.iconBg = 'yellow'
        this.arr_direct = 'corner_up'
      }
      this.tmpActive_internet = !this.tmpActive_internet
    }
  }
}
