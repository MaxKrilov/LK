import { API } from '@/functions/api'
import { ActionContext } from 'vuex'
import { AxiosError } from 'axios'
import { TYPE_ARRAY } from '@/constants/type_request'

const REVERCE_ZONE_QUERY = {
  GET: '/internet/revercezonebss/list',
  ADD: '/internet/revercezonebss/add',
  EDIT: '/internet/revercezonebss/edit',
  DELETE: '/internet/revercezonebss/del'
}

const api = () => new API()

const actions = {
  getListReverceZone (
    context: ActionContext<undefined, any>,
    { ip }: { ip: string }
  ) {
    if (!ip) throw Error('Missing required parameter')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ ip })
        .query(REVERCE_ZONE_QUERY.GET)
        .then((response: string[]) => resolve(response))
        .catch((error: AxiosError) => reject(error))
    })
  },
  addReverceZone (
    context: ActionContext<undefined, any>,
    { ip, domain }: { ip: string, domain: string }
  ) {
    if (!ip || !domain) throw Error('Missing required parameter')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ ip, domain })
        .query(REVERCE_ZONE_QUERY.ADD)
        .then((response: any) => resolve(response)) // todo Проверить
        .catch((error: AxiosError) => reject(error))
    })
  },
  editReverceZone (
    context: ActionContext<undefined, any>,
    { ip, domain, domainOld }: { ip: string, domain: string, domainOld: string }
  ) {
    if (!ip || !domain || !domainOld) throw Error('Missing required parameter')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ ip, domain, domainOld })
        .query(REVERCE_ZONE_QUERY.EDIT)
        .then((response: any) => resolve(response)) // todo Проверить
        .catch((error: AxiosError) => reject(error))
    })
  },
  deleteReverceZone (
    context: ActionContext<undefined, any>,
    { ip, domain }: { ip: string, domain: string }
  ) {
    if (!ip || !domain) throw Error('Missing required parameter')
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ ip, domain })
        .query(REVERCE_ZONE_QUERY.DELETE)
        .then((response: any) => resolve(response)) // todo Проверить
        .catch((error: AxiosError) => reject(error))
    })
  },
  getStatistic (context: ActionContext<any, any>, {
    fromDate,
    toDate,
    productInstance,
    eventSource
  }: {
    fromDate: string,
    toDate: string,
    productInstance: string,
    eventSource: string
  }) {
    const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          clientId,
          id: billingAccountId,
          dateFrom: fromDate,
          dateTo: toDate,
          productInstance,
          eventSource
        })
        .query('/billing/packets/events')
        .then(response => resolve(response))
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  getDDoSLink (context: ActionContext<any, any>, payload: { productIds: string[] }) {
    const { toms: clientId } = context.rootGetters['auth/user']

    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_ARRAY)
        .setData({
          clientId,
          bpiId: payload.productIds
        })
        .query('/internet/guard/index2')
        .then(response => resolve(response))
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  getContentFilterLink (context: ActionContext<any, any>, { login }: { login: string }) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          login
        })
        .query('/internet/contentfilter-new/urlsettings')
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
      api()
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
