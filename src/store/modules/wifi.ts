import { API } from '@/functions/api'
import { ActionContext } from 'vuex'
import { TYPE_ARRAY, TYPE_JSON } from '@/constants/type_request'
import { IWifiPro, IWifiResourceInfo } from '@/tbapi'

const api = () => new API()

const actions = {
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
        // .setBranch('web-20066')
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
        // .setBranch('web-20066')
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
        // .setBranch('web-20066')
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
        .setBranch('web-bss-psi2')
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
  }
}

export default {
  namespaced: true,
  actions
}
