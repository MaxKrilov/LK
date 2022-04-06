import { Vue, Component } from 'vue-property-decorator'
import AddressCheckbox from '../address-checkbox/index.vue'
import LocationSelect from '../location-select/index.vue'
import { ILocationOfferInfo } from '@/tbapi'
import { PRODUCT_CODE } from '@/constants/wifi-filter'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import head from 'lodash/head'

const props = {
  list: {
    type: Array,
    default: () => ([])
  },
  isHideHeader: Boolean
}
const components = {
  AddressCheckbox,
  LocationSelect,
  ErPlugProduct
}

@Component<InstanceType<typeof WifiFilterPlug>>({
  props,
  components,
  watch: {
    currentLocationBPI (val) {
      if (val.length > 1) {
        this.currentLocationBPI = val.slice(1)
      }
    }
  }
})
export default class WifiFilterPlug extends Vue {
  currentLocationBPI: string[] = []

  isOrderMode: boolean = false
  isShowOrder: boolean = false
  isSengingOrder: boolean = false
  orderData: any = {}

  get addressList () {
    return this.$props.list.map((el: any) => {
      return {
        label: el.fulladdress,
        value: el.bpi
      }
    })
  }

  withCurrentBPI ({ bpi }: ILocationOfferInfo) {
    return bpi === head(this.currentLocationBPI)
  }

  onPlug () {
    const location = this.$props.list.find(this.withCurrentBPI)

    this.orderData = {
      bpi: head(this.currentLocationBPI),
      locationId: location.id,
      marketId: location.marketId,
      offer: 'wifi',
      productCode: PRODUCT_CODE,
      title: `Вы уверены, что хотите подключить контент фильтрацию?`,
      tomsId: '302000024'
    }

    this.isOrderMode = true
    this.isShowOrder = true
  }

  onOrderError () {
    this.isOrderMode = false
    this.isShowOrder = false
  }

  onOrderSuccess () {
    this.isOrderMode = true
    this.isShowOrder = true
  }

  onCancel () {
    this.$emit('cancel')
  }

  onChangeCurrentLocation (value: any) {
    this.currentLocationBPI = value
  }
}
