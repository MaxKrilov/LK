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
      { icon: 'internet', date: '01.01.', year: '19', time: '00:01', title: 'Интернет', link: true, descr: 'Подключено 2 офиса', value: '-10 000'},
      { icon: 'watch', date: '01.01.', year: '19', time: '00:01', title: 'Видеонаблюдение', link: true, descr: 'Подключено 3 объекта', value: '-10 000'},
      { icon: 'wifi', date: '01.01.', year: '19', time: '00:01', title: 'Wi-Fi для бизнеса', link: true, descr: 'Подключен 1 объект', value: '-10 000'},
      { icon: 'deffence', date: '01.01.', year: '19', time: '00:01', title: 'Антивирусы', link: false, descr: '1 подписка. Антивирус Kaspersky Endpoint Security для бизнеса Стандартный', value: '-10 000'},
      { icon: 'rouble', date: '01.01.', year: '19', time: '00:01', title: 'Пополнение счета', link: false, descr: 'С банковской карты ****1234', value: '+200 000'}
    ],
    wrapper: 'wrapper',
    tmpActive_internet: false,
    arr_direct: 'corner_down',
  }),
  computed: {
    item() {
      return this.items[this.index]
    }
  },
  methods: {
    active_internet (e) {
      const icon =  e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0]
      if (this.tmpActive_internet === true) {
        icon.style.backgroundColor = '#E2E2E2'
        icon.childNodes[0].childNodes[0].style.color = '#F3F3F3'
        this.arr_direct = 'corner_down'
      } else {
        icon.style.backgroundColor = '#FFDD00'
        icon.childNodes[0].childNodes[0].style.color = '#FFEF80'
        this.arr_direct = 'corner_up'
      }

      this.tmpActive_internet = !this.tmpActive_internet
    },
  },
  mounted() {
    if (this.index == 4) {
      this.wrapper = 'wrapper-pay'
    }
  }

}
