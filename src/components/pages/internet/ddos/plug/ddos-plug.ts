import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { IPointItem, IDdosPrice } from '@/components/pages/internet/ddos/ddos.d.ts'
import { SERVICE_DDOS_PROTECT, CURRENT_SPEED } from '@/constants/internet'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const components = {
  ListPointComponent,
  ErActivationModal
}
@Component({ components })
export default class DddosPlug extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly points!: IPointItem[]
  pre = 'ddos-plug-page'
  internalPeriod = []
  activePoint: IPointItem | null = null
  creatingOrder: boolean = false
  prices: IDdosPrice[] = []
  isLoadingConnection: boolean = false
  tloIp: string = ''
  currentSpeed: string = ''
  checkedIps: string[] = []
  isShowModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false
  isShowMoneyModal: boolean = false
  sendingOrder: boolean = false
  ddosPrice: number = 0
  availableFunds: number = 0

  get ips () {
    return [this.tloIp].filter(el => el)
  }
  get fullAddress () {
    return this.activePoint?.fulladdress || ''
  }
  @Watch('points')
  onPointsChange () {
    if (!this.activePoint) {
      this.activePoint = this.points?.[0] || null
    }
  }

  @Watch('activePoint')
  onActivePointChange (value: IPointItem) {
    if (value) this.getConnectionInfo()
  }

  plugDdos () {
    this.creatingOrder = true
    if (!this.activePoint?.id) return
    this.$store.dispatch('salesOrder/createSaleOrder',
      {
        locationId: this.activePoint?.id,
        bpi: this.activePoint?.bpi,
        isReturnPrice: true,
        productCode: SERVICE_DDOS_PROTECT,
        chars: { 'Объект защиты IPv6': 'Защита выключена' }
      })
      .then((answer) => {
        this.ddosPrice = Number(answer)
        this.$store.dispatch('salesOrder/getAvailableFunds')
          .then((response) => {
            this.availableFunds = response.availableFundsAmt
            if (response.availableFundsAmt - this.ddosPrice < 0) {
              this.creatingOrder = false
              this.isShowMoneyModal = true
            } else {
              this.isShowModal = true
            }
          })
          .catch(() => {
            this.isShowModal = true
          })
      })
      .catch(() => {
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.creatingOrder = false
      })
  }
  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }
  getConnectionInfo () {
    if (!this.activePoint?.id) return

    this.isLoadingConnection = true
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: this.activePoint.bpi,
      code: 'ANTIDDOS'
    })
      .then((answer: any) => {
        if (!answer.slo?.[0]?.prices) return
        this.tloIp = answer?.tlo?.chars?.['IPv4 адрес в составе услуги']
        this.currentSpeed = answer?.tlo?.chars?.[CURRENT_SPEED]
        this.prices = answer.slo?.[0]?.prices
          .filter((el: any) => el?.chars?.[CURRENT_SPEED])
          .map((el: any) => { return { 'price': el?.amount, 'speed': el?.chars?.[CURRENT_SPEED].name.replace('Мбит/с', '') } })
          .sort((a:any, b:any) => a.speed - b.speed)
      })
      .finally(() => {
        this.isLoadingConnection = false
      })
  }
  sendOrder () {
    this.sendingOrder = true
    this.$store.dispatch('salesOrder/send', { offerAcceptedOn: this.$moment().toISOString() })
      .then(() => {
        this.sendingOrder = false
        this.isShowSuccessModal = true
        this.isShowModal = false
      })
      .catch(() => {
        this.isShowModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrder = false
      })
  }
  mounted () {
    this.activePoint = this.points?.[0] || null
  }
}
