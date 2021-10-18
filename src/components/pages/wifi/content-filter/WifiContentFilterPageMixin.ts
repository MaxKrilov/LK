import { Component, Mixins } from 'vue-property-decorator'
import { VueTransitionFSM } from '@/mixins/FSMMixin'
import { StoreGetter } from '@/functions/store'
import { IPointItem } from '@/interfaces/point'
import BillingAccountMixin from '@/mixins/BillingAccountMixin'
import { ICustomerProduct, ICustomerProductSLO } from '@/tbapi'

@Component({})
export default class WifiContentFilterPageMixin extends Mixins(VueTransitionFSM, BillingAccountMixin) {
  /* config */
  isPromoEnabled: boolean = true

  contentFilter: any = '-'

  /* Getters */
  @StoreGetter('wifiFilter/pointList')
  pointList!: IPointItem[]

  @StoreGetter('wifiFilter/pointBpiList')
  bpiPointList!: string[]

  /* Actions */
  pullLocations () {
    return this.$store.dispatch('wifiFilter/pullLocations')
  }

  pullVlan () {
    return this.$store.dispatch('wifiFilter/pullVlan', this.bpiPointList)
  }

  fetchData () {
    this.setState('loading')
    this.pullLocations()
      .then(this.fetchContentFilter)
      .then((data: Record<string, ICustomerProduct>) => {
        this.$set(this, 'contentFilter', data)

        const issetContentFilter = Object.values(data)
          .reduce((acc, item) => {
            acc.push(...item.slo)

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
}
