import Vue from 'vue'
import Component from 'vue-class-component'

import WifiAuthServicesCard from './components/card/index.vue'
import { ICustomerProduct, ILocationOfferInfo, IWifiResourceInfo } from '@/tbapi'
import ListPointComponent from '@/components/blocks/ErListPoints/index.vue'
import { transformListPoint, iPointItem } from '@/components/blocks/ErListPoints/script'
import { getFirstElement } from '@/functions/helper'

import { SERVICES_AUTH } from '@/components/pages/wifi/index/constants'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof WifiAuthService>>({
  props: {
    listPoint: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    WifiAuthServicesCard,
    ListPointComponent
  },
  watch: {
    computedListPoint (val: iPointItem[]) {
      val.length > 0 &&
        (this.activePoint = getFirstElement(val)) &&
        (this.isLoadingListPoint = false)
    },
    activePoint (val: iPointItem | null) {
      this.customerProduct = null
      val && Promise.all([
        this.$store.dispatch('productnservices/customerProduct', {
          api: this.$api,
          parentId: val.bpi
        }),
        this.$store.dispatch('wifi/getResource', {
          bpi: val.bpi
        })
      ])
        .then(response => {
          const [customerProduct, wifiInfo] = response
          this.customerProduct = customerProduct
          this.vlanInfo = wifiInfo[0]
          if (this.vlanInfo && this.vlanInfo.hasOwnProperty('vlan')) {
            const vlanInfo = this.vlanInfo.vlan![0]
            this.$store.dispatch('wifi/getPointInfo', {
              vlan: vlanInfo.number,
              city_id: vlanInfo.cityId
            })
          }
        })
    }
  }
})
export default class WifiAuthService extends Vue {
  // Props
  readonly listPoint!: ILocationOfferInfo[]

  // Data
  activePoint: iPointItem | null = null
  customerProduct: ICustomerProduct | null = null
  vlanInfo: IWifiResourceInfo | null = null

  // Loading Data
  isLoadingListPoint: boolean = true

  // Computed
  get computedListPoint () {
    return transformListPoint(this.listPoint)
  }

  get computedListAuthService () {
    if (this.customerProduct == null) return []
    return this.customerProduct.slo.filter(sloProduct => SERVICES_AUTH.includes(sloProduct.code))
      .map(sloProduct => ({
        code: sloProduct.code,
        title: sloProduct.name,
        description: sloProduct.description,
        price: sloProduct.status.toLowerCase() === 'active'
          ? sloProduct.purchasedPrices.recurrentTotal.value
          : getFirstElement(sloProduct.prices)?.amount || '0',
        isConnect: sloProduct.status.toLowerCase() === 'active',
        productId: sloProduct.productId,
        chars: sloProduct.chars
      }))
  }
}
