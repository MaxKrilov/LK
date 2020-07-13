import { Vue, Component } from 'vue-property-decorator'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import AnalyticItem from './components/AnalyticItem/index.vue'

import { ICamera, IBaseFunctionality, IOffer } from '@/interfaces/videocontrol'
import { IProductOffering } from '@/interfaces/offering'
import { promisedStoreValue } from '@/functions/store_utils'
import { logInfo, logError } from '@/functions/logging'
import {
  CODES,
  VIDEOARCHIVE_DAY_COUNT,
  CHARS,
  CAMERA_SALE_TYPES,
  SERVICE_ORDER_MAP
} from '@/constants/videocontrol'

import { ILocationOfferInfo, ISLOPricesItem } from '@/tbapi'
import { mapState, mapGetters } from 'vuex'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

/* FUNCTIONS */
const isFullHD = (el: IOffer) => el.code === CODES.FULLHD
const isFullHDArchive = (el: IOffer) => el.code === CODES.FULLHD_ARCHIVE
const isHDArchive = (el: IOffer) => el.code === CODES.HD_ARCHIVE

const components = {
  AnalyticItem,
  ErActivationModal,
  ErPlugProduct
}

const props = {
  id: String
}

const VIDEO_QUALITY_VALUE_LIST = ['HD', 'FullHD']

const computed = {
  ...mapGetters({
    availableServiceListByBFOId: 'videocontrol/availableServiceListByBFOId',
    availableAnalyticListByBFOId: 'videocontrol/availableAnalyticListByBFOId',
    locationById: 'videocontrol/pointById',
    cameraById: 'videocontrol/cameraById',
    bfById: 'videocontrol/bfById'
  }),
  ...mapState({
    // isAnalyticsLoaded: (state: any) => state.videocontrol.isAllowedOffersLoaded,
    isDomainsLoaded: (state: any) => state.videocontrol.isDomainRegistryLoaded,
    isLocationLoaded: (state: any) => state.videocontrol.isPointsLoaded
  })
}
@Component({ components, props, computed })
export default class VCCameraConfigPage extends Vue {
  /* === Config === */
  isActionButtonsVisible: boolean = false
  isForpostProtalWorking: boolean = false

  VIDEO_QUALITY_VALUE_LIST: string[] = VIDEO_QUALITY_VALUE_LIST

  /* === mapState === */
  isLocationLoaded!: boolean
  isDomainsLoaded!: boolean

  /* === mapGetters === */
  availableAnalyticListByBFOId!: (BFOfferId: string) => IOffer[]
  availableServiceListByBFOId!: (BFOfferId: string) => IOffer[]
  cameraById!: (id: string) => ICamera
  locationById!: (id: string) => ILocationOfferInfo
  bfById!: (id: string) => IBaseFunctionality

  /* === Заполняются в mounted() === */
  allowedOffer!: IProductOffering

  /* === */
  isAnalyticsLoaded: boolean = false
  isOrderMode: boolean = false

  isSendingOrder: boolean = false
  isShowDisconnectModal: boolean = false

  /* === Form === */
  soundRecordValue: boolean = false
  videoQualityValue: string = VIDEO_QUALITY_VALUE_LIST[0]
  videoArchiveValue: string = '0'
  PTZValue: boolean = false

  isChanged = false
  isManagerRequest = false
  isOrderModalVisible = false
  requestData = {}
  orderData = {}

  isShowRenameButton: boolean = false
  name: string = ''

  get location (): ILocationOfferInfo {
    return this.locationById(this.camera?.locationId) || {}
  }

  get locationName () {
    return this.location?.name || ''
  }

  get camera (): ICamera {
    return this.cameraById(this.$props.id)
  }

  get cameraName (): string {
    return this.name || this.camera?.name || ''
  }

  get bf (): IBaseFunctionality {
    return this.bfById(this.camera.parentId)
  }

  get hasRentPay () {
    return this?.camera?.chars[CHARS.CAMERA_SALE_TYPE] === CAMERA_SALE_TYPES.RENT
  }

  get rentPay () {
    return this?.camera?.purchasedPrices.recurrentTotal.value || '0'
  }

  get licensePay () {
    const price = this?.bf?.offer?.prices?.[0]
    return price ? parseFloat(price.amount) : '0'
  }

  get totalPrice () {
    let price = parseFloat(this.licensePay)
    price += parseFloat(this.rentPay)

    price += this.enabledServiceList.reduce(
      (total, el: any) => total + parseFloat(el.purchasedPrices.recurrentTotal.value),
      0
    )

    return price.toFixed(2)
  }

  get enabledServiceList (): IProductOffering[] {
    const services = this.bf?.services
    return services ? Object.values(services) : []
  }

  get enabledServiceCode () {
    return this.enabledServiceList?.map(el => el?.offer?.code)
  }

  get enabledAnalyticCount (): number {
    const isServiceEnabled = (el: any) => this.enabledServiceCode.includes(el?.code)

    return this.availableAnalyticsList
      .filter(
        isServiceEnabled
      ).length || 0
  }

  get availableServiceList () {
    return this.availableServiceListByBFOId(this.bf?.offer?.id) || []
  }

  get availableAnalyticsList () {
    return this.availableAnalyticListByBFOId(this.bf?.offer?.id) || []
  }

  // Поворотный модуль
  get isPTZAvailable (): boolean {
    return ['Да', 'Yes'].includes(this.camera.chars.PTZ)
  }

  get isPTZEnabled (): boolean {
    return this.enabledServiceCode.includes(CODES.PTZ)
  }

  // Sound Record
  get soundRecordService () {
    if (this.enabledServiceList.length) {
      return this.enabledServiceList
        .find((el: IProductOffering) => el?.offer?.code === CODES.SOUND_RECORD)
    }
  }

  get isSoundRecordEnabled () {
    return this.enabledServiceCode.includes(CODES.SOUND_RECORD)
  }

  get soundRecordPrice () {
    return this.soundRecordService?.purchasedPrices?.recurrentTotal?.value || '0'
  }

  // FullHD
  get fullHd () {
    // @ts-ignore
    return this.enabledServiceList.find(({ offer }) => isFullHD(offer))
  }

  get isFHDEnabled () {
    return this.enabledServiceCode.includes(CODES.FULLHD)
  }

  get fullHdPrice (): string {
    return this.availableServiceList
      ?.find(isFullHD)
      ?.prices?.[0]
      ?.amount || '0'
  }

  get videoQualityPrice () {
    if (this.videoQualityValue === 'HD') {
      return '0'
    } else {
      if (this.isFHDEnabled) {
        return this.fullHd?.purchasedPrices?.recurrentTotal?.value || '0'
      } else {
        return this.fullHdPrice
      }
    }
  }

  get videoArchiveOfferList (): ISLOPricesItem[] {
    const isCurrentService = this.isFHDEnabled ? isFullHDArchive : isHDArchive
    return this.availableServiceList
      .find(isCurrentService)
      ?.prices || []
  }

  get videoArchiveValueList (): string[] {
    return this.videoArchiveOfferList?.map(
      (el: ISLOPricesItem) => el.chars[VIDEOARCHIVE_DAY_COUNT]
    )
  }

  get videoArchiveCurrentValue (): string {
    // @ts-ignore
    return this.videoArchiveValueList?.[this.videoArchiveValue] || '0'
  }

  get videoArchiveValueIndex () {
    return this.videoArchiveValueList?.indexOf(this.videoArchiveValue) || 0
  }

  get videoArchivePrice () {
    return this.videoArchiveOfferList?.[this.videoArchiveValueIndex]?.amount || 0
  }

  fetchAllowedOfferList (offerId: string) {
    const payload = {
      api: this.$api,
      id: offerId
    }

    return this.$store.dispatch(
      'videocontrol/pullAllowedOffers',
      payload
    )
  }

  mounted () {
    promisedStoreValue(this.$store, 'videocontrol', 'isDomainRegistryLoaded')
      .then(() => {
        this.fetchAllowedOfferList(this.bf?.offer?.id)
          .then(data => {
            this.allowedOffer = data[0]
            this.isAnalyticsLoaded = true

            this.PTZValue = this.isPTZEnabled
            this.soundRecordValue = this.isSoundRecordEnabled
            this.videoQualityValue = VIDEO_QUALITY_VALUE_LIST[+this.isFHDEnabled]
            this.videoArchiveValue = this.videoArchiveCurrentValue
          })
      })
  }

  checkIsServiceEnabled (code: string) {
    return this.enabledServiceCode.includes(code)
  }

  getPTZPrice () {
    if (this.checkIsServiceEnabled(CODES.PTZ)) {
      const service = this.enabledServiceList.find((el:any) => el.offer.code === CODES.PTZ)
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    return '0'
  }

  getPriceWithoutTax (price: {amount: string, tax: string}) {
    return (parseFloat(price.amount) - parseFloat(price.tax)).toFixed(2)
  }

  getAnalyticItemPrice (code: string) {
    if (this.checkIsServiceEnabled(code)) {
      const service = this.enabledServiceList.find((el:any) => el.offer.code === code)
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    const service = this.availableAnalyticsList.find((el:any) => el.code === code)
    return service?.prices?.[0] ? this.getPriceWithoutTax(service.prices[0]) : '0.1'
  }

  enableService (code: string, value: any) {
    logInfo('enable Service', code, value)
    this.isOrderModalVisible = true
  }

  switchFunctionality (code: string, value: any) {
    this.isManagerRequest = !SERVICE_ORDER_MAP[code]

    this.requestData = {
      descriptionModal: 'Для подключения необходимо сформировать заявку',
      addressId: this.location.address.id,
      services: '',
      fulladdress: this.locationName
    }

    this.orderData = {
      locationId: this.location.id,
      bpi: this.bf.id,
      productCode: code,
      offer: true,
      title: 'Вы уверены, что хотите подключить услугу?'
    }

    if (SERVICE_ORDER_MAP[code]) {
      logInfo('Order', code, value, this.orderData, this.requestData)
    } else {
      logInfo('Request', code, value, this.orderData, this.requestData)
    }

    if (this.checkIsServiceEnabled(code)) {
      this.disableService(code, value)
    } else {
      this.enableService(code, value)
    }

    // this.isOrderModalVisible = true
  }

  disableService (code: string, value: any) {
    logInfo('disableService', code, value)

    this.isOrderMode = true

    const payload = {
      locationId: this.location.id,
      bpi: this.bf.id,
      disconnectDate: this.$moment().format()
    }

    this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
      .then(() => {
        this.isShowDisconnectModal = true
      })
      .catch(e => logError('ERR createDisconnectOrder', e))
  }

  /* === Events === */
  onVideoQualityInput (value: string) {
    this.videoQualityValue = value
    this.switchFunctionality(
      CODES.FULLHD,
      value === VIDEO_QUALITY_VALUE_LIST[1]
    )
  }

  onPTZInput (value: boolean) {
    this.switchFunctionality(CODES.PTZ, value)
  }

  onSoundRecordInput (value: boolean) {
    this.switchFunctionality(CODES.SOUND_RECORD, value)
  }

  onVideoArchiveInput (value: any) {
    const valueIndex = this.videoArchiveValueList?.indexOf(value) || 0
    this.switchFunctionality(
      CODES.FULLHD_ARCHIVE,
      this.videoArchiveOfferList?.[valueIndex]
    )
  }

  onInputName (value: string) {
    this.isShowRenameButton = true
    logInfo('input camera name', value)
    this.name = value
  }

  onRenameCamera () {
    logInfo(`Rename camera from '${this.cameraName} to '${this.name}'`)
  }

  onPlay () {
    logInfo('watch camera stream')
  }

  onFormInput (data: any) {
    logInfo('onFormInput', data)
  }

  onInputAnalyticItem (...data: any) {
    this.switchFunctionality(data[0], data[1])
  }

  onCancelOrder () {
    logInfo('onCancelOrder')
    this.$store.dispatch('salesOrder/cancel')
  }

  onApplyOrder () {
    const payload = {
      offerAcceptedOn: this.$moment().format()
    }
    logInfo('onApplyOrder', payload)
    this.$store.dispatch('salesOrder/send', payload)
  }
}
