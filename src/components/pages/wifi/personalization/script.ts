import Component, { mixins } from 'vue-class-component'

import Page, { iPageComponent } from '@/components/helpers/Page'

// Components
import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import ErtWifiPersonalizationScreen from './components/ErtWifiPersonalizationScreen/index.vue'
import ErtWifiPersonalizationSettings from './components/ErtWifiPersonalizationSettings/index.vue'
/// Dialog windows
import ErtWifiPersonalizationDialogLogo from './components/ErtWifiPersonalizationDialogLogo/index.vue'
import ErtWifiPersonalizationDialogBackground from './components/ErtWifiPersonalizationDialogBackground/index.vue'
import ErtWifiPersonalizationDialogButton from './components/ErtWifiPersonalizationDialogButton/index.vue'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErPromo from '@/components/blocks/ErPromo/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'

// Utils
import { head, cloneDeep } from 'lodash'
import { mapState, mapActions } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_LG } from '@/constants/breakpoint'
import { IAvailableFunds, IWifiResourceInfo, WifiData } from '@/tbapi'
import { HOST_WIFI_BACKEND, SLO_CODE, SLO_CODE_SOCIAL_NETWORK } from '@/components/pages/wifi/personalization/constants'
import { IButtons } from './types'
import { camelize } from '@/functions/helper2'
import { ServiceStatus, STATUS_SUSPENDED } from '@/constants/status'
import { price as priceFormatted } from '@/functions/filters'

const personalizationFutureList = require('./promo.json')

const typesButtons = ['abonent', 'guest', 'voucher', 'premium']

const defaultStyles: Record<string, string> = {
  color: 'rgb(255, 255, 255)',
  borderRadius: '24px',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.05), 0px 2px 12px rgba(0, 0, 0, 0.1)',
  borderColor: '#FF130E',
  backgroundColor: '#FF312C'
}

function parseStyles (field: string | null) {
  if (field === null) { // Возвращаем стили по умолчанию
    return defaultStyles
  }

  const result: Record<string, string> = {}
  field.split(';').forEach(style => {
    if (style) {
      const [property, value] = style.split(':')
      result[camelize(property).trim()] = value.trim()
    }
  })

  return Object.assign({}, defaultStyles, result)
}

function defineSNParams (sn: string) {
  switch (sn) {
    case 'field_social_auth_vk':
      return 514
    case 'field_social_auth_ok':
      return 515
    case 'field_social_auth_fb':
      return 516
    case 'field_social_auth_in':
      return 517
    case 'field_social_auth_tw':
      return 518
  }
}

@Component<InstanceType<typeof WifiPersonalizationPage>>({
  components: {
    ErListPoints,
    ErtWifiPersonalizationScreen,
    ErtWifiPersonalizationSettings,
    ErtWifiPersonalizationDialogLogo,
    ErtWifiPersonalizationDialogBackground,
    ErtWifiPersonalizationDialogButton,
    ErPromo,
    ErPlugProduct,
    ErDisconnectProduct,
    ErActivationModal
  },
  filters: {
    priceFormatted
  },
  computed: {
    ...mapState({
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    })
  },
  watch: {
    listPoint () {
      this.$nextTick(() => {
        this.isLoadingListPoint = false
      })
    },
    customerProduct (val) {
      val && this.$nextTick(() => {
        this.isLoadingCustomerProduct = false
      })
    },
    screenWidth (val) {
      if (val < BREAKPOINT_LG) {
        this.modelScreenOrientation = this.listScreenOrientation.find(item => item.value === 'portrait')
      }
    },
    activePoint (newVal, oldVal) {
      Page.options.watch.activePoint.call(this, newVal, oldVal)
      if (newVal && oldVal) {
        this.isLoadingCustomerProduct = true
        this.isLoadingWifiData = true
        this.isErrorLoad = false
      }
      newVal && this.getResource({ bpi: newVal.bpi })
        .then(response => {
          const vlan = head(response)!.vlan
          if (vlan && typeof head(vlan) !== 'undefined') {
            this.cityId = head(vlan)!.cityId
            this.vlan = head(vlan)!.number
          }
          if (!this.cityId || !this.vlan) return
          this.getData({ vlan: this.vlan, cityId: this.cityId })
            .then(dataResponse => {
              this.wifiData = dataResponse
              this.isLoadingWifiData = false
            })
            .catch(() => {
              this.isErrorLoad = true
              this.isLoadingCustomerProduct = false
              this.isLoadingWifiData = false
            })
        })
        .catch(() => {
          this.isErrorLoad = true
          this.isLoadingCustomerProduct = false
          this.isLoadingWifiData = false
        })
    }
  },
  methods: mapActions({
    getResource: 'wifi/getResource',
    getData: 'wifi/getData',
    getAvailableFunds: 'salesOrder/getAvailableFunds'
  })
})
export default class WifiPersonalizationPage extends mixins(Page) implements iPageComponent {
  // Options
  productType = 'Wi-Fi Hot Spot (Дом.ru)'

  // Vuex
  readonly screenWidth!: number

  // Vuex actions
  getResource!: <T = { bpi: string }, R = Promise<IWifiResourceInfo[]>>(args: T) => R
  getData!: <T = { vlan: string }, R = Promise<WifiData>>(args: T) => R
  getAvailableFunds!: <R = Promise<IAvailableFunds>>() => R

  // Data
  /// Data
  /**
   * Список ориентация экрана
   */
  listScreenOrientation = [
    { value: 'landscape', text: 'Горизонтальная', image: require('@/components/pages/wifi/personalization/images/orientations/horizontal_orientation.svg') },
    { value: 'portrait', text: 'Вертикальная', image: require('@/components/pages/wifi/personalization/images/orientations/vertical_orientation.svg') }
  ]
  /**
   * Список языков
   */
  listLanguage = [
    { value: 'RUS', text: 'Русский', image: require('@/components/pages/wifi/personalization/images/flags/RUS.svg') }
  ]

  vlan: string = ''
  cityId: string = ''

  /// Models
  modelScreenOrientation = head(this.listScreenOrientation)
  modelLanguage = head(this.listLanguage)

  /// Dialogs
  dialogLogo: boolean = false
  dialogBackground: boolean = false
  dialogButton: boolean = false

  /// Server Data
  wifiData: WifiData | null = null

  /// Internal Data
  internalLogoFile: null | File | false = null
  internalLogoBase64: null | string | false = null

  internalBackgroundImageFile: null | File | false = null
  internalBackgroundImageBase64: null | string | false = null

  internalBannerFile: null | File | false = null
  internalBannerBase64: null | string | false = null

  internalFullscreen: null | boolean = null

  internalFieldCustomBodyStyle: null | { backgroundColor: string, color: string } = null

  internalButtons: IButtons | null = null
  internalButtonStyles: Record<string, string> | null = null
  internalSocialNetworks: Record<string, number> | null = null

  /// Loading Data
  isLoadingListPoint: boolean = true
  isLoadingCustomerProduct: boolean = true
  isLoadingWifiData: boolean = true

  isErrorLoad: boolean = false

  isLoadingSetData: boolean = false
  isSuccessSetData: boolean = false
  isErrorSetData: boolean = false

  promoFeatureList: { icon: string, name: string, description: string }[] = personalizationFutureList
  isShowPlugProductPlugin: boolean = false
  isShowDisconnectProductPlugin: boolean = false

  isCheckingMoney: boolean = false
  isShowMoneyModal: boolean = false
  availableFundsAmt: number = 0

  isErrorMoney: boolean = false

  // Computed
  get isPortrait () {
    return this.modelScreenOrientation!.value === 'portrait'
  }

  get isLandscape () {
    return this.modelScreenOrientation!.value === 'landscape'
  }

  get getLogo () {
    return this.internalLogoBase64 === null
      ? this.wifiData && this.wifiData.field_logo
        ? `${HOST_WIFI_BACKEND}${this.wifiData.field_logo}`
        : false
      : this.internalLogoBase64
  }

  get getBackgroundImage () {
    return this.internalBackgroundImageBase64 === null
      ? this.wifiData && this.wifiData.field_custom_background_image
        ? `${HOST_WIFI_BACKEND}${this.wifiData.field_custom_background_image}`
        : false
      : this.internalBackgroundImageBase64
  }

  get getFieldCustomBodyStyle () {
    return this.internalFieldCustomBodyStyle === null
      ? this.wifiData
        ? {
          backgroundColor: this.wifiData.field_custom_body?.styles?.['background-color'] || '#F7F7F7',
          color: this.wifiData.field_custom_body?.styles?.['color'] || 'black'
        }
        : false
      : this.internalFieldCustomBodyStyle
  }

  get getBanner () {
    return this.internalBannerBase64 === null
      ? this.wifiData && this.wifiData.field_index_banner
        ? `${HOST_WIFI_BACKEND}${this.wifiData.field_index_banner}`
        : false
      : this.internalBannerBase64
  }

  get getIsFullscreen () {
    return this.internalFullscreen === null
      ? this.wifiData && this.wifiData.field_custom_fullscreen !== null
        ? this.wifiData.field_custom_fullscreen
        : false
      : this.internalFullscreen
  }

  get getServerButtons () {
    const result: IButtons = {
      abonent: { auth: 0, title: '' },
      guest: { auth: 0, title: '' },
      voucher: { auth: 0, title: '' },
      premium: { auth: 0, title: '' }
    }

    if (this.wifiData === null) return result

    typesButtons.forEach(type => {
      result[type as keyof IButtons] = {
        auth: (this.wifiData as any)[`field_${type}_auth`],
        title: (this.wifiData as any)[`field_index_${type}_title`]
      }
    })

    return result
  }

  get getButtons () {
    return this.internalButtons === null
      ? this.getServerButtons
      : this.internalButtons
  }

  get getButtonStyles () {
    return this.internalButtonStyles === null
      ? parseStyles(this.wifiData?.field_custom_button?.style || null)
      : this.internalButtonStyles
  }

  get getServerSocialNetworks () {
    const socialNetworks: Record<string, number> = {
      field_social_auth_vk: 0,
      field_social_auth_ok: 0,
      field_social_auth_fb: 0,
      field_social_auth_in: 0,
      field_social_auth_tw: 0
    }

    if (this.wifiData === null) return socialNetworks

    for (const key in socialNetworks) {
      if (socialNetworks.hasOwnProperty(key)) {
        socialNetworks[key] = this.wifiData.hasOwnProperty(key)
          ? (this.wifiData as any)[key]
          : 0
      }
    }

    return socialNetworks
  }

  get getSocialNetworks () {
    return this.internalSocialNetworks === null
      ? this.getServerSocialNetworks
      : this.internalSocialNetworks
  }

  get isActiveProduct () {
    return this.customerProduct
      ? this.customerProduct.slo
        .find(sloItem => sloItem.code === SLO_CODE)!.status === ServiceStatus.STATUS_ACTIVE
      : false
  }

  get isStoppedProduct () {
    return this.customerProduct
      ? this.customerProduct.slo
        .find(sloItem => sloItem.code === SLO_CODE)!.status === ServiceStatus.STATUS_SUSPENDED
      : false
  }

  get isActiveSocialNetwork () {
    return this.customerProduct
      ? this.customerProduct.slo
        .find(sloItem => sloItem.code === SLO_CODE_SOCIAL_NETWORK)!.status === ServiceStatus.STATUS_ACTIVE
      : false
  }

  get getPriceForConnection () {
    return this.customerProduct && !this.isActiveProduct
      ? Number(head(this.customerProduct!.slo.find(sloItem => sloItem.code === SLO_CODE)!.prices)!.amount)
      : 0
  }

  get getOrderData () {
    return {
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      productCode: SLO_CODE,
      offer: 'wifi',
      title: 'Вы уверены, что хотите подключить услугу «Управление дизайном стартовой страницы»?',
      marketId: this.activePoint?.marketId,
      tomsId: '302000023'
    }
  }

  get getDisconnectData () {
    const productId = this.customerProduct && this.isActiveProduct
      ? this.customerProduct.slo.find(sloItem => sloItem.code === SLO_CODE)!.productId
      : ''
    return {
      bpi: this.activePoint?.bpi,
      locationId: this.activePoint?.id,
      productId,
      title: 'Вы уверены, что хотите отключить услугу «Управление дизайном стартовой страницы»?',
      marketId: this.activePoint?.marketId
    }
  }

  get statusSuspended () {
    return STATUS_SUSPENDED
  }

  // Methods
  openDialogLogo () {
    this.dialogLogo = true
  }

  openDialogBackground () {
    this.dialogBackground = true
  }

  openDialogButton () {
    this.dialogButton = true
  }

  onSaveLogo (e: { file: File | false, base64: string | false }) {
    this.internalLogoFile = e.file
    this.internalLogoBase64 = e.base64
  }

  onSaveBackground (e: Record<string, any>) {
    this.internalBackgroundImageFile = e.backgroundImageFile || (e.backgroundImageServer ? null : false)
    this.internalBackgroundImageBase64 = e.backgroundImageBase64 || (e.backgroundImageServer ? null : false)

    this.internalBannerFile = e.bannerFile || (e.bannerServer ? null : false)
    this.internalBannerBase64 = e.bannerBase64 || (e.bannerServer ? null : false)

    this.internalFullscreen = e.isFullscreen

    this.internalFieldCustomBodyStyle = {
      backgroundColor: e.backgroundColor,
      color: e.colorText
    }
  }

  onSaveButtons (e: Record<string, any>) {
    this.internalButtons = cloneDeep(e.buttons)
    this.internalButtonStyles = cloneDeep(e.buttonStyle)
    this.internalSocialNetworks = cloneDeep(e.socialNetworks)
  }

  onSave () {
    this.isLoadingSetData = true
    const data = new FormData()

    data.append('vlan', this.vlan)
    data.append('city_id', this.cityId)

    if (this.internalLogoFile) {
      data.append(`field_logo`, this.internalLogoFile)
    } else if (this.internalLogoFile === false) {
      data.append('params[field_logo]', '')
    }

    if (this.internalBackgroundImageFile) {
      data.append('field_custom_background_image', this.internalBackgroundImageFile)
    } else if (this.internalBackgroundImageFile === false) { // Происходит удаление заднего фона
      data.append('params[field_custom_background_image]', '')
    }

    if (this.internalBannerFile) {
      data.append('field_index_banner', this.internalBannerFile)
    } else if (this.internalBannerFile === false) { // Происходит удаление баннера
      data.append('params[field_index_banner]', '')
    }

    if (this.internalFullscreen !== null) {
      data.append('params[field_custom_fullscreen]', Number(this.internalFullscreen).toString())
    }

    if (this.internalFieldCustomBodyStyle) {
      data.append('params[field_custom_body][styles][background-color]', this.internalFieldCustomBodyStyle.backgroundColor)
      data.append('params[field_custom_body][styles][color]', this.internalFieldCustomBodyStyle.color)
    }

    if (this.internalButtons) {
      Object.keys(this.internalButtons).forEach(key => {
        if (this.internalButtons!.hasOwnProperty(key)) {
          data.append(`params[field_${key}_auth]`, (this.internalButtons as any)[key].auth)
          data.append(`params[field_index_${key}_title]`, (this.internalButtons as any)[key].title)
        }
      })
    }

    if (this.internalButtonStyles) {
      const styles: string[] = []
      Object.keys(this.internalButtonStyles).forEach(key => {
        if (this.internalButtonStyles!.hasOwnProperty(key)) {
          styles.push(`${key}: ${this.internalButtonStyles![key]}`)
        }
      })

      data.append('params[field_custom_button][style]', styles.join('; '))
    }

    this.$store.dispatch('wifi/setData', data)
      .then(response => {
        if (response) {
          if (this.internalSocialNetworks) {
            // Для установки социальных сетей используется другой метод
            Promise.all(Object.keys(this.internalSocialNetworks).map(sn => {
              const snData = new FormData()
              snData.append('vlan', this.vlan)
              snData.append('city_id', this.cityId)
              snData.append('params[param_id]', defineSNParams(sn)!.toString())
              snData.append('params[value]', this.internalSocialNetworks![sn].toString())
              return this.$store.dispatch('wifi/hotspotUpdate', snData)
            }))
              .then(response => {
                if (response.every(responseItem => !!responseItem)) this.isSuccessSetData = true
                else this.isErrorSetData = true
              })
          } else {
            this.isSuccessSetData = true
          }
        } else {
          this.isErrorSetData = true
        }
      })
      .catch(() => {
        this.isErrorSetData = true
      })
      .finally(() => {
        this.isLoadingSetData = false
      })
  }

  getListPoint () {
    return new Promise((resolve, reject) => {
      Page.options.methods.getListPoint.call(this)
        .then(() => {
          this.listPoint = this.listPoint.filter((point: any) => ~point.offerName.match(/hot spot/ig))

          if (this.$route.params.hasOwnProperty('bpi')) {
            this.activePoint = this.listPoint.find(point => point.bpi === this.$route.params.bpi) || null
          } else {
            this.activePoint = head(this.listPoint) || null
          }

          resolve(this.listPoint)
        })
        .catch((error: any) => {
          this.isErrorLoad = true
          this.isLoadingListPoint = false
          this.isLoadingCustomerProduct = false
          this.isLoadingWifiData = false
          reject(error)
        })
    })
  }

  onConnect () {
    this.isCheckingMoney = true
    this.getAvailableFunds()
      .then(response => {
        const availableFunds = Number(response.availableFundsAmt)
        this.availableFundsAmt = availableFunds

        if (availableFunds - this.getPriceForConnection >= 0) {
          this.isShowPlugProductPlugin = true
        } else {
          this.isShowMoneyModal = true
        }
      })
      .catch(() => {
        this.isErrorMoney = true
      })
      .finally(() => {
        this.isCheckingMoney = false
      })
  }

  onToPayment () {
    this.$router.push({
      name: 'add-funds',
      params: {
        total_amount: this.getPriceForConnection
          ? String(this.getPriceForConnection - this.availableFundsAmt)
          : '0'
      }
    })
  }

  // Hooks
  mounted () {
    if (this.screenWidth < BREAKPOINT_LG) {
      this.modelScreenOrientation = this.listScreenOrientation.find(item => item.value === 'portrait')
    }
  }
}
