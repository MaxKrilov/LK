import { Skeleton } from 'vue-loading-skeleton'
import { price as priceFormatted } from '../../../functions/filters'

export default {
  name: 'er-card-products',
  components: {
    Skeleton
  },
  filters: {
    priceFormatted
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
  },
  watch: {
    isOpen (val) {
      this.$emit('open', val)
    }
  }
}
