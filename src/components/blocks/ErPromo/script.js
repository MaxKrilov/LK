import ErPromo from '../../blocks/ErPromo'

export default {
  name: 'promo-component',
  components: {
    ErPromo
  },
  props: {
    title: {
      type: String,
      default: 'Как это работает?'
    },
    banner: {
      type: String
    },
    plugText: {
      type: String,
      default: 'Подключить'
    },
    featureList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    pre: 'promo-component'
  }),
  methods: {
    getImg (img) {
      return require(`@/assets/images/${img}`)
    }
  }
}
