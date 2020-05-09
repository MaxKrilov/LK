import { Skeleton } from 'vue-loading-skeleton'

export default {
  name: 'er-card-products',
  components: {
    Skeleton
  },
  props: {
    stopped: {
      type: Boolean,
      default: false
    },
    loading: {
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
    // },
    // productData: {
    //   type: Object,
    //   default: function () {
    //     return {}
    //   }
    }
  },

  data () {
    return {
      pre: 'er-card-products',
      isOpen: false
    }
  }
}
