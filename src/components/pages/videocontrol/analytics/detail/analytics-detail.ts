import { Vue, Component } from 'vue-property-decorator'
import { mapState, mapGetters } from 'vuex'
import { logInfo } from '@/functions/logging'

import ErPromo from '@/components/blocks/ErPromo/index.vue'
import AddonConfig from '../components/AddonConfig/index.vue'
import AddonDescription from '../components/AddonDescription/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

import { ILocationOfferInfo } from '@/tbapi'
import {
  IDomainRegistry,
  ICamera,
  IBaseFunctionality,
  TBaseFunctionalityId
} from '@/interfaces/videocontrol'

import { ANALYTIC_NAME, SERVICE_ORDER_MAP } from '@/constants/videocontrol'
import VIDEO_ANALYTICS from '@/constants/videoanalytics'

import { promisedStoreValue } from '@/functions/store_utils'

import SERVICE_DESCRIPTION_DATA from './serviceDescriptionData'

const components = {
  AddonConfig,
  AddonDescription,
  ErPromo,
  ErPlugProduct
}

const props = {
  code: String
}

const computed = {
  ...mapState({
    pointList: (state: any) => state.videocontrol.points,
    domainRegistry: (state: any) => state.videocontrol.domainRegistry,
    isDomainsLoaded: (state: any) => state.videocontrol.isDomainRegistryLoaded
  }),
  ...mapGetters({
    allBaseFunctionality: 'videocontrol/allBaseFunctionality',
    allCameraList: 'videocontrol/allCameraList',
    bfById: 'videocontrol/bfById'
  })
}

@Component({ components, props, computed })
export default class VCAddonDetailPage extends Vue {
  /* === mapState === */
  pointList!: ILocationOfferInfo[]
  domainRegistry!: IDomainRegistry
  isDomainsLoaded!: boolean

  /* === mapGetters === */
  allBaseFunctionality!: IBaseFunctionality[]
  allCameraList!: ICamera[]
  bfById!: (id: string) => IBaseFunctionality

  /* === config === */
  isOrderModalVisible: boolean = false
  isLoaded: boolean = false
  // TODO: убрать после решения по разделу видеоаналитики (проблема слишком долгой загрузки данных)
  isLoadedX: boolean = false

  isManagerRequest: boolean = false
  requestData = {}
  orderData = {}

  isPromoOpened = false
  oldTotalPrice = 820

  analyticItem!: any

  get coverPath () {
    const imageName = VIDEO_ANALYTICS[this.$props.code].cover || 'no_cover.jpg'
    return `/videocontrol/${imageName}`
  }

  get locationList () {
    function isUniquePoint (
      el: ILocationOfferInfo,
      idx: number,
      self: ILocationOfferInfo[]
    ) {
      return self.map(el => el.id).indexOf(el.id) === idx
    }

    const isVCPoint = (el: ILocationOfferInfo) => el.offer.name === 'Видеоконтроль'

    return this.pointList
      .filter(isVCPoint)
      .filter(isUniquePoint)
  }

  get price () {
    return this.analyticItem?.prices[0].amount || '0'
  }

  get totalPrice () {
    const enabledCameraList = this.allCameraList
      .filter((el: ICamera) => this.isCameraWithService(el.parentId))

    return enabledCameraList.length * parseFloat(this.price)
  }

  get name () {
    return this.analyticItem?.name || ''
  }

  get advantages () {
    return SERVICE_DESCRIPTION_DATA[this.$props.code]
  }

  /*
    ID первой попавшейся базовой функциональности
    для получения доступной видеоаналитики
  */
  get bfOfferId () {
    return this.allBaseFunctionality[0].offer.id // '2546'
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

  getFirstOfObject (obj: any): any {
    return Object.values(obj)?.[0]
  }

  mounted () {
    this.analyticItem = { name: '' }

    promisedStoreValue(this.$store, 'videocontrol', 'isDomainRegistryLoaded')
      .then(() => {
        if (this.bfOfferId) {
          this.fetchAllowedOfferList(this.bfOfferId)
            .then(data => {
              const offeringRel = data?.[0]?.offeringRelationships
              const availOfferingList = offeringRel
                .find((el: any) => el.name === ANALYTIC_NAME)?.offerings

              const filteredList = availOfferingList
                ?.find((el:any) => el.code === this.$props.code)

              this.analyticItem = filteredList || {}
              this.isLoaded = true
            })
        }
      })
  }

  getPointCameraList (locationId: string): ICamera[] {
    return this.allCameraList.filter((el: ICamera) => el.locationId === locationId)
  }

  onPlugAddonToCamera (value: {
    id: string,
    parentId: TBaseFunctionalityId,
    addressId: string,
    value: Boolean,
    locationId: string,
    locationName: string
  }) {
    const code = this.$props.code

    this.isManagerRequest = !SERVICE_ORDER_MAP[code]

    this.requestData = {
      descriptionModal: 'Для подключения необходимо сформировать заявку',
      addressId: value.addressId,
      services: '',
      fulladdress: value.locationName
    }

    this.orderData = {
      locationId: value.locationId,
      bpi: value.parentId,
      productCode: this.$props.code,
      offer: true,
      title: `Вы уверены, что хотите подключить «${this.name}»?`
    }

    if (SERVICE_ORDER_MAP[code]) {
      logInfo('Order', code, value, this.orderData, this.requestData)
    } else {
      logInfo('Request', code, value, this.orderData, this.requestData)
    }

    this.isOrderModalVisible = true
  }

  isCameraWithService (id: TBaseFunctionalityId) {
    const bf = this.bfById(id)

    return bf?.services ? !!Object.values(bf?.services)?.find(
      (el: any) => {
        return el.offer.code === this.$props.code
      }
    ) : false
  }
}
