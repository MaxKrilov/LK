import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import accounts from './modules/accounts'
import modal from './modules/modal'
import accountForm from './modules/accountForm'
import directories from './modules/directories'
import api from './modules/api'
import variables from './modules/variables'
import dictionary from './modules/dictionary'
import user from './modules/user'
import request from './modules/request'
import loading from './modules/loading'
import internet from './modules/internet'
import documents from './modules/documents'
import fileinfo from './modules/fileinfo'
import productnservices from './modules/productnservices'
import payments from './modules/payments'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    accounts,
    modal,
    accountForm,
    directories,
    api,
    variables,
    dictionary,
    user,
    request,
    loading,
    internet,
    documents,
    fileinfo,
    productnservices,
    payments
  },
  strict: debug,
  plugins: [createPersistedState({
    key: 'lkb2b',
    paths: ['auth.userToken', 'auth.accessToken', 'auth.refreshToken', 'auth.userInfo']
  })]
})
