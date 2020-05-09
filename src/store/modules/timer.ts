interface IState {
  timer: Map<string, number>
}

const state: IState = {
  timer: new Map()
}

const mutations = {
  setInterval (state: IState, payload: { id: string, delay: number, cb: (...args: any[]) => void }) {
    if (state.timer.has(payload.id)) {
      console.error('Clear previously value')
      return
    }
    const intervalId = setInterval(payload.cb, payload.delay)
    state.timer.set(payload.id, intervalId)
  },
  clearInterval (state: IState, id: string) {
    if (!state.timer.has(id)) return
    const intervalId = state.timer.get(id)
    clearInterval(intervalId)
    state.timer.delete(id)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
