<template lang="pug">
  div.app.erth(data-app="true")
    div.app__content
      template(v-if="isShowPreloader || isCheckingForwardStatus")
        ErPreloader(
          :status="textPreloader"
          :isEcommerce="isEcommerce"
        )
      template(v-else-if="$props.isWorkInProgress || (forwardStatusResult && forwardStatusResult.status === true)")
        work-in-progress(
          :userMessage="forwardStatusResult && forwardStatusResult.userMessage"
          :isAfterAuth="forwardStatusResult && forwardStatusResult.afterAuth === true"
        )
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
            div Вы отсутствовали более {{ halfLifetimeRefreshToken }} минут. Для безопасности вашего аккаунта сессия скоро будет завершена.
            div.snackbar-continue-button.mt-8(@click="updateTokens")
              button
                | Остаться в системе
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { SCREEN_WIDTH } from './store/actions/variables'
import { getWindowWidth, isFramed, isLocalhost } from './functions/helper'
import NotAccessPage from './components/pages/errors/not-access'
import WorkInProgress from '@/components/pages/errors/work-in-progress'
import ErPreloader from './components/blocks/ErPreloader'

import ErtTokens from '@/mixins2/ErtTokens'

import * as Sentry from '@sentry/vue'

import {
  GET_CATEGORY_INFO,
  GET_CLIENT_INFO, GET_DISTRIBUTION_CHANNEL,
  GET_BILLING_CONTACTS,
  GET_LIST_PRODUCT_BY_ADDRESS, GET_LIST_PRODUCT_BY_SERVICE,
  GET_MANAGER_INFO
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
    model: [],
    isCheckingForwardStatus: false
  }),
  watch: {
    isAccessGranted (val) {
      if (val && !this.forwardStatusResult?.status) {
        this.fetchUserData()
      }
    },
    rebootBillingAccount (val) {
      if (!val) {
        const context = { api: this.$api }
        this.$store.commit(`loading/menuComponentBalance`, true)
        this.$store.commit(`loading/indexPageProductByAddress`, true)
        this.$store.commit(`loading/indexPageProductByService`, true)
        this.$store.commit(`loading/loadingDocuments`, true)
        this.$store.dispatch(`fileinfo/downloadListDocument`, context)
        this.$store.dispatch(`payments/getBillingInfo`, context)
          .then(({ branchId }) => {
            this.getBranchLocation(branchId)
          })
        this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, context)
          .then(() => {
            this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, context)
          })
      }
    }
  },
  async created () {
    this.isCheckingForwardStatus = true
    const forwardResult = await this.getForwardStatus({ api: this.$api })
    this.isCheckingForwardStatus = false

    const isEnableForward = forwardResult.status === true
    const isAfterAuth = forwardResult.afterAuth === true

    if (!isEnableForward || (isEnableForward && isAfterAuth)) {
      await this.createdHook()
    }
    if (!isEnableForward && this.isAccessGranted) {
      this.fetchUserData()
    }

    this.forwardStatusResult = forwardResult
  },
  beforeCreate () {
    this.$store.commit(SCREEN_WIDTH, getWindowWidth())
    window.addEventListener('resize', () => {
      this.$store.commit(SCREEN_WIDTH, getWindowWidth())
    })
    window.addEventListener('orientationchange', () => {
      this.$store.commit(SCREEN_WIDTH, getWindowWidth())
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
    if (!this.isManager && !this.forwardStatusResult?.status) {
      this.onHandleInaction()
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
    }
  },
  methods: {
    ...mapActions({
      fetchNotifications: 'campaign/fetchNotifications',
      fetchPPR: 'campaign/fetchPPR',
      fetchClientInfo: `user/${GET_CLIENT_INFO}`,
      pullAvailableProducts: 'profile/pullAvailableProducts',
      pullOATSDomains: 'profile/pullOATSDomains',
      pullOATSUsers: 'profile/pullOATSUsers',
      createUserRoles: 'accountForm/createUserRoles',
      linkOATSDirector: 'profile/linkOATSDirector',
      getForwardStatus: 'user/getForwardStatus',
      getBranchLocation: `branch/pullBranchLocation`
    }),
    fetchOatsLPRLink () {
      this.pullAvailableProducts()
        .then(() => {
          if (!this.isLPR) return
          Promise.allSettled(this.oatsProductList.map(({ id, cityId }) => {
            return new Promise((resolve, reject) => {
              this.pullOATSDomains({ id, cityId })
                .then(domain => {
                  this.pullOATSUsers(domain)
                    .then(() => resolve())
                    .catch(e => reject(e))
                })
                .catch(e => reject(e))
            })
          }))
            .then(() => {
              if (!this.user.postAccess.includes('oats')) {
                this.createUserRoles({
                  api: this.$api,
                  userPostId: this.user.postId,
                  systemRoleId: 8
                })
              }

              this.notLinkedDomains(this.user.sub)
                .forEach(domain => {
                  this.linkOATSDirector(domain)
                    .then(() => {
                      this.pullOATSUsers(domain)
                    })
                })
            })
            .catch(e => {
              console.error(e)
            })
        })
    },
    fetchUserData () {
      const context = { api: this.$api }
      !this.isEcommerce && this.fetchNotifications(context)
      !this.isEcommerce && this.fetchPPR(context)
      this.fetchClientInfo(context)
        .then(clientInfo => {
          if (!isLocalhost()) {
            Sentry.configureScope(scope => {
              scope.setUser({ clientId: this.user.toms })
            })
          }
          this.setUserId(this.user.toms)
          if (Object.keys(clientInfo).length !== 0) {
            !this.isEcommerce && this.$store.dispatch(`user/${GET_MANAGER_INFO}`, context)
            !this.isEcommerce && this.$store.dispatch(`request/${GET_REQUEST}`, context)
            this.$store.dispatch(`user/${GET_CATEGORY_INFO}`, context)
              .then(() => {
                this.$store.dispatch(`user/${GET_DISTRIBUTION_CHANNEL}`)
              })
            !this.isEcommerce && this.$store.dispatch(`request/${GET_REQUEST}`, context)
            !this.isEcommerce && this.$store.dispatch(`fileinfo/downloadListDocument`, context)
            this.$store.dispatch(`payments/getListBillingAccount`, { route: this.$route })
              .then(isValid => {
                if (isValid) {
                  this.fetchOatsLPRLink()
                  this.$store.dispatch(`payments/getBillingInfo`, context)
                    .then(({ branchId }) => {
                      this.getBranchLocation(branchId)
                    })
                  this.$store.dispatch(`chat/${GET_CHAT_TOKEN}`, context)
                  !this.isEcommerce && this.$store.dispatch(`user/${GET_BILLING_CONTACTS}`, context)
                  !this.isEcommerce && this.$store.dispatch(`payments/getPromisedPaymentInfo`, context)
                  !this.isEcommerce && this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_ADDRESS}`, context)
                    .then(() => {
                      !this.isEcommerce && this.$store.dispatch(`user/${GET_LIST_PRODUCT_BY_SERVICE}`, context)
                    })
                } else {
                  this.$store.commit(`loading/menuComponentBalance`, false)
                  this.$store.commit(`loading/loadingPromisedPayment`, false)
                  this.$store.commit(`loading/indexPageProductByAddress`, false)
                }
              })
          }
        })
    },
    setUserId (userId) {
      if (typeof window !== 'undefined') {
        window.hasOwnProperty('gtag') && window.gtag('config', 'UA-42532108-4', { 'user_id': userId })
        window.hasOwnProperty('ga') && window.ga('set', 'userId', userId)
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'hasAccess', 'isLPR']),
    ...mapGetters('profile', ['oatsProductList', 'notLinkedDomains']),
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
    },
    isEcommerce () {
      return isFramed() && !!location.href.match(/ecommerce/g)
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
