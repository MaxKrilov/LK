import { Vue, Component, Watch } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { getFirstElement } from '@/functions/helper'
import { API } from '@/functions/api'
import { mapState } from 'vuex'
import { ICustomerProduct, ILocationOfferInfo } from '@/tbapi'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string
}

@Component({
  components: {
    ListPointComponent
  },
  computed: {
    ...mapState({
      loadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount,
      billingAccountId: (state: any) => state.user.activeBillingAccount,
      billingAccountNumber: (state: any) => state.user.activeBillingAccountNumber
    })
  }
})
export default class InternetTemplate extends Vue {
  $api!: API
  listPoint: iPointItem[] = []
  activePoint: iPointItem | null = null
  loadingBillingAccount!: boolean
  billingAccountId!: string | number
  billingAccountNumber!: string | number
  isLoadingListPoint = true
  customerProduct: ICustomerProduct | null = null

  get computedPageName () {
    return this.$route.meta?.name || 'Интернет'
  }

  @Watch('loadingBillingAccount')
  onLoadingBillingAccountChange (val: boolean) {
    if (!val) {
      this.init()
    }
  }

  async created () {
    if (!this.loadingBillingAccount) {
      this.init()
    }
  }

  getCustomerProduct () {
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.activePoint?.bpi
    })
      .then((result) => {
        this.customerProduct = result
      })
  }

  getRemainingPackages () {
    this.$store.dispatch('productnservices/billingPacket', {
      api: this.$api,
      id: this.billingAccountId,
      product: this.activePoint?.bpi
    })
      .then((result) => {
        console.log(result)
      })
  }

  getProductInfolist () {
    this.$store.dispatch('productnservices/productInfoList', {
      api: this.$api,
      id: this.activePoint?.bpi
    })
      .then((result) => {
        console.log(result)
      })
  }

  init () {
    this.isLoadingListPoint = true
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Интернет'
    })
      .then((response: ILocationOfferInfo[]) => {
        this.listPoint = response.map(item => ({
          id: item.id,
          fulladdress: item.fulladdress,
          bpi: item.bpi,
          offerName: item.offer.name
        }))
        this.activePoint = getFirstElement(this.listPoint) || null
        this.$nextTick(() => {
          this.getCustomerProduct()
          this.getRemainingPackages()
          this.getProductInfolist()
        })
      })
      .catch(() => {
        this.listPoint = []
        this.activePoint = null
      })
      .finally(() => { this.isLoadingListPoint = false })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div class={['internet-template', 'main-content--top-menu-fix']}>
        <er-page-header title={this.computedPageName} class={['main-content', 'main-content--padding', 'pb-0']} />
        <list-point-component class={['mb-16', 'main-content', 'main-content--padding', 'py-0']} list={this.listPoint} vModel={this.activePoint} />
        <router-view customerProduct={this.customerProduct} />
      </div>
    )
  }
}
