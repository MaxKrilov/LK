import { API } from '@/functions/api'
import { ActionContext } from 'vuex'

const $api = new API()

const actions = {
  getStatistic (context: ActionContext<any, any>, { fromDate, toDate, productInstance }: { fromDate: string, toDate: string, productInstance: string }) {
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      $api
        .setWithCredentials()
        .setData({
          clientId,
          id: billingAccountId,
          dateFrom: fromDate,
          dateTo: toDate,
          productInstance
        })
        .query('/billing/packets/events')
        .then(response => resolve(response))
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  getFileStatistic (context: ActionContext<any, any>, { fromDate, toDate, productInstance }: { fromDate: string, toDate: string, productInstance: string }) {
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      $api
        .setWithCredentials()
        .setData({
          clientId,
          id: billingAccountId,
          dateFrom: fromDate,
          dateTo: toDate,
          productInstance
        })
        .query('/billing/packets/report')
        .then(response => resolve(response))
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
