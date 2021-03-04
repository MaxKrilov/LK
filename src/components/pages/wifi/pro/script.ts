import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapState } from 'vuex'
import { ILocationOfferInfo, IWifiPro } from '@/tbapi'

import ErtWifiProItem from './components/pro-item/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const DISPATCH_GET_LOCATIONS = 'productnservices/locationOfferInfo'
const DISPATCH_GET_WIFI_PRO = 'wifi/getWifiPro'

const productType = 'Wi-Fi'

// Функция, возвращающая активные локации только WiFi Pro
function getBPIWiFiPro (list: ILocationOfferInfo[]): ILocationOfferInfo[] {
  return list
    .filter(listItem => listItem.offer.name.toLowerCase().indexOf('pro'))
}

@Component<InstanceType<typeof ErtWifiPro>>({
  components: {
    ErtWifiProItem,
    ErActivationModal
  },
  computed: {
    ...mapState({
      isLoadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount
    }),
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    })
  },
  watch: {
    billingAccountId () {
      this.init()
    }
  }
})
export default class ErtWifiPro extends Vue {
  // Vuex
  readonly isLoadingBillingAccount!: boolean
  readonly billingAccountId!: string

  // Data
  listActiveLocation: ILocationOfferInfo[] = []
  listDomain: Record<string, IWifiPro> | {} = {}

  isSuccessModal: boolean = false
  isErrorModal: boolean = false

  // Methods
  init () {
    this.getListPoint()
      .then(() => {
        this.getWifiPro()
      })
  }

  getListPoint () {
    return new Promise<ILocationOfferInfo[]>((resolve, reject) => {
      this.$store.dispatch(DISPATCH_GET_LOCATIONS, {
        api: this.$api,
        productType: productType
      })
        .then((response: ILocationOfferInfo[]) => {
          this.listActiveLocation = getBPIWiFiPro(response)
          resolve(response)
        })
        .catch(err => reject(err))
    })
  }

  getWifiPro () {
    return new Promise<Record<string, IWifiPro>>((resolve, reject) => {
      this.$store.dispatch(DISPATCH_GET_WIFI_PRO, {
        parentIds: this.listActiveLocation.map(activeLocation => activeLocation.bpi.toString())
      })
        .then(response => {
          this.listDomain = this.transformListDomain(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }

  transformListDomain (listDomain: Record<string, IWifiPro>) {
    for (const key in listDomain) {
      if (!listDomain.hasOwnProperty(key)) continue
      const services = listDomain[key].services

      for (const keyService in services) {
        if (!services.hasOwnProperty(keyService)) continue
        const service = services[keyService]

        const activeLocation = this.listActiveLocation
          .find(activeLocation => activeLocation.id === service.locationId)
        service.fullAddress = activeLocation!.fulladdress
        service.addressId = activeLocation!.address.id as string
      }
    }
    return listDomain
  }

  onSuccessModal () {
    this.isSuccessModal = true
    this.getWifiPro()
  }

  onErrorModal () {
    this.isErrorModal = true
  }

  // Hooks
  created () {
    this.billingAccountId && this.init()
  }
}
