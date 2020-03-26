import { Vue, Component } from 'vue-property-decorator'
import { ICustomerProduct } from '@/tbapi'
import { price } from '@/functions/filters'

@Component({
  filters: {
    price
  },
  props: {
    customerProduct: {
      type: Object,
      default: () => ({})
    }
  }
})
export default class PriceServicesComponent extends Vue {
  readonly customerProduct!: ICustomerProduct | null
  isOpenList = false

  toggleList () {
    this.isOpenList = !this.isOpenList
  }

  get priceOfServices () {
    // todo Скидки
    if (this.customerProduct === null) return []
    const result = []
    // Стоимость TLO
    result.push({
      name: this.customerProduct.tlo.offer.code,
      price: Number(this.customerProduct.tlo.purchasedPrices.recurrentTotal.value),
      currency: `${this.customerProduct.tlo.purchasedPrices.recurrentTotal.currency.currencyCode}/месяц`
    })
    this.customerProduct.slo.forEach(slo => {
      if (slo.activated) {
        result.push({
          name: slo.childProductOffering.code,
          price: typeof slo.purchasedPrices !== 'string' ? Number(slo.purchasedPrices.recurrentTotal.value) : 0,
          currency: typeof slo.purchasedPrices !== 'string'
            ? `${slo.purchasedPrices.recurrentTotal.currency.currencyCode}/месяц`
            : ''
        })
      }
    })
    return result
  }

  get totalSummary () {
    return this.priceOfServices.reduce((acc, item) => {
      return acc + item.price
    }, 0)
  }

  get currency () {
    return this.priceOfServices[0]?.currency || ''
  }
}
