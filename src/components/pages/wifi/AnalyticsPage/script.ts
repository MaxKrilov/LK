import Vue from 'vue'
import Component from 'vue-class-component'

import ErPromo from '@/components/blocks/ErPromo/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'

import { mapActions, mapGetters, mapState } from 'vuex'

import { IAvailableFunds, ICustomerProduct, ICustomerProductSLO, ILocationOfferInfo } from '@/tbapi'
import { API } from '@/functions/api'

import { STATUS_ACTIVE, STATUS_SUSPENDED } from '@/constants/status'

import { head } from 'lodash'
import { price as priceFormatted } from '@/functions/filters'
import moment from 'moment'

const analyticsFeatureList = require('./promo.json')

const SLO_CODE = 'WIFIANALYTICS'
const PRODUCT_TYPE = 'Wi-Fi Hot Spot (Дом.ru)'

@Component<InstanceType<typeof ErtAnalyticsPage>>({
  components: {
    ErPromo,
    ErActivationModal,
    ErPlugProduct,
    ErDisconnectProduct
  },
  filters: {
    priceFormatted
  },
  computed: {
    ...mapState({
      isLoadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount,
      loadingBalance: (state: any) => state.loading.menuComponentBalance
    }),
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    })
  },
  methods: {
    ...mapActions({
      getListPoint: 'productnservices/locationOfferInfo',
      customerProducts: 'productnservices/customerProducts',
      getAvailableFunds: 'salesOrder/getAvailableFunds',
      customerProduct: 'productnservices/customerProduct',
      getRadarLink: 'wifi/getRadarLink'
    })
  },
  watch: {
    loadingBalance (val) {
      if (val) {
        this.isLoadingData = true
      } else {
        this.init()
      }
    },
    connectPoint (val, oldVal) {
      if (val.length > 1) {
        this.connectPoint = val.slice(1)
      } else if (val.length === 0) {
        this.$nextTick(() => {
          this.connectPoint = oldVal
        })
      }
    }
  }
})
export default class ErtAnalyticsPage extends Vue {
  /// Vuex state
  readonly isLoadingBillingAccount!: boolean
  readonly loadingBalance!: boolean

  /// Vuex getters
  readonly billingAccountId!: string

  /// Vuex actions
  readonly getListPoint!: (payload: { api: API, productType: string | string[] }) => Promise<ILocationOfferInfo[]>

  readonly customerProducts!: (payload: {
    api: API,
    parentIds?: Array<string | number>,
    code?: string[] | string,
    tomsId?: string
  }) => Promise<Record<string, ICustomerProduct>>

  readonly customerProduct!: (payload: {
    api: API,
    parentId?: string | number,
    parentIds?: string[]
    locationId?: string | number,
    marketId?: string | number,
    code?: string,
    tomsId?: string
  }) => Promise<ICustomerProduct>

  readonly getAvailableFunds!: <R = Promise<IAvailableFunds>>() => R

  readonly getRadarLink!: () => Promise<{ data: string, payload: Record<string, string> }>

  /// Data
  isLoadingData: boolean = true
  isErrorLoaded: boolean = false
  isCheckingMoney: boolean = false

  isShowDialogOfListPoint: boolean = false
  isShowMoneyModal: boolean = false
  isShowPlugProductPlugin: boolean = false
  isShowDisconnectProduct: boolean = false

  isErrorMoney: boolean = false

  listPoint: ILocationOfferInfo[] = []
  listCustomerProduct: ICustomerProductSLO[] = []

  analyticsFeatureList = analyticsFeatureList

  connectPoint: ILocationOfferInfo[] = []

  priceForConnection: number = 0
  availableFundsAmt: number = 0

  flagRequestRadarLink: Record<string, boolean> = {}
  flagDisconnect: Record<string, boolean> = {}

  disconnectData: Record<string, string> = {}

  /// Computed
  get hasLeastOneActiveOrSuspendedPoint () {
    return this.listCustomerProduct.some(sloProduct => [STATUS_ACTIVE, STATUS_SUSPENDED].includes(sloProduct.status))
  }

  get listPointWithoutAnalytics () {
    return this.listPoint
      .filter(point => !this.listCustomerProduct.some(product => product.parentId === point.bpi))
  }

  get orderData () {
    return {
      locationId: this.connectPoint[0]?.id,
      bpi: this.connectPoint[0]?.bpi,
      productCode: SLO_CODE,
      offer: 'wifi',
      title: 'Вы уверены, что хотите подключить услугу «Аналитика по пользователям»?',
      marketId: this.connectPoint[0]?.marketId,
      tomsId: '302000029'
    }
  }

  get statusSuspended () {
    return STATUS_SUSPENDED
  }

  /// Methods
  async init () {
    try {
      this.listPoint = await this.getListPoint({ api: this.$api, productType: PRODUCT_TYPE })

      const customerProductsResponse = await this.customerProducts({
        api: this.$api,
        parentIds: this.listPoint.map(point => String(point.bpi)),
        code: SLO_CODE
      })

      this.listCustomerProduct = Object.values(customerProductsResponse)
        .reduce((acc, item) => {
          acc.push(...item.slo)

          return acc
        }, [] as ICustomerProductSLO[])

      this.isErrorLoaded = false
    } catch (ex) {
      this.isErrorLoaded = true
    } finally {
      this.isLoadingData = false
    }
  }

  onShowDialogOfListPointHandler () {
    this.isShowDialogOfListPoint = true
  }

  onHideDialogOfListPointHandler () {
    this.isShowDialogOfListPoint = false
  }

  async onConnectHandler () {
    // Получаем сумму, необходимую для подключения
    this.isCheckingMoney = true
    try {
      const customerProductResponse = await this.customerProduct({
        api: this.$api,
        parentId: this.connectPoint[0].bpi,
        marketId: this.connectPoint[0].marketId
      })
      this.priceForConnection = Number(head(customerProductResponse!.slo.find(sloItem => sloItem.code === SLO_CODE)!.prices)!.amount) || 0

      // Получаем доступные средства
      const availableFundsResponse = await this.getAvailableFunds()
      const availableFunds = Number(availableFundsResponse.availableFundsAmt)
      this.availableFundsAmt = availableFunds

      if (availableFunds - this.priceForConnection >= 0) {
        this.isShowPlugProductPlugin = true
      } else {
        this.isShowDialogOfListPoint = false
        this.isShowMoneyModal = true
      }
    } catch (ex) {
      this.isShowDialogOfListPoint = false
      this.isErrorMoney = true
    } finally {
      this.isCheckingMoney = false
    }
  }

  onToPayment () {
    this.$router.push({
      name: 'add-funds',
      params: {
        total_amount: this.priceForConnection
          ? String(this.priceForConnection - this.availableFundsAmt)
          : '0'
      }
    })
  }

  actualStartDateFormat (date: string) {
    return moment(date).format('DD.MM.YYYY')
  }

  getAddressByBPI (bpi: string) {
    return this.listPoint.find(point => point.bpi === bpi)?.fulladdress || ''
  }

  async onGetRadarLinkHandler (bpi: string) {
    Vue.set(this.flagRequestRadarLink, bpi, true)
    const radarLink = await this.getRadarLink()
    window.open(radarLink.data, '_blank')?.focus()
    Vue.set(this.flagRequestRadarLink, bpi, false)
  }

  async onDisconnectHandler (bpi: string) {
    Vue.set(this.flagDisconnect, bpi, true)

    const point = this.listPoint.find(point => point.bpi === bpi)!
    const customerProduct = await this.customerProduct({
      api: this.$api,
      parentId: bpi,
      marketId: point.marketId
    })
    const productId = customerProduct.slo.find(sloItem => sloItem.code === SLO_CODE)!.productId

    this.disconnectData = {
      bpi,
      locationId: String(point.id),
      productId,
      title: 'Вы уверены, что хотите отключить услугу «Аналитика по пользователям»?',
      marketId: point.marketId
    }

    this.$nextTick(() => {
      this.isShowDisconnectProduct = true

      Vue.set(this.flagDisconnect, bpi, false)
    })
  }

  onCompletedDisconnect (bpi: string) {
    Vue.set(this.flagDisconnect, bpi, false)
  }

  /// Hooks
  created () {
    this.billingAccountId && this.init()
  }
}
