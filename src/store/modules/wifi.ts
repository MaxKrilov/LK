/* eslint-disable camelcase */
import { API } from '@/functions/api'
import { ActionContext } from 'vuex'
import { TYPE_ARRAY, TYPE_JSON } from '@/constants/type_request'
import { IWifiPro, IWifiResourceInfo } from '@/tbapi'
import { head } from 'lodash'
import { logError } from '@/functions/logging'

const api = () => new API()

const VOUCHER_REQUEST = '/internet/analytics/request'

const URLS = {
  GET_RADAR_LINK: '/internet/radar/link'
}

const actions = {
  getRadarLink (context: ActionContext<any, any>) {
    const clientInfo = context.rootState.user.clientInfo

    const { id: clientId } = clientInfo

    const {
      market,
      marketingBrandId: brand
    } = context.rootState.payments.billingInfo

    const billingAccountId = context.rootState.payments.activeBillingAccount?.billingAccountId
    const INN = context.rootGetters['user/getINN']
    const dmpCustomerId = context.rootGetters['user/getDMPCustomerId']

    const newPayload: Record<string, string> = {
      clientId,
      clientName: clientInfo?.legalName || clientInfo?.name,
      INN,
      market: JSON.stringify(market),
      brand,
      billingAccountId,
      dmpCustomerId,
      role: context.rootState.auth.userInfo.postRole || ''
    }

    if (context.rootState.auth.isManager) {
      newPayload.email = context.rootState.auth.userInfo.mail
      newPayload.role = head(
        context.rootState.auth.userInfo.realm_access?.roles ||
        context.rootState.auth.userInfo.realmAccess?.roles ||
        []
      ) || ''
    }

    return api()
      .setWithCredentials()
      .setData(newPayload)
      .query(URLS.GET_RADAR_LINK)
      .then(data => {
        return {
          payload: newPayload,
          data: data
        }
      })
  },
  getResource (
    context: ActionContext<undefined, any>,
    { bpi }: { bpi: string }
  ) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_ARRAY)
        .setData({
          bpi: [bpi]
        })
        .query('/resource/info/vpn')
        .then((response: IWifiResourceInfo[]) => resolve(response))
        .catch(error => reject(error))
    })
  },
  getPointInfo (
    context: ActionContext<undefined, any>,
    // eslint-disable-next-line camelcase
    { vlan, city_id }: { vlan: string, city_id: string }
  ) {
    const { toms } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          client_id: toms,
          vlan,
          city_id
        })
        .query('/voucher/point/view')
        .then((response) => resolve(response))
        .catch(error => reject(error))
    })
  },
  bigDataStatAudience (
    context: ActionContext<undefined, any>,
    payload: {
      cityId: string,
      vlan: string,
      dateFrom: string,
      dateTo: string,
      authType: string,
      periodType: string
    }
  ) {
    let {
      cityId,
      vlan,
      dateFrom,
      dateTo,
      authType,
      periodType
    } = payload
    if (~vlan.indexOf('.')) {
      vlan = vlan.replace('.', ':')
    }
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          method: 'stat_audiences',
          cityId,
          vlan,
          dateFrom,
          dateTo,
          authType,
          periodType
        })
        .query('/internet/analytics/bigdata')
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  bigDataStatUser (
    context: ActionContext<undefined, any>,
    payload: {
      cityId: string,
      vlan: string,
      dateFrom: string,
      dateTo: string
    }
  ) {
    let {
      cityId,
      vlan,
      dateFrom,
      dateTo
    } = payload
    if (~vlan.indexOf('.')) {
      vlan = vlan.replace('.', ':')
    }
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({
          method: 'stat_users',
          cityId,
          vlan,
          dateFrom,
          dateTo
        })
        .query('/internet/analytics/bigdata')
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getWifiPro (context: ActionContext<undefined, any>, payload: { parentIds: string[] }) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise<IWifiPro>((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          clientId,
          parentIds: payload.parentIds
        })
        .query('/customer/product/wifipro')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  getData (
    context: ActionContext<undefined, any>,
    { vlan, cityId }: { vlan: string, cityId: string }
  ) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setData({ vlan, city_id: cityId })
        .query('/hotspot/default/get-data')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  setData (
    context: ActionContext<undefined, any>,
    data: FormData
  ) {
    data.append('_token', context.rootGetters)
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData(data)
        .query('/hotspot/default/set-data')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  hotspotUpdate (
    context: ActionContext<undefined, any>,
    data: FormData
  ) {
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData(data)
        .query('/hotspot/default/update')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  voucherView (
    context: ActionContext<undefined, any>,
    { vlan, cityId }: { vlan: string, cityId: string }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'point/view',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  managerCreate (
    context: ActionContext<undefined, any>,
    {
      password,
      vlan,
      cityId,
      fullName
    }: {
      password: string,
      vlan: string,
      cityId: string,
      fullName: string
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'manager/create',
          data: {
            client_id: clientId,
            password,
            vlan,
            city_id: cityId,
            full_name: fullName
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  managerUpdate (
    context: ActionContext<undefined, any>,
    {
      password,
      vlan,
      cityId,
      fullName,
      managerId
    }: {
      password: string,
      vlan: string,
      cityId: string,
      fullName: string,
      managerId: number
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'manager/update',
          data: {
            client_id: clientId,
            password,
            vlan,
            city_id: cityId,
            full_name: fullName,
            manager_id: managerId
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  managerView (
    context: ActionContext<undefined, any>,
    {
      vlan,
      cityId,
      managerId
    }: {
      vlan: string,
      cityId: string,
      managerId: number
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'manager/view',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId,
            manager_id: managerId
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  managerDelete (
    context: ActionContext<undefined, any>,
    {
      vlan,
      cityId,
      managerId
    }: {
      vlan: string,
      cityId: string,
      managerId: number
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'manager/delete',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId,
            manager_id: managerId
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  managerRestore (
    context: ActionContext<undefined, any>,
    {
      vlan,
      cityId,
      managerId
    }: {
      vlan: string,
      cityId: string,
      managerId: number
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'manager/restore',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId,
            manager_id: managerId
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  pointCreate (
    context: ActionContext<undefined, any>,
    {
      vlan,
      cityId,
      loginPrefix
    }: {
      vlan: string,
      cityId: string,
      loginPrefix: string
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'point/create',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId,
            login_prefix: loginPrefix
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  pointUpdate (
    context: ActionContext<undefined, any>,
    {
      vlan,
      cityId,
      loginPrefix
    }: {
      vlan: string,
      cityId: string,
      loginPrefix: string
    }
  ) {
    const { toms: clientId } = context.rootGetters['auth/user']
    return new Promise((resolve, reject) => {
      api()
        .setWithCredentials()
        .setType(TYPE_JSON)
        .setData({
          category: 'voucher',
          action: 'point/update',
          data: {
            client_id: clientId,
            vlan,
            city_id: cityId,
            login_prefix: loginPrefix
          }
        })
        .query(VOUCHER_REQUEST)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  createClient (
    context: ActionContext<undefined, any>
  ) {
    return new Promise(async (resolve) => {
      const { toms: client_id } = context.rootGetters['auth/user']
      const {
        inn: taxpayer_id,
        name: legal_name,
        address
      } = context.rootGetters['user/getClientInfo']
      const zip_code = ''

      try {
        await api()
          .setWithCredentials()
          .setType(TYPE_JSON)
          .setData({
            category: 'voucher',
            action: 'client/create',
            data: { client_id, taxpayer_id, legal_name, address, zip_code }
          })
          .query(VOUCHER_REQUEST)

        resolve()
      } catch (e) {
        logError(e)
        resolve()
      }
    })
  }
}

export default {
  namespaced: true,
  actions
}
