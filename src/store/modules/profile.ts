import Vue from 'vue'
import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { removeObjectKey } from '@/functions/helper'
import { IForpostAccount, IForpostUser } from '@/interfaces/profile'
import {
  SYSTEM_NAMES,
  OATS_USERS_OWNER,
  SSO_FORPOST_AUTH_PROVIDER
} from '@/constants/profile'

const URLS = {
  PRODUCTS: '/customer/product/client',
  OATS_DOMAINS: '/order/contract/get-oats-domain',
  OATS_USERS: '/sso/oats/users',
  FORPOST_USERS: '/sso/forpost/list',
  FORPOST_ALL_USERS: '/sso/forpost/list-all',
  FORPOST_ADD: '/sso/forpost/add',
  FORPOST_DELETE: '/sso/forpost/delete'
}

const FORPOST_DOMAIN = 'VIDCDOMAIN'

const removeDebugData = (obj: any) => removeObjectKey('debugData', obj)

const APIShortcut = (url: string, data: Object, branch?: string) => {
  const api = new API()

  if (branch) api.setBranch(branch)

  return api
    .setType('json')
    .setData(data)
    .query(url)
}

function isOATSProduct (product: any) {
  return product.offer.originalName.includes('ОАТС')
}

function isForpostDomain (product: any) {
  const isForpost = product.offer.code === FORPOST_DOMAIN
  const isRootOffer = product.offer.isRoot
  return isForpost && isRootOffer
}

const TYPES = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_OATS_USERS: 'SET_OATS_USERS',
  SET_OATS_DOMAINS: 'SET_OATS_DOMAINS',
  SET_FORPOST_ACCOUNTS: 'SET_FORPOST_ACCOUNTS',
  SET_FORPOST_USERS: 'SET_FORPOST_USERS',
  SET_FORPOST_ACCOUNTS_ERROR: 'SET_FORPOST_ACCOUNTS_ERROR',
  SET_FORPOST_USERS_ERROR: 'SET_FORPOST_USERS_ERROR',
  SET_OATS_DOMAINS_FETCH_ERROR: 'SET_OATS_DOMAINS_FETCH_ERROR',
  SET_OATS_USERS_FETCH_ERROR: 'SET_OATS_USERS_FETCH_ERROR'
}

interface IState {
  products: []
  oatsDomains: []
  oatsUsers: []
  forpostAccounts: IForpostAccount[]
  forpostUsers: Record<string, IForpostUser[]>
  forpostUsersError: boolean
  oatsDomainFetchError: boolean
  oatsUsersFetchError: boolean
}

const state: IState = {
  products: [],
  oatsDomains: [],
  oatsUsers: [],
  forpostAccounts: [],
  forpostUsers: {},
  forpostUsersError: false,
  oatsDomainFetchError: false,
  oatsUsersFetchError: false
}

const getters = {
  availableSystems (state: IState, getters: any): string[] {
    const systems: Record<string, any> = {
      [SYSTEM_NAMES.LKB2B]: true,
      [SYSTEM_NAMES.DMP]: true,
      [SYSTEM_NAMES.ITGLOBAL]: false,
      [SYSTEM_NAMES.FORPOST]: getters.hasForpost,
      [SYSTEM_NAMES.OATS]: getters.hasOATS
    }

    return Object.keys(systems).filter(
      (el:string) => systems[el]
    )
  },
  hasOATS (state: IState, getters: any): boolean {
    return !!getters.oatsProductList.length
  },
  hasForpost (state: IState): boolean {
    // return !!state.forpostAccounts.length
    return !!state.products.find(isForpostDomain)
  },
  oatsProductList (state: IState) {
    return state.products.filter(
      isOATSProduct
    )
  },
  forpostAccountsRegistry (state: IState): Record<string, IForpostAccount> {
    return state.forpostAccounts.reduce((acc: Record<string, any>, item: IForpostAccount) => {
      return { ...acc, [item.ID]: item }
    }, {})
  },
  allForpostUserList (state: IState) {
    return Object.values(state.forpostUsers).reduce((acc: IForpostUser[], el: any) => {
      return [...acc, ...el]
    }, [])
  },
  bindedForpostUserList (state: IState, getters: any): IForpostUser[] {
    return getters.allForpostUserList.filter((user: IForpostUser) => user.ExternalID)
  },
  unbindedForpostUserList (state: IState, getters: any): IForpostUser[] {
    return getters.allForpostUserList.filter((user: IForpostUser) => user.ExternalID === null)
  }
}

const actions = {
  pullAvailableProducts (context: ActionContext<IState, any>) {
    const payload = {
      clientId: context.rootGetters['auth/getTOMS']
    }
    return APIShortcut(URLS.PRODUCTS, payload)
      .then(data => {
        context.commit(TYPES.SET_PRODUCTS, data)
        return data
      })
  },
  pullOATSDomains (context: ActionContext<IState, any>, parentId: string) {
    const payload = {
      clientId: context.rootGetters['auth/getTOMS'],
      id: parentId
    }

    return APIShortcut(URLS.OATS_DOMAINS, payload)
      .catch(() => {
        context.commit(TYPES.SET_OATS_DOMAINS_FETCH_ERROR, true)
        throw new Error(`Не получилось запросить домены OATS`)
      })
      .then(data => {
        context.commit(TYPES.SET_OATS_DOMAINS_FETCH_ERROR, false)

        context.commit(TYPES.SET_OATS_DOMAINS, [data])
        return data
      })
  },
  pullOATSUsers (context: ActionContext<IState, any>, domain: string) {
    const newPayload = {
      owner: OATS_USERS_OWNER,
      userDomain: domain
    }
    return APIShortcut(URLS.OATS_USERS, newPayload)
      .catch(() => {
        context.commit(TYPES.SET_OATS_USERS_FETCH_ERROR, true)
        throw new Error(`Не получилось запросить пользователей OATS для домена ${newPayload.userDomain}`)
      })
      .then(data => {
        context.commit(TYPES.SET_OATS_USERS_FETCH_ERROR, false)
        const users = data.accounts
        context.commit(TYPES.SET_OATS_USERS, users)
        return data
      })
  },
  fetchForpostAccounts (context: ActionContext<IState, any>, externalId: any) {
    const payload = {
      // externalId: context.rootGetters['auth/getTOMS']
      externalId // здесь externalId это TOMS
    }

    return APIShortcut(URLS.FORPOST_ALL_USERS, payload, 'web-20443-fix')
      .catch(() => {
        context.commit(TYPES.SET_FORPOST_ACCOUNTS_ERROR, true)
        throw new Error(`Не получилось запросить учётные записи Forpost для externalId=${externalId}`)
      })
      .then(removeDebugData)
      .then(Object.values)
  },
  pullForpostAccounts (context: ActionContext<IState, any>, externalId: any) {
    return context.dispatch('fetchForpostAccounts', externalId)
      .then(data => {
        context.commit(TYPES.SET_FORPOST_ACCOUNTS_ERROR, false)
        context.commit(TYPES.SET_FORPOST_ACCOUNTS, data)
        return data
      })
  },
  pullCurrentUserForpostAccounts (context: ActionContext<IState, any>) {
    const externalId = context.rootGetters['auth/getTOMS']

    return context.dispatch('fetchForpostAccounts', externalId)
      .then(data => {
        context.commit(TYPES.SET_FORPOST_ACCOUNTS, data)
        return data
      })
  },
  pullAllForpostUsers (context: ActionContext<IState, any>) {
    context.state.forpostAccounts.forEach((el: IForpostAccount) => {
      context.dispatch('pullForpostUsers', el.ID)
    })
  },
  pullForpostUsers (context: ActionContext<IState, any>, accountId: string) {
    const payload = {
      accountId
    }

    return APIShortcut(URLS.FORPOST_USERS, payload)
      .catch(() => {
        context.commit(TYPES.SET_FORPOST_USERS_ERROR, true)
        throw new Error(`Не получилось запросить пользователей Forpost для accountId=${accountId}`)
      })
      .then(removeDebugData)
      .then(Object.values)
      .then(data => {
        context.commit(TYPES.SET_FORPOST_USERS_ERROR, false)
        context.commit(TYPES.SET_FORPOST_USERS, { accountId, userList: data })
        return data
      })
  },
  addForpostToSSO (context: ActionContext<IState, any>, payload: any) {
    /*
     параметры:
      {
        id: string, // Forpost user id
        accountId: string, // Forpost account id
        externalId: string, // rootGetters.auth.userInfo.userId
        authProvider: 2
      }
     */

    const newPayload = {
      ...payload,
      // externalId: context.rootState.auth.userInfo.userId,
      authProviderId: SSO_FORPOST_AUTH_PROVIDER
    }

    return APIShortcut(URLS.FORPOST_ADD, newPayload)
      .catch(() => {})
  },
  deleteForpostFromSSO (context: ActionContext<IState, any>, payload: any) {
    /*
     параметры:
      {
        id: string,
        accountId: string,
        externalId: string, // context.rootState.auth.userInfo.userId
        authProvider: 2
      }
     */

    // const externalId = context.rootState.auth.userInfo.userId

    const newPayload = {
      ...payload,
      authProviderId: SSO_FORPOST_AUTH_PROVIDER
    }

    return APIShortcut(URLS.FORPOST_DELETE, newPayload)
  }
}

const mutations = {
  [TYPES.SET_PRODUCTS] (state: IState, data: []) {
    state.products = data
  },
  [TYPES.SET_OATS_DOMAINS] (state: IState, data: []) {
    state.oatsDomains = data
  },
  [TYPES.SET_OATS_USERS] (state: IState, data: []) {
    state.oatsUsers = data
  },
  [TYPES.SET_FORPOST_ACCOUNTS] (state: IState, data: []) {
    state.forpostAccounts = data
  },
  [TYPES.SET_FORPOST_USERS] (state: IState, { accountId, userList }: { accountId: string, userList: IForpostUser[] }) {
    Vue.set(state.forpostUsers, accountId, userList)
  },
  [TYPES.SET_FORPOST_ACCOUNTS_ERROR] (state: IState, isError: boolean) {
    Vue.set(state, 'forpostAccountsError', isError)
  },
  [TYPES.SET_FORPOST_USERS_ERROR] (state: IState, isError: boolean) {
    Vue.set(state, 'forpostUsersError', isError)
  },
  [TYPES.SET_OATS_DOMAINS_FETCH_ERROR] (state: IState, isError: boolean) {
    Vue.set(state, 'oatsDomainFetchError', isError)
  },
  [TYPES.SET_OATS_USERS_FETCH_ERROR] (state: IState, isError: boolean) {
    Vue.set(state, 'oatsUsersFetchError', isError)
  }
}

export default {
  name: 'ProfileStoreModule',
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
