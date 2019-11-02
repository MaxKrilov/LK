import ListComponent from '../ListComponent/index.vue'

export default {
  name: 'operation-component',
  components: {
    ListComponent
  },
  props: ['index'],
  data: () => ({
    pre: 'operation-component',
    items: [
      { icon: 'internet', date: '01.01.', year: '19', time: '00:01', title: 'Интернет', link: true, descr: 'Подключено 2 офиса', value: '-10 000' },
      { icon: 'watch', date: '01.01.', year: '19', time: '00:01', title: 'Видеонаблюдение', link: true, descr: 'Подключено 3 объекта', value: '-10 000' },
      { icon: 'wifi', date: '01.01.', year: '19', time: '00:01', title: 'Wi-Fi для бизнеса', link: true, descr: 'Подключен 1 объект', value: '-10 000' },
      { icon: 'deffence', date: '01.01.', year: '19', time: '00:01', title: 'Антивирусы', link: true, descr: '1 подписка', value: '-10 000' },
      { icon: 'rouble', date: '01.01.', year: '19', time: '00:01', title: 'Пополнение счета', link: true, descr: 'С банковской карты ****1234', value: '+200 000' }
    ],
    wrapper: 'red',
    color: 'red',
    iconBg: 'gray',
    tmpActive_internet: false,
    arr_direct: 'corner_down'
  }),
  computed: {
    item () {
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
  },
  mounted () {
    if (this.index === '4') {
      this.wrapper = 'green'
      this.color = 'green'
    }
  }
}
