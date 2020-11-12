import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { BRAND_ID, CUSTOMER_CATEGORY_ID, DISTRIBUTION_CHANNEL_ID, MARKET_ID } from '@/constants/catalog'
import { TYPE_JSON } from '@/constants/type_request'
import { ICatalogOffer } from '@/tbapi/catalog_offer'

const api = () => new API()

const actions = {
  fetchAllowedOffers (
    context: ActionContext<undefined, any>,
    { id }: { id: string }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']

    return new Promise<ICatalogOffer[]>((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          brandId: BRAND_ID,
          marketId: MARKET_ID,
          customerCategoryId: CUSTOMER_CATEGORY_ID,
          distributionChannelId: DISTRIBUTION_CHANNEL_ID,
          id
        })
        .query('/catalog/management/allowed-offers')
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
