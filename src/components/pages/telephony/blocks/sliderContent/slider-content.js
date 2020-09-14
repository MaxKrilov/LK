import BreakpointMixin from '@/mixins/BreakpointMixin'
import ConnectedPhone from '../ConnectedPhone'
import moment from 'moment'
import ErPlugProduct from '@/components/blocks/ErPlugProduct'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import PackageMinuteCard from '@/components/pages/telephony/blocks/packageMinute/index.vue'
import { ARRAY_SHOWN_PHONES, CODE_PACGLOCMIN, CODE_PACGMIN } from '@/constants/product-code'

export default {
  name: 'slider-content',
  mixins: [BreakpointMixin],
  components: {
    ConnectedPhone,
    ErPlugProduct,
    ErDisconnectProduct,
    ErActivationModal,
    PackageMinuteCard
  },
  props: {
    parentId: {
      default: '',
      type: String
    },
    addressId: {
      default: '',
      type: String
    },
    fulladdress: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      pre: 'slider-content',
      slo: [],
      tlo: {},
      local: undefined,
      global: undefined,
      localPlug: undefined,
      globalPlug: undefined,
      globalConnected: undefined,
      localConnected: undefined,
      isConnection: false,
      isDisconnection: false,
      isLoading: true,

      requestData: {
        descriptionModal: 'Для подключения телефонного номера нужно сформировать заявку на вашего персонального менеджера',
        addressId: this.addressId,
        services: 'Подключение дополнительного номера',
        fulladdress: this.fulladdress
      },
      disconnectRequestData: {
        descriptionModal: 'Для подключения телефонного номера нужно сформировать заявку на вашего персонального менеджера',
        addressId: this.addressId,
        services: 'Отключение дополнительного номера',
        fulladdress: this.fulladdress
      }
    }
  },
  computed: {
    phones () {
      return this.slo.filter(el => ARRAY_SHOWN_PHONES.includes(el.code)).map(el => {
        return {
          number: el.chars['Номер телефона'],
          price: el?.purchasedPrices?.recurrentTotal?.value,
          productId: el?.productId
        }
      })
    },
    tariffName () {
      return this.tlo?.offer?.name || ''
    },
    startDate () {
      if (this.tlo?.actualStartDate) {
        return moment(this.tlo?.actualStartDate).format('DD.MM.Y')
      }
      return ''
    },
    isStopped () {
      return this.tlo?.status === 'Suspended'
    }
  },
  methods: {
    connectNewNumber () {
      this.isConnection = true
    },
    plugPackages () {
      this.$router.push({
        name: 'plug-packages',
        params: {
          local: this.localPlug,
          global: this.globalPlug
        }
      })
    },
    disconnectNumber (number) {
      this.disconnectRequestData.services += number
      this.isDisconnection = true
    },
    getPackageMinute (productId) {
      return this.$store.dispatch('productnservices/billingPacket', {
        api: this.$api,
        product: productId
      })
    },
    cancelOrder () {
      this.$store.dispatch('salesOrder/cancel')
    }
  },
  mounted () {
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.parentId
    }).then(answer => {
      this.isLoading = false
      this.slo = answer?.slo
      this.tlo = answer?.tlo

      this.local = answer?.slo.find(el => el.code === CODE_PACGLOCMIN)
      this.global = answer?.slo.find(el => el.code === CODE_PACGMIN)
      if (this.local) {
        if (this.local?.status === 'Active') {
          this.localConnected = { ...this.local, locationId: this.tlo?.locationId }
        } else {
          this.localPlug = {
            locationId: this.tlo?.locationId,
            bpi: this.tlo?.id,
            amount: this.local?.prices
              .find(el => el?.chars?.['Категория продукта'] === this.tlo?.chars?.['Категория продукта']).amount,
            chars: this.local?.prices
              .find(el => el?.chars?.['Категория продукта'] === this.tlo?.chars?.['Категория продукта']).chars
          }
        }
      }
      if (this.global) {
        if (this.global?.status === 'Active') {
          this.globalConnected = { ...this.global, locationId: this.tlo?.locationId }
        } else {
          this.globalPlug = {
            locationId: this.tlo?.locationId,
            bpi: this.tlo?.id,
            amount: this.global?.prices
              .find(el => el?.chars?.['Категория продукта'] === this.tlo?.chars?.['Категория продукта'])?.amount,
            chars: this.global?.prices
              .find(el => el?.chars?.['Категория продукта'] === this.tlo?.chars?.['Категория продукта']).chars
          }
        }
      }
    }).catch(() => {
      this.isLoading = false
    })
  }
}
