<template lang="pug">
  div.app.erth(data-app="true")
    div.app__content
      template(v-if="isShowPreloader")
        ErPreloader(:status="textPreloader")
      template(v-else-if="$props.isWorkInProgress")
        work-in-progress
      template(v-else-if="!isAccessGranted")
        not-access-page
      template(v-else)
        router-view
        ErtSnackbar(
          :value="isShowWarningMessage"
          type="warning"
          :infinity="true"
        )
          div
            div Вы отсутствовали более {{ halfLifetimeRefreshToken }} минут. Для безопасности вашего аккаунта в скором времени&nbsp;
              | произойдёт логаут
            div.snackbar-continue-button.mt-8(@click="updateTokens")
              button
                | Продолжить
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getScreenWidth, isLocalhost } from './functions/helper'
import NotAccessPage from './components/pages/errors/not-access'
import WorkInProgress from '@/components/pages/errors/work-in-progress'
import ErPreloader from './components/blocks/ErPreloader'

import ErtTokens from '@/mixins2/ErtTokens'

import * as Sentry from '@sentry/vue'

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
    WorkInProgress,
    NotAccessPage,
    ErPreloader
  },
  mixins: [
    ErtTokens
  ],
  props: {
    isWorkInProgress: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    model: ''
  }),
  watch: {
    // isAccessGranted (val) {
    //   if (val) {
    //     this.fetchUserData()
    //   }
    // },
    rebootBillingAccount (val) {
      if (!val) {
        const context = { api: this.$api }
        this.$store.commit(`loading/menuComponentBalance`, true)
        this.$store.commit(`loading/indexPageProductByAddress`, true)
        this.$store.commit(`loading/indexPageProductByService`, true)
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
    this.createdHook()
      .then(() => {
        this.isAccessGranted && this.fetchUserData()
      })
    if (USE_SSO_AUTH) {}
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
  mounted () {
    this.onHandleInaction()
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
          if (!isLocalhost()) {
            Sentry.configureScope(scope => {
              scope.setUser({ clientId: this.user.toms })
            })
          }
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
      rebootBillingAccount: state => state.loading.rebootBillingAccount,
      isLogouting: state => state.auth.isLogouting,
      isLogging: state => state.auth.isLogging,
      // Токены (для валидации запросов)
      accessToken: state => state.auth.accessToken,
      refreshToken: state => state.auth.refreshToken
    }),
    isAccessGranted () {
      return USE_SSO_AUTH ? this.hasAccess : true
    },
    isShowPreloader () {
      return this.isLogging || this.isLogouting
    },
    textPreloader () {
      return this.isLogging
        ? 'Проверяем авторизацию'
        : this.isLogouting
          ? 'Выполняется выход из системы'
          : ''
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

    .snackbar-continue-button button {
      padding: 4px;
      border: 1px solid currentColor;
      border-radius: 4px;
    }
  }
}
</style>
