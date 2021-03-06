import { Component, Mixins } from 'vue-property-decorator'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ProductItem from '../components/ProductItem/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErAvailableFundsModal from '@/components/blocks/ErAvailableFundsModal/index.vue'

import RenameField from './components/rename-field.vue'

import VIDEO_ANALYTICS from '@/constants/videoanalytics'

import { IBaseFunctionality, ICamera, IOffer, IVideocontrol } from '@/interfaces/videocontrol'
import { IProductOffering } from '@/interfaces/offering'
// @ts-ignore
import { promisedStoreValue } from '@/functions/store_utils'
import { logInfo } from '@/functions/logging'
import {
  CAMERA_SALE_TYPES,
  CHAR_VALUES,
  CHARS,
  TOMS_IDS,
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
import { isVisibleAnalytic } from '@/functions/videocontroll'
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue'
import moment from 'moment'

/* FUNCTIONS */
const isFullHD = (el: IOffer) => fullHdTomsIds.includes(el.tomsId)
const isFullHDArchive = (el: IOffer) => el.tomsId === TOMS_IDS.FULLHD_ARCHIVE
const isHDArchive = (el: IOffer) => el.tomsId === TOMS_IDS.HD_ARCHIVE
const isArchiveRecordConst = (el: IOffer) => el.tomsId === TOMS_IDS.CONST_RECORD

const fullHdTomsIds = [TOMS_IDS.FULLHD, TOMS_IDS.FULLHD_VIDEOREGISTRATOR]
const soundRecordTomsIds = [TOMS_IDS.SOUND_RECORD, TOMS_IDS.SOUND_RECORD_VIDEOREGISTRATOR]
const PTZTomsIds = [ TOMS_IDS.PTZ, TOMS_IDS.PTZ_VIDEOREGISTRATOR ]

const components = {
  ProductItem,
  ErActivationModal,
  ErPlugProduct,
  RenameField,
  ErAvailableFundsModal,
  PriceServicesComponent
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
  tomsId: string
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
    bfById: 'videocontrol/bfById',
    videocontrolById: 'videocontrol/videocontrolById'
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
  saleType: string // "????????????" etc
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

  TOMS_IDS = TOMS_IDS
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
        console.log('?????????????? ??????????-???????????? ??????????')
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
  videocontrolById!: (id: string) => IVideocontrol

  /* === ?????????????????????? ?? mounted() === */
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
      value: '???????????????? ????????????????',
      tomsId: TOMS_IDS.DETECTOR_RECORD
    },
    {
      value: '?????????????????????? ????????????',
      tomsId: TOMS_IDS.CONST_RECORD
    }
  ]

  archiveRecordValue: any = this.archiveRecordValueList[0]

  PTZValue: boolean = false

  currentValue: any = null
  currentServiceTomsId: string = ''
  isChanged: boolean = false
  isManagerRequest: boolean = false
  isOrderModalVisible: boolean = false
  isShowRenameConfirm: boolean = false
  isShowSuccessDisconnectModal: boolean = false
  requestData = {}
  orderData: any = {
    offer: 'cctv',
    tomsId: ''
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

  get cameraOwnershipType (): string {
    return this.camera.chars['???????????? ???????????????????????????? ????????????????????????']
  }

  get cameraOwnershipPrice (): string {
    return this.camera?.purchasedPrices?.recurrentTotal?.value
  }

  get cameraGuaranteePeriod (): string {
    const guaranteePeriod = this.camera.chars?.['?????????????????????? ???????? (????)']
    return guaranteePeriod ? moment(guaranteePeriod).format('L') : ''
  }

  get bf (): IBaseFunctionality {
    // @ts-ignore
    const empty: IBaseFunctionality = {}
    return this.camera?.parentId ? this.bfById(this.camera.parentId) : empty
  }

  get videocontrol (): IVideocontrol {
    // @ts-ignore
    const empty: IVideocontrol = {}
    return this.camera?.parentId ? this.videocontrolById(this.camera.parentId) : empty
  }

  get allServicesTotalPrice ():any {
    return Object.values(this.bf.services || {}).reduce((totalPrice, currentService) => totalPrice + +(currentService?.purchasedPrices?.recurrentTotal?.value || 0), 0)
  }

  get marketId (): string {
    return this.bf.market.id
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

  get enabledServiceTomsId () {
    return this.enabledServiceList?.map(el => el?.offer?.tomsId)
  }

  get enabledAnalyticCount (): number {
    const isServiceEnabled = (el: any) => this.enabledServiceTomsId.includes(el?.tomsId)

    return this.availableAnalyticsList
      .filter(
        isServiceEnabled
      ).length || 0
  }

  get availableServiceList () {
    return this.availableServiceListByBFOId(this.bf?.offer?.id) || []
  }

  get availableAnalyticsList () {
    /* ?? ???????????? WEB-31415 ?????????????????? ?????????????? ???? ?????????????????? ?????????? ?????????????????? ??????????????: ???????????????? ?????????????????????? ?? ?????????? ???????????????????? "Security+" */
    let availableAnalyticsList = this.availableAnalyticListByBFOId(this.bf?.offer?.id)?.filter(isVisibleAnalytic) || []
    const forbiddenList = ['???????????????? ??????????????????????', '?????????? ???????????????????? "Security+"']
    return availableAnalyticsList.filter(item => !forbiddenList.includes(item.name || ''))
  }

  // ???????????????????? ????????????
  get isPTZAvailable (): boolean {
    return ['????', 'Yes'].includes(this.camera.chars.PTZ)
  }

  get isPTZEnabled (): boolean {
    return this.enabledServiceTomsId.includes(TOMS_IDS.PTZ)
  }

  // Sound Record
  get soundRecordService () {
    if (this.enabledServiceList.length) {
      return this.enabledServiceList
        .find((el: IProductOffering) => soundRecordTomsIds.includes(el?.offer?.tomsId || ''))
    }
  }

  get isSoundRecordEnabled () {
    return this.enabledServiceTomsId.includes(TOMS_IDS.SOUND_RECORD)
  }

  get soundRecordPrice () {
    if (this.checkIsServiceEnabled(TOMS_IDS.SOUND_RECORD) || this.checkIsServiceEnabled(TOMS_IDS.SOUND_RECORD_VIDEOREGISTRATOR)) {
      const service = this.enabledServiceList.find((el: any) => soundRecordTomsIds.includes(el.offer.tomsId))
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    const soundRecord = this.availableServiceList.find(item => soundRecordTomsIds.includes(item.tomsId))

    if (soundRecord) {
      return soundRecord.prices?.find(item => item.type === 'Monthly Fee')?.amount || '0'
    }

    return '0'
  }

  // FullHD
  get fullHd () {
    // @ts-ignore
    return this.enabledServiceList.find(({ offer }) => isFullHD(offer))
  }

  get isFHDEnabled () {
    return this.enabledServiceTomsId.includes(TOMS_IDS.FULLHD) || this.enabledServiceTomsId.includes(TOMS_IDS.FULLHD_VIDEOREGISTRATOR)
  }

  get fullHdPrice (): string {
    return this.availableServiceList
      ?.find(isFullHD)
      ?.prices?.find(item => item.type === 'Monthly Fee')
      ?.amount || '0'
  }

  get videoQualityCurrentPrice () {
    // ???????? ???????????????????????? ????????????
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
    // ???????? ???????????????????????? ????????????
    if (this.videoQualityValue.value === 'HD') {
      return '0'
    } else {
      if (this.isFHDEnabled) {
        return this.fullHd?.offer?.prices?.find(item => item.type === 'Monthly Fee')?.amount || '0'
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
    const currentTomsId = this.isFHDEnabled ? TOMS_IDS.FULLHD_ARCHIVE : TOMS_IDS.HD_ARCHIVE
    return this.enabledServiceList.find(
      (el: IProductOffering) => el?.offer?.tomsId === currentTomsId
    )?.chars?.[CHARS.ARCHIVE_DAY_COUNT] || '-'
  }

  get videoArchiveValueIndex () {
    return this.videoArchiveValueList?.indexOf(this.videoArchiveValue) || 0
  }

  get currentVideoArchiveTomsId () {
    return this.isFHDEnabled
      ? TOMS_IDS.FULLHD_ARCHIVE
      : TOMS_IDS.HD_ARCHIVE
  }

  get videoArchiveCurrentPrice () {
    const isArchiveProductOffering = (el: IProductOffering): boolean => el?.offer?.tomsId === this.currentVideoArchiveTomsId
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
    return this.archiveRecordValue.tomsId === TOMS_IDS.DETECTOR_RECORD
  }

  get isPTZExists () {
    /* ???????? ???????????????????? ???????????? */
    return this?.camera?.chars?.[CHARS.PTZ] === CHAR_VALUES.YES
  }

  get isSoundRecordExists () {
    /* ???????????????????????????? ???????????? ?????????? */
    return this?.camera?.chars?.[CHARS.SOUND_RECORD] === CHAR_VALUES.YES
  }

  get isFullHDExists () {
    /* ???????????????????????????? ???????????? ?????????? */
    return this?.camera?.chars?.[CHARS.FULLHD] === CHAR_VALUES.YES
  }

  get currentServicePrice () {
    const tomsId = this.orderData.tomsId
    const service = this?.getServiceByTomsId(tomsId)

    let price = service?.prices?.find(service => service.type === 'Monthly Fee')?.amount || '0.0'

    if ([TOMS_IDS.FULLHD_ARCHIVE, TOMS_IDS.HD_ARCHIVE].includes(tomsId)) {
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
      marketId: this.marketId
    }

    return this.$store.dispatch(
      'videocontrol/pullAllowedOffers',
      payload
    )
  }

  get baseCost () {
    if (this.videocontrol?.purchasedPrices?.recurrentTotal?.value) {
      return +(this.videocontrol?.purchasedPrices?.recurrentTotal?.value) - this.allServicesTotalPrice - this.rentPay
    }

    return 0
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
      el => ({ [el.tomsId]: false })
    ).reduce((accumulator, el) => ({ ...accumulator, ...el }), {})

    this.enabledServiceTomsId.forEach(
      (el: any) => {
        this.serviceStatuses[el] = true
      }
    )

    this.serviceStatuses[TOMS_IDS.PTZ] = this.PTZValue
    this.serviceStatuses[TOMS_IDS.SOUND_RECORD] = this.soundRecordValue
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

  checkIsServiceEnabled (tomsId: string) {
    return this.enabledServiceTomsId.includes(tomsId)
  }

  getPTZPrice () {
    if (this.checkIsServiceEnabled(TOMS_IDS.PTZ) || this.checkIsServiceEnabled(TOMS_IDS.PTZ_VIDEOREGISTRATOR)) {
      const service = this.enabledServiceList.find((el: any) => PTZTomsIds.includes(el.offer.tomsId))
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    const PTZ = this.availableServiceList.find(item => PTZTomsIds.includes(item.tomsId))

    if (PTZ) {
      return PTZ.prices?.find(item => item.type === 'Monthly Fee')?.amount || '0'
    }

    return '0'
  }
  get cameraSaleInfo () {
    switch (this.device.saleType) {
      case CAMERA_SALE_TYPES.SALE:
        return {
          firstColumn: {
            name: '?????????????????????? ???????? ????:',
            content: this.$moment(this?.camera?.chars[CHARS.GARANTE_TO]).format('DD.MM.YYYY')
          },
          secondColumn: {
            name: '',
            content: ''
          }
        }
      case CAMERA_SALE_TYPES.OWN_DEVICE:
        return {
          firstColumn: {
            name: '',
            content: ''
          },
          secondColumn: {
            name: '?????????????????????? ???????????????????????? ??????????????',
            content: ''
          }
        }
      case CAMERA_SALE_TYPES.RENT:
        return {
          firstColumn: {
            name: '????????????????',
            content: '---'
          },
          secondColumn: {
            name: '????????????',
            content: this.device.price
          }
        }
      case CAMERA_SALE_TYPES.INSTALLMENT:
        return {
          firstColumn: {
            name: '????????????????',
            content: this.$moment(this?.camera?.chars[CHARS.GARANTE_TO]).format('DD.MM.YYYY')
          },
          secondColumn: {
            name: `?????????????????? ${this?.camera?.chars[CHARS.DURATION]} ??????.`,
            content: this.device.price
          }
        }
    }
    return {
      firstColumn: {
        name: '',
        content: ''
      },
      secondColumn: {
        name: '',
        content: ''
      }
    }
  }

  getAnalyticItemPrice (tomsId: string) {
    if (this.checkIsServiceEnabled(tomsId)) {
      const service = this.enabledServiceList.find((el: any) => el.offer.tomsId === tomsId)
      return service?.purchasedPrices?.recurrentTotal?.value || '0'
    }

    const service = this.availableAnalyticsList.find((el: any) => el.tomsId === tomsId)
    return service?.prices?.length ? service.prices.find(isMonthlyFeePrice)?.amount : '0.1'
  }

  getServiceByTomsId (tomsId: string): IOffer | undefined {
    const serviceName = this.availableServiceList.find(
      (el: any) => el.tomsId === tomsId
    )

    const analyticName = this.availableAnalyticsList.find(
      (el: any) => el.tomsId === tomsId
    )

    return serviceName || analyticName
  }

  getServiceNameByTomsId (tomsId: string) {
    return this.getServiceByTomsId(tomsId)?.name
  }

  getProductId (tomsId: string) {
    const service = this.enabledServiceList.find(
      (el: any) => el.offer.tomsId === tomsId
    )
    return service?.id || this.bf.id
  }

  switchFunctionality (value: any, tomsId: string) {
    if (tomsId === TOMS_IDS.FULLHD && !this.isFullHDExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (tomsId === TOMS_IDS.SOUND_RECORD && !this.isSoundRecordExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (tomsId === TOMS_IDS.PTZ && !this.isPTZExists) {
      this.onInfo({ message: MESSAGES.FUNC_NOT_EXISTS })
    } else if (this.isModificationInProgress && SERVICE_ORDER_MAP[tomsId]) {
      this.onInfo({ message: MESSAGES.MIP_MESSAGE })
    } else {
      this.currentServiceTomsId = tomsId
      this.serviceStatuses[tomsId] = value
      this.currentValue = value
      this.isManagerRequest = !SERVICE_ORDER_MAP[tomsId]

      this.requestData = {
        descriptionModal: '?????? ?????????????????????? ???????????????????? ???????????????????????? ????????????',
        addressId: this.location.address.id,
        services: this.getServiceNameByTomsId(tomsId),
        fulladdress: this.locationName
      }

      this.orderData = {
        // @ts-ignore
        locationId: this.location.id,
        marketId: this.marketId,
        bpi: this.bf.id,
        tomsId,
        offer: 'cctv',
        title: `???? ??????????????, ?????? ???????????? ???????????????????? ??${this.getServiceNameByTomsId(tomsId)}???`
      }

      if (SERVICE_ORDER_MAP[tomsId]) {
        logInfo('Order', tomsId, value, this.orderData, this.requestData)
      } else {
        logInfo('Request', tomsId, value, this.orderData, this.requestData)
      }

      if (this.checkIsServiceEnabled(tomsId)) {
        if (this.isManagerRequest) {
          this.requestData = {
            descriptionModal: '?????? ???????????????????? ???????????????????? ???????????????????????? ????????????',
            addressId: this.location.address.id,
            services: this.getServiceNameByTomsId(tomsId),
            fulladdress: this.locationName,
            type: 'disconnect'
          }
          this.isOrderModalVisible = true
        } else {
          this.disableService(tomsId, value)
        }
      } else {
        if (SERVICE_ORDER_MAP[tomsId]) {
          this.checkFunds(+this.currentServicePrice)
            .then(() => {
              this.enableService(tomsId, value)
            })
        } else {
          this.enableService(tomsId, value)
        }
      }
    }
  }

  disableService (tomsId: string, value: any) {
    logInfo('disableService', tomsId, value)

    this.isOrderMode = true
    this.disconnectTitle = `???? ??????????????, ?????? ???????????? ?????????????????? ??${this.getServiceNameByTomsId(tomsId)}???`

    const payload = {
      marketId: this.marketId,
      locationId: this.location.id,
      productId: this.getProductId(tomsId),
      disconnectDate: this.$moment().format()
    }

    this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
      .then(() => {
        this.isShowDisconnectModal = true
      })
      .catch(() => {
        this.showError('?????? ???????????? ?????????????????? ????????????, ???????????????????? ?? ???????????? ?????????????????????????? ??????????????????')
      })
  }

  enableService (tomsId: string, value: any) {
    logInfo('enable Service', tomsId, value)
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
        marketId: this.marketId,
        bpi: this.camera.id,
        chars: {
          [CHARS.DEVICE_NAME]: value
        }
      }

      this.isDeviceRenameMode = true
      this.$store.dispatch('salesOrder/createModifyOrder', payload)
        .then(() => {
          // ???????????????????? ?????????????? ??????????????????????????
          this.setState('renameConfirmation')
        })
        .catch(() => {
          this.showError('?????? ???????????? ?????????????????? ????????????, ???????????????????? ?? ???????????? ?????????????????????????? ??????????????????')
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
      (!isFullHDEnabled && this.enabledServiceTomsId.includes(TOMS_IDS.FULLHD_ARCHIVE)) ||
      (isFullHDEnabled && this.enabledServiceTomsId.includes(TOMS_IDS.HD_ARCHIVE))
    ) {
      this.onInfo({ message: MESSAGES.WARNING_FULLHD_AND_HD_ARCHIVE })
      this.$set(this, 'videoQualityValue', prevValue)
    } else {
      if (!this.isModificationInProgress) {
        this.switchFunctionality(
          isFullHDEnabled,
          TOMS_IDS.FULLHD
        )
      } else {
        this.onInfo({ message: MESSAGES.MIP_MESSAGE })
        this.$set(this, 'videoQualityValue', prevValue)
      }
    }
  }

  onPTZInput (value: boolean) {
    this.switchFunctionality(value, TOMS_IDS.PTZ)
  }

  onSoundRecordInput (value: boolean) {
    this.switchFunctionality(value, TOMS_IDS.SOUND_RECORD)
  }

  onVideoArchiveInput (value: any) {
    if (this.isModificationInProgress) {
      this.onInfo({ message: MESSAGES.MIP_MESSAGE })
      return
    }

    const valueIndex = this.videoArchiveValueList?.indexOf(value) || 0

    this.currentServiceTomsId = this.currentVideoArchiveTomsId
    this.currentValue = value
    const serviceName = this.getServiceNameByTomsId(this.currentVideoArchiveTomsId)

    const isDisabling = value === MESSAGES.DISABLE
    this.orderData = {
      locationId: this.location.id,
      bpi: this.bf.id,
      marketId: this.camera.market.id,
      tomsId: this.isFHDEnabled ? TOMS_IDS.FULLHD_ARCHIVE : TOMS_IDS.HD_ARCHIVE,
      offer: isDisabling ? '' : 'cctv',
      title: isDisabling
        ? `???? ??????????????, ?????? ???????????? ?????????????????? ??${serviceName}???`
        : `???? ??????????????, ?????? ???????????? ???????????????????? ??${serviceName}???`,
      chars: {
        ...this.videoArchiveOfferList?.[valueIndex].chars,
        [CHARS.NAME_IN_INVOICE]: `???????????????????? ?????????????? ?????????????????????? ${this.videoQualityValue.value}`
      }
    }

    if (isDisabling) {
      this.disableService(this.currentVideoArchiveTomsId, false)
    } else {
      this.checkFunds(+this.currentServicePrice)
        .then(() => {
          this.enableService(this.currentVideoArchiveTomsId, value)
        })
    }
  }

  onArchiveRecordInput (archiveRecord: iArchiveRecordValue) {
    this.switchFunctionality(true, archiveRecord.tomsId)
  }

  onPlay () {
    // TODO: ???????????????? ?????????????? ???? ???????? ???????????????? ?????????? ?????????? ???????????? ????????????
    logInfo('watch camera stream')
  }

  onInputAnalyticItem (...data: any) {
    this.switchFunctionality(data[0], data[1])
  }

  onCancelOrder () {
    this.isOrderMode = false
    this.serviceStatuses[this.currentServiceTomsId] = !this.serviceStatuses[this.currentServiceTomsId]
    this.isDeviceRenameMode = false
    this.currentServiceTomsId = ''
    this.setState('loading')
    this.$store.dispatch('salesOrder/cancel').then(() => {
      this.reloadCameraData()
    })
  }

  onCancelOrderWithoutCancel () {
    this.isOrderMode = false
    this.serviceStatuses[this.currentServiceTomsId] = !this.serviceStatuses[this.currentServiceTomsId]
    this.isDeviceRenameMode = false
    this.currentServiceTomsId = ''
    this.setState('loading')
    this.reloadCameraData()
  }

  onCancelRequest () {
    this.serviceStatuses[this.currentServiceTomsId] = !this.serviceStatuses[this.currentServiceTomsId]
    this.currentServiceTomsId = ''
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
        this.currentServiceTomsId = ''
      })
  }

  onCloseError () {
    this.errorMessage = ''
    this.setState('ready')
    this.serviceStatuses[this.currentServiceTomsId] = !this.serviceStatuses[this.currentServiceTomsId]
    this.currentServiceTomsId = ''
  }

  showError (message: string) {
    this.errorMessage = message
    this.setState('error')
  }

  onCloseSuccess () {
    this.reloadCameraData()
    this.currentServiceTomsId = ''
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

  getAnalyticItemIcon (tomsId: string) {
    return VIDEO_ANALYTICS[tomsId]?.iconName
  }

  updateKeyPlease () {
    return parseInt(Math.random() * 999, 10)
  }

  onInfoClose () {
    this.isInfoMode = false
  }

  onCloseAvailableFundsModal () {
    this.setState('ready')
    this.serviceStatuses[this.currentServiceTomsId] = !this.serviceStatuses[this.currentServiceTomsId]
    this.currentServiceTomsId = ''
  }

  get customerProduct () {
    let customerProduct = {
      tlo: {
        offer: {
          originalName: '?????????????? ??????????????????'
        },
        purchasedPrices: {
          recurrentTotal: {
            value: this.baseCost,
            currency: {
              currencyCode: this.camera?.purchasedPrices?.recurrentTotal?.currency?.currencyCode
            }
          }
        }
      },
      slo: [{
        activated: true,
        originalName: '?????????????????? ????????????',
        purchasedPrices: {
          recurrentTotal: {
            value: this.rentPay,
            currency: {
              currencyCode: this.camera?.purchasedPrices?.recurrentTotal?.currency?.currencyCode
            }
          }
        }
      }]
    }

    Object.values(this.bf.services || {}).forEach(service => customerProduct.slo.push({
      activated: true,
      originalName: service.chars?.['?????? ?? ??????????'],
      purchasedPrices: {
        recurrentTotal: {
          value: service.purchasedPrices?.recurrentTotal?.value,
          currency: {
            currencyCode: this.camera?.purchasedPrices?.recurrentTotal?.currency?.currencyCode
          }
        }
      }
    }))

    return customerProduct
  }

  isLoadingCustomerProduct = true
}
