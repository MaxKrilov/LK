import { Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters, mapActions } from 'vuex'
import { ITVPacketPage, ITVPacket, IModuleInfo, ITVPacketsInModule } from '@/components/pages/tv/tv.d.ts'
import { IOfferingRelationship, IProductOffering } from '@/interfaces/offering'
import { IAddress } from '@/tbapi'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErServiceCatchUp from '@/components/blocks/ErServiceCatchUp/index.vue'
import { getNoun } from '@/functions/helper'
import { IDeleteOrderData } from '@/constants/er-plug'
import ComponentManageViewMixin from '@/mixins/ComponentManageView/ComponentManageViewMixin'
import { reassignActualStartDate } from '@/components/pages/tv/components/useHooks/reassignment/reassignmentActualStartDate'
import moment from 'moment'

@Component({
  components: {
    ErPlugProduct,
    ErActivationModal,
    ErDisconnectProduct,
    ErServiceCatchUp
  },
  methods: {
    ...mapActions({
      getProductServicesAllowedOffers: 'productnservices/allowedOffers'
    })
  },
  computed: {
    ...mapGetters('user', ['getAddressList'])
  }
})
export default class TVPackagesPage extends ComponentManageViewMixin {
  @Prop() readonly line: IModuleInfo | undefined
  packages:ITVPacketPage[] = []
  connectedPackages:ITVPacketPage[] = []
  allowedPackages:ITVPacketPage[] = []
  standartPackage:ITVPacketPage | null = null
  modelPeriodPicker: Date[] = []
  searchFieldDateActivation: ITVPacketPage[] | any = []
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
      descriptionModal: '?????? ?????????? ???????????????? ?????????? ?????????? ???????????????????????? ???????????? ???? ???????????? ?????????????????????????? ??????????????????',
      addressId: this.line?.addressId,
      services: '?????????? ?????????????????? ?????????? ????',
      type: 'change',
      fulladdress: this.line?.fulladdress
    }
  }
  get editingOrderData () {
    return {
      locationId: this.line?.locationId,
      bpi: this.line?.stb?.[0].id,
      marketId: this.line?.marketId || '',
      chars: { '?????? ????????????????????????': this.stbName },
      title: `???? ??????????????, ?????? ???????????? ???????????????? ?????? ?????????????????????????`
    }
  }
  get pasketsPrise () {
    return this.line?.packets.reduce((acc: number, el: {id: string, name: string, price: number}) => acc + el.price, 0) || 0
  }
  get stbType () {
    return this.line?.stb?.[0].type || ''
  }
  get stbModel () {
    return this.line?.stb?.[0].model || ''
  }
  get stbPrice () {
    if (this.stbType === '??????????????') {
      return ''
    }
    return this.line?.stb?.[0].price || ''
  }
  get tariffname () {
    return this.line?.name?.replace('?????????????????????? ??????????', '').trim()
  }
  get guarantee () {
    if (this.stbType === '????????????') {
      return '???'
    }
    if (this.stbType === '??????????????') {
      return this.$moment(this.line?.stb?.[0].guarantee).format('DD.MM.YYYY')
    }
    return ''
  }
  get safeStorage () {
    return this.stbType === '?????????????????????????? ????????????????'
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
  plug (code: string, price: string, isTitle?: boolean) {
    const additionalPackage: string = '???????????????????????????? ??????????'
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
      title: `???? ??????????????, ?????? ???????????? ???????????????????? ${isTitle ? this.serviceManageView : additionalPackage}?`
    }
    this.isThereActivationDate = this.searchFieldDateActivation.find((searchDateActivation: any) => searchDateActivation['code'].includes(code))?.['activationDate']
    this.$store.dispatch('salesOrder/getAvailableFunds')
      .then((response) => {
        this.availableFunds = Number(response.availableFundsAmt)
        if (this.availableFunds - Number(this.selectedPrice) < 0) {
          this.isShowMoneyModal = true
          this.isStatusSwitcherAfterSendingOrder = true
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
  unPlug (productId: string, name: string = '', isTitle?: boolean) {
    const additionalPackage: string = `?????????? ${name}`
    this.deleteData = {
      bpi: this.line?.id || '',
      locationId: this.line?.locationId || '',
      marketId: this.line?.marketId || '',
      productId,
      title: `???? ??????????????, ?????? ????????????  ?????????????????? ${isTitle ? this.serviceManageView : additionalPackage}?`
    }
    this.disconnectedItem = productId
    this.isDisconnection = true
    this.isSuccessStatusSwitcherAfterSendingOrder = false
  }
  cancelLoaderSwitcher () {
    this.isStatusSwitcherAfterSendingOrder = false
  }
  cancelLoaderAfterSendingOrder () {
    this.isSuccessStatusSwitcherAfterSendingOrder = false
  }
  editName () {
    this.stbName = this.line?.stb?.[0].name || ''
    this.isEditMode = true
  }
  saveName () {
    if (this.stbName !== this.line?.stb?.[0].name) {
      this.isEditingName = true
    } else {
      this.isEditMode = false
    }
  }
  disassembleAllowedOffers () {
    return this.getProductServicesAllowedOffers({ api: this.$api, id: this.line?.offerId, marketId: this.line?.marketId })
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
  useActivationDate (acDate: string, oActiveDate: any) {
    return `??????????????????:&nbsp ${oActiveDate[acDate] ? oActiveDate[acDate] : oActiveDate.actualStartDate}`
  }
  useShutdownDate (shDate: string, oShutDate: any) {
    return (shDate in oShutDate ? `????????????????????: ${oShutDate[shDate]}` : '&nbsp')
  }
  async mounted () {
    this.appointModelPeriodPicker()
    if (this.line) {
      const firstSampleOffering = ([ first ]: IProductOffering | any) => first.offeringRelationships
      this.productAllowedOffers = await this.disassembleAllowedOffers().then(firstSampleOffering)
      this.$store.dispatch('tv/packs', { api: this.$api })
        .then((answer: ITVPacketPage[]) => {
          this.packages = answer

          // ?????? ?????????????????? ??????
          this.searchFieldDateActivation = this.productAllowedOffers
            .map((relationships: IOfferingRelationship) => {
              const childMax = [(+true)].indexOf(+relationships.childMax) !== -1
              const childProductOffering = relationships?.['childProductOffering']
              const activationDate = childProductOffering?.product?.chars.find((offer: any) => offer.name === '???????? ??????????????????')?.['name'] && !!'?????????????????? ??????'
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

          // ?????????????????? ???????????? ?????????????????? ?????????? ?????? ??????????????????????
          this.allowedPackagesCodes = this.productAllowedOffers
            .map((el: IOfferingRelationship) => el.childProductOffering?.code)
            .filter((el: string | undefined) => el)

          // ???????? ?????? ??????????????????????
          this.allowedPackagesPrices = this.productAllowedOffers
            .reduce((acc: Record<string, string>, el: IOfferingRelationship) => {
              const price = el?.childProductOffering?.prices
                ?.find((_price: any) => _price?.amount && _price?.chars?.['?????? TV']?.id === this.line?.tvType)?.amount
              if (el?.childProductOffering?.prices && el?.childProductOffering?.code && price) {
                return {
                  ...acc,
                  [el.childProductOffering.code]: price
                }
              }
              return acc
            }, {})
          const connectedpackagesCodes: string[] = this.line?.packets.map((el: ITVPacketsInModule) => el.code) || []
          // ?????????????????? ???????????? ?????????????????? ??????????????
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
              _el.count = `${el.count} ${getNoun(el.count, '??????????', '????????????', '??????????????')}`

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
              const charsDateActivation = (reassignActualStartDate)(connectedPacket.chars, packet)
              const actualStartDate = moment(connectedPacket.actualStartDate).format('DD.MM.YY')
              if (packet) {
                packet.productId = connectedPacket.id
                packet.price = connectedPacket.price
                packet.count = `${packet.count} ${getNoun(packet.count, '??????????', '????????????', '??????????????')}`
                packet.actualStartDate = '?????? ??????' in connectedPacket.chars ? actualStartDate : charsDateActivation
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
