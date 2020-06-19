export default {
  name: 'promo-component',

  props: {
    title: {
      type: String,
      default: 'Как это работает?'
    },
    banner: {
      type: String
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
