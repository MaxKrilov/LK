<template lang="pug">
  div.app(data-app="true")
    div.app__content
      template(v-if="isFetching")
        | Проверяем авторизацию
      template(v-else-if="!hasAccess")
        | Доступ закрыт
      template(v-else)
        router-view
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'
import axios from 'axios'

import {
  GET_CLIENT_INFO,
  GET_LIST_BILLING_ACCOUNT, GET_LIST_PRODUCT_BY_ADDRESS, GET_LIST_PRODUCT_BY_SERVICE,
  GET_MANAGER_INFO, GET_PAYMENT_INFO, GET_PROMISED_PAYMENT_INFO,
  GET_DOCUMENTS
} from '@/store/actions/user'

import { GET_REQUEST } from '@/store/actions/request'

export default {
  name: 'app',
  data: () => ({
    model: 1
  }),
  watch: {
    rebootBillingAccount (val) {
      if (!val) {
        this.$store.commit(`loading/menuComponentBalance`, true)
        // this.$store.commit(`loading/loadingPromisedPayment`, true) todo убрать комментарий
        this.$store.commit(`loading/indexPageProductByAddress`, true)
        this.$store.dispatch(`user/${GET_PAYMENT_INFO}`, { api: this.$api })
        // this.$store.dispatch(`user/${GET_PROMISED_PAYMENT_INFO}`, { api: this.$api }) todo убрать комментарий
        this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, { api: this.$api })
          .then(() => {
            this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, { api: this.$api })
          })
      }
    }
  },
  async created () {
    if (process.env.VUE_APP_USE_SSO_AUTH !== 'no') {
      axios.interceptors.response.use(response => response, err => {
        return new Promise((resolve, reject) => {
          if (err && err.response && [403, 401].includes(err.response.status)) {
            this.$store.dispatch('auth/signOut', { api: this.$api })
          }
          reject(err)
        })
      })
      if (!this.refreshedToken.isFetching && !this.serverErrorMessage) {
        this.$store.dispatch('auth/checkAuth', { api: this.$api })
          .then(() => {
            this.$store.dispatch(`user/${GET_CLIENT_INFO}`, { api: this.$api })
              .then(clientInfo => {
                if (Object.keys(clientInfo).length !== 0) {
                  this.$store.dispatch(`user/${GET_MANAGER_INFO}`, { api: this.$api })
                  this.$store.dispatch(`request/${GET_REQUEST}`, { api: this.$api })
                  this.$store.dispatch(`user/${GET_DOCUMENTS}`, { api: this.$api })
                  this.$store.dispatch(`user/${GET_LIST_BILLING_ACCOUNT}`, { api: this.$api })
                    .then(isValid => {
                      if (isValid) {
                        this.$store.dispatch(`user/${GET_PAYMENT_INFO}`, { api: this.$api })
                        this.$store.dispatch(`user/${GET_PROMISED_PAYMENT_INFO}`, { api: this.$api })
                        this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, { api: this.$api })
                          .then(() => {
                            this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, { api: this.$api })
                          })
                      } else {
                        this.$store.commit(`loading/menuComponentBalance`, false)
                        this.$store.commit(`loading/loadingPromisedPayment`, false)
                        this.$store.commit(`loading/indexPageProductByAddress`, false)
                      }
                    })
                }
              })
          })
      }
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
  methods: {},
  computed: {
    ...mapGetters('auth', ['user', 'hasAccess']),
    ...mapState({
      error: state => state.auth.error,
      isFetching: state => state.auth.isFetching,
      isFetched: state => state.auth.isFetched,
      refreshedToken: state => state.auth.refreshedToken,
      rebootBillingAccount: state => state.loading.rebootBillingAccount
    })
  }
}
</script>

<style lang="scss">
.app {
  &__content {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
}
</style>
