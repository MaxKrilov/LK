import Vue from 'vue'
import Component from 'vue-class-component'

// Components
import ErListPoint from '@/components/blocks/ErListPoints/index.vue'
import ErtRedirectionItemComponent from './components/RedirectionItem/index.vue'
import ErtRedirectionAddForm from './components/RedirectionAddForm/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

// Interfaces & helpers
import { iPointItem, transformList } from '@/components/helpers/Page'
import { API } from '@/functions/api'
import { ICustomerProduct, ICustomerProductSLO, ILocationOfferInfo } from '@/tbapi'

// Vuex
import { mapActions, mapGetters } from 'vuex'

// Helpers
import head from 'lodash/head'
import last from 'lodash/last'
import cloneDeep from 'lodash/cloneDeep'

// Constants
import { ARRAY_SHOWN_PHONES, CODE_CALLFORWRD } from '@/constants/product-code'
import { ITelephonyRedirection } from '@/interfaces/telephony'
import * as CONST from './constants'
import { STATUS_DISCONNECTED } from '@/constants/status'
// import { STATUS_ACTIVATION_IN_PROGRESS, STATUS_ACTIVE, STATUS_MODIFICATION, STATUS_PLANNED } from '@/constants/status'

// Internal helpers
const generatePeriodList = (chars: Record<string, string>) => {
  const result: Record<string, boolean> = {}
  for (const key in chars) {
    if (chars.hasOwnProperty(key) && CONST.DAYS_ARRAY.includes(key)) {
      result[key] = chars[key] === CONST.YES
    }
  }

  return result
}

@Component<InstanceType<typeof ErtTelephonyRedirection>>({
  components: {
    ErListPoint,
    ErtRedirectionItemComponent,
    ErtRedirectionAddForm,
    ErActivationModal
  },
  computed: {
    ...mapGetters({
      marketingBrandId: 'payments/getMarketingBrandId',
      activeBillingAccount: 'payments/getActiveBillingAccount'
    })
  },
  methods: {
    ...mapActions({
      locationOfferInfo: 'productnservices/locationOfferInfo',
      customerProduct: 'productnservices/customerProduct',
      listCustomerProduct: 'productnservices/customerProducts'
    })
  },
  watch: {
    activeBillingAccount (val) {
      if (val && this.activePoint) {
        this.isLoadingListPoint = true
      }
    },
    marketingBrandId (val) {
      if (val) {
        this.init()
      }
    },
    activePoint (_, oldVal) {
      oldVal !== null && this.fetchPhones()
    }
  }
})
export default class ErtTelephonyRedirection extends Vue {
  // Data
  /**
   * Список точек подключения
   * @type {Array<iPointItem>}
   */
  listPoint: iPointItem[] = []
  /**
   * Активная точка подключения
   * @type {iPointItem | null}
   */
  activePoint: iPointItem | null = null
  /**
   * Список номеров телефонов
   * @type {Array<{ id: string, phone: string }>}
   */
  listPhone: { id: string, phone: string }[] = []
  /**
   * Список переадресаций
   * @type {Array<ITelephonyRedirection>}
   */
  listRedirection: ITelephonyRedirection[] = []

  /// Vuex getters
  readonly marketingBrandId!: string | undefined
  readonly activeBillingAccount!: string | undefined

  /// Loading Data
  /**
   * Индикатор загрузки списка точек
   * @type {boolean}
   */
  isLoadingListPoint: boolean = true
  /**
   * Индикатор загрузки продуктов
   * @type {boolean}
   */
  isLoadingProducts: boolean = true

  isLoadedProductsError: boolean = false

  isRequestSuccess: boolean = false

  /// Vuex actions
  readonly locationOfferInfo!: (payload: { api: API, productType: string | string[] }) => Promise<ILocationOfferInfo[]>
  readonly customerProduct!: (payload: {
    api: API,
    parentId?: string | number,
    parentIds?: string[]
    locationId?: string | number,
    marketId?: string | number,
    code?: string
  }) => Promise<ICustomerProduct>
  readonly listCustomerProduct!: (payload: { api: API, parentIds?: Array<string | number>, code?: string }) => Promise<Record<string, ICustomerProduct>>

  // Computed
  get locationId () {
    return this.activePoint?.id || ''
  }

  get marketId () {
    return this.activePoint?.marketId || ''
  }

  // Methods
  /**
   * Получение списка точек
   * @return {Promise<void>}
   */
  fetchListPoint () {
    return new Promise(async (resolve, reject) => {
      this.isLoadingListPoint = true

      try {
        const listPointResponse = await this.locationOfferInfo({
          api: this.$api,
          productType: CONST.PRODUCT_TYPE_TELEPHONY
        })

        this.listPoint = transformList(listPointResponse)

        if (this.listPoint.length > 0) {
          this.activePoint = head(this.listPoint)!
        }

        resolve()
      } catch (e) {
        console.error(e)
        reject(e)
      } finally {
        this.isLoadingListPoint = false
      }
    })
  }

  fetchPhones () {
    return new Promise(async (resolve, reject) => {
      this.isLoadingProducts = true
      try {
        const customerProductResponse = await this.customerProduct({
          api: this.$api,
          marketId: this.activePoint!.marketId,
          parentId: String(this.activePoint!.bpi)
        })

        const listPhoneIdsWithNumber = customerProductResponse.slo.reduce((acc, item) => {
          if (ARRAY_SHOWN_PHONES.includes(item.code)) {
            acc[item.productId] = {
              phone: item.chars[CONST.CHAR_PHONE],
              redirectionOfferId: item.offeringRelationships.find(offeringRelationship => {
                return offeringRelationship?.childProductOffering.code === CODE_CALLFORWRD
              })?.childProductOffering.id || '',
              status: item.status
            }
          }

          return acc
        }, {} as Record<string, { phone: string, redirectionOfferId: string, status: string }>)

        this.listPhone = Object.keys(listPhoneIdsWithNumber)
          .map(item => ({
            id: item,
            phone: listPhoneIdsWithNumber[item].phone,
            redirectionOfferId: listPhoneIdsWithNumber[item].redirectionOfferId,
            status: listPhoneIdsWithNumber[item].status
          }))

        const listCustomerProductResponse = await this.listCustomerProduct({
          api: this.$api,
          parentIds: Object.keys(listPhoneIdsWithNumber),
          code: CODE_CALLFORWRD
        })

        this.listRedirection = Object.values(listCustomerProductResponse)
          .reduce((acc, item) => {
            acc.push(...item.slo)
            return acc
          }, [] as ICustomerProductSLO[])
          .filter(item => ![STATUS_DISCONNECTED].includes(item.status))
          .map(item => {
            const hoursMatch = item.chars?.[CONST.CHAR_HOURS].match(/\d+/g)
            return {
              id: item.id,
              phoneId: item.parentId,
              fromPhone: listPhoneIdsWithNumber[item.parentId].phone.replace(/\D+/g, ''),
              toPhone: item.chars?.[CONST.CHAR_TO_REDIRECTION].replace(/\D+/g, ''),
              type: item.chars?.[CONST.CHAR_TYPE_REDIRECTION],
              hoursFrom: Array.isArray(hoursMatch) ? head(hoursMatch) : '',
              hoursTo: Array.isArray(hoursMatch) ? last(hoursMatch) : '',
              period: cloneDeep(generatePeriodList(item.chars)),
              status: listPhoneIdsWithNumber[item.parentId].status,
              redirectionStatus: item.status,
              parent: {
                bpi: String(this.activePoint!.bpi),
                locationId: String(this.activePoint!.id),
                marketId: this.activePoint!.marketId
              }
            }
          })

        resolve()
      } catch (e) {
        this.isLoadedProductsError = true
        reject(e)
      } finally {
        this.isLoadingProducts = false
      }
    })
  }

  async init () {
    await this.fetchListPoint()
    await this.fetchPhones()
  }

  onSuccessHandler () {
    this.isRequestSuccess = true
    this.isLoadingProducts = true
    setTimeout(() => {
      this.fetchPhones()
    }, 5000)
  }

  mounted () {
    if (this.marketingBrandId) {
      this.init()
    }
  }
}
