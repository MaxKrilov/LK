import BreakpointMixin from '@/mixins/BreakpointMixin'
import ConnectedPhone from '../ConnectedPhone'
import moment from 'moment'
import ErPlugProduct from '@/components/blocks/ErPlugProduct'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct'
import { CODE_PHONE, CODE_PHONE_VPN } from '@/constants/product-code'

export default {
  name: 'slider-content',
  mixins: [BreakpointMixin],
  components: {
    ConnectedPhone,
    ErPlugProduct,
    ErDisconnectProduct
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
      },
      shadowIcon: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
          x: '-4px',
          y: '4px'
        },
        shadowRadius: '4px'
      }
    }
  },
  computed: {
    phones () {
      return this.slo.filter(el => el.code === CODE_PHONE || el.code === CODE_PHONE_VPN).map(el => {
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
    disconnectNumber (number) {
      this.disconnectRequestData.services += number
      this.isDisconnection = true
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
    }).catch(() => {
      this.isLoading = false
    })
  }
}
