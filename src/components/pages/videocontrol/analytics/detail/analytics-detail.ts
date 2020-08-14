import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import ErPromo from '@/components/blocks/ErPromo/index.vue'
import AddonConfig from '../components/AddonConfig/index.vue'
import AddonDescription from '../components/AddonDescription/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

import { IBaseFunctionality, ICamera, TBaseFunctionalityId } from '@/interfaces/videocontrol'

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
  ...mapGetters({
    allBaseFunctionality: 'videocontrol/allBaseFunctionality',
    allCameraList: 'videocontrol/allCameraList',
    bfById: 'videocontrol/bfById',
    locationList: 'videocontrol/videocontrolPoints'
  })
}

@Component({ components, props, computed })
export default class VCAddonDetailPage extends Vue {
  /* === mapGetters === */
  allBaseFunctionality!: IBaseFunctionality[]
  allCameraList!: ICamera[]
  bfById!: (id: string) => IBaseFunctionality

  /* === config === */
  isOrderModalVisible: boolean = false
  isLoaded: boolean = false
  isDiscountVisible: boolean = false

  // TODO: убрать после решения по разделу видеоаналитики (проблема слишком долгой загрузки данных)
  isLoadedX: boolean = false

  isManagerRequest: boolean = false
  requestData = {}
  orderData: Record<string, any> = {
    offer: 'cctv'
  }

  isPromoOpened = false
  oldTotalPrice = 820

  analyticItem: Record<string, any> = { name: '' }

  get coverPath () {
    const imageName = VIDEO_ANALYTICS[this.$props.code].cover || 'no_cover.jpg'
    return `/videocontrol/${imageName}`
  }

  get price () {
    return this.analyticItem?.prices?.[0].amount || '0'
  }

  get totalPrice () {
    const enabledCameraList = this.allCameraList
      .filter((el: ICamera) => this.isCameraWithService(el.parentId))

    return enabledCameraList.length * parseFloat(this.price)
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

  mounted () {
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

              this.$set(this, 'analyticItem', filteredList)
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
      offer: 'cctv',
      title: `Вы уверены, что хотите подключить «${this.analyticItem.name}»?`
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
