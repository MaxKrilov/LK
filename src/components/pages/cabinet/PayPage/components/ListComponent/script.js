import DetailComponent from '../DetailComponent/index.vue'

export default {
  name: 'list-component',
  components: {
    DetailComponent
  },
  props: ['index'],
  data: () => ({
    pre: 'list-component',
    items: [
      { city: 'Москва,', street: 'пр-т Мира, д.40', value: '-6000'},
      { city: 'Москва,', street: 'улица Большая Бронная, дом 29', value: '-6000'}
    ],
    title: 'title-row',
    geo: 'geo',
    subtmpActive: false,
    subarr_direct: 'corner_down',
  }),
  computed: {
    item () {
      return this.items[this.index]
    }
  },
  methods: {
    subwork_internet (e) {
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
    },
  }
}
