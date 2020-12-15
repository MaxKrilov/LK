interface IState {
  lifetime: {
    access: number
    refresh: number
  },
  created: {
    access: number
    refresh: number
  },
  interval: {
    access: number,
    refresh: number
  },
  isExpiressSoon: boolean
}

const state: IState = {
  lifetime: {
    access: 0,
    refresh: 0
  },
  created: {
    access: 0,
    refresh: 0
  },
  interval: {
    access: 0,
    refresh: 0
  },
  isExpiressSoon: false
}

const mutations = {
  setLifetime (state: IState, payload: { token: 'access' | 'refresh', lifetime: number }) {
    state.lifetime[payload.token] = payload.lifetime
  },
  setCreated (state: IState, payload: { token: 'access' | 'refresh', created: number }) {
    state.created[payload.token] = payload.created
  },
  setInterval (state: IState, payload: { token: 'access' | 'refresh', interval: number }) {
    state.interval[payload.token] = payload.interval
  },
  clearInterval (state: IState, payload: { token: 'access' | 'refresh' }) {
    clearInterval(state.interval[payload.token])
    state.interval[payload.token] = 0
  },
  setExpiressSoon (state: IState, payload: boolean) {
    state.isExpiressSoon = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
