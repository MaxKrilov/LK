import { Vue, Component } from 'vue-property-decorator'
import { price } from '../../../../../../functions/filters'
import { GET_LIST_ADDRESS_BY_SERVICES, GET_LIST_SERVICE_BY_ADDRESS } from '../../../../../../store/actions/user'

@Component({
  props: {
    icon: {
      type: String,
      default: 'geolocation'
    },
    title: String,
    sortBy: {
      type: String,
      default: 'service',
      validator: val => ['service', 'office'].includes(val)
    },
    price: [String, Number],
    addressId: [Number, String],
    productType: String
  },
  filters: {
    price
  }
})
export default class ProductItemComponent extends Vue {
  shadowIcon = {
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      x: '-4px',
      y: '4px'
    },
    shadowRadius: '4px'
  }
  isOpen = false
  services = []
  address = []
  isLoading = true

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

  get subArray () {
    return this.sortBy === 'office'
      ? this.getFormatListService
      : this.getFormatListAddress
  }

  async toggleDetail () {
    this.isOpen = !this.isOpen
    if (this.isLoading) {
      await this.loadServices()
    }
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
