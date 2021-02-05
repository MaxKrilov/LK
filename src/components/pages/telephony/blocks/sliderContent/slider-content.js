import BreakpointMixin from '@/mixins/BreakpointMixin'
import ConnectedPhone from '../ConnectedPhone'
import moment from 'moment'
import ErPlugProduct from '@/components/blocks/ErPlugProduct'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct'
import ErNumberField from '@/components/blocks/ErNumberField'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import PackageMinuteCard from '@/components/pages/telephony/blocks/packageMinute/index.vue'
import InfolistViewer from '@/components/pages/internet/blocks/TariffComponent/components/InfolistViewer/index.vue'
import { ARRAY_SHOWN_PHONES, CODE_PACGLOCMIN, CODE_PACGMIN, CODE_PHONE_SERSELCHTR } from '@/constants/product-code'
import { ARRAY_STATUS_SHOWN } from '@/constants/status'

const CODES = {
  VIRTUAL_NUMBER: 'VIRTNUMB'
}

export default {
  name: 'slider-content',
  mixins: [BreakpointMixin],
  components: {
    ConnectedPhone,
    ErPlugProduct,
    ErDisconnectProduct,
    ErActivationModal,
    ErNumberField,
    PackageMinuteCard,
    InfolistViewer
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
      isShowInfolistViewer: false,

      serChannels: 0,
      serChannelsValue: 0,
      serChannelsPrice: 0,
      serChannelsE1: 0,
      isChangingChannels: false,

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
      return this.slo
        .filter(el => ARRAY_SHOWN_PHONES.includes(el.code) && ARRAY_STATUS_SHOWN.includes(el.status))
        .map(el => {
          return {
            number: el.chars['Номер телефона'],
            price: el?.purchasedPrices?.recurrentTotal?.value,
            productId: el?.productId
          }
        })
    },
    isChangedChannels () {
      return this.serChannels - this.serChannelsValue
    },
    changeChannelsRequestData () {
      return {
        descriptionModal: 'Для подключения телефонного номера нужно сформировать заявку на вашего персонального менеджера',
        addressId: this.addressId,
        services: `Изменение кол-ва каналов связи. ${this.serChannelsValue} шт`,
        fulladdress: this.fulladdress
      }
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
    },
    isVirtualNumber () {
      return this.tlo?.offer?.code === CODES.VIRTUAL_NUMBER
    }
  },
  methods: {
    connectNewNumber () {
      this.isConnection = true
    },
    changeChannels () {
      this.isChangingChannels = true
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
    },
    onClickVirtualNumberInfolist () {
      this.isShowInfolistViewer = true
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

      this.serChannels = +answer?.slo.find(el => el.code === CODE_PHONE_SERSELCHTR)?.chars?.['Дополнительные каналы серийного искания']
      this.serChannelsValue = this.serChannels
      this.serChannelsPrice = answer?.slo.find(el => el.code === CODE_PHONE_SERSELCHTR)?.purchasedPrices?.recurrentTotal?.value
      this.serChannelsE1 = answer?.tlo?.chars?.['Количество каналов серийного искания по умолчанию']

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
