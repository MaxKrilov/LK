import { Component, Vue, Watch } from 'vue-property-decorator'
import ProductItem from '@/components/pages/videocontrol/components/ProductItem/index.vue'
import { IRequestData } from '@/constants/er-plug'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { ILocationOfferInfo } from '@/tbapi'
import {
  ARCHIVE_DEPTH_LIST,
  OWNERSHIP_TYPE_LIST,
  PLACEMENT,
  RECORD_TYPE_LIST,
  STREAM_RESOLUTION_LIST
} from '@/components/pages/videocontrol/AddCameraPage/labels'
import { mapGetters } from 'vuex'
import { IOffer, IBaseFunctionality, ICamera } from '@/interfaces/videocontrol'
import VIDEO_ANALYTICS from '@/constants/videoanalytics'

const props = {
  id: String
}
const components = {
  ProductItem,
  ErPlugProduct
}

const computed = {
  ...mapGetters({
    availableAnalyticListByBFOId: 'videocontrol/availableAnalyticListByBFOId',
    bfById: 'videocontrol/bfById',
    cameraById: 'videocontrol/cameraById'
  })
}

const isNotEmptyString = (el: string) => !!el

interface IOfferingRelationships {
  id: string;
  offeringRelationships: IProductOffering[]
  tomsId: string;
}

interface IProductOffering {
  id: string;
  childProductOffering?: IRelationships
  name: string;
}

interface IRelationships {
  code: string;
  id: string;
  offeringRelationships: IOfferings[];
  originalName: string;
  prices: IPrice;
  tomsId: string
}

interface IPrice {
  amount: string;
  endDate?: string;
  id: string;
  productOfferingIds: string[];
  startDate: string;
  tax: string;
  type: string;
  chars: Record<string, string>;
}

interface IOfferings {
  id: string;
  name: string;
  offerings: IOfferingsParams[];

}

interface IOfferingsParams {
  code: string;
  id: string;
  name: string;
  originalName: string;
  prices: IPrice[];
  tomsId : string;
}

interface IBaseCost {
  archiveRecordingModeCost: number;
  streamResolutionCost: number
}

interface IAdditionalCost {
  audioRecordingCost: number;
  swivelModuleCost: number;
}

@Component({ props, components, computed })
export default class AddCameraPage extends Vue {
  totalPrice: string = '1024'
  baseCost: number = 720
  baseCostComponents: IBaseCost = {
    archiveRecordingModeCost: 0,
    streamResolutionCost: 0
  }
  analyticServicesTotalCost: number = 0
  /* Меняется в зависимости от состояния чекбоксов в дополнительных сервисах */
  additionalServicesComponents: IAdditionalCost = {
    audioRecordingCost: 0,
    swivelModuleCost: 0
  }
  audioRecordingCost = 0;
  swivelModuleCost = 0
  additionalServicesCost = 0
  typeOfOwnershipCost: number = 0
  archiveRecordingModeCost: number = 0
  rentPayment: number = 233.9
  placement: number = 1
  location: string = ''
  countOfCameras: number = 1
  ownershipType: number = 1
  isPTZEnabled: boolean = false
  soundRecord: boolean = false
  recordType: number = 1
  streamResolution: number = 1
  streamResolutionPrices:IPrice[] = []
  archiveDepth: number = 1
  allProductSlo: IOfferingRelationships[]= []
  availableAnalyticsList: IOfferingsParams[] = []
  isAnalyticsLoaded: boolean = false;
  /* string - code, boolean - status */
  analyticServiceStatuses: Record<string, boolean> = {}
  /* string - code, string - price */
  analyticServicePrices: Record<string, string> = {}
  offeringRelationships: IOfferings[] = []
  selectedAnalyticsServices: string[] = []
  requiredRule = [
    (v: any) => !!v || 'Поле обязательно к заполнению'
  ]

  isRequestModalVisible: boolean = false

  /* === mapGetters === */
  availableAnalyticListByBFOId!: (BFOfferId: string) => IOffer[]
  bfById!: (id: string) => IBaseFunctionality
  cameraById!: (id: string) => ICamera

  get pointList (): ILocationOfferInfo[] {
    return this.$store.getters['videocontrol/uniqPointList']
  }

  get placementItems () {
    return PLACEMENT
  }

  get ownershipTypeList () {
    return OWNERSHIP_TYPE_LIST
  }

  get recordTypeList () {
    return RECORD_TYPE_LIST
  }

  get streamResolutionList () {
    return STREAM_RESOLUTION_LIST
  }

  get archiveDepthList () {
    return ARCHIVE_DEPTH_LIST
  }

  get addressList () {
    return this.pointList.map(el => {
      return {
        value: el.id,
        text: el.fulladdress
      }
    })
  }

  get currentPlacementLabel () {
    return this.placementItems
      .find(el => el.value === this.placement)?.text
  }

  get currentArchiveDepthLabel () {
    return 'Глубина видеоархива: ' + this.archiveDepthList
      .find(el => el.value === this.archiveDepth)?.text
  }

  get currentResolution () {
    return 'Разрешение видеопотока: ' + this.streamResolutionList
      .find(el => el.value === this.streamResolution)?.text
  }

  get currentOwnershipLabel () {
    return this.ownershipTypeList
      .find(el => el.value === this.ownershipType)?.text
  }

  get currentRecordTypeLabel () {
    return 'Режим записи: ' + this.recordTypeList
      .find(el => el.value === this.recordType)?.text
  }

  get currentPoint () {
    return this.pointList.find(el => el.id === this.location)
  }

  get currentAddressId () {
    return this.currentPoint?.address?.id || ''
  }

  get currentFulladdress (): string {
    return this.currentPoint?.fulladdress || ''
  }

  get charList () {
    const chars = [
      this.soundRecord ? 'Запись звука' : '',
      this.isPTZEnabled ? 'Поворотный модуль' : '',
      this.currentRecordTypeLabel,
      this.currentResolution,
      this.currentArchiveDepthLabel
    ]

    return chars.filter(isNotEmptyString).join(', \n')
  }

  get selectedAnalyticsServicesList () {
    let selectedAnalyticsServices = this.selectedAnalyticsServices.length > 0 ? this.selectedAnalyticsServices : ['']
    return selectedAnalyticsServices.filter(isNotEmptyString).join(', \n')
  }

  get requestData (): IRequestData {
    const services = `Подключение камеры.
Форма собственности: ${this.currentOwnershipLabel},

Характеристики: 
${this.charList},

Сервисы аналитики:
${this.selectedAnalyticsServicesList.length ? this.selectedAnalyticsServicesList : 'не выбраны'},

Количество камер: ${this.countOfCameras},

Итого: ${this.totalPrice} ₽/месяц,

Размещение: ${this.currentPlacementLabel}
`

    return {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      services,
      type: 'connect',
      addressId: this.currentAddressId.toString(),
      fulladdress: this.currentFulladdress
    }
  }

  validateFormData () {
    return !!this.location.length
  }

  onAddCamera () {
    // заявка на менеджера
    const isFormValid = this.validateFormData()

    if (isFormValid) {
      this.isRequestModalVisible = true
    }
  }

  updateKeyPlease () {
    return parseInt(Math.random() * 999, 10)
  }

  getAnalyticItemIcon (code: string) {
    return VIDEO_ANALYTICS[code]?.iconName
  }

  onInputAnalyticItem (code: string, value: boolean) {
    Vue.set(this.analyticServiceStatuses, code, value)

    const analyticsService = this.availableAnalyticsList.find(item => item.code === code)

    if (analyticsService) {
      if (value) {
        this.selectedAnalyticsServices.push(analyticsService.originalName)
      } else {
        const index = this.selectedAnalyticsServices.findIndex(item => item === analyticsService.originalName)
        this.selectedAnalyticsServices.splice(index, 1)
      }
    }

    this.calculateAnalyticServicesTotalCost()
  }

  calculateAnalyticServicesTotalCost () {
    this.analyticServicesTotalCost = 0
    Object.entries(this.analyticServiceStatuses).forEach(item => {
      if (item[1]) {
        this.analyticServicesTotalCost += +this.analyticServicePrices[item[0]]
      }
    })

    this.calculateTotalPrice()
  }

  calculateBaseCost () {
    this.baseCost = 720 + Object.values(this.baseCostComponents).reduce((sum, current) => sum + current, 0)
  }

  calculateTotalPrice () {
    this.totalPrice = String((this.rentPayment + this.baseCost + this.additionalServicesComponents.audioRecordingCost +
      this.additionalServicesComponents.swivelModuleCost + this.analyticServicesTotalCost) * this.countOfCameras)
  }

  @Watch('ownershipType')
  onOwnershipTypeValueChange (val: number) {
    if (val === 1) {
      this.rentPayment = 233.9
    } else {
      this.rentPayment = 0
    }

    this.calculateTotalPrice()
  }

  @Watch('baseCostComponents.typeOfOwnershipCost')
  onTypeOfOwnershipCostValueChange () {
    this.calculateBaseCost()
    this.calculateTotalPrice()
  }

  @Watch('recordType')
  onRecordTypeValueChange (val: number) {
    const offerings = this.offeringRelationships?.find(item => item.name === 'Базовая функциональность видеоконтроля к Тип записи')?.offerings
    const prices = offerings?.find(item => item.tomsId === '310000013')?.prices
    const amount = prices?.find(item => item.type === 'Monthly Fee')?.amount
    if (val === 1) {
      this.baseCostComponents.archiveRecordingModeCost = 0
    } else {
      if (amount) {
        this.baseCostComponents.archiveRecordingModeCost = +amount
      }
    }
  }

  @Watch('baseCostComponents.archiveRecordingModeCost')
  onArchiveRecordingModeCostValueChange () {
    this.calculateBaseCost()
    this.calculateTotalPrice()
  }

  @Watch('countOfCameras')
  onCountOfCamerasValueChange () {
    this.calculateTotalPrice()
  }

  @Watch('streamResolution')
  onStreamResolutionValueChange (val: number) {
    const offerings = this.offeringRelationships?.find(item => item.name === 'Базовая функциональность видеоконтроля к Дополнительные услуги Видеоконтроль')?.offerings

    if (val === 1) {
      const prices = offerings?.find(item => item.tomsId === '310100003')?.prices
      if (prices) {
        this.streamResolutionPrices = prices
      }
    } else {
      const prices = offerings?.find(item => item.tomsId === '310100004')?.prices
      if (prices) {
        this.streamResolutionPrices = prices
      }
    }

    this.onArchiveDepthValueChange(this.archiveDepth)
  }

  @Watch('soundRecord')
  onSoundRecordValueChange (val: boolean) {
    this.additionalServicesComponents.audioRecordingCost = val ? this.audioRecordingCost : 0
    this.calculateTotalPrice()
  }

  @Watch('isPTZEnabled')
  onIsPTZEnabledValueChange (val: boolean) {
    this.additionalServicesComponents.swivelModuleCost = val ? this.swivelModuleCost : 0
    this.calculateTotalPrice()
  }

  @Watch('archiveDepth')
  onArchiveDepthValueChange (val:number) {
    let numberOfDays:string = '3'

    switch (val) {
      case 1:
        numberOfDays = '3'
        break
      case 2:
        numberOfDays = '7'
        break
      case 3:
        numberOfDays = '10'
        break
      case 4:
        numberOfDays = '14'
        break
      case 5:
        numberOfDays = '30'
        break
    }

    if (numberOfDays === '3') {
      this.baseCostComponents.streamResolutionCost = 0
    } else {
      const amount = this.streamResolutionPrices.find(item => item?.chars['Количество дней архива'] === numberOfDays)?.amount
      if (amount) {
        this.baseCostComponents.streamResolutionCost = +amount
      }
    }
  }

  @Watch('baseCostComponents.streamResolutionCost')
  onstreamResolutionCostValueChange () {
    this.calculateBaseCost()
    this.calculateTotalPrice()
  }

  mounted () {
    this.$store.dispatch('videocontrol/getAllProductSlo', '310000004')
      .then((response:IOfferingRelationships[]) => {
        this.allProductSlo = response

        const offeringRelationships = this.allProductSlo.find(item => item.tomsId === '310000004')?.offeringRelationships

        const childProductOffering = offeringRelationships?.find(item => item.name === 'Видеоконтроль to Базовая функциональность видеоконтроля')?.childProductOffering

        const childProductOfferingRelationships = childProductOffering?.offeringRelationships

        if (childProductOfferingRelationships) {
          this.offeringRelationships = childProductOfferingRelationships
        }

        const additionalServicesOfferings = childProductOfferingRelationships?.find(item => item.name === 'Базовая функциональность видеоконтроля к Дополнительные услуги Видеоконтроль')?.offerings

        if (additionalServicesOfferings) {
          const prices = additionalServicesOfferings?.find(item => item.tomsId === '310100003')?.prices
          if (prices) {
            this.streamResolutionPrices = prices
          }

          const audioRecordingPrices = additionalServicesOfferings?.find(item => item.tomsId === '310000008')?.prices
          const audioRecordingAmount = audioRecordingPrices?.find(item => item.type === 'Monthly Fee')?.amount
          if (audioRecordingAmount) {
            this.audioRecordingCost = +audioRecordingAmount
          }

          const swivelModulePrices = additionalServicesOfferings?.find(item => item.tomsId === '310000009')?.prices
          const swivelModuleAmount = swivelModulePrices?.find(item => item.type === 'Monthly Fee')?.amount
          if (swivelModuleAmount) {
            this.swivelModuleCost = +swivelModuleAmount
          }
        }

        const analyticsOfferings = childProductOfferingRelationships?.find(item => item.name === 'Базовая функциональность видеоконтроля к Сервисы видеоаналитики')?.offerings

        if (analyticsOfferings) {
          this.isAnalyticsLoaded = true
          this.availableAnalyticsList = analyticsOfferings
          this.availableAnalyticsList.forEach(item => {
            Vue.set(this.analyticServiceStatuses, item.code, false)
            const price = item.prices?.find(item => item.type === 'Monthly Fee')?.amount
            if (price) {
              this.analyticServicePrices[item.code] = price
            }
          })

          this.calculateTotalPrice()
        }
      })
  }
}
