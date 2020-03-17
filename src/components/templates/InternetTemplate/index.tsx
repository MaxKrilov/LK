import { Vue, Component, Watch } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { GET_LIST_ADDRESS_BY_SERVICES } from '@/store/actions/user'
import { getFirstElement } from '@/functions/helper'
import { API } from '@/functions/api'
import { mapState } from 'vuex'

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
      loadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount
    })
  }
})
export default class InternetTemplate extends Vue {
  $api!: API
  listPoint: iPointItem[] = []
  activePoint: iPointItem | null = null
  loadingBillingAccount!: boolean

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

  async init () {
    const listPoint = await this.$store.dispatch(`user/${GET_LIST_ADDRESS_BY_SERVICES}`, {
      api: this.$api,
      productType: 'Стандартный Интернет'
    })
    this.listPoint = listPoint.map((item: any) => ({
      id: item.id,
      fulladdress: item.fulladdress,
      bpi: item.bpi,
      offerName: item.offer.name
    }))
    this.activePoint = getFirstElement(this.listPoint) || null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div class={['internet-template', 'main-content--top-menu-fix']}>
        <er-page-header title={this.computedPageName} class={['main-content', 'main-content--padding', 'pb-0']} />
        <list-point-component class={['mb-16', 'main-content', 'main-content--padding', 'py-0']} list={this.listPoint} vModel={this.activePoint} />
        <router-view activePoint={this.activePoint?.bpi} />
      </div>
    )
  }
}
