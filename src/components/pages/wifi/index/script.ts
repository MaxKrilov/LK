import Vue from 'vue'
import Component from 'vue-class-component'
import { latLng, icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import ServicesComponent from '../blocks/services/index.vue'
import { IAddressUnit, ICustomerProduct, ILocationOfferInfo } from '@/tbapi'
import moment from 'moment'
import { SERVICE_URLS } from '@/constants/url'
import { WIFIANALYTICS, WIFIKONTFIL, SERVICES_AUTH, WIFIDESIGNOPT } from '@/components/pages/wifi/index/constants'
import ErBundleInfo from '@/components/blocks/ErBundleInfo/index.vue'
import { STATUS_SUSPENDED } from '@/constants/status'
import WifiDeviceComponent from '../blocks/WifiDeviceComponent/index.vue'
import { DEVICES } from '@/constants/wifi'
import ErActivationModal from '@/components/blocks/ErActivationModal//index.vue'

const MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const CHAR_SPEED = 'Скорость, до (Мбит/с)'
const CHAR_INSTITUTION_NAME = 'Название заведения'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EARTH_RADIUS = 6372795
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EQUATOR_LENGTH = 40075.696

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deg2rad = (deg: number) => deg * Math.PI / 180

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof WifiIndexPage>>({
  props: {
    listPoint: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    ErBundleInfo,
    ServicesComponent,
    WifiDeviceComponent,
    ErActivationModal
  },
  watch: {
    listPoint (val: ILocationOfferInfo[]) {
      this.getListAddressUnit(
        val.map(item => item.address.id as string)
      )
    }
  }
})
export default class WifiIndexPage extends Vue {
  readonly DEVICES:string[] = DEVICES
  // Props
  readonly listPoint!: ILocationOfferInfo[]

  // Data
  // mapZoom = 13
  mapOptions = {
    zoomSnap: 0.5
  }
  mapAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  mapUrl = MAP_URL
  mapIcon = icon({
    iconUrl: require('@/assets/images/geo_icon.svg'),
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  })
  mapPopupOptions: Record<string, string> = {
    className: 'wifi-index-page__map-popup',
    maxWidth: '268'
  }
  listCustomerProduct: Map<string, ICustomerProduct | null> = new Map()
  listAddressUnit: IAddressUnit[] = []
  tracker = 1
  isRecovering: boolean = false
  isShowResumeModal: boolean = false
  isShowErrorModal: boolean = false
  isSendingOrderResume: boolean = false
  isShowSuccessModal: boolean = false
  isLoadingList:Record<string, boolean> = {}

  // Computed
  get isErrorClient () {
    const countAdresses = this.listAddressUnit.length

    let isError = false
    for (let i = 0; i < countAdresses; i++) {
      if (!this.listAddressUnit[i].hasOwnProperty('latitude') ||
        !this.listAddressUnit[i].hasOwnProperty('longitude')) {
        isError = true
        break
      }
    }

    return isError
  }

  get mapCenter () {
    const countAdresses = this.listAddressUnit.length

    if (countAdresses === 1) {
      return latLng(
        Number(this.listAddressUnit[0]?.latitude || 0),
        Number(this.listAddressUnit[0]?.longitude || 0)
      )
    }

    if (countAdresses === 2) {
      return latLng(
        (Number(this.listAddressUnit[0].latitude) + Number(this.listAddressUnit[1].latitude)) / 2,
        (Number(this.listAddressUnit[0].longitude) + Number(this.listAddressUnit[1].longitude)) / 2
      )
    }

    let A = 0

    const getCoordinates = (i: number) => {
      const xI = Number(this.listAddressUnit[i].longitude)
      const yI = Number(this.listAddressUnit[i].latitude)
      const xI1 = this.listAddressUnit[i + 1]
        ? Number(this.listAddressUnit[i + 1].longitude)
        : Number(this.listAddressUnit[0].longitude)
      const yI1 = this.listAddressUnit[i + 1]
        ? Number(this.listAddressUnit[i + 1].latitude)
        : Number(this.listAddressUnit[0].latitude)

      return { xI, yI, xI1, yI1 }
    }

    for (let i = 0, length = this.listAddressUnit.length; i < length; i++) {
      const { xI, yI, xI1, yI1 } = getCoordinates(i)
      A += (xI * yI1 - xI1 * yI)
    }

    A = A / 2

    let GX = 0
    let GY = 0

    for (let i = 0, length = this.listAddressUnit.length; i < length; i++) {
      const { xI, yI, xI1, yI1 } = getCoordinates(i)
      const diff = (xI * yI1 - xI1 * yI)
      GX += ((xI + xI1) * diff)
      GY += ((yI + yI1) * diff)
    }

    GX = GX / 6 / A
    GY = GY / 6 / A

    return A > 0 ? latLng(GY, GX) : latLng(0, 0)
  }

  get mapZoom () {
    return 13
    // todo Вернуть после разбора (возвращается Infinite)
    // if (this.listAddressUnit.length === 0) {
    //   return 1
    // }
    // const minLatitude = deg2rad(Math.min(...this.listAddressUnit.map(addressUnit => Number(addressUnit.latitude))))
    // const maxLatitude = deg2rad(Math.max(...this.listAddressUnit.map(addressUnit => Number(addressUnit.latitude))))
    // const minLongitude = deg2rad(Math.min(...this.listAddressUnit.map(addressUnit => Number(addressUnit.longitude))))
    // const maxLongitude = deg2rad(Math.max(...this.listAddressUnit.map(addressUnit => Number(addressUnit.longitude))))
    //
    // const cosLatitude1 = Math.cos(minLatitude)
    // const cosLatitude2 = Math.cos(maxLatitude)
    // const sinLatitude1 = Math.sin(minLatitude)
    // const sinLatitude2 = Math.sin(maxLatitude)
    //
    // const delta = maxLongitude - minLongitude
    // const cosDelta = Math.cos(delta)
    // const sinDelta = Math.sin(delta)
    //
    // const y = Math.sqrt(
    //   Math.pow(cosLatitude2 * sinDelta, 2) +
    //   Math.pow(cosLatitude1 * sinLatitude2 - sinLatitude1 * cosLatitude2 * cosDelta, 2)
    // )
    // const x = sinLatitude1 * sinLatitude2 + cosLatitude1 * cosLatitude2 * cosDelta
    // const ad = Math.atan2(y, x)
    // const dist = ad * EARTH_RADIUS / 1000
    //
    // return Math.floor(Math.log(EQUATOR_LENGTH / dist) / Math.log(2))
  }

  get getSpeed () {
    return (id: string) => this.tracker
      ? (this.listCustomerProduct.get(id)?.tlo.chars[CHAR_SPEED])
      : null
  }

  get isOnAnalytic () {
    return (id: string) => this.tracker
      ? this.listCustomerProduct.get(id)?.slo.find(slo => slo.code === WIFIANALYTICS)?.status === 'Active'
      : false
  }

  get isOnPersonalisation () {
    return (id: string) => this.tracker
      ? this.listCustomerProduct.get(id)?.slo.find(slo => slo.code === WIFIDESIGNOPT)?.status === 'Active'
      : false
  }

  get isOnContent () {
    return (id: string) => this.tracker
      ? this.listCustomerProduct.get(id)?.slo.find(slo => slo.code === WIFIKONTFIL)?.status === 'Active'
      : false
  }

  get countOfActiveAuthService () {
    return (id: string) => this.tracker
      ? this.listCustomerProduct.get(id)?.slo.reduce((acc: number, slo) => {
        acc += (SERVICES_AUTH.includes(slo.code) && slo.status === 'Active' ? 1 : 0)
        return acc
      }, 0)
      : 0
  }

  get countOfAuthService () {
    return (id: string) => this.tracker
      ? this.listCustomerProduct.get(id)?.slo.reduce((acc: number, slo) => {
        acc += (SERVICES_AUTH.includes(slo.code) ? 1 : 0)
        return acc
      }, 0)
      : 0
  }

  get actualStartDate () {
    return (id: string) => this.tracker
      ? moment(this.listCustomerProduct.get(id)?.tlo.actualStartDate).format('DD.MM.YYYY')
      : null
  }

  get countListPoint () {
    return this.listAddressUnit.length
  }

  get institutionName () {
    return (id: string) => {
      return this.tracker
        ? (this.listCustomerProduct.get(id)?.tlo.chars[CHAR_INSTITUTION_NAME])
        : null
    }
  }

  get issetCustomerProduct () {
    return (id: string) => {
      return this.tracker
        ? this.listCustomerProduct.has(id)
        : false
    }
  }

  get isOnServiceAuth () {
    return (id: string) => this.tracker
      ? (this.countOfActiveAuthService(id)! > 0)
      : false
  }

  get getStatusSuspended () {
    return STATUS_SUSPENDED
  }

  get isStopped () {
    return (id: string) => {
      return this.tracker && this.listCustomerProduct.get(id)?.tlo.status === STATUS_SUSPENDED
    }
  }

  // Methods
  getCustomerProductById (id: string, marketId: string) {
    Vue.set(this.isLoadingList, id, true)
    const customerProduct = this.listCustomerProduct.get(id)

    if (customerProduct != null) {
      Vue.set(this.isLoadingList, id, false)
      return
    }
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: id,
      marketId
    })
      .then(answer => {
        Vue.set(this.isLoadingList, id, false)
        this.listCustomerProduct.set(id, answer)
        this.tracker++
      })
  }

  getListAddressUnit (ids: string[]) {
    this.$store.dispatch('address/getAddressUnit', {
      ids
    })
      .then(response => { this.listAddressUnit = response })
  }

  latLng (latitude: number, longitude: number, altitude?: number) {
    return latLng(latitude, longitude, altitude)
  }

  getPointInfoByAddressUnit (addressUnitId: string) {
    return this.listPoint.find(point => point.address.id === addressUnitId)
  }

  getBPIByAddressUnit (addressUnitId: string) {
    return this.getPointInfoByAddressUnit(addressUnitId)!.bpi
  }

  openPopup (addressUnitId: string) {
    const pointInfo = this.getPointInfoByAddressUnit(addressUnitId)
    if (!pointInfo || this.listCustomerProduct.has(pointInfo.bpi as string)) return
    this.getCustomerProductById(pointInfo.bpi as string, pointInfo.marketId)
  }

  openNextPopup (index: number) {
    (this.$refs as any)[`popup__${index + 1}`][0].mapObject.openPopup()
  }

  openPrevPopup (index: number) {
    (this.$refs as any)[`popup__${index - 1}`][0].mapObject.openPopup()
  }

  onClickPlug () {
    window.open(SERVICE_URLS.WIFI_HOT_SPOT)
  }

  recover (point: ILocationOfferInfo) {
    this.isRecovering = true
    const customerProduct = this.listCustomerProduct.get(point.bpi as string)

    this.$store.dispatch('salesOrder/createResumeOrder',
      {
        locationId: customerProduct?.tlo.locationId,
        disconnectDate: '1',
        productId: customerProduct?.tlo.id,
        marketId: point.marketId
      })
      .then(() => {
        this.isShowResumeModal = true
      })
      .catch(() => {
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.isRecovering = false
      })
  }

  sendResumeOrder () {
    this.isSendingOrderResume = true

    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.isShowResumeModal = false
        this.isShowSuccessModal = true
      })
      .catch(() => {
        this.isShowResumeModal = false
        this.isShowErrorModal = true
        this.cancelOrder()
      })
      .finally(() => {
        this.isSendingOrderResume = false
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }
}
