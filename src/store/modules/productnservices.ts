import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { ICustomerProduct, ILocationOfferInfo } from '@/tbapi'
import { AxiosError } from 'axios'

interface IState {}

const state: IState = {}

const getters = {}

const actions = {
  /**
   * Получение локаций с названием тарифа (и/или суммарной ценой) по типу продукта и биллинг-аккаунту
   * @param context
   * @param payload
   */
  locationOfferInfo (context: ActionContext<IState, any>, payload: { api: API, productType: string}) {
    const { api, productType } = payload
    const { toms: clientId } = context.rootGetters['auth/user']
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    return new Promise<ILocationOfferInfo[]>((resolve, reject) => {
      api
        .setWithCredentials()
        .setData({
          clientId,
          billingAccountId,
          productType
        })
        .query('/order/management/points')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  /**
   * Получение клиентских продуктов (по Интернету)
   * @param context
   * @param payload
   */
  customerProduct (context: ActionContext<IState, any>, payload: { api: API, parentId?: string | number, locationId?: string | number }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    const data: any = { clientId, id: clientId }
    payload.parentId && (data.parentId = payload.parentId)
    payload.locationId && (data.locationId = payload.locationId)
    return new Promise<ICustomerProduct>((resolve, reject) => {
      payload.api
        .setWithCredentials()
        .setData(data)
        .query('/customer/product/all')
        .then((response: ICustomerProduct) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },
  billingPacket (context: ActionContext<IState, any>, { api, product }: { api: API, product: string | number }) {
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    return new Promise<any>((resolve, reject) => {
      api
        .setWithCredentials()
        .setData({
          id: billingAccountId,
          product
        })
        .query('/billing/packets/index')
        .then((response: any) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  },
  productInfoList (context: ActionContext<IState, any>, { api, id }: { api: API, id: string | number }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api
        .setWithCredentials()
        .setResponseType('blob')
        .setData({
          clientId,
          id
        })
        .query('/customer/product/infolist')
        .then((response: any) => resolve(response))
        .catch((err: AxiosError) => reject(err))
    })
  }
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
