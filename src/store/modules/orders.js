import {
  GET_ORDERS,
  GET_ORDERS_SUCCESS,
  CREATE_TASK
} from '../actions/orders'
import { ERROR_MODAL } from '../actions/variables'

const state = {
  listOrders: [],
  statuses: [],
  cities: []
}

const actions = {
  [GET_ORDERS]: async ({ rootGetters, commit }, { statuses, api }) => {
    const { toms: clientId } = rootGetters['auth/user']
    commit('loading/loadingOrders', true, { root: true })
    try {
      const result = await api
        .setData({
          clientId,
          status: statuses
        })
        .setType('array')
        .query('/order/products/group')
      commit(GET_ORDERS_SUCCESS, result)
    } catch (error) {
      commit(ERROR_MODAL, true, { root: true })
    } finally {
      commit('loading/loadingOrders', false, { root: true })
    }
  },
  [CREATE_TASK]: async ({ commit }, { api, orderId, owner, type, name, description = '', dateFrom = '', dateTo = '' }) => {
    try {
      commit('loading/sendingCancellingOrder', true, { root: true })
      const result = await api
        .setData({
          name,
          description,
          relatedObject: orderId,
          managerId: owner,
          owner,
          type,
          dateFrom,
          dateTo
        })
        .query('/customer/manager/create-task')
      return result
    } catch (error) {
      return false
    } finally {
      commit('loading/sendingCancellingOrder', false, { root: true })
    }
  }

}

const mutations = {
  [GET_ORDERS_SUCCESS]: (state, payload) => {
    const transformOrder = (data) => {
      const rec = (ar, f, level) => {
        return ar.map(el => {
          const actionMapping = {
            Add: 'Добавление',
            Modify: 'Изменение',
            Disconnect: 'Отключение'
          }
          const listSpecs = []
          if (
            el?.action &&
            el?.chars['Имя в счете'] &&
            actionMapping.hasOwnProperty(el?.action)
          ) {
            listSpecs.push(`${actionMapping[el?.action]} ${el?.chars['Имя в счете']}`)
          }
          if (el?.orderItems) {
            listSpecs.push(f(el.orderItems, f, level + 1))
          }
          if (level) {
            return listSpecs
          } else {
            return {
              locationId: el?.locationId,
              listSpecs: [...new Set(listSpecs.flat(Infinity))].join(', ')
            }
          }
        })
      }
      return rec(data, rec, 0)
    }
    const res = [...payload]
      .filter(el => el?.orderItems)
      .map(el => {
        const orderItems = transformOrder(el.orderItems)
        return {
          status: el?.status,
          orderItems,
          cities: el?.cities,
          id: el?.id,
          locationIds: el?.locationIds,
          sequenceNo: el?.sequenceNo,
          createdWhen: el?.createdWhen,
          price: el?.price?.recurrentTotal?.value,
          salesOrderOwner: el?.salesOrderOwner
        }
      })
    state.listOrders = res
    state.cities = [...new Set(payload.reduce((acc, current) => [...acc, ...current.cities], []))]
    state.statuses = [...new Set(res.map(el => el.status))]
  }
}

const getters = {
  getListOrders (state) {
    return state.listOrders
  },
  getCities (state) {
    return state.cities
  },
  getStatuses (state) {
    return state.statuses
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
