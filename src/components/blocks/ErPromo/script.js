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
    buttonId: {
      type: String,
      default: 'activate'
    },
    plugText: {
      type: String,
      default: 'Подключить'
    },
    featureList: {
      type: Array,
      default: () => []
    },
    linkToConnect: String,
    isLoadingConnectButton: Boolean,
    onlyFeature: Boolean
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
