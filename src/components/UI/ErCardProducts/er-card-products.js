
export default {
  name: 'er-card-products',
  props: {
    stopped: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ''
    },
    price: {
      type: String,
      default: '0'
    },
    icon: {
      type: String,
      default: 'geolocation'
    }
  },

  data () {
    return {
      pre: 'er-card-products',
      isOpen: false
    }
  }
}
