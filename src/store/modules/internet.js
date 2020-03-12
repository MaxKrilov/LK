import {
  GET_DATA_FOR_INTERNET,
  GET_DATA_FOR_INTERNET_SUCCESS,
  GET_DATA_FOR_INTERNET_ERROR
} from '../actions/internet'
// import { TYPE_ARRAY } from '../../constants/type_request'
import { ERROR_MODAL } from '../actions/variables'

const state = {
  dataForInternet: {}
}

const getters = {
  getRequestParams () {
    return [
      'purchasedPrices.recurrentTotal',
      'chars',
      'actualStartDate',
      'id'
    ]
  }
}

const actions = {
  [GET_DATA_FOR_INTERNET]: async ({ commit, dispatch, rootGetters }, { api, parentId }) => {
    // const include = getters.getRequestParams()
    const { toms: clientId } = rootGetters['auth/user']
    const id = clientId
    try {
      const result = await api
        .setWithCredentials()
        .setBranch('web-bss')
        // .setType(TYPE_ARRAY)
        .setData({ clientId, id, parentId })
        .query('/customer/product/client')
      console.log(result)
      commit(GET_DATA_FOR_INTERNET_SUCCESS, result)
    } catch (e) {
      commit(ERROR_MODAL, true, { root: true })
      commit(GET_DATA_FOR_INTERNET_ERROR)
      // todo Логирование
    }
  }
}

const mutations = {
  [GET_DATA_FOR_INTERNET_SUCCESS]: (state, payload) => {
    state.dataForInternet = payload
  },
  [GET_DATA_FOR_INTERNET_ERROR]: (state) => {
    state.dataForInternet = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
