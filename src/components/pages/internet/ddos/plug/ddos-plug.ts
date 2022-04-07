import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { IPointItem, IDdosPrice } from '@/components/pages/internet/ddos/ddos.d.ts'
import { CURRENT_SPEED, TOMS_IDS } from '@/constants/internet'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

const components = {
  ListPointComponent,
  ErActivationModal,
  ErPlugProduct
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
  isRequestModalVisible: boolean = false
  requestData: Record<string, any> = {}
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

  plugDdos () {
    // заявка на менеджера
    this.isRequestModalVisible = true

    this.requestData = {
      descriptionModal: 'Для подключения услуги Защита от DDoS атак необходимо сформировать заявку',
      services: 'Защита от DDoS атак',
      type: 'create',
      addressId: this.activePoint?.addressId,
      fulladdress: this.activePoint?.fulladdress
    }
  }

  onCloseSuccess () {}

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  getConnectionInfo () {
    if (!this.activePoint?.id) return

    this.isLoadingConnection = true
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      marketId: this.activePoint?.marketId,
      parentId: this.activePoint.bpi,
      tomsId: TOMS_IDS.SERVICE_DDOS_PROTECT_SP
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
    this.getConnectionInfo()
  }
}
