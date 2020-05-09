import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { getFirstElement, uniq } from '@/functions/helper'
import { API } from '@/functions/api'
import { mapState } from 'vuex'
import { ICustomerProduct, ILocationOfferInfo } from '@/tbapi'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string
}

const transformListPoint = (listPoint: ILocationOfferInfo[]): iPointItem[] => uniq(listPoint.map(item => ({
  id: item.id,
  fulladdress: item.fulladdress,
  bpi: item.bpi,
  offerName: item.offer.name
})), 'id')

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof InternetTemplate>>({
  components: {
    ListPointComponent
  },
  computed: {
    ...mapState({
      loadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount,
      billingAccountId: (state: any) => state.user.activeBillingAccount
    })
  },
  watch: {
    loadingBillingAccount (val) {
      if (!val) {
        this.init()
      }
    },
    billingAccountId (val: string, oldVal: string) {
      // Вызываем ининициализацию, если переключение л/с было вызывано пользователем
      // В противном случае инициализация происходит в watch loadingBillingAccount
      if (oldVal !== '') {
        this.init()
      }
    }
  }
})
export default class InternetTemplate extends Vue {
  // Options
  $api!: API

  // Vuex
  loadingBillingAccount!: boolean
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
      parentId: this.activePoint!.bpi
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
        this.listPoint = transformListPoint(response)
        this.activePoint = getFirstElement(this.listPoint)
        this.$nextTick(this.getCustomerProduct)
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
    if (!this.loadingBillingAccount) {
      this.init()
    }
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'internet-template main-content--top-menu-fix'
    }, [
      h('er-page-header', {
        staticClass: 'main-content main-content--padding pb-0',
        props: { title: this.computedPageName }
      }),
      h('list-point-component', {
        staticClass: 'main-content main-content--padding mb-16 py-0',
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
          isLoadingCustomerProduct: this.isLoadingCustomerProduct
        }
      })
    ])
  }
}
