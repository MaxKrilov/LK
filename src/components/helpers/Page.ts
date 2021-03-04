import Vue from 'vue'
import Component from 'vue-class-component'

import { uniqBy, head } from 'lodash'
import { ICustomerProduct, ILocationOfferInfo } from '@/tbapi'

import { mapGetters, mapState } from 'vuex'

export interface iPageComponent {
  productType: string | null
}

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string,
  addressId: string
}

export function transformList (listPoint: ILocationOfferInfo[]): iPointItem[] {
  return uniqBy(listPoint.map(listPointItem => {
    return {
      id: listPointItem.id,
      fulladdress: listPointItem.fulladdress,
      bpi: listPointItem.bpi,
      offerName: listPointItem.offer.name,
      addressId: listPointItem.address.id.toString()
    }
  }), 'bpi')
}

const DISPATCH_GET_LOCATIONS = 'productnservices/locationOfferInfo'
const DISPATCH_GET_CUSTOMER_PRODUCT = 'productnservices/customerProduct'

@Component<InstanceType<typeof PageComponent>>({
  computed: {
    ...mapState({
      isLoadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount
    }),
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    })
  },
  watch: {
    billingAccountId () {
      this.init()
    },
    activePoint (newVal, oldVal) {
      newVal && oldVal && this.getCustomerProduct()
    }
  }
})
export default class PageComponent extends Vue {
  // Vuex
  readonly isLoadingBillingAccount!: boolean
  readonly billingAccountId!: string

  // Data
  /**
   * Список точек
   */
  listPoint: iPointItem[] = []
  /**
   * Активная точка
   */
  activePoint: iPointItem | null = null
  /**
   * Список клиентских продуктов
   */
  customerProduct: ICustomerProduct | null = null

  // Methods
  /**
   * Получение списка точек
   */
  getListPoint () {
    return new Promise((resolve, reject) => {
      this.$store.dispatch(DISPATCH_GET_LOCATIONS, {
        api: this.$api,
        productType: (this as any).productType
      })
        .then(response => {
          this.listPoint = transformList(response)
          if (this.listPoint.length > 0) {
            this.activePoint = head(this.listPoint) || null
          }
          resolve(this.listPoint)
        })
        .catch(err => reject(err))
    })
  }

  /**
   * Получение клиентских продуктов
   */
  getCustomerProduct () {
    return new Promise((resolve, reject) => {
      if (!this.activePoint) resolve(null)
      this.$store.dispatch(DISPATCH_GET_CUSTOMER_PRODUCT, {
        api: this.$api,
        parentId: this.activePoint!.bpi
      })
        .then(response => {
          this.customerProduct = response
          resolve(response)
        })
        .catch(err => reject(err))
    })
  }

  /**
   * Инициализация (последовательное получение списка точек и клиентских продуктов)
   */
  init () {
    this.reset()
    return new Promise((resolve, reject) => {
      this.getListPoint()
        .then(() => {
          this.getCustomerProduct()
            .then(() => {
              resolve()
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  /**
   * Сброс
   */
  reset () {
    this.listPoint = []
    this.activePoint = null
    this.customerProduct = null
  }

  created () {
    this.billingAccountId && this.init()
  }
}
