import Vue from 'vue'
import Component from 'vue-class-component'
import TariffComponent from '@/components/pages/internet/blocks/TariffComponent/index.vue'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import ServicesComponent from '@/components/pages/internet/blocks/ServicesComponent/index.vue'
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue'
import { API } from '@/functions/api'
import { ICustomerProduct } from '@/tbapi'
import { SERVICE_URLS } from '@/constants/url'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string
}

@Component({
  components: {
    TariffComponent,
    SpeedComponent,
    ServicesComponent,
    PriceServicesComponent
  },
  props: {
    customerProduct: {
      type: Object,
      default: null
    },
    isLoadingCustomerProduct: Boolean,
    locationId: [String, Number]
  }
})
export default class IndexPage extends Vue {
  $api!: API

  // Props
  readonly customerProduct!: ICustomerProduct | null
  readonly isLoadingCustomerProduct!: boolean
  readonly locationId!: number | string

  // Methods
  updateData () {
    this.$emit('update')
  }

  onClickPlug () {
    window.open(SERVICE_URLS.INTERNET)
  }
}
