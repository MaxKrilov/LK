import SliderContent from './blocks/sliderContent'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'telephony-page',
  components: {
    SliderContent
  },

  data () {
    return {
      pre: 'telephony-page',
      isLoading: true,
      shadowIcon: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
          x: '-4px',
          y: '4px'
        },
        shadowRadius: '4px'
      },
      data: []
    }
  },
  computed: {
    ...mapGetters({
      billingAccountId: 'user/getActiveBillingAccount'
    }),
    amount () {
      return this.data.reduce((acc, el) => acc + +el.price, 0)
    }
  },
  watch: {
    billingAccountId (val) {
      if (val) {
        this.getPoints()
      }
    }
  },
  methods: {
    getPoints () {
      this.$store.dispatch('productnservices/locationOfferInfo', {
        api: this.$api,
        productType: 'Телефония'
      }).then(answer => {
        if (answer.length) {
          this.data = answer.map(el => {
            const result = {}
            result.price = `${+el?.amount?.value}`
            result.fulladdress = el?.fulladdress
            result.tariff = el?.offer?.name
            result.bpi = el?.bpi
            result.status = el?.status
            return result
          })
        } else {
          this.$router.push('/lk/telephony/promo')
        }
        this.isLoading = false
      })
    }
  },
  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
