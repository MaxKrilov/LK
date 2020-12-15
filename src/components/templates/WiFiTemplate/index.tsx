import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { mapState } from 'vuex'
import { ILocationOfferInfo } from '@/tbapi'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof WiFiTemplate>>({
  computed: {
    ...mapState({
      loadingBillingAccount: (state: any) => state.loading.menuComponentBillingAccount,
      billingAccountId: (state: any) => state.user.activeBillingAccount
    })
  },
  watch: {
    loadingBillingAccount (val) {
      if (!val) {
        this.init()
      }
    },
    billingAccountId (val: string, oldVal: string) {
      // Вызываем ининициализацию, если переключение л/с было вызывано пользователем
      // В противном случае инициализация происходит в watch loadingBillingAccount
      if (oldVal !== '') {
        this.init()
      }
    }
  }
})
export default class WiFiTemplate extends Vue {
  // Vuex
  loadingBillingAccount!: boolean
  billingAccountId!: string

  listPoint: ILocationOfferInfo[] = []

  init () {
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Wi-Fi'
    })
      .then(response => {
        const listPoint = response.filter((point: any) => ~point.offer.name.toLowerCase().indexOf('mono'))
        if (listPoint.length === 0) {
          this.$router.push('/lk/wifi/promo')
        } else {
          this.listPoint = listPoint
        }
      })
      .catch(() => {
      })
      .finally(() => {
      })
  }

  render (h: CreateElement) {
    return h('router-view', {
      attrs: {
        listPoint: this.listPoint
      }
    })
  }

  created () {
    if (!this.loadingBillingAccount) {
      this.init()
    }
  }
}
