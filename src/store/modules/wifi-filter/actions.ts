import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import moment from 'moment'
import PnS from '@/store/modules/productnservices'
import {
  ACTIONS as WIFI_ACTIONS,
  PRODUCT_CODE,
  PRODUCT_SUB_TYPE,
  PRODUCT_TYPE
} from '@/constants/wifi-filter'
import { IState } from './state'
import TYPES from './types'
import { TYPE_JSON } from '@/constants/type_request'
import { ISubscription, ISubscriptionInfo, TVlanNumber } from '@/interfaces/wifi-filter'
import { isEmptyObject } from '@/functions/helper'

const apiWrap = new API()

const APIShortcut = (url: string, data: Object, branch?: string | undefined) => {
  let api = new API()
  api = api
    .setType(TYPE_JSON)
    .setData(data)

  if (branch) {
    api = api.setBranch(branch)
  }

  return api.query(url)
}

function todayWifiFormatted () {
  // сегодняшняя дата в формате wifi-бекенда
  return moment().format('DD.MM.YYYY')
}

const URLS = {
  RESOURCE_VPN: '/resource/info/vpn',
  WIFI_ANALYTICS: '/internet/analytics/request'
}

const CODES = {
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  UNKNOWN: 'UNKNOWN'
}

function getWifiInfoResult (action: string) {
  /*
    Вынимаем данные из ответа метода /internet/analytics/request

    Возможные приходящие данные:
    1) {
      "get_client_subscriptions": {
        "rowset": [...]
      }
    }
      - тогда возвращаем массив response.get_client_subscriptions.rowset

    2) {
      "get_available_subscriptions": {
        "rowset": {
          "row": [...]
        }
      }
    }
      - тогда возвращаем массив из response.get_available_subscriptions.rowset.row
    3) [...] - возвращаем как есть
   */
  return (data: any) => {
    const { result } = data
    return result?.[action]
      ? result[action]?.rowset
        ? result[action].rowset
        : result[action]
      : result
  }
}

const mapAttributes = (object: any) => {
  /* Распаковка атрибутов (объекта '@attributes')

    На входе:
    {
      @attributes: {
        subscription_id: "1234"
        subscription_name: "Азартные игры"
      },
      someData: 'some text'
    }

    Выход:
    {
      subscription_id: "1234",
      subscription_name: "Азартные игры",
      someData: 'some text'
    }
   */
  let newItem = { ...object?.['@attributes'] || {}, ...object }
  delete newItem['@attributes']
  return newItem
}

export default {
  fetchLocations: (context: ActionContext<IState, any>) => {
    const newPayload = {
      api: apiWrap,
      productType: PRODUCT_TYPE
    }

    return PnS.actions.locationOfferInfo(context, newPayload)
      // Контент-фильтрация работает только для "Wi-fi Hot spot mono"
      .then(data => data.filter(el => el.offer.name === PRODUCT_SUB_TYPE))
  },
  pullLocations: (context: ActionContext<IState, any>) => {
    return context.dispatch('fetchLocations')
      .then(data => {
        context.commit(TYPES.SET_LOCATIONS, data)
        return data
      })
  },
  fetchContentFilter: (context: ActionContext<IState, any>, bpiList: string[]) => {
    return new Promise(async (resolve) => {
      const payload = {
        api: apiWrap,
        parentIds: bpiList,
        code: PRODUCT_CODE
      }

      const promiseCustomerProducts = await PnS.actions.customerProducts(context, payload)
      context.commit(TYPES.SET_CONTENT_FILTER, promiseCustomerProducts)

      resolve(promiseCustomerProducts)
    })
  },
  fetchVlan: (context: ActionContext<IState, any>, bpiList: string[]) => {
    /*
      отдаём список bpi
      Например: ["9157305292213722180"]

      получаем список следующей структуры:
      [
        {
          "vlan": [
            {
              "name": "Нижний VLAN 3660: ккк",
              "number": "102.3660",
              "status": "Зарезервирован",
              "cityId": "238"
            }
          ],
          "bpi_id": "9157305292213722180" // тот же самый bpi
        }
      ]
     */
    return APIShortcut(URLS.RESOURCE_VPN, {
      bpi: bpiList
    })
  },
  pullVlan: (context: ActionContext<IState, any>, bpiList: string[]) => {
    context.commit(TYPES.SET_VLAN_LOADED, false)

    return context.dispatch('fetchVlan', bpiList)
      .then(data => {
        context.commit(TYPES.SET_VLAN, data)
        context.commit(TYPES.SET_VLAN_LOADED, true)
        return data
      })
  },
  fetchWifiInfo: (context: ActionContext<IState, any>, payload: { action: string, data: any }) => {
    /* База для запросов к wifi-бэкенду */

    if (!payload.action || !payload.action.length) {
      throw Error('Не указан параметр action для запроса к wifi-бэкенду')
    }

    const preparedPayload = {
      category: 'filtration',
      ...payload
    }

    return APIShortcut(
      `${URLS.WIFI_ANALYTICS}?${payload.action}`,
      preparedPayload
    )
      .then(data => {
        if (data.messages) {
          if (data.messages.code === CODES.SUBSCRIPTION_NOT_FOUND) {
            throw Error('not found')
          }

          if (data.messages.code === CODES.UNKNOWN) {
            throw Error('unknown error')
          }
        }
        return data
      })
      .then(getWifiInfoResult(payload.action))
  },
  fetchAdditPublicSubscriptions (context: ActionContext<IState, any>) {
    const action = WIFI_ACTIONS.GET_ADDIT_PUBLIC_SUBSCRIPTIONS

    const prepareWifiInfoRows = (data: any): ISubscription => {
      return data.category
        .map(mapAttributes)
        .map((el: any) => {
          const items = Array.isArray(el.row) ? el.row : [el.row]

          return {
            ...el,
            items: items.map(mapAttributes)
          }
        })
    }

    return context.dispatch('fetchWifiInfo', { action })
      .then(prepareWifiInfoRows)
    // .then(data => context.commit(TYPES.SET_ADD_FILTERS, data))
  },
  pullAdditPublicSubscriptions (context: ActionContext<IState, any>) {
    return context.dispatch('fetchAdditPublicSubscriptions')
      .then(data => {
        context.commit(TYPES.SET_ADD_FILTERS, data)
        return data
      })
  },
  pullAvailableSubscriptions (context: ActionContext<IState, any>) {
    /* Загрузка доступных фильтров "Игры", "Образование", "Соц.сети" и т.д. */
    const action = WIFI_ACTIONS.GET_AVAILABLE_SUBSCRIPTIONS
    const prepareWifiInfoRows = (data: any): ISubscription => {
      data = data.row
      return data.map((el: any) => {
        return {
          ...el['@attributes']
        }
      })
    }

    return context.dispatch('fetchWifiInfo', { action })
      .then(prepareWifiInfoRows)
      .then(data => context.commit(TYPES.SET_AVAILABLE_FILTERS, data))
  },
  // eslint-disable-next-line camelcase
  fetchClientSubscriptions (context: ActionContext<IState, any>, { city_id }: { city_id: string }) {
    /*
      get_client_subscriptions(
        client_id,
        city_id
      )
     */
    const action = WIFI_ACTIONS.GET_CLIENT_SUBSCRIPTIONS
    const data = {
      client_id: context.rootGetters['auth/getTOMS'],
      city_id
    }

    const prepareData = (data:any) => {
      let result = data.row
      if (Array.isArray(data.row)) {
        result = data.row.map(mapAttributes)
      } else {
        result = [mapAttributes(data.row)]
      }

      const isNotEmptyObject = (el: {}) => !isEmptyObject(el)

      return result.filter(isNotEmptyObject)
    }

    return context.dispatch('fetchWifiInfo', { action, data })
      .then(prepareData)
  },
  // eslint-disable-next-line camelcase
  getSubscriptionInfo (context: ActionContext<IState, any>, subscription_id: string) {
    /* может получить только пользовательский Subscription а не AvailableSubscription */

    const action = WIFI_ACTIONS.GET_SUBSCRIPTION_INFO
    const data = {
      subscription_id
    }

    const prepareResponseData = (data: any): ISubscriptionInfo => {
      data = mapAttributes(data.row)

      if (data?.subscriptions?.subscription) {
        if (Array.isArray(data?.subscriptions?.subscription)) {
          data.subscriptions.subscription = data.subscriptions.subscription.map(mapAttributes)
        } else {
          data.subscriptions.subscription = [mapAttributes(data.subscriptions.subscription)]
        }
      }

      if (data['url_list']) {
        data['url_list'].url = Object.values(data['url_list'].url)
          .map(mapAttributes)
      }

      return data
    }

    return context.dispatch('fetchWifiInfo', { action, data })
      .then(prepareResponseData)
  },
  pullSubscriptionInfo (context: ActionContext<IState, any>, subscriptionId: string) {
    return context.dispatch('getSubscriptionInfo', subscriptionId)
      .then(data => {
        context.commit(TYPES.SET_SUBSCRIPTION_INFO, { subscriptionId, data })
        context.commit(TYPES.SET_SUBSCRIPTION_INFO_LOADED, subscriptionId)
        return data
      })
  },
  getClientSubscrsByVLAN (
    context: ActionContext<IState, any>,
    // eslint-disable-next-line camelcase
    { city_id, vlan }: { city_id: string, vlan: TVlanNumber }
  ) {
    const clientId = context.rootGetters['auth/getTOMS']
    const action = WIFI_ACTIONS.GET_CLIENT_SUBSCRS_BY_VLAN
    const data = {
      city_id,
      vlan,
      client_id: clientId,
      is_client_bss: '1'
    }

    const prepareResponseData = (data: any) => {
      const addenda = mapAttributes(data?.addenda)
      addenda['terminal_resource'] = mapAttributes(addenda['terminal_resource'])

      if (Array.isArray(addenda['terminal_resource'].row)) {
        addenda['terminal_resource'].row = addenda['terminal_resource'].row
          .map(mapAttributes)
      } else if (addenda['terminal_resource'].row) {
        addenda['terminal_resource'].row = [mapAttributes(addenda['terminal_resource'].row)]
      }

      return addenda
    }

    return context.dispatch('fetchWifiInfo', { action, data })
      .then(prepareResponseData)
      .then(data => {
        context.commit(TYPES.SET_SUBSCRIPTION, { vlan, data })
        return data
      })
  },
  addSubscription (context: ActionContext<IState, any>, payload: {
    /* eslint-disable camelcase */
    city_id: string,
    subscription_name: string,
    description: string,
    subscription_type_id: string,
    public_subscriptions: string[],
    url: string[],
    vlans: string
    /* eslint-enable camelcase */
  }) {
    /*
      add_subscription(
        client_id, // ТОМС
        city_id,
        subscription_name,
        description,
        subscription_type_id, // Белый или чёрный список (т.е. цифра 4 или 3)
        public_subscriptions, // список разделённый точками
        url, // список url разделённый точкой с запятой
        vlans
      )
     */
    const action = WIFI_ACTIONS.ADD_SUBSCRIPTION
    const data = {
      client_id: context.rootGetters['auth/getTOMS'],
      ...payload,
      subscription_type_id: payload['subscription_type_id'].toString(),
      url: payload['url'].join(';'),
      public_subscriptions: payload['public_subscriptions'].join('.')
    }

    return context.dispatch('fetchWifiInfo', { action, data })
  },
  addUrlToSubscription (
    context: ActionContext<IState, any>,
    // eslint-disable-next-line camelcase
    payload: { url: string, subscription_id: string }
  ) {
    /*
      add_url_in_subscription(subscription_id, url)
     */

    const action = WIFI_ACTIONS.ADD_URL_IN_SUBSCRIPTION
    const data = { ...payload }
    return context.dispatch('fetchWifiInfo', { action, data })
  },
  addSubscriptionToVLAN (context: ActionContext<IState, any>, payload: any) {
    /*
      add_subscription_to_vlan(
        city_id,
        vlan,
        subscription_id,
        active_from = current_date,
        active_to = 01.01.3000
      )
     */
    const action = WIFI_ACTIONS.ADD_SUBSCRIPTION_TO_VLAN

    const data = {
      // client_id: context.rootGetters['auth/getTOMS'],
      ...payload
    }

    return context.dispatch('fetchWifiInfo', { action, data })
  },
  editSubscription (context: ActionContext<IState, any>, payload: any) {
    /*
      edit_subscription(
        client_id,
        city_id,
        subscription_id,
        subscription_name,
        description,
        public_subscriptions
      )
     */
    const action = WIFI_ACTIONS.EDIT_SUBSCRIPTION

    const data = {
      client_id: context.rootGetters['auth/getTOMS'],
      ...payload,
      public_subscriptions: payload['public_subscriptions'].join('.')
    }

    return context.dispatch('fetchWifiInfo', { action, data })
  },
  deleteSubscription (
    context: ActionContext<IState, any>,
    // eslint-disable-next-line camelcase
    payload: { city_id: string, subscription_id: string }
  ) {
    /*
     close_subscription_on_client(
       client_id,
       city_id,
       subscription_id,
       for_day = current_date
     )
     */
    const action = WIFI_ACTIONS.CLOSE_SUBSCRIPTION_ON_CLIENT

    const data = {
      client_id: context.rootGetters['auth/getTOMS'],
      ...payload,
      for_day: todayWifiFormatted()
    }

    return context.dispatch('fetchWifiInfo', { action, data })
      .then(() => {
        context.commit(TYPES.UNSET_SUBSCRIPTION_INFO_LOADED, payload['subscription_id'])
      })
  },
  deleteUrlInSubscription (context: ActionContext<IState, any>, urlId: string) {
    const action = WIFI_ACTIONS.DEL_URL_IN_SUBSCRIPTION
    const data = {
      urlId
    }

    return context.dispatch('fetchWifiInfo', { action, data })
  },
  getSubscriptionUrlList (context: ActionContext<IState, any>, subscriptionId: string) {
    return context.dispatch('fetchWifiInfo', {
      action: WIFI_ACTIONS.GET_SUBSCR_URL_LIST,
      data: {
        subscription_id: subscriptionId
      }
    })
  }
}
