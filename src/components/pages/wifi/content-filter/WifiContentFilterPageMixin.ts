import { Component, Mixins } from 'vue-property-decorator'
import { VueTransitionFSM } from '@/mixins/FSMMixin'
import { StoreGetter } from '@/functions/store'
import { IPointItem } from '@/interfaces/point'
import BillingAccountMixin from '@/mixins/BillingAccountMixin'
import { ICustomerProduct, ICustomerProductSLO } from '@/tbapi'
import { head } from 'lodash'
import { STATUS_ACTIVE } from '@/constants/status'

@Component({})
export default class WifiContentFilterPageMixin extends Mixins(VueTransitionFSM, BillingAccountMixin) {
  /* config */
  isPromoEnabled: boolean = true

  contentFilter: any = '-'

  currentPoint: IPointItem | null = null

  /* Getters */
  @StoreGetter('wifiFilter/pointList')
  pointList!: IPointItem[]

  @StoreGetter('wifiFilter/pointBpiList')
  bpiPointList!: string[]

  @StoreGetter('wifiFilter/contentFilter')
  externalContentFilter!: Record<string, ICustomerProduct>

  /* Actions */
  pullLocations () {
    return this.$store.dispatch('wifiFilter/pullLocations')
  }

  pullVlan () {
    return this.$store.dispatch('wifiFilter/pullVlan', this.bpiPointList)
  }

  get getSLO () {
    if (typeof this.contentFilter !== 'object') return {} as Record<string, any>

    const contentFilterElement = (this.contentFilter as Record<string, ICustomerProduct>)[this.currentPoint?.bpi || '']

    if (typeof contentFilterElement === 'undefined') return {} as Record<string, any>

    const sloElement = contentFilterElement.slo.find(sloItem => sloItem.status === STATUS_ACTIVE) || head(contentFilterElement.slo)

    if (typeof sloElement === 'undefined') return {} as Record<string, any>

    return sloElement
  }

  // Computed
  get getProductId () {
    return this.getSLO.id || ''
  }

  get getProductStatus () {
    return this.getSLO.status || ''
  }

  fetchData () {
    this.setState('loading')
    this.pullLocations()
      .then(this.fetchContentFilter)
      .then((data: Record<string, ICustomerProduct>) => {
        this.$set(this, 'contentFilter', data)

        const issetContentFilter = Object.values(data)
          .reduce((acc, item) => {
            acc.push(...item.slo.filter(sloItem => sloItem.status === STATUS_ACTIVE))

            return acc
          }, [] as ICustomerProductSLO[]).length

        if (this.isPromoEnabled && !issetContentFilter) {
          this.setState('promo')
        } else {
          this.pullVlan()
          this.setState('ready')
        }
      })
  }

  fetchContentFilter () {
    return this.$store.dispatch('wifiFilter/fetchContentFilter', this.bpiPointList)
  }

  onChangeBillingAccountId () {
    this.fetchData()
  }

  onChangeCurrentPoint (val: IPointItem) {
    this.currentPoint = val
  }
}
