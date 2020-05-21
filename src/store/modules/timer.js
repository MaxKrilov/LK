const state = {
    timer: new Map()
};
const mutations = {
    setInterval(state, payload) {
        if (state.timer.has(payload.id)) {
            console.error('Clear previously value');
            return;
        }
        const intervalId = setInterval(payload.cb, payload.delay);
        state.timer.set(payload.id, intervalId);
    },
    clearInterval(state, id) {
        if (!state.timer.has(id))
            return;
        const intervalId = state.timer.get(id);
        clearInterval(intervalId);
        state.timer.delete(id);
    }
};
export default {
    namespaced: true,
    state,
    mutations
};
//# sourceMappingURL=timer.js.map