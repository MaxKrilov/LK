import moment from 'moment'
import { mapGetters } from 'vuex'
import plug from '@/components/pages/internet/content-filter/plug'
import ErActivationModal from '@/components/blocks/ErActivationModal/index'
import { ARRAY_STATUS_SHOWN } from '@/constants/status.ts'

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
      isShowErrorDisconnectModal: false,
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
            acc[el.bpi] = el?.fulladdress
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
              this.connectedBpis = Object.keys(answer)
              this.data = this.connectedBpis
                .map(
                  (el) => answer[el].slo?.filter((slo) => ARRAY_STATUS_SHOWN.includes(slo.status))?.[0] // отфильтровали точки, где нет активных
                )
                .filter(el => el)
                .map(el => {
                  const _el = {}
                  _el['fulladdress'] = points[el?.parentId]
                  _el['date'] = moment(el?.actualStartDate).format('DD.MM.YY')
                  _el['price'] = el?.purchasedPrices?.recurrentTotal?.value
                  _el['login'] = el?.chars?.['Реквизиты доступа']
                  _el['tariff'] = el?.chars?.['Имя тарифного плана']
                  _el['offerId'] = el?.offer?.id
                  _el['productId'] = el?.id
                  _el['locationId'] = el?.locationId
                  _el['bpi'] = el?.parentId
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
              this.freePoints = freePoints.filter(el => !this.data.map(_el => _el.bpi).includes(el.bpi))
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
        .then((answer) => {
          // eslint-disable-next-line camelcase
          if (answer?.submit_statuses?.[0]?.submitStatus === 'FAILED') {
            this.isShowErrorModal = true
          } else {
            this.isShowSuccessModal = true
          }
          this.sendingOrder = false
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
    disconnect (offerId, locationId, bpi, productId, date) {
      if (date === moment().format('DD.MM.YY')) {
        this.isShowErrorDisconnectModal = true
        return
      }
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
