import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ddos-page',

  data () {
    return {
      pre: 'ddos-page',
      isOpen: false,
      data: [],
      isLoading: true
    }
  },
  watch: {
    billingAccountId (val) {
      if (val) {
        this.getContentFilterData()
      }
    }
  },
  computed: {
    ...mapGetters({
      billingAccountId: 'user/getActiveBillingAccount'
    }),
    amountPrice () {
      return this.data.reduce((acc, el) => acc + +el.price, 0)
    }
  },
  methods: {
    getContentFilterData () {
      this.$store.dispatch('productnservices/locationOfferInfo', {
        api: this.$api,
        productType: 'Интернет'
      }).then(answer => {
        const points = answer.reduce((acc, el) => {
          acc[el.bpi] = el.fulladdress
          return acc
        }, {})
        const bpis = answer.map(el => el.bpi)
        this.$store.dispatch('productnservices/customerProducts', {
          api: this.$api,
          parentIds: bpis,
          code: 'ANTIDDOSSP'
        }).then(answer => {
          const data = Object.values(answer)
          this.data = data.map(el => {
            const _el = {}
            _el['fulladdress'] = points[el.slo[0].parentId]
            _el['date'] = moment(el.slo[0].actualStartDate).format('DD.MM.YY')
            _el['price'] = el.slo[0].purchasedPrices.recurrentTotal.value
            return _el
          })
          this.isLoading = false
        })
      })
    }
  },
  mounted () {
    if (this.billingAccountId) {
      this.getContentFilterData()
    }
  }
}
