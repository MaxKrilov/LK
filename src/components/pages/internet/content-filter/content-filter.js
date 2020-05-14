import moment from 'moment'
import { mapGetters } from 'vuex'
import plug from '@/components/pages/internet/content-filter/plug'
import ErActivationModal from '@/components/blocks/ErActivationModal/index'

export default {
  name: 'content-filter-page',

  data () {
    return {
      pre: 'content-filter-page',
      isOpen: false,
      data: [],
      isLoading: true,
      isShowConnecting: false,
      offer: false,
      isShowDisconnectModal: false,
      isShowErrorModal: false,
      offerAcceptedOn: '',
      sendingOrder: false,
      isCreatingOrder: false,
      connectedBpis: [],
      freePoints: []
    }
  },
  components: {
    plug,
    ErActivationModal
  },
  watch: {
    billingAccountId (val) {
      if (val) {
        this.getContentFilterData()
      }
    },
    offer (val) {
      this.offerAcceptedOn = val ? this.$moment().format() : null
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
    getLink (login) {
      return this.$store.dispatch('internet/getContentFilterLink', {
        login
      })
    },
    getContentFilterData () {
      this.$store.dispatch('productnservices/locationOfferInfo', {
        api: this.$api,
        productType: 'Интернет'
      }).then(answer => {
        if (answer) {
          // преобразуем в объект ключ - bpi,   значене - полный адрес
          const points = answer.reduce((acc, el) => {
            acc[el.bpi] = el.fulladdress
            return acc
          }, {})

          // точки доступные для подключения
          const freePoints = answer.map(el => {
            return {
              id: el?.id,
              fulladdress: el?.fulladdress,
              bpi: el?.bpi,
              offerName: el?.offer?.name
            }
          })

          const bpis = answer.map(el => el.bpi)

          this.$store.dispatch('productnservices/customerProducts', {
            api: this.$api,
            parentIds: bpis,
            code: 'CONTENTFIL'
          })
            .then(answer => {
              const data = Object.values(answer)
              this.connectedBpis = Object.keys(answer)
              this.data = data.map(el => {
                const _el = {}
                _el['fulladdress'] = points[el?.slo[0]?.parentId]
                _el['date'] = moment(el?.slo[0]?.actualStartDate).format('DD.MM.YY')
                _el['price'] = el?.slo[0]?.purchasedPrices?.recurrentTotal?.value
                _el['login'] = el?.slo[0]?.chars?.['Реквизиты доступа']
                _el['tariff'] = el?.slo[0]?.chars?.['Имя тарифного плана']
                _el['offerId'] = el?.slo[0]?.offer?.id
                _el['productId'] = el?.slo[0]?.id
                _el['locationId'] = el?.tlo?.locationId
                _el['bpi'] = el?.tlo?.id
                _el['link'] = ''
                this.getLink(_el['login']).then((e) => {
                  _el['link'] = e?.url
                }).catch(() => {
                  _el['link'] = ''
                })
                return _el
              })
            })
            .finally(() => {
              this.isLoading = false
              this.freePoints = freePoints.filter(el => !this.connectedBpis.includes(el.bpi))
            })
        }
      })
    },
    cancelOrder () {
      this.offer = false
      this.$store.dispatch('salesOrder/cancel')
    },
    sendOrder () {
      this.sendingOrder = true
      this.$store.dispatch('salesOrder/send', { offerAcceptedOn: this.offerAcceptedOn })
        .then(() => {
          this.sendingOrder = false
          this.isShowSuccessModal = true
          this.isShowDisconnectModal = false
        })
        .catch(() => {
          this.isShowDisconnectModal = false
          this.isShowErrorModal = true
        })
        .finally(() => {
          this.sendingOrder = false
          this.offer = false
        })
    },
    disconnect (offerId, locationId, bpi, productId) {
      this.isCreatingOrder = true
      this.$store.dispatch('salesOrder/createDisconnectOrder', {
        locationId,
        bpi,
        offerId,
        productId,
        disconnectDate: this.$moment().format()
      }).then(() => {
        this.isShowDisconnectModal = true
      }).catch(() => {
        this.isShowErrorModal = true
      }).finally(() => {
        this.isCreatingOrder = false
      })
    }
  },
  mounted () {
    if (this.billingAccountId) {
      this.getContentFilterData()
    }
  }
}
