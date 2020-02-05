<template lang="pug">
  div.app(data-app="true")
    div.app__content
      //-template(v-if="isFetching")
        | Проверяем авторизацию
      //-template(v-else-if="!hasAccess")
        | Доступ закрыт
      //-template(v-else)
      router-view
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth } from './functions/helper'

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
    menuComponentBillingAccount () {
      this.$store.commit(`loading/menuComponentBalance`, true)
      this.$store.commit(`loading/loadingPromisedPayment`, true)
      this.$store.commit(`loading/indexPageProductByAddress`, true)
      this.$store.dispatch(`user/${GET_PAYMENT_INFO}`, { api: this.$api })
      this.$store.dispatch(`user/${GET_PROMISED_PAYMENT_INFO}`, { api: this.$api })
      this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, { api: this.$api })
        .then(() => {
          this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, { api: this.$api })
        })
    }
  },
  async created () {
    if (process.env.VUE_APP_USE_SSO_AUTH !== 'no') {
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
  },
  methods: {},
  computed: {
    ...mapGetters('auth', ['user', 'hasAccess']),
    ...mapState({
      error: state => state.auth.error,
      isFetching: state => state.auth.isFetching,
      isFetched: state => state.auth.isFetched,
      refreshedToken: state => state.auth.refreshedToken,
      menuComponentBillingAccount: state => state.loading.menuComponentBillingAccount
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
