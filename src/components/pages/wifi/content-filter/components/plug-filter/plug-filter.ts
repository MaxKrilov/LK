import { Vue, Component } from 'vue-property-decorator'
import AddressCheckbox from '../address-checkbox/index.vue'
import LocationSelect from '../location-select/index.vue'
import { ILocationOfferInfo } from '@/tbapi'
import { PRODUCT_CODE } from '@/constants/wifi-filter'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

const props = {
  list: Array
}
const components = {
  AddressCheckbox,
  LocationSelect,
  ErPlugProduct
}

@Component({ props, components })
export default class WifiFilterPlug extends Vue {
  currentLocationBPI: string = ''

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
    return bpi === this.currentLocationBPI
  }

  onPlug () {
    const location = this.$props.list.find(this.withCurrentBPI)

    this.orderData = {
      // @ts-ignore
      locationId: location.id,
      bpi: this.currentLocationBPI,
      productCode: PRODUCT_CODE,
      offer: 'wifi',
      title: `Вы уверены, что хотите подключить контент фильтрацию?`
    }

    this.isOrderMode = true
    this.isShowOrder = true
  }

  onOrderError () {
    this.isOrderMode = false
    this.isShowOrder = false
  }

  onCancel () {
    this.$emit('cancel')
  }

  onChangeCurrentLocation (value: any) {
    this.currentLocationBPI = value
  }
}
