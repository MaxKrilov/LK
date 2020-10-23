import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { ITVPacketPage, ITVPacket, IModuleInfo, ITVPacketsInModule } from '@/components/pages/tv/tv.d.ts'
import { IOfferingRelationship, IProductOffering } from '@/interfaces/offering'
import { IAddress } from '@/tbapi'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { IDeleteOrderData } from '@/constants/er-plug'

@Component({
  components: {
    ErPlugProduct,
    ErActivationModal,
    ErDisconnectProduct
  },
  computed: {
    ...mapGetters('user', ['getAddressList'])
  }
})
export default class TVPackagesPage extends Vue {
  @Prop() readonly line: IModuleInfo | undefined

  packages:ITVPacketPage[] = []
  connectedPackages:ITVPacketPage[] = []
  allowedPackages:ITVPacketPage[] = []
  standartPackage:ITVPacketPage | null = null
  tvPackets: ITVPacket[] = []
  getAddressList!: IAddress[]

  allowedPackagesCodes: string[] = []
  allowedPackagesPrices: Record<string, string> = {}

  isConnection: boolean = false
  deleteData: IDeleteOrderData = {
    bpi: '',
    locationId: '',
    productId: '',
    title: ''
  }
  orderData: any = {}
  isDisconnection: boolean = false
  loading: boolean = true
  disconnectedItem: string | boolean = false
  connectedItem: string | boolean = false
  isChangeTariff: boolean = false
  isShowMoneyModal: boolean = false
  isCheckingMoney: boolean = false
  availableFunds: number = 0
  selectedPrice: number = 0

  isEditMode: boolean = false
  isEditingName: boolean = false
  stbName: string = ''

  @Watch('isDisconnection')
  onIsDisconnection (val: boolean) {
    if (!val) {
      this.disconnectedItem = false
    }
  }
  @Watch('isEditingName')
  onIsEditingName (val: boolean) {
    if (!val) {
      this.isEditMode = false
    }
  }
  @Watch('isConnection')
  onIsConnection (val: boolean) {
    if (!val) {
      this.connectedItem = false
    }
  }

  get address () : string {
    if (this.line?.locationId) {
      return this.getAddressList.find((el: IAddress) => el.locationId === this.line?.locationId)?.value || ''
    }
    return ''
  }
  get requestData () {
    return {
      descriptionModal: 'Для смены тариного плана нужно сформировать заявку на вашего персонального менеджера',
      addressId: this.line?.addressId,
      services: 'Смена тарифного плана ТВ',
      type: 'change',
      fulladdress: this.line?.fulladdress
    }
  }
  get editingOrderData () {
    return {
      locationId: this.line?.locationId,
      bpi: this.line?.stb?.id,
      chars: { 'Имя оборудования': this.stbName },
      title: `Вы уверены, что хотите изменить имя оборудования?`
    }
  }
  get pasketsPrise () {
    return this.line?.packets.reduce((acc: number, el: {id: string, name: string, price: number}) => acc + el.price, 0) || 0
  }
  get stbType () {
    return this.line?.stb.type || ''
  }
  get tariffname () {
    return this.line?.name?.replace('Абонентская линия', '')
  }
  get standartPackageName () {
    return this.standartPackage?.title
  }
  get standartPackageCount () {
    return this.standartPackage?.count
  }
  get standartPackageId () {
    return this.standartPackage?.id
  }
  plug (code: string, price: string) {
    this.selectedPrice = Number(price)
    this.isCheckingMoney = true
    this.disconnectedItem = code
    this.orderData = {
      locationId: this.line?.locationId,
      bpi: this.line?.id,
      productCode: code.split(' ').join('').split(',').find((el: string) => this.allowedPackagesCodes.includes(el)),
      offer: 'tv',
      title: 'Вы уверены, что хотите подключить дополнительный пакет?'
    }
    this.$store.dispatch('salesOrder/getAvailableFunds')
      .then((response) => {
        this.availableFunds = Number(response.availableFundsAmt)
        if (this.availableFunds - Number(this.selectedPrice) < 0) {
          this.isShowMoneyModal = true
        } else {
          this.isConnection = true
        }
      })
      .catch(() => {
        this.isConnection = true
      })
      .finally(() => {
        this.isCheckingMoney = false
      })
  }
  unPlug (productId: string, name: string = '') {
    this.deleteData = {
      bpi: this.line?.id || '',
      locationId: this.line?.locationId || '',
      productId,
      title: `Вы уверены, что хотите отключить пакет ${name}?`
    }
    this.disconnectedItem = productId
    this.isDisconnection = true
  }
  editName () {
    this.stbName = this.line?.stb?.name || ''
    this.isEditMode = true
  }
  saveName () {
    this.isEditingName = true
  }
  mounted () {
    if (this.line) {
      this.$store.dispatch('tv/packs', { api: this.$api })
        .then((answer: ITVPacketPage[]) => {
          this.packages = answer
          this.$store.dispatch('productnservices/allowedOffers', { api: this.$api, id: this.line?.offerId })
            .then((answer: IProductOffering[]) => {
              // формируем список доступных кодов для подключения
              this.allowedPackagesCodes = answer[0].offeringRelationships
                .map((el: IOfferingRelationship) => el.childProductOffering?.code)
                .filter((el: string | undefined) => el)

              // цены для подключения
              this.allowedPackagesPrices = answer[0].offeringRelationships
                .reduce((acc: Record<string, string>, el: IOfferingRelationship) => {
                  const price = el?.childProductOffering?.prices
                    ?.find((_price: any) => _price?.amount && _price?.chars?.['Тип TV']?.id === this.line?.tvType)?.amount
                  if (el?.childProductOffering?.prices && el?.childProductOffering?.code && price) {
                    return {
                      ...acc,
                      [el.childProductOffering.code]: price
                    }
                  }
                  return acc
                }, {})

              // формируем список подключенных кодов
              const connectedpackagesCodes: string[] = this.line?.packets.map((el: ITVPacketsInModule) => el.code) || []

              // формируем массив доступных пакетов
              this.allowedPackages = this.packages
                .filter(
                  (el:ITVPacketPage) =>
                    el.productCode
                      .split(' ')
                      .join('')
                      .split(',')
                      .find((el: string) => this.allowedPackagesCodes.includes(el)))
                .filter(
                  (el:ITVPacketPage) =>
                    !el.productCode
                      .split(' ')
                      .join('')
                      .split(',')
                      .find((el: string) => connectedpackagesCodes.includes(el)))
                .filter((el:ITVPacketPage) => el.productCode !== 'TVPSTAND')
                .map((el: any) => {
                  const _el = el

                  const code = Object.keys(this.allowedPackagesPrices)
                    ?.find((price) => el.productCode.replace(' ', '').split(',').includes(price)) || ''

                  if (code && this.allowedPackagesPrices?.[code]) {
                    _el.price = this.allowedPackagesPrices?.[code]
                  }
                  try {
                    _el.img = _el.backgroundMobile ? require(`@/assets/images/tv/${_el.backgroundMobile}.png`) : ''
                  } catch {
                    _el.img = ''
                  }
                  return _el
                })

              const conpack: any = this.line?.packets
                .map((connectedPacket: ITVPacketsInModule) => {
                  const packet: any = this.packages.find((el:ITVPacketPage) => {
                    return el.productCode.replace(' ', '').split(',').includes(connectedPacket.code)
                  })
                  if (packet) {
                    packet.productId = connectedPacket.id
                    packet.price = connectedPacket.price
                    try {
                      packet.img = packet.backgroundMobile ? require(`@/assets/images/tv/${packet.backgroundMobile}.png`) : ''
                    } catch {
                      packet.img = ''
                    }
                    return packet
                  }
                  return undefined
                })
                .filter((el: any) => el)
                .filter((el:ITVPacketPage) => el.productCode !== 'TVPSTAND')
              this.connectedPackages = conpack
              this.standartPackage = this.packages.find((el:ITVPacketPage) => el.productCode === 'TVPSTAND') || null
            })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    } else {
      this.$router.push('/lk/tv')
    }
  }
}
