import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { getFirstElement, uniq } from '@/functions/helper'
import { API } from '@/functions/api'
import { mapGetters, mapState } from 'vuex'
import { ICustomerProduct, ILocationOfferInfo } from '@/tbapi'
import { dataLayerPush } from '@/functions/analytics'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string,
  addressId: string,
  marketId: string
}

const transformListPoint = (listPoint: ILocationOfferInfo[]): iPointItem[] => uniq(listPoint.map(item => ({
  id: item.id,
  fulladdress: item.fulladdress,
  bpi: item.bpi,
  offerName: item.offer.name,
  addressId: item.address.id,
  marketId: item.marketId
})), 'bpi')

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof InternetTemplate>>({
  components: {
    ListPointComponent
  },
  computed: {
    ...mapState({
      loadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount,
      loadingBalance: (state: any) => state.loading.menuComponentBalance
    }),
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    })
  },
  watch: {
    loadingBalance (val) {
      !val && this.init()
    },
    billingAccountId (val: string, oldVal: string) {
      if (oldVal !== '') {
        this.isLoadingListPoint = true
        this.isLoadingCustomerProduct = true
      }
    },
    activePoint (val, oldVal) {
      oldVal !== null && this.getCustomerProduct()
    }
  }
})
export default class InternetTemplate extends Vue {
  // Options
  $api!: API

  // Vuex
  loadingBillingAccount!: boolean
  loadingBalance!: boolean
  billingAccountId!: string

  // Data
  /**
   * Список точек
   */
  listPoint: iPointItem[] = []
  /**
   * Активная точка
   */
  activePoint: iPointItem | null = null
  /**
   * Список клиентских продуктов
   */
  customerProduct: ICustomerProduct | null = null
  /**
   * Флаг, отвечающий за загрузку списка точек
   */
  isLoadingListPoint = true
  /**
   * Флаг, отвечающий за загрузку клиентских продуктов
   */
  isLoadingCustomerProduct = true

  // Computed
  get computedPageName () {
    return this.$route.meta?.name || 'Интернет'
  }

  getCustomerProduct () {
    this.isLoadingCustomerProduct = true

    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.activePoint!.bpi,
      marketId: this.activePoint!.marketId
    })
      .then(response => {
        this.customerProduct = response
      })
      .catch(() => {
        this.customerProduct = null
      })
      .finally(() => {
        this.isLoadingCustomerProduct = false
      })
  }

  init () {
    this.isLoadingListPoint = true
    this.isLoadingCustomerProduct = true

    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Интернет'
    })
      .then(response => {
        if (response.length === 0) {
          this.$router.push('/lk/internet/promo')
        } else {
          this.listPoint = transformListPoint(response)
          this.activePoint = getFirstElement(this.listPoint)
          this.$nextTick(this.getCustomerProduct)
        }
      })
      .catch(() => {
        this.listPoint = []
        this.activePoint = null
      })
      .finally(() => {
        this.isLoadingListPoint = false
      })
  }

  created () {
    if (!this.loadingBalance) {
      this.init()
    }
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'internet-template main-content--top-menu-fix'
    }, [
      h('er-page-header', {
        staticClass: 'main-content main-content--padding pb-0',
        props: { title: this.computedPageName },
        on: {
          onBack: () => { dataLayerPush({ category: 'internet', label: 'return' }) }
        }
      }),
      h('list-point-component', {
        staticClass: 'main-content main-content--padding py-0',
        props: {
          list: this.listPoint,
          value: this.activePoint
        },
        on: {
          input: (e: iPointItem) => { this.activePoint = e }
        }
      }),
      h('router-view', {
        attrs: {
          locationId: this.activePoint?.id,
          customerProduct: this.customerProduct,
          isLoadingCustomerProduct: this.isLoadingCustomerProduct,
          addressId: this.activePoint?.addressId,
          fullAddress: this.activePoint?.fulladdress,
          marketId: this.activePoint?.marketId
        },
        on: {
          update: () => {
            this.getCustomerProduct()
          }
        }
      })
    ])
  }
}
