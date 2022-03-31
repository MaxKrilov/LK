import { IOfferingRelationship, IProductOffering } from '@/interfaces/offering'

const firstSampleOffering = ([ first ]: IProductOffering | any) => first['offeringRelationships']

class ProductOffers {
}

class ProductOffersImpl extends ProductOffers {
  async methodGetOffers (methodOffers : IOfferingRelationship | any) {
    const allOffers = await methodOffers().then(firstSampleOffering)
    return allOffers
  }
}

export default class DisassembleAllowedOffers {
  implProductOffers: ProductOffersImpl = {
    // @ts-ignore
    childMax: '',
    childMin: '',
    childProductOffering: undefined,
    id: '',
    name: ''
  }
  constructor () {
    this.implProductOffers = new ProductOffersImpl()
  }

  async offersGet (productOffers: any) {
    const offersGet = await this['implProductOffers'].methodGetOffers(productOffers)
    return offersGet
  }
}
