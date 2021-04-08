import { Vue, Component, Watch } from 'vue-property-decorator'
import { price } from '../../../../../../functions/filters'
import { GET_LIST_SERVICE_BY_ADDRESS, GET_LIST_ADDRESS_BY_SERVICES } from '../../../../../../store/actions/user'
import { getIconNameByCode } from './_functions'

@Component({
  props: {
    title: String,
    price: [Number, String],
    addressId: [Number, String],
    sortBy: {
      type: String,
      default: 'service',
      validator: val => ['service', 'office'].includes(val)
    },
    productType: String
  },
  filters: {
    price,
    vcName: (val) => val.match(/форпост/i) || val.match(/iVideon/i) ? 'Видеонаблюдение' : val
  }
})
export default class ProductItemComponent extends Vue {
  isOpen = false
  isLoading = true

  services = []
  address = []

  @Watch('isOpen')
  async onIsOpenChange (val) {
    if (val && this.isLoading) {
      await this.loadServices()
    }
  }

  get getFormatListService () {
    return this.services.map(item => ({
      price: item.amount.value,
      offerName: item.offer.name,
      title: item.offeringCategory.name
    }))
  }

  get getFormatListAddress () {
    return this.address.map(item => ({
      title: item.fulladdress,
      price: item.amount.value,
      offerName: item.offer.name
    }))
  }

  get getListDetail () {
    return this.sortBy === 'service'
      ? this.getFormatListAddress
      : this.getFormatListService
  }

  getTopIcon () {
    return this.sortBy === 'service'
      ? getIconNameByCode(this.title)
      : 'geolocation'
  }

  getSubIcon (title) {
    return this.sortBy === 'service'
      ? 'geolocation'
      : getIconNameByCode(title)
  }

  toggleDetail () {
    this.isOpen = !this.isOpen
  }

  async loadServices () {
    if (this.sortBy === 'office') {
      this.services = await this.$store.dispatch(`user/${GET_LIST_SERVICE_BY_ADDRESS}`, {
        api: this.$api,
        address: this.addressId
      })
    } else {
      this.address = await this.$store.dispatch(`user/${GET_LIST_ADDRESS_BY_SERVICES}`, {
        api: this.$api,
        productType: this.productType
      })
    }
    this.isLoading = false
  }
}
