import { API } from '@/functions/api'
import { ActionContext } from 'vuex'
import { IOATSDomain } from '@/interfaces/oats'
import PnS from '@/store/modules/productnservices'
import { ILocationOfferInfo } from '@/tbapi'

const OATS_PRODUCT_TYPE = 'ОАТС'

const APIShortcut = (url: string, data: Object, branch?: string) => {
  const api = new API()

  if (branch) api.setBranch(branch)

  return api
    .setType('json')
    .setData(data)
    .query(url)
}

// const OATS_BRANCH = 'web-bss-psi1'
const URLS = {
  DOMAINS: '/customer/product/oats',
  PORTAL_LINK: '/sso/forpost/oats-link'
}

const MUTATIONS = {
  SET_DOMAINS: 'SET_DOMAINS',
  SET_DOMAINS_LOADED: 'SET_DOMAINS_LOADED',
  SET_POINTS: 'SET_POINTS',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE'
}

interface IState {
  domains: Record<string, any>
  isDomainsLoaded: boolean
  pointList: any[],
  errorMessage: string
}

const state: IState = {
  domains: {},
  isDomainsLoaded: false,
  pointList: [],
  errorMessage: ''
}

const getters = {
  domainList (state: IState): IOATSDomain[] {
    return Object.values(state.domains)
  },
  pointBpiList (state: IState) {
    return state.pointList.map(({ bpi }: ILocationOfferInfo) => bpi)
  },
  errorMessage (state: IState) {
    return state.errorMessage
  }
}

const actions = {
  fetchPoints (context: ActionContext<IState, any>, payload: { api: API, productType: string}) {
    return PnS.actions.locationOfferInfo(context, payload)
  },
  pullPoints (context: ActionContext<IState, any>) {
    const payload = {
      api: new API(),
      productType: OATS_PRODUCT_TYPE
    }

    return context.dispatch('fetchPoints', payload)
      .then(points => {
        context.commit(MUTATIONS.SET_POINTS, points)
        return points
      })
  },
  pullDomains ({ rootGetters, commit }: ActionContext<IState, any>) {
    const payload = {
      clientId: rootGetters['auth/getTOMS'],
      status: ['Active', 'Activation in Progress', 'Activation passed PONR', 'Suspended'],
      productType: 'ОАТС'
    }
    return APIShortcut(URLS.DOMAINS, payload)
      .then(data => {
        commit(MUTATIONS.SET_DOMAINS, data)
        commit(MUTATIONS.SET_DOMAINS_LOADED, true)
      })
      .catch(error => commit(MUTATIONS.SET_ERROR_MESSAGE, error.response.data.message))
  },
  fetchPortalLink (context: ActionContext<IState, any>, { cityId, account }: { cityId: string, account: string }) {
    const isManager = context.rootState.auth.isManager
    let payload: Record<string, any> = {
      isManager,
      cityId,
      account
    }

    const toms = context.rootGetters['auth/getTOMS']
    if (isManager) payload['externalId'] = toms

    return APIShortcut(URLS.PORTAL_LINK, payload)
  }
}

interface IOATSDomainRegistry extends Record<string, any> {}

const mutations = {
  [MUTATIONS.SET_DOMAINS] (state: IState, payload: IOATSDomainRegistry) {
    state.domains = payload
  },
  [MUTATIONS.SET_DOMAINS_LOADED] (state: IState, payload: boolean) {
    state.isDomainsLoaded = payload
  },
  [MUTATIONS.SET_POINTS] (state: IState, payload: any[]) {
    state.pointList = payload
  },
  [MUTATIONS.SET_ERROR_MESSAGE] (state: IState, payload: string) {
    state.errorMessage = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
