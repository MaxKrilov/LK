import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent'
import Submenu from './components/Submenu'
import { mapActions } from 'vuex'
import { head } from 'lodash'
import Page from '../../../../helpers/Page'
import { ServiceStatus } from '@/constants/status'
import ErPromo from '@/components/blocks/ErPromo'
import ErPlugProduct from '@/components/blocks/ErPlugProduct'
import { price as priceFormatted } from '@/functions/filters'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const analyticFutureList = require('./promo.json')

const SLO_CODE = 'WIFIANALYTICS'

export default {
  name: 'wifi-analytics-statistics',
  components: {
    ListPointComponent,
    Submenu,
    ErPromo,
    ErPlugProduct,
    ErActivationModal
  },
  mixins: [ResponsiveMixin, Page],
  filters: {
    priceFormatted
  },
  props: {},
  data: () => ({
    pre: 'statistics',
    subpage: '',
    listPoint: [],
    activePoint: null,
    vlan: '',
    cityId: '',
    productType: 'Wi-Fi Hot Spot (Дом.ru)',
    customerProduct: null,
    isLoadingListPoint: true,
    isLoadingCustomerProduct: true,
    isLoadingWifiData: true,
    isErrorLoad: false,
    promoFeatureList: analyticFutureList,
    isShowPlugProductPlugin: false,
    isShowMoneyModal: false,
    isErrorMoney: false,
    isCheckingMoney: false,
    availableFundsAmt: 0
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    },
    isActiveProduct () {
      return this.customerProduct
        ? this.customerProduct.slo
          .find(sloItem => sloItem.code === SLO_CODE).status === ServiceStatus.STATUS_ACTIVE
        : false
    },
    getPriceForConnection () {
      return this.customerProduct && !this.isActiveProduct
        ? Number(head(this.customerProduct.slo.find(sloItem => sloItem.code === SLO_CODE).prices).amount)
        : 0
    },
    getOrderData () {
      return {
        locationId: this.activePoint?.id,
        bpi: this.activePoint?.bpi,
        productCode: SLO_CODE,
        offer: 'wifi',
        title: 'Вы уверены, что хотите подключить услугу «Аналитика по пользователям»?'
      }
    },
    getDisconnectData () {
      const productId = this.customerProduct && this.isActiveProduct
        ? this.customerProduct.slo.find(sloItem => sloItem.code === SLO_CODE).productId
        : ''
      return {
        bpi: this.activePoint?.bpi,
        locationId: this.activePoint?.id,
        productId,
        title: 'Вы уверены, что хотите отключить услугу «Аналитика по пользователям»?'
      }
    }
  },
  watch: {
    listPoint () {
      this.$nextTick(() => {
        this.isLoadingListPoint = false
      })
    },
    customerProduct (val) {
      val && this.$nextTick(() => {
        this.isLoadingCustomerProduct = false
      })
    },
    activePoint (newVal, oldVal) {
      Page.options.watch.activePoint.call(this, newVal, oldVal)
      if (newVal && oldVal) {
        this.isLoadingCustomerProduct = true
        this.isLoadingWifiData = true
        this.isErrorLoad = false
      }
      newVal && this.getResource({ bpi: newVal.bpi })
        .then(response => {
          const vlan = head(response).vlan
          if (vlan && typeof head(vlan) !== 'undefined') {
            this.cityId = head(vlan).cityId
            this.vlan = head(vlan).number
          }
        })
        .catch(() => {
          this.isErrorLoad = true
          this.isLoadingCustomerProduct = false
          this.isLoadingWifiData = false
        })
    }
  },
  methods: {
    selectSubpage (name) {
      const routeName = this.$router.currentRoute.name
      if (routeName !== name) {
        this.$router.push({ name: name })
        this.subpage = name
      }
    },
    getListPoint () {
      return new Promise((resolve, reject) => {
        Page.options.methods.getListPoint.call(this)
          .then(() => {
            this.listPoint = this.listPoint.filter(point => ~point.offerName.match(/hot spot/ig))
            if (this.$route.params.hasOwnProperty('bpi')) {
              this.activePoint = this.listPoint.find(point => point.bpi === this.$route.params.bpi) || null
            } else {
              this.activePoint = head(this.listPoint) || null
            }
            resolve(this.listPoint)
          })
          .catch(error => {
            this.isErrorLoad = true
            this.isLoadingListPoint = false
            this.isLoadingCustomerProduct = false
            this.isLoadingWifiData = false
            reject(error)
          })
      })
    },
    ...mapActions({
      getResource: 'wifi/getResource',
      getData: 'wifi/getData',
      getAvailableFunds: 'salesOrder/getAvailableFunds'
    }),
    onConnect () {
      this.isCheckingMoney = true
      this.getAvailableFunds()
        .then(response => {
          const availableFunds = Number(response.availableFundsAmt)
          this.availableFundsAmt = availableFunds

          if (availableFunds - this.getPriceForConnection > 0) {
            this.isShowPlugProductPlugin = true
          } else {
            this.isShowMoneyModal = true
          }
        })
        .catch(() => {
          this.isErrorMoney = true
        })
        .finally(() => {
          this.isCheckingMoney = false
        })
    },
    onToPayment () {
      this.$router.push({
        name: 'add-funds',
        params: {
          total_amount: this.getPriceForConnection
            ? String(this.getPriceForConnection - this.availableFundsAmt)
            : '0'
        }
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.subpage = to.name
    next()
  }
}
