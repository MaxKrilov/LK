import Vue from 'vue'
import Vuex from 'vuex'

import api from './modules/api'
import variables from './modules/variables'
import dictionary from './modules/dictionary'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
    variables,
    dictionary
  }
})
