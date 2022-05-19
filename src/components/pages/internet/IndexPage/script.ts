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
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

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
    InternetDeviceComponent,
    ErActivationModal
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

  isRecovering: boolean = false
  isShowResumeModal: boolean = false
  isShowErrorModal: boolean = false
  isSendingOrderResume: boolean = false
  isShowSuccessModal: boolean = false

  get getProductId () {
    return this.customerProduct?.tlo.id || ''
  }

  get isStopped () {
    return this.customerProduct?.tlo.status === 'Suspended'
  }

  // Methods
  updateData () {
    this.$emit('update')
  }

  onClickPlug () {
    window.open(SERVICE_URLS.INTERNET)
  }

  recover () {
    this.isRecovering = true

    this.$store.dispatch('salesOrder/createResumeOrder',
      {
        locationId: this.customerProduct?.tlo.locationId,
        disconnectDate: '1',
        productId: this.customerProduct?.tlo.id,
        marketId: this.marketId
      })
      .then(() => {
        this.isShowResumeModal = true
      })
      .catch(() => {
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.isRecovering = false
      })
  }

  sendResumeOrder () {
    this.isSendingOrderResume = true

    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.isShowSuccessModal = true
      })
      .catch(() => {
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.isShowResumeModal = false
        this.isSendingOrderResume = false
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  get bundle () {
    return this.customerProduct?.tlo?.bundle
  }
}
