import Vue from 'vue'
import { ActionContext } from 'vuex'
import { API } from '@/functions/api'
import { removeObjectKey } from '@/functions/helper'
import { IForpostAccount, IForpostUser, IOatsUser } from '@/interfaces/profile'
import {
  SYSTEM_NAMES,
  OATS_USERS_OWNER,
  SSO_FORPOST_AUTH_PROVIDER
} from '@/constants/profile'

const URLS = {
  PRODUCTS: '/customer/product/client',
  OATS_DOMAINS: '/order/contract/get-oats-domain',
  OATS_USERS: '/sso/oats/users',
  OATS_ADD_USER: '/sso/oats/link',
  OATS_DELETE_USER: '/sso/oats/unlink',
  FORPOST_USERS: '/sso/forpost/list',
  FORPOST_ALL_USERS: '/sso/forpost/list-all',
  FORPOST_ADD: '/sso/forpost/add',
  FORPOST_DELETE: '/sso/forpost/delete'
}

const FORPOST_DOMAIN = 'VIDCDOMAIN'

const removeDebugData = (obj: any) => removeObjectKey('debugData', obj)

const mapOATSUserDomain = (originalUser: any, domain: string): IOatsUser => ({ ...originalUser, domain })

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

// const hasEmptySSOId = (el: IOatsUser): boolean => !el.sso_id.length cityId: "238"

const TYPES = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_OATS_USERS: 'SET_OATS_USERS',
  SET_OATS_DOMAINS: 'SET_OATS_DOMAINS',
  ADD_OATS_DOMAIN: 'ADD_OATS_DOMAINS',
  ADD_OATS_DOMAIN_BY_BPI_N_CITY_ID: 'ADD_OATS_DOMAIN_BY_BPI',
  SET_FORPOST_ACCOUNTS: 'SET_FORPOST_ACCOUNTS',
  SET_FORPOST_USERS: 'SET_FORPOST_USERS',
  SET_FORPOST_ACCOUNTS_ERROR: 'SET_FORPOST_ACCOUNTS_ERROR',
  SET_FORPOST_USERS_ERROR: 'SET_FORPOST_USERS_ERROR',
  SET_OATS_DOMAINS_FETCH_ERROR: 'SET_OATS_DOMAINS_FETCH_ERROR',
  SET_OATS_USERS_FETCH_ERROR: 'SET_OATS_USERS_FETCH_ERROR',

  CLEAR_OATS_USERS: 'CLEAR_OATS_USERS',
  CLEAR_OATS_DOMAINS: 'CLEAR_OATS_DOMAINS'
}

interface IState {
  products: []
  oatsDomains: string[]
  oatsUsers: Record<string, IOatsUser[]>
  forpostAccounts: IForpostAccount[]
  forpostUsers: Record<string, IForpostUser[]>
  forpostUsersError: boolean
  oatsDomainFetchError: boolean
  oatsUsersFetchError: boolean,
  oatsDomainsByBPINCityId: Record<string, { bpi: string, cityId: string }>
}

const state: IState = {
  products: [],
  oatsDomains: [],
  oatsUsers: {},
  forpostAccounts: [],
  forpostUsers: {},
  forpostUsersError: false,
  oatsDomainFetchError: false,
  oatsUsersFetchError: false,
  oatsDomainsByBPINCityId: {}
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
    return state.products.filter(isOATSProduct)
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
  linkedOATSUserList (state: IState, getters: any): any[] {
    return getters.allOatsUserList.filter((user: IOatsUser) => user.sso_id)
  },
  unbindedForpostUserList (state: IState, getters: any): IForpostUser[] {
    return getters.allForpostUserList.filter((user: IForpostUser) => user.ExternalID === null)
  },
  notLinkedOATSUserList (state: IState, getters: any): any[] {
    return getters.allOatsUserList.filter((user: IOatsUser) => user.sso_id === null)
  },
  allOatsUserList (state: IState) {
    return Object.values(state.oatsUsers).reduce((acc, el: any) => {
      return [...acc, ...el]
    }, [])
  },
  bindedOatsUserList (state: IState, getters: any) {
    return getters.allOatsUserList.filter((el: IOatsUser) => el.sso_id)
  },
  unbindedOatsUserList (state: IState, getters: any) {
    return getters.allOatsUserList.filter((el: IOatsUser) => !el.sso_id)
  },
  notLinkedDomains (state: IState) {
    return (userId: string) => {
      return state.oatsDomains
        .filter(domain => {
          const userList = state.oatsUsers[domain]

          if (!userList) return false

          return !userList.length ||
            !userList.some(user => user.sso_id === userId)
        })
    }
  },
  oatsPortalLink () {
    // const first = head(getters.oatsProductList) as Record<string, any>
    // if (first) return `/lk/oats/go-to-portal?bpi=${first.id}&cityId=${first.cityId}`
    return '/lk/oats/go-to-portal'
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
  pullOATSDomains (context: ActionContext<IState, any>, { id, cityId }: { id: string, cityId: string }) {
    const payload = {
      clientId: context.rootGetters['auth/getTOMS'],
      id: id
    }

    return APIShortcut(URLS.OATS_DOMAINS, payload)
      .catch(() => {
        context.commit(TYPES.SET_OATS_DOMAINS_FETCH_ERROR, true)
        throw new Error(`Не получилось запросить домены OATS`)
      })
      .then(data => {
        context.commit(TYPES.SET_OATS_DOMAINS_FETCH_ERROR, false)

        if (!context.state.oatsDomains.find(el => el === data)) {
          context.commit(TYPES.ADD_OATS_DOMAIN, data)
          context.commit(TYPES.ADD_OATS_DOMAIN_BY_BPI_N_CITY_ID, {
            domain: data,
            bpi: id,
            cityId
          })
        }

        return data
      })
  },
  pullOATSUsers (context: ActionContext<IState, any>, domain: string) {
    const newPayload = {
      owner: OATS_USERS_OWNER,
      userDomain: domain,
      cityId: context.state.oatsDomainsByBPINCityId[domain].cityId
    }
    return APIShortcut(URLS.OATS_USERS, newPayload)
      .catch(() => {
        context.commit(TYPES.SET_OATS_USERS_FETCH_ERROR, true)
        throw new Error(`Не получилось запросить пользователей OATS для домена ${newPayload.userDomain}`)
      })
      .then(data => {
        context.commit(TYPES.SET_OATS_USERS_FETCH_ERROR, false)

        const users: IOatsUser[] = data.accounts.map((el: any) => mapOATSUserDomain(el, domain))

        context.commit(TYPES.SET_OATS_USERS, { domain, list: users })
        return data
      })
  },
  linkOATSDirector (context: ActionContext<IState, any>, domain: string) {
    /* */

    const { userId: ssoId } = context.rootState.auth.userInfo

    const payload = {
      domain,
      login: 'director',
      ssoId
    }
    return context.dispatch('addOatsUser', payload)
  },
  addOatsUser (
    context: ActionContext<IState, any>,
    payload: {domain: string, login: string, ssoId: string}
  ) {
    /*
      Параметры привязки:
      owner - Владелец, например: domru
      userDomain - домен для учеток
      login - логин из поля accounts.login в пред. ответе
      sso_id - id учетки в SSO // поле sub или userId из токена
    */

    // eslint-disable-next-line camelcase
    const { domain: userDomain, login, ssoId: sso_id } = payload
    const newPayload = {
      owner: OATS_USERS_OWNER,
      userDomain,
      login,
      sso_id,
      cityId: context.state.oatsDomainsByBPINCityId[userDomain].cityId
    }

    return APIShortcut(URLS.OATS_ADD_USER, newPayload)
      .catch((error) => {
        console.log(error)
      })
  },
  deleteOatsUser (context: ActionContext<IState, any>, payload: {userDomain: string, login: string}) {
    /*
      Параметры отвязки пользователя:
      owner - Владелец, например: domru
      userDomain - домен для учеток
      login - логин из поля accounts.login в пред. ответе
    */

    const newPayload = {
      owner: OATS_USERS_OWNER,
      cityId: context.state.oatsDomainsByBPINCityId[payload.userDomain].cityId,
      ...payload
    }

    return APIShortcut(URLS.OATS_DELETE_USER, newPayload)
      .catch(() => {})
  },
  fetchForpostAccounts (context: ActionContext<IState, any>, externalId: any) {
    const payload = {
      // externalId: context.rootGetters['auth/getTOMS']
      externalId // здесь externalId это TOMS
    }

    return APIShortcut(URLS.FORPOST_ALL_USERS, payload)
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
  },
  cleanupOATSData (context: ActionContext<IState, any>) {
    context.commit(TYPES.CLEAR_OATS_USERS)
    context.commit(TYPES.CLEAR_OATS_DOMAINS)
  }
}

const mutations = {
  [TYPES.SET_PRODUCTS] (state: IState, data: []) {
    state.products = data
  },
  [TYPES.ADD_OATS_DOMAIN] (state: IState, domain: string) {
    // @ts-ignore
    state.oatsDomains.push(domain)
  },
  [TYPES.SET_OATS_DOMAINS] (state: IState, data: []) {
    state.oatsDomains = data
  },
  [TYPES.SET_OATS_USERS] (state: IState, data: {domain: string, list: IOatsUser[]}) {
    Vue.set(state.oatsUsers, data.domain, data.list)
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
  },
  [TYPES.CLEAR_OATS_USERS] (state: IState) {
    Vue.set(state, 'oatsUsers', [])
  },
  [TYPES.CLEAR_OATS_DOMAINS] (state: IState) {
    Vue.set(state, 'oatsDomains', {})
  },
  [TYPES.ADD_OATS_DOMAIN_BY_BPI_N_CITY_ID] (state: IState, payload: { domain: string, bpi: string, cityId: string }) {
    state.oatsDomainsByBPINCityId[payload.domain] = {
      bpi: payload.bpi,
      cityId: payload.cityId
    }
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
