import Vue from 'vue'
import Component from 'vue-class-component'

import { parseJwt } from '@/functions/helper'
import { mapState, mapActions } from 'vuex'
import { API } from '@/functions/api'
import { IForward } from '@/interfaces/forward'

// const USE_SSO_AUTH = process.env.VUE_APP_USE_SSO_AUTH !== 'no'

@Component<InstanceType<typeof ErtTokens>>({
  computed: {
    ...mapState({
      accessToken: (state: any) => state.auth.accessToken,
      refreshToken: (state: any) => state.auth.refreshToken,
      isManager: (state: any) => state.auth.isManager
    })
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn',
      fetchRefreshToken: 'auth/fetchRefreshToken',
      signOut: 'auth/signOut',
      getForwardStatus: 'user/getForwardStatus'
    })
  }
})
export default class ErtTokens extends Vue {
  // Vuex state
  accessToken!: string
  refreshToken!: string
  isManager!: boolean

  // Vuex actions
  signIn!: ({ api }: { api: API }) => Promise<any>
  fetchRefreshToken!: ({ api }: { api: API }) => Promise<boolean>
  signOut!: ({ api }: { api: API }) => Promise<void>
  getForwardStatus!: ({ api }: { api: API }) => Promise<IForward>

  // Data
  isInactive: boolean = false
  inactiveTimer: number = 0
  inactiveEventHandler: null | (() => void) = null

  lifetimeAccessToken: number = 0
  timestampCreatingAccessToken: number = 0
  accessTokenInterval: number = 0

  lifetimeRefreshToken: number = 0
  timestampCreatingRefreshToken: number = 0

  isShowWarningMessage: boolean = false

  forwardStatusResult: IForward | null = null

  get halfLifetimeRefreshToken () {
    return Math.floor(this.lifetimeRefreshToken / 2 / 60)
  }

  getNow () {
    return parseInt(Date.now() / 1000, 10)
  }

  getTokenLifetime (token: string) {
    if (!token) return 0
    const payload = parseJwt(token)
    const { exp } = payload

    return exp as number
  }

  isValidToken (token: string) {
    const exp = this.getTokenLifetime(token)
    const now = this.getNow()

    return exp - now > 0
  }

  onHandleInaction () {
    const eventHandler = () => {
      if (this.isShowWarningMessage) return
      clearTimeout(this.inactiveTimer)
      this.isInactive = false
      this.inactiveTimer = setTimeout(() => {
        this.isInactive = true
      }, this.lifetimeAccessToken / 2 * 1000)
    }

    document.addEventListener('mousemove', eventHandler)
    document.addEventListener('keydown', eventHandler)
    document.addEventListener('scroll', eventHandler)

    this.inactiveEventHandler = eventHandler
  }

  onProccessingAccessToken () {
    clearInterval(this.accessTokenInterval)
    // Определяем время жизни access token и refresh токен (в секундах)
    this.lifetimeAccessToken = this.getTokenLifetime(this.accessToken) - this.getNow()
    this.lifetimeRefreshToken = this.getTokenLifetime(this.refreshToken) - this.getNow()
    // Определяем дату/время получения токена
    this.timestampCreatingAccessToken = this.getNow()
    this.timestampCreatingRefreshToken = this.getNow()
    // Запускаем интервал (ежесекундный)
    this.accessTokenInterval = setInterval(async () => {
      if (this.isInactive && this.getNow() - this.timestampCreatingAccessToken > this.lifetimeRefreshToken) {
        // Разлогиниваем
        this.signOut({ api: new API() })
      } else if (this.isInactive && this.getNow() - this.timestampCreatingAccessToken > this.lifetimeRefreshToken / 2) {
        this.isShowWarningMessage = true
      } else if (!this.isInactive && this.getNow() - this.timestampCreatingAccessToken > this.lifetimeAccessToken / 2) {
        // Пользователь активен, но access-токен скоро протухнет - обновим
        this.forwardStatusResult = await this.getForwardStatus({ api: this.$api })
        if (!this.forwardStatusResult.status) {
          const fetchRefreshTokenResult = await this.fetchRefreshToken({ api: new API() })
          fetchRefreshTokenResult && this.onProccessingAccessToken()
        } else {
          clearInterval(this.accessTokenInterval)
        }
      }
    }, 1000)
  }

  createdHook () {
    return new Promise((resolve, reject) => {
      if (!this.accessToken || !this.isValidToken(this.accessToken)) {
        this.signIn({ api: new API() })
          .then(response => {
            !this.isManager && this.onProccessingAccessToken()
            resolve(response)
          })
          .catch(error => reject(error))
        return
      }

      !this.isManager && this.fetchRefreshToken({ api: new API() })
        .then(response => {
          if (!response) reject()
          this.onProccessingAccessToken()

          resolve()
        })

      if (this.isManager) {
        resolve()
      }
    })
  }

  updateTokens () {
    this.isShowWarningMessage = false
    this.fetchRefreshToken({ api: new API() })
      .then(response => {
        if (response) {
          this.onProccessingAccessToken()
        }
      })
  }

  async handleVisibilityChange () {
    if (!document.hidden) {
      this.forwardStatusResult = await this.getForwardStatus({ api: this.$api })
      if (!this.forwardStatusResult.status) {
        const fetchRefreshTokenResult = await this.fetchRefreshToken({ api: new API() })
        fetchRefreshTokenResult && this.onProccessingAccessToken()
      }
    }
  }

  beforeDestroy () {
    if (this.isManager) return
    if (this.inactiveEventHandler != null) {
      document.removeEventListener('mousemove', this.inactiveEventHandler)
      document.removeEventListener('keydown', this.inactiveEventHandler)
      document.removeEventListener('scroll', this.inactiveEventHandler)
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false)
  }
}
