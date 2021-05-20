import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { TYPE_JSON } from '@/constants/type_request'

const api = () => new API()

const LK_NAME = 'Личный кабинет'
// Distribution channel toms id
const DC_TOMS_ID = '9154757453113196816'

interface IPayload {
  api: API,
  id?: string
  marketId?: string,
  brandId?: string
}

const actions = {
  fetchDistributionChannel (context: ActionContext<undefined, any>) {
    const clientId = context.rootGetters['auth/getTOMS']

    const newPayload = {
      channelId: '',
      tomsId: DC_TOMS_ID,
      clientId,
      name: LK_NAME
    }

    return api()
      .setWithCredentials()
      .setData(newPayload)
      .query('/catalog/management/distribution-channel')
  },
  fetchAllowedOffers (
    context: ActionContext<undefined, any>,
    payload: IPayload
  ) {
    const clientId = context.rootGetters['auth/getTOMS']
    const marketId = context.rootGetters['user/getMarketId']
    const brandId = context.rootGetters['user/getMarketingBrandId']
    const customerCategoryId = context.rootGetters['user/customerCategoryId']
    const distributionChannelId = context.rootGetters['user/distributionChannelId']

    const newPayload = {
      clientId,
      marketId,
      brandId,
      customerCategoryId,
      distributionChannelId,
      ...payload
    }

    return api()
      .setWithCredentials()
      .setType(TYPE_JSON)
      .setData(newPayload)
      .query('/catalog/management/allowed-offers')
  }
}

export default {
  namespaced: true,
  actions
}
