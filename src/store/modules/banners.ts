import { IBannerList } from '@/tbapi/banners'
import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { TYPE_ARRAY } from '@/constants/type_request'

const api = () => new API()

interface IState {
  banners: IBannerList | null
}

const state: IState = {
  banners: null
}

const getters = {
  banners: (state: IState) => state.banners
}

const actions = {
  getBannerList (context: ActionContext<IState, any>) {
    // const userData = context.rootGetters['user/getBannerRequestData']
    const productList = context.rootGetters['user/getListProductByService']
    // const branchId = context.rootGetters['payments/getBranchId']

    const offeringCategory = productList.map((product: any) => product.code)

    return new Promise(async (resolve, reject) => {
      try {
        const result = await api()
          .setWithCredentials()
          .setType(TYPE_ARRAY)
          .setData({
            // ...userData,
            // branchId,
            offeringCategory
          })
          .query('/catalog/banners/list')

        if ('all' in result && 'client' in result) {
          context.commit('setBannerList', result)
          resolve(result)
        } else {
          reject('Unknown error')
        }
      } catch (ex) {
        reject(ex)
      }
    })
  }
}
const mutations = {
  setBannerList (state: IState, payload: IBannerList) {
    state.banners = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
