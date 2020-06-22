import { Vue, Component, Watch } from 'vue-property-decorator'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { mapGetters } from 'vuex'
import { IPointItem } from '@/components/pages/internet/ip/ip.d.ts'
import { CODE_IP4SUBNET, SERVICE_ADDITIONAL_IP, CODE_IP4SECOND } from '@/constants/internet'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import SubnetExpander from '@/components/pages/internet/ip/components/SubnetExpander.vue'
import Price from '@/components/pages/internet/ip/components/Price.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'

const components = {
  ListPointComponent,
  SubnetExpander,
  Price,
  ErDisconnectProduct,
  ErPlugProduct,
  ErActivationModal
}

const SUBNRT_IP_COUNT: Record<string, number> = {
  '/30': 4,
  '/29': 8,
  '/28': 16,
  '/27': 32,
  '/26': 64,
  '/25': 128,
  '/24': 256
}
@Component({
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'user/getActiveBillingAccount' })
  }
})
export default class Ip extends Vue {
  points: IPointItem[] = []
  billingAccountId!: string | number

  activePoint: IPointItem | null = null
  isConnection: boolean = false
  isDisconnection: boolean = false
  disconnectionOrderData: any = { title: 'Вы уверены, что хотите отключить услугу Дополнительный IPv4 адрес?' }

  ipAddressList:any[] = []

  prices: any = {}
  isLoadingPoints:boolean = true
  isLoadingIps:boolean = true
  showAddIpForm:boolean = false
  totalConnections: number = 4
  isConnectionsShow:boolean = false
  mainIp: string = ''
  addProtocol: string = ''
  addIpCount: string = ''

  protocolList: string[] = ['ipv4']
  @Watch('billingAccountId')
  onBillingAccountIdChange (val: boolean) {
    if (val) {
      this.getPoints()
    }
  }
  get isDisabledAddButton () {
    return !(this.addIpCount && this.addProtocol)
  }
  get orderData () {
    return {
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      productCode: this.addIpCount === '1' ? SERVICE_ADDITIONAL_IP : CODE_IP4SUBNET,
      chars: this.ipChars,
      offer: true,
      title: 'Вы уверены, что хотите подключить услугу Дополнительный IPv4 адрес?'
    }
  }
  get totalPrice () {
    return this.ipAddressList.reduce((acc: number, el: any) => acc + Number(el.price), 0)
  }
  get ipCountList () {
    return Object.keys(this.prices)
  }
  get ipCost () {
    return Number(this.prices?.[this.addIpCount]?.amount || 0)
  }
  get ipChars () {
    return this.prices?.[this.addIpCount]?.chars
  }

  deleteIp (productId: string) {
    this.disconnectionOrderData = {
      productId,
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      title: 'Вы уверены, что хотите отключить услугу Дополнительный IPv4 адрес?'
    }
    this.isDisconnection = true
  }
  onShowAddIpForm () {
    this.showAddIpForm = true
  }
  onAddIp () {
    this.isConnection = true
  }
  onCancelAddIp () {
    if (this.ipAddressList.length) {
      this.showAddIpForm = false
    } else {
      this.$router.push('/lk/internet')
    }
  }
  onShowConnections () {
    this.isConnectionsShow = true
  }
  onHideConnections () {
    this.isConnectionsShow = false
  }
  onToggleConnections () {
    this.isConnectionsShow = !this.isConnectionsShow
  }
  getPoints () {
    this.isLoadingPoints = true
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Интернет'
    })
      .then(answer => {
        this.points = answer.map((el:any) => {
          return {
            id: el.id,
            addressId: el.address.id,
            fulladdress: el.fulladdress,
            bpi: el.bpi,
            offerName: el.offer.name
          }
        })
      })
      .finally(() => {
        this.isLoadingPoints = false
      })
  }
  @Watch('points')
  onPointsChange () {
    if (!this.activePoint) {
      this.activePoint = this.points?.[0] || null
    }
  }

  @Watch('activePoint')
  onActivePointChange (value: IPointItem) {
    if (value) {
      this.getIpData()
      this.getPrices()
    }
  }

  getIpData () {
    if (!this.activePoint?.id) return
    this.isLoadingIps = true
    this.$store.dispatch('productnservices/customerProducts', {
      api: this.$api,
      parentIds: [this.activePoint.bpi]
    })
      .then((answer: any) => {
        if (this.activePoint?.bpi && !answer?.[this.activePoint.bpi]) {
          return
        }
        const point = answer[this.activePoint!.bpi]
        this.mainIp = point?.tlo?.chars?.['IPv4 адрес в составе услуги']
        this.ipAddressList = point?.slo
          .filter((el:any) => (el.offer.code === CODE_IP4SECOND || el.offer.code === CODE_IP4SUBNET || el.offer.code === SERVICE_ADDITIONAL_IP) && el.status === 'Active')
          .map((el:any) => {
            if (el.offer.code === CODE_IP4SECOND || el.code === CODE_IP4SUBNET) {
              return {
                price: Number(el?.purchasedPrices?.recurrentTotal?.value),
                productId: el.id,
                ip: el?.chars?.['IPv4 подсеть'],
                subnet: []
              }
            }
            return {
              price: Number(el?.purchasedPrices?.recurrentTotal?.value),
              productId: el.id,
              auth: el?.chars?.['Тип авторизации']
            }
          })
        this.ipAddressList.unshift(
          {
            price: null,
            ip: this.mainIp,
            auth: point?.tlo?.chars?.['Тип авторизации']
          })
        if (!this.ipAddressList.length) this.showAddIpForm = true
      })
      .finally(() => {
        this.isLoadingIps = false
      })
  }
  getPrices () {
    if (!this.activePoint?.id) return
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.activePoint.bpi
    })
      .then((answer: any) => {
        // задаем цену для одного доп айпи
        this.prices[1] = {
          amount: answer?.slo.find((el: any) => el.code === SERVICE_ADDITIONAL_IP)?.prices?.[0]?.amount
        }

        // формируем объект с ценами на подсети с ключами количества доп ип
        const subnetPrices = answer?.slo.find((el: any) => el.code === CODE_IP4SUBNET)?.prices
          .filter((el: any) => el.chars['Тип IPv4 адреса'] === 'Публичный')
          .reduce((acc: any, el: any) => {
            acc[SUBNRT_IP_COUNT[el.chars['Префикс подсети']]] = {
              amount: el.amount,
              chars: el.chars
            }
            return acc
          }, {})
        // объединяем в один объект
        this.prices = { ...this.prices, ...subnetPrices }
        if (!this.ipAddressList.length) this.showAddIpForm = true
      })
  }
  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
