<template lang="pug">
  div.app(data-app="true")
    div.app__content
      template(v-if="isFetching")
        | Проверяем авторизацию
      template(v-else-if="!isAccessGranted")
        not-access-page
      template(v-else)
        router-view
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'
import axios from 'axios'
import NotAccessPage from './components/pages/errors/not-access'

import {
  GET_CLIENT_INFO,
  GET_LIST_BILLING_ACCOUNT, GET_LIST_PRODUCT_BY_ADDRESS, GET_LIST_PRODUCT_BY_SERVICE,
  GET_MANAGER_INFO, GET_PAYMENT_INFO, GET_PROMISED_PAYMENT_INFO
} from '@/store/actions/user'
import { GET_CHAT_TOKEN } from '@/store/actions/chat'

import { GET_REQUEST } from '@/store/actions/request'

const USE_SSO_AUTH = process.env.VUE_APP_USE_SSO_AUTH !== 'no'

export default {
  name: 'app',
  components: {
    NotAccessPage
  },
  data: () => ({
    model: 1
  }),
  watch: {
    isAccessGranted (val) {
      if (val) {
        this.fetchUserData()
      }
    },
    rebootBillingAccount (val) {
      if (!val) {
        const context = { api: this.$api }
        this.$store.commit(`loading/menuComponentBalance`, true)
        this.$store.commit(`loading/indexPageProductByAddress`, true)
        this.$store.commit(`loading/loadingDocuments`, true)
        this.$store.dispatch(`fileinfo/downloadListDocument`, context)
        this.$store.dispatch(`user/${GET_PAYMENT_INFO}`, context)
        this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, context)
          .then(() => {
            this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, context)
          })
      }
    }
  },
  async created () {
    if (USE_SSO_AUTH) {
      axios.interceptors.response.use(response => response, err => {
        return new Promise((resolve, reject) => {
          if (err && err.response && [403, 401].includes(err.response.status)) {
            this.$store.dispatch('auth/signIn', { api: this.$api })
          }
          reject(err)
        })
      })
    }

    if (this.isAccessGranted) {
      this.fetchUserData()
    }
  },
  beforeCreate () {
    this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    window.addEventListener('resize', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
    window.addEventListener('orientationchange', () => {
      this.$store.commit(SCREEN_WIDTH, getScreenWidth())
    })
    console.log('%c ВНИМАНИЕ!', 'font-size: 28px; color: #E31E24')
    console.log(
      '%c Данная опция браузера предназначена для разработчиков! Пожалуйста, не вводите здесь что-либо для обеспечения безопасности вашего аккаунта!',
      'font-size: 12px;'
    )
    console.log(
      '%c Если вы обнаружили какую-то уязвимость или недоработку, то, пожалуйста, сообщите о ней нам',
      'font-size: 12px;'
    )
    console.log(
      '%c Считаете, что можете сделать лучше? Тогда скорее отправляйте нам своё резюме на http://job.ertelecom.ru/ :)',
      'font-size: 10px'
    )
  },
  methods: {
    ...mapActions({
      fetchNotifications: 'campaign/fetchNotifications',
      fetchPPR: 'campaign/fetchPPR',
      fetchClientInfo: `user/${GET_CLIENT_INFO}`
    }),
    fetchUserData () {
      const context = { api: this.$api }
      this.fetchNotifications(context)
      this.fetchPPR(context)
      this.fetchClientInfo(context)
        .then(clientInfo => {
          if (Object.keys(clientInfo).length !== 0) {
            this.$store.dispatch(`user/${GET_MANAGER_INFO}`, context)
            this.$store.dispatch(`request/${GET_REQUEST}`, context)
            this.$store.dispatch(`fileinfo/downloadListDocument`, context)
            this.$store.dispatch(`user/${GET_LIST_BILLING_ACCOUNT}`, { ...context, route: this.$route })
              .then(isValid => {
                if (isValid) {
                  this.$store.dispatch(`user/${GET_PAYMENT_INFO}`, context)
                  this.$store.dispatch(`chat/${GET_CHAT_TOKEN}`, context)
                  this.$store.dispatch(`user/${GET_PROMISED_PAYMENT_INFO}`, context)
                  this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, context)
                    .then(() => {
                      this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, context)
                    })
                } else {
                  this.$store.commit(`loading/menuComponentBalance`, false)
                  this.$store.commit(`loading/loadingPromisedPayment`, false)
                  this.$store.commit(`loading/indexPageProductByAddress`, false)
                }
              })
          }
        })
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'hasAccess']),
    ...mapState({
      error: state => state.auth.error,
      isFetching: state => state.auth.isFetching,
      isFetched: state => state.auth.isFetched,
      refreshedToken: state => state.auth.refreshedToken,
      rebootBillingAccount: state => state.loading.rebootBillingAccount
    }),
    isAccessGranted () {
      return USE_SSO_AUTH ? this.hasAccess : true
    }
  }
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;

    &__height-auto {
      min-height: auto;
    }
  }
}
</style>
