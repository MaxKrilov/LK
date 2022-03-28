import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { ITVPacketPage, ITVPacket, IModuleInfo, ITVPacketsInModule } from '@/components/pages/tv/tv.d.ts'
import { IOfferingRelationship, IProductOffering } from '@/interfaces/offering'
import { IAddress } from '@/tbapi'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { getNoun } from '@/functions/helper'
import { IDeleteOrderData } from '@/constants/er-plug'
import moment from 'moment'

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

  modelPeriodPicker: Date[] = []
  packages: ITVPacketPage[] = []
  connectedPackages: ITVPacketPage[] = []
  allowedPackages: ITVPacketPage[] = []
  searchFieldDateActivation: ITVPacketPage[] | any = []
  standartPackage: ITVPacketPage | null = null
  tvPackets: ITVPacket[] = []
  getAddressList!: IAddress[]
  allowedPackagesCodes: string[] = []
  allowedPackagesPrices: Record<string, string> = {}
  isResetPeriod: boolean = false
  isConnection: boolean = false
  isShowNotificationPicker: boolean = false
  isThereActivationDate: boolean = false
  deleteData: IDeleteOrderData = {
    bpi: '',
    marketId: '',
    locationId: '',
    productId: '',
    title: ''
  }
  currentCodeOrderData: any
  orderDataFromMethodPST: any = {}
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
  isNotShowPicker: boolean = false
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

  @Watch('isNotShowPicker')
  onIsNotShowPicker (isChecked: boolean) {
    if (isChecked) this.appointModelPeriodPicker()
    else this.isResetPeriod = true
  }

  @Watch('isResetPeriod')
  onIsResetPeriod (isChecked: boolean) {
    if (!isChecked) {
      this.isNotShowPicker = true
    }
  }

  get internalPeriod () {
    return this.modelPeriodPicker
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
      marketId: this.line?.marketId || '',
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
  get stbModel () {
    return this.line?.stb.model || ''
  }
  get stbPrice () {
    if (this.stbType === 'Продажа') {
      return ''
    }
    return this.line?.stb.price || ''
  }
  get tariffname () {
    return this.line?.name?.replace('Абонентская линия', '')
  }
  get guarantee () {
    if (this.stbType === 'Аренда') {
      return '∞'
    }
    if (this.stbType === 'Продажа') {
      return this.$moment(this.line?.stb.guarantee).format('DD.MM.YYYY')
    }
    return ''
  }
  get safeStorage () {
    return this.stbType === 'Ответственное хранение'
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
  get computingDiff () {
    return (start: Date, end: Date) => Math.abs(this.$moment(end).diff(start, 'days'))
  }
  get generateDaysThree () {
    const daysAddThree = new Date()
    this.modelPeriodPicker = [
      new Date(),
      new Date(
        daysAddThree
          .setDate(daysAddThree
            .getDate() + 1)
      )
    ]
    return this.modelPeriodPicker
  }
  get separateModelPeriodPicker () {
    const [start, end] = this.modelPeriodPicker
    const diff = this.computingDiff(start, end) + 1
    const numberBeginCurrentMonth = moment(start, 'YYYY-MM').daysInMonth()
    const numberEndCurrentMonth = moment(end, 'YYYY-MM').daysInMonth()
    const checkBeginCurrentDays = moment(start, 'YYYY/MM/DD')
    const checkEndCurrentDays = moment(end, 'YYYY/MM/DD')
    const getBeginCurrentDays = checkBeginCurrentDays.format('D')
    const getEndCurrentDays = checkEndCurrentDays.format('D')
    const sepBeginPrice = (this.selectedPrice / numberBeginCurrentMonth)
    const sepEndPrice = (this.selectedPrice / numberEndCurrentMonth)
    const delDaysInMonth = numberBeginCurrentMonth === numberEndCurrentMonth ? (sepBeginPrice * diff)
      : ((sepBeginPrice * ((numberBeginCurrentMonth + 1) - +getBeginCurrentDays)) + (sepEndPrice * (+getEndCurrentDays)))
    return Math.round(delDaysInMonth)
  }
  get getTotalDaysPrice () {
    return this.separateModelPeriodPicker
  }
  changePeriodPicker (v:boolean) {
    this.isShowNotificationPicker = v
  }
  plug (code: string, price: string) {
    this.currentCodeOrderData = code
    this.selectedPrice = Number(price)
    this.isCheckingMoney = true
    this.disconnectedItem = code
    this.orderData = {
      locationId: this.line?.locationId,
      bpi: this.line?.id,
      marketId: this.line?.marketId,
      productCode: code.split(' ').join('').split(',').find((el: string) => this.allowedPackagesCodes.includes(el)),
      offer: 'tv',
      title: 'Вы уверены, что хотите подключить дополнительный пакет?'
    }
    this.isThereActivationDate = this.searchFieldDateActivation.find((searchDateActivation: any) => searchDateActivation['code'].includes(code))?.['activationDate']
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
      marketId: this.line?.marketId || '',
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
    if (this.stbName !== this.line?.stb?.name) {
      this.isEditingName = true
    } else {
      this.isEditMode = false
    }
  }
  appointModelPeriodPicker () {
    const today = new Date()
    const afterMonth = new Date()
    afterMonth.setMonth(afterMonth.getMonth() + 1)
    this.modelPeriodPicker = [
      today,
      afterMonth
    ]
  }
  handleShowPicker (event: Event): void {
    if (event) {
      this.isResetPeriod = false
      this.isShowNotificationPicker = false
    }
  }
  resetPeriodAction (isChecked: boolean): void {
    this.isResetPeriod = isChecked
    this.isNotShowPicker = !isChecked
    this.appointModelPeriodPicker()
  }

  mounted () {
    this.appointModelPeriodPicker()
    if (this.line) {
      this.$store.dispatch('tv/packs', { api: this.$api })
        .then((answer: ITVPacketPage[]) => {
          this.packages = answer
          this.$store.dispatch('productnservices/allowedOffers', { api: this.$api, id: this.line?.offerId, marketId: this.line?.marketId })
            .then((answer: IProductOffering[]) => {
              // ищем поле name === дата активации
              this.searchFieldDateActivation = answer[0].offeringRelationships
                .map((relationships: IOfferingRelationship) => {
                  const childMax = [(+true)].indexOf(+relationships.childMax) !== -1
                  const childProductOffering = relationships?.['childProductOffering']
                  const activationDate = childProductOffering?.product?.chars.find((offer: any) => offer.name === 'Дата активации')?.['name'] && !!'Активация ПСТ'
                  const packagesPacketCode = (packet:ITVPacketPage) =>
                    packet.productCode
                      .split(' ')
                      .join('')
                      .split(',')
                      .find((oPacketCode: string) => childProductOffering?.code.includes(oPacketCode))
                  const code = this.packages
                    .filter(packagesPacketCode)[0]?.['productCode']
                  return childMax && activationDate && {
                    code,
                    activationDate
                  }
                }).filter(activationDate => activationDate)

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
                  _el.count = `${el.count} ${getNoun(el.count, 'канал', 'канала', 'каналов')}`

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
                    packet.count = `${packet.count} ${getNoun(packet.count, 'канал', 'канала', 'каналов')}`
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
