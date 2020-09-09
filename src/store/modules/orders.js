import {
  GET_ORDERS,
  CREATE_TASK
} from '../actions/orders'
import moment from 'moment'

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
const state = {
  listOrders: []
}

const actions = {
  [GET_ORDERS]: async ({ rootGetters, commit }, { statuses, api, page = 1, rowCount = 25 }) => {
    const { toms: clientId } = rootGetters['auth/user']
    commit('loading/loadingOrders', true, { root: true })

    try {
      const result = await api
        .setData({
          clientId,
          status: statuses,
          page,
          rowCount,
          dateFrom: moment().add('months', -10).format('YYYY-MM-DDTHH:mm:ss') + 'Z',
          dateTo: moment().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
        })
        .setType('array')
        .query('/order/products/group')
      const res = [...result.requests]
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

      const orders = res.sort((a, b) => {
        return moment(b.createdWhen).unix() - moment(a.createdWhen).unix()
      })
      return {
        range: result.range,
        orders
      }
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

const getters = {
  getListOrders (state) {
    return state.listOrders
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters
}
