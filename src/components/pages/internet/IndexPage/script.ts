import Vue from 'vue'
import Component from 'vue-class-component'
import TariffComponent from '@/components/pages/internet/blocks/TariffComponent/index.vue'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import InternetDeviceComponent from '@/components/pages/internet/blocks/InternetDeviceComponent/index.vue'
import ServicesComponent from '@/components/pages/internet/blocks/ServicesComponent/index.vue'
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue'
import { API } from '@/functions/api'
import { ICustomerProduct } from '@/tbapi'
import { SERVICE_URLS } from '@/constants/url'
import ErBundleInfo from '@/components/blocks/ErBundleInfo/index.vue'
import { DEVICES } from '@/constants/internet'

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
    ErBundleInfo,
    PriceServicesComponent,
    InternetDeviceComponent
  },
  props: {
    customerProduct: {
      type: Object,
      default: null
    },
    isLoadingCustomerProduct: Boolean,
    locationId: [String, Number],
    addressId: [String, Number],
    fullAddress: String,
    marketId: String
  }
})
export default class IndexPage extends Vue {
  $api!: API

  readonly DEVICES:string[] = DEVICES

  // Props
  readonly customerProduct!: ICustomerProduct | null
  readonly isLoadingCustomerProduct!: boolean
  readonly locationId!: number | string
  readonly addressId!: number | string
  readonly fullAddress!: string
  readonly marketId!: string

  // Methods
  updateData () {
    this.$emit('update')
  }

  onClickPlug () {
    window.open(SERVICE_URLS.INTERNET)
  }

  get bundle () {
    return this.customerProduct?.tlo?.bundle
  }
}
