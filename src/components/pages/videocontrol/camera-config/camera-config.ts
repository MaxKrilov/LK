import { Component, Mixins } from 'vue-property-decorator'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ProductItem from '../components/ProductItem/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErAvailableFundsModal from '@/components/blocks/ErAvailableFundsModal/index.vue'

import RenameField from './components/rename-field.vue'

import VIDEO_ANALYTICS from '@/constants/videoanalytics'

import { IBaseFunctionality, ICamera, IOffer } from '@/interfaces/videocontrol'
import { IProductOffering } from '@/interfaces/offering'
// @ts-ignore
import { promisedStoreValue } from '@/functions/store_utils'
import { logInfo } from '@/functions/logging'
import {
  CAMERA_SALE_TYPES,
  CHAR_VALUES,
  CHARS,
  CODES,
  MESSAGES,
  SERVICE_ORDER_MAP,
  VC_DOMAIN_STATUSES,
  VIDEOARCHIVE_DAY_COUNT
} from '@/constants/videocontrol'

import { ILocationOfferInfo, ISLOPricesItem } from '@/tbapi'
import { mapGetters, mapState } from 'vuex'
import { VueTransitionFSM } from '@/mixins/FSMMixin'
import { ErtPageWithDialogsMixin } from '@/mixins2/ErtPageWithDialogsMixin'
import { ErtFetchAvailableFundsMixin } from '@/mixins2/ErtFetchAvailableFundsMixin'
import { isMonthlyFeePrice } from '@/functions/offers'

/* FUNCTIONS */
const isFullHD = (el: IOffer) => el.code === CODES.FULLHD
const isFullHDArchive = (el: IOffer) => el.code === CODES.FULLHD_ARCHIVE
const isHDArchive = (el: IOffer) => el.code === CODES.HD_ARCHIVE
const isArchiveRecordConst = (el: IOffer) => el.code === CODES.CONST_RECORD

const components = {
  ProductItem,
  ErActivationModal,
  ErPlugProduct,
  RenameField,
  ErAvailableFundsModal
}

const props = {
  id: String
}

interface iVideoQualityValueItem {
  id: number
  value: string
}

interface iArchiveRecordValue {
  value: string
  code: string
}

const HD_VALUE = 'HD'
const FHD_VALUE = 'FullHD'
const VIDEO_QUALITY_VALUE_LIST: iVideoQualityValueItem[] = [
  { id: 1, value: HD_VALUE },
  { id: 2, value: FHD_VALUE }
]

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

interface ICameraDevice {
  model: string
  price: string
  saleType: string // "Аренда" etc
}

const getCameraDevice = (camera: ICamera): ICameraDevice => {
  const model = camera?.chars?.[CHARS.MODEL] || ''
  const saleType = camera?.chars?.[CHARS.CAMERA_SALE_TYPE] || ''
  const price = camera?.purchasedPrices?.recurrentTotal?.value || ''

  return { model, price, saleType }
}

@Component({
  components,
  props,
  computed
})
export default class VCCameraConfigPage extends Mixins(
  VueTransitionFSM,
  ErtPageWithDialogsMixin,
  ErtFetchAvailableFundsMixin
) {
  /* === Config === */
  isActionButtonsVisible: boolean = false
  isForpostPortalWorking: boolean = false
  isAnalyticCountVisible: boolean = false

  VIDEO_QUALITY_VALUE_LIST: any[] = VIDEO_QUALITY_VALUE_LIST

  CODES = CODES
  CHARS = CHARS

  ORDER_STATE = 'order'
  REQUEST_STATE = 'request'
  READY_STATE = 'ready'

  readonly stateList: string[] = [
    'loading',
    this.READY_STATE,
    this.ORDER_STATE,
    this.REQUEST_STATE,
    'error',
    'success',
    'renameConfirmation'
  ]

  stateTransitions = {
    ready: {
      order: () => {
        console.log('закажем каких-нибудь услуг')
      },
      renameConfirmation: (vm: any) => {
        vm.isShowRenameConfirm = true
      },
      loading: (vm: any) => {
        vm.isAnalyticsLoaded = false
      }
    },
    error: {
      ready: (vm: any) => {
        vm.isDeviceRenameMode = false
      }
    },
    renameConfirmation: {
      success: (vm: any) => {
        vm.isDeviceRenameMode = false
        vm.isShowRenameConfirm = false
        vm.isShowSuccessDisconnectModal = true
      }
    }
  }
  disconnectTitle: string = ''
  errorMessage: string = ''

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
  serviceStatuses: Record<string, boolean> = {}
  isOrderMode: boolean = false

  isDeviceRenameMode: boolean = false
  isSendingOrder: boolean = false
  isShowDisconnectModal: boolean = false

  /* === Form === */
  soundRecordValue: boolean = false
  videoQualityValue: iVideoQualityValueItem = VIDEO_QUALITY_VALUE_LIST[0]

  archiveRecordValueList: iArchiveRecordValue[] = [
    {
      value: 'Детектор движения',
      code: CODES.DETECTOR_RECORD
    },
    {
      value: 'Непрерывная запись',
      code: CODES.CONST_RECORD
    }
  ]

  archiveRecordValue: any = this.archiveRecordValueList[0]

  PTZValue: boolean = false

  currentValue: any = null
  currentServiceCode: string = ''
  isChanged: boolean = false
  isManagerRequest: boolean = false
  isOrderModalVisible: boolean = false
  isShowRenameConfirm: boolean = false
  isShowSuccessDisconnectModal: boolean = false
  requestData = {}
  orderData: any = {
    offer: 'cctv',
    productCode: ''
  }

  get isModificationInProgress () {
    return this.bf?.status === VC_DOMAIN_STATUSES.MODIFICATION
  }

  get location (): ILocationOfferInfo {
    return this.locationById(this.camera?.locationId) || {}
  }

  get locationName () {
    return this.location?.fulladdress || ''
  }

  get deviceName (): string {
    return this.camera?.chars[CHARS.DEVICE_NAME] || ''
  }

  get device (): ICameraDevice {
    return getCameraDevice(this.camera) || {}
  }

  get camera (): ICamera {
    return this.cameraById(this.$props.id) || {}
  }

  get cameraName (): string {
    return this.camera?.name || ''
  }

  get bf (): IBaseFunctionality {
    // @ts-ignore
    const empty: IBaseFunctionality = {}
    return this.camera?.parentId ? this.bfById(this.camera.parentId) : empty
  }

  get hasRentPay () {
    return this?.camera?.chars[CHARS.CAMERA_SALE_TYPE] === CAMERA_SALE_TYPES.RENT
  }

  get rentPay () {
    return this?.camera?.purchasedPrices?.recurrentTotal?.value || '0'
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
    return services
      ? Object.values(services)
        .filter((el: any) => el.status === 'Active')
      : []
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

  get videoQualityCurrentCode () {
    return this.isFHDEnabled
      ? CODES.FULLHD
      : 'HD'
  }

  get videoQualityCurrentPrice () {
    // цена подключенной услуги
    if (this.videoQualityValue.value === 'HD') {
      return '0'
    } else {
      if (this.isFHDEnabled) {
        return this.fullHd?.purchasedPrices?.recurrentTotal?.value || '0'
      } else {
        return this.fullHdPrice
      }
    }
  }

  get videoQualityPrice () {
    // цена подключаемой услуги
    if (this.videoQualityValue.value === 'HD') {
      return '0'
    } else {
      if (this.isFHDEnabled) {
        return this.fullHd?.offer?.prices?.[0]?.amount || '0'
      } else {
        return this.fullHdPrice
      }
    }
  }

  get isVideoQualityChanged () {
    const isCurrentValueFHD = this.videoQualityValue.value === FHD_VALUE
    return this.isFHDEnabled !== isCurrentValueFHD
  }

  get videoArchiveOfferList (): ISLOPricesItem[] {
    const isCurrentService = this.isFHDEnabled ? isFullHDArchive : isHDArchive
    return this.availableServiceList
      .find(isCurrentService)
      ?.prices || []
  }

  get videoArchiveValueList (): string[] {
    const originalOfferValues = this.videoArchiveOfferList?.map(
      (el: ISLOPricesItem) => el.chars?.[VIDEOARCHIVE_DAY_COUNT] || '-'
    )

    return this.videoArchiveValue !== '-'
      ? [MESSAGES.DISABLE, ...originalOfferValues]
      : originalOfferValues
  }

  get videoArchiveCurrentValue (): string {
    // @ts-ignore
    return this.videoArchiveValueList?.[this.videoArchiveValue] || '0'
  }

  get videoArchiveValue (): string {
    const currentCode = this.isFHDEnabled ? CODES.FULLHD_ARCHIVE : CODES.HD_ARCHIVE
    return this.enabledServiceList.find(
      (el: IProductOffering) => el?.offer?.code === currentCode
    )?.chars?.[CHARS.ARCHIVE_DAY_COUNT] || '-'
  }

  get videoArchiveValueIndex () {
    return this.videoArchiveValueList?.indexOf(this.videoArchiveValue) || 0
  }

  get currentVideoArchiveCode () {
    return this.isFHDEnabled
      ? CODES.FULLHD_ARCHIVE
      : CODES.HD_ARCHIVE
  }

  get videoArchiveCurrentPrice () {
    const isArchiveProductOffering = (el: IProductOffering): boolean => el?.offer?.code === this.currentVideoArchiveCode
    const service = this.enabledServiceList.find(isArchiveProductOffering)
    return service?.purchasedPrices?.recurrentTotal?.value || '0'
  }

  get videoArchivePrice () {
    return this.videoArchiveOfferList?.[this.videoArchiveValueIndex]?.amount || 0
  }

  get archiveRecordPrice (): string {
    return this.archiveRecordIsDetector
      ? '0'
      : this.availableServiceList
        ?.find(isArchiveRecordConst)
        ?.prices?.[0]
        ?.amount || '0'
  }

  get archiveRecordIsDetector (): boolean {
    return this.archiveRecordValue.code === CODES.DETECTOR_RECORD
  }

  get isPTZExists () {
    /* Есть поворотный модуль */
    return this?.camera?.chars?.[CHARS.PTZ] === CHAR_VALUES.YES
  }

  get isSoundRecordExists () {
    /* Поддерживается запись звука */
    return this?.camera?.chars?.[CHARS.SOUND_RECORD] === CHAR_VALUES.YES
  }

  get isFullHDExists () {
    /* Поддерживается запись звука */
    return this?.camera?.chars?.[CHARS.FULLHD] === CHAR_VALUES.YES
  }

  get currentServicePrice () {
    const code = this.orderData.productCode
    const service = this?.getServiceByCode(code)

    let serviceChar = 0
    let price = service?.prices?.[serviceChar]?.amount || '0.0'

    if ([CODES.FULLHD_ARCHIVE, CODES.HD_ARCHIVE].includes(code)) {
      price = service?.prices?.find(
        (el: any) => {
          return el.chars?.[VIDEOARCHIVE_DAY_COUNT] === this.currentValue
        }
      )?.amount || '0'
    }
    return price
  }

  fetchAllowedOfferList (offerId: string) {
    const payload = {
      api: this.$api,
      id: offerId,
      marketId: this.bf?.market?.id
    }

    return this.$store.dispatch(
      'videocontrol/pullAllowedOffers',
      payload
    )
  }

  mounted () {
    this.setState('loading')
    promisedStoreValue(this.$store, 'videocontrol', 'isDomainRegistryLoaded')
      .then(() => {
        this.fetchAllowedOfferList(this.bf?.offer?.id)
          .then(this.initCameraData)
      })
  }

  initCameraData (data: any) {
    this.allowedOffer = data?.[0]
    this.isAnalyticsLoaded = true

    this.PTZValue = this.isPTZEnabled
    this.soundRecordValue = this.isSoundRecordEnabled
    this.videoQualityValue = VIDEO_QUALITY_VALUE_LIST[+this.isFHDEnabled]

    this.serviceStatuses = this.availableAnalyticsList.map(
      el => ({ [el.code]: false })
    ).reduce((accumulator, el) => ({ ...accumulator, ...el }), {})

    this.enabledServiceCode.forEach(
      (el: any) => {
        this.serviceStatuses[el] = true
      }
    )

    this.serviceStatuses[CODES.PTZ] = this.PTZValue
    this.serviceStatuses[CODES.SOUND_RECORD] = this.soundRecordValue
    this.setState(this.READY_STATE)
  }

  fetchCameraData () {
    this.setState('loading')
    promisedStoreValue(this.$store, 'videocontrol', 'isDomainRegistryLoaded')
      .then(() => {
        this.fetchAllowedOfferList(this.bf?.offer?.id)
          .then(this.initCameraData)
      })
  }

  reloadCameraData () {
    this.pullDomainRegistry()
    this.fetchCameraData()
  }

  checkIsServiceEnabled (code: string) {
    return this.enabledServiceCode.includes(code)
  }

  getPTZPrice () {
    if (this.checkIsServiceEnabled(CODES.PTZ)) {
      const service = this.enabledServiceList.find((el: any) => el.offer.code === CODES.PTZ)
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    return '0'
  }

  getAnalyticItemPrice (code: string) {
    if (this.checkIsServiceEnabled(code)) {
      const service = this.enabledServiceList.find((el: any) => el.offer.code === code)
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    const service = this.availableAnalyticsList.find((el: any) => el.code === code)
    return service?.prices?.length ? service.prices.find(isMonthlyFeePrice)?.amount : '0.1'
  }

  getServiceByCode (code: string): IOffer | undefined {
    const serviceName = this.availableServiceList.find(
      (el: any) => el.code === code
    )

    const analyticName = this.availableAnalyticsList.find(
      (el: any) => el.code === code
    )

    return serviceName || analyticName
  }

  getServiceNameByCode (code: string) {
    return this.getServiceByCode(code)?.name
  }

  getProductId (code: string) {
    const service = this.enabledServiceList.find(
      (el: any) => el.offer.code === code
    )
    return service?.id || this.bf.id
  }

  switchFunctionality (code: string, value: any) {
    if (code === CODES.FULLHD && !this.isFullHDExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (code === CODES.SOUND_RECORD && !this.isSoundRecordExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (code === CODES.PTZ && !this.isPTZExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (this.isModificationInProgress && SERVICE_ORDER_MAP[code]) {
      this.onInfo({ message: MESSAGES.MIP_MESSAGE })
    } else {
      this.currentServiceCode = code
      this.serviceStatuses[code] = value
      this.currentValue = value
      this.isManagerRequest = !SERVICE_ORDER_MAP[code]

      this.requestData = {
        descriptionModal: 'Для подключения необходимо сформировать заявку',
        addressId: this.location.address.id,
        services: this.getServiceNameByCode(code),
        fulladdress: this.locationName
      }

      this.orderData = {
        // @ts-ignore
        locationId: this.location.id,
        bpi: this.bf.id,
        productCode: code,
        offer: 'cctv',
        title: `Вы уверены, что хотите подключить «${this.getServiceNameByCode(code)}»?`
      }

      if (SERVICE_ORDER_MAP[code]) {
        logInfo('Order', code, value, this.orderData, this.requestData)
      } else {
        logInfo('Request', code, value, this.orderData, this.requestData)
      }

      if (this.checkIsServiceEnabled(code)) {
        if (this.isManagerRequest) {
          this.requestData = {
            descriptionModal: 'Для отключения необходимо сформировать заявку',
            addressId: this.location.address.id,
            services: this.getServiceNameByCode(code),
            fulladdress: this.locationName,
            type: 'disconnect'
          }
          this.isOrderModalVisible = true
        } else {
          this.disableService(code, value)
        }
      } else {
        if (SERVICE_ORDER_MAP[code]) {
          this.checkFunds(+this.currentServicePrice)
            .then(() => {
              this.enableService(code, value)
            })
        } else {
          this.enableService(code, value)
        }
      }
    }
  }

  disableService (code: string, value: any) {
    logInfo('disableService', code, value)

    this.isOrderMode = true
    this.disconnectTitle = `Вы уверены, что хотите отключить «${this.getServiceNameByCode(code)}»?`

    const payload = {
      locationId: this.location.id,
      productId: this.getProductId(code),
      disconnectDate: this.$moment().format()
    }

    this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
      .then(() => {
        this.isShowDisconnectModal = true
      })
      .catch(() => {
        this.showError('При заказе произошла ошибка, обратитесь к вашему персональному менеджеру')
      })
  }

  enableService (code: string, value: any) {
    logInfo('enable Service', code, value)
    this.isOrderModalVisible = true
  }

  /* === Events === */
  onApplyRename () {
    this.setState('renameConfirmation')
    this.isSendingOrder = true
    this.$store.dispatch('salesOrder/send', {
      offerAcceptedOn: this.$moment().format()
    })
      .catch(data => {
        this.showError(MESSAGES.ORDER_ERROR)
        throw new Error(data)
      })
      .then(() => {
        this.setState('success')
      })
      .finally(() => {
        this.isSendingOrder = false
        this.reloadCameraData()
      })
  }

  onCancelRename () {
    this.onCancelOrder()
    this.setState('ready')
  }

  onSaveDeviceName (value: string) {
    if (this.isModificationInProgress) {
      this.onInfo({ message: MESSAGES.MIP_MESSAGE })
    } else {
      const payload = {
        locationId: this.location.id,
        bpi: this.camera.id,
        chars: {
          [CHARS.DEVICE_NAME]: value
        }
      }

      this.isDeviceRenameMode = true
      this.$store.dispatch('salesOrder/createModifyOrder', payload)
        .then(() => {
          // показываем модалку подтверждения
          this.setState('renameConfirmation')
        })
        .catch(() => {
          this.showError('При заказе произошла ошибка, обратитесь к вашему персональному менеджеру')
        })
    }
  }

  onCancelDeviceRename () {
    this.isDeviceRenameMode = false
  }

  onVideoQualityInput (value: iVideoQualityValueItem) {
    this.$set(this, 'videoQualityValue', value)
    const isFullHDEnabled = this.videoQualityValue['id'] === VIDEO_QUALITY_VALUE_LIST[1].id
    const prevValue = this.isFHDEnabled
      ? VIDEO_QUALITY_VALUE_LIST[1]
      : VIDEO_QUALITY_VALUE_LIST[0]

    if (
      (!isFullHDEnabled && this.enabledServiceCode.includes(CODES.FULLHD_ARCHIVE)) ||
      (isFullHDEnabled && this.enabledServiceCode.includes(CODES.HD_ARCHIVE))
    ) {
      this.onInfo({ message: MESSAGES.WARNING_FULLHD_AND_HD_ARCHIVE })
      this.$set(this, 'videoQualityValue', prevValue)
    } else {
      if (!this.isModificationInProgress) {
        this.switchFunctionality(
          CODES.FULLHD,
          isFullHDEnabled
        )
      } else {
        this.onInfo({ message: MESSAGES.MIP_MESSAGE })
        this.$set(this, 'videoQualityValue', prevValue)
      }
    }
  }

  onPTZInput (value: boolean) {
    this.switchFunctionality(CODES.PTZ, value)
  }

  onSoundRecordInput (value: boolean) {
    this.switchFunctionality(CODES.SOUND_RECORD, value)
  }

  onVideoArchiveInput (value: any) {
    if (this.isModificationInProgress) {
      this.onInfo({ message: MESSAGES.MIP_MESSAGE })
      return
    }

    const valueIndex = this.videoArchiveValueList?.indexOf(value) || 0

    this.currentServiceCode = this.currentVideoArchiveCode
    this.currentValue = value
    const serviceName = this.getServiceNameByCode(this.currentVideoArchiveCode)

    const isDisabling = value === MESSAGES.DISABLE

    this.orderData = {
      locationId: this.location.id,
      bpi: this.bf.id,
      productCode: this.currentVideoArchiveCode,
      offer: isDisabling ? '' : 'cctv',
      title: isDisabling
        ? `Вы уверены, что хотите отключить «${serviceName}»?`
        : `Вы уверены, что хотите подключить «${serviceName}»?`,
      chars: {
        ...this.videoArchiveOfferList?.[valueIndex].chars,
        [CHARS.NAME_IN_INVOICE]: `Увеличение глубины видеоархива ${this.videoQualityValue.value}`
      }
    }

    if (isDisabling) {
      this.disableService(this.currentVideoArchiveCode, false)
    } else {
      this.checkFunds(+this.currentServicePrice)
        .then(() => {
          this.enableService(this.currentVideoArchiveCode, value)
        })
    }
  }

  onArchiveRecordInput (archiveRecord: iArchiveRecordValue) {
    this.switchFunctionality(archiveRecord.code, true)
  }

  onPlay () {
    // TODO: добавить переход на сайт ФОРПОСТа когда будет готова ссылка
    logInfo('watch camera stream')
  }

  onInputAnalyticItem (...data: any) {
    this.switchFunctionality(data[0], data[1])
  }

  onCancelOrder () {
    this.isOrderMode = false
    this.serviceStatuses[this.currentServiceCode] = !this.serviceStatuses[this.currentServiceCode]
    this.isDeviceRenameMode = false
    this.currentServiceCode = ''
    this.setState('loading')
    this.$store.dispatch('salesOrder/cancel').then(() => {
      this.reloadCameraData()
    })
  }

  onCancelRequest () {
    this.serviceStatuses[this.currentServiceCode] = !this.serviceStatuses[this.currentServiceCode]
    this.currentServiceCode = ''
    this.reloadCameraData()
  }

  onApplyOrder () {
    const FAILED_STATUS = 'FAILED'

    const payload = {
      offerAcceptedOn: this.$moment().format()
    }

    this.isSendingOrder = true
    this.$store.dispatch('salesOrder/send', payload)
      .then(response => {
        if (response?.submit_statuses?.[0].submitStatus === FAILED_STATUS) {
          throw Error(MESSAGES.ORDER_ERROR)
        } else {
          this.isShowDisconnectModal = false
          this.isSendingOrder = false
          this.isShowSuccessDisconnectModal = true
          this.setState('ready')
        }
      })
      .catch(() => {
        this.isShowDisconnectModal = false
        this.showError(MESSAGES.ORDER_ERROR)
      })
      .finally(() => {
        this.isSendingOrder = false
        this.isOrderMode = false
        this.currentServiceCode = ''
      })
  }

  onCloseError () {
    this.errorMessage = ''
    this.setState('ready')
    this.serviceStatuses[this.currentServiceCode] = !this.serviceStatuses[this.currentServiceCode]
    this.currentServiceCode = ''
  }

  showError (message: string) {
    this.errorMessage = message
    this.setState('error')
  }

  onCloseSuccess () {
    this.reloadCameraData()
    this.currentServiceCode = ''
  }

  pullDomainRegistry (): void {
    const parentIds = this.$store.state.videocontrol.points
      .map(({ bpi }: ILocationOfferInfo) => bpi)

    this.$store.dispatch(
      'videocontrol/pullForpostDomainRegistry',
      {
        api: this.$api,
        parentIds
      })
  }

  getAnalyticItemIcon (code: string) {
    return VIDEO_ANALYTICS[code]?.iconName
  }

  updateKeyPlease () {
    return parseInt(Math.random() * 999, 10)
  }

  onInfoClose () {
    this.isInfoMode = false
  }

  onCloseAvailableFundsModal () {
    this.setState('ready')
    this.serviceStatuses[this.currentServiceCode] = !this.serviceStatuses[this.currentServiceCode]
    this.currentServiceCode = ''
  }
}
