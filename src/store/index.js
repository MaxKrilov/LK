import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import accounts from './modules/accounts'
import contacts from './modules/contacts'
import modal from './modules/modal'
import accountForm from './modules/accountForm'
import contactForm from './modules/contactForm'
import directories from './modules/directories'
import api from './modules/api'
import variables from './modules/variables'
import dictionary from './modules/dictionary'
import user from './modules/user'
import request from './modules/request'
import loading from './modules/loading'
import orders from './modules/orders'
import campaign from './modules/campaign'
import survey from './modules/survey'
import internet from './modules/internet'
import documents from './modules/documents'
import fileinfo from './modules/fileinfo'
import productnservices from './modules/productnservices'
import payments from './modules/payments'
import salesOrder from './modules/sales-order'
import telephony from './modules/telephony'
import chat from './modules/chat'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    accounts,
    contacts,
    modal,
    accountForm,
    contactForm,
    directories,
    api,
    variables,
    dictionary,
    user,
    request,
    loading,
    orders,
    campaign,
    survey,
    internet,
    documents,
    fileinfo,
    productnservices,
    payments,
    salesOrder,
    telephony,
    chat
  },
  strict: debug,
  plugins: [createPersistedState({
    key: 'lkb2b',
    paths: ['auth.userToken', 'auth.accessToken', 'auth.refreshToken', 'auth.userInfo']
  })]
})
