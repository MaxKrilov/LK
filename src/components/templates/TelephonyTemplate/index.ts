import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { mapState } from 'vuex'
import { ICustomerProduct } from '@/tbapi'
import { iPointItem, transformListPoint } from '@/components/blocks/ErListPoints/script'
import { getFirstElement } from '@/functions/helper'

const PHONE_NUMBER_SLO_CODE = 'PHNUMBVN'

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof TelephonyTemplate>>({
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
export default class TelephonyTemplate extends Vue {
  // Vuex state
  readonly loadingBillingAccount!: boolean
  readonly billingAccountId!: string

  // Data
  listBPI: string[] = []
  listPoint: iPointItem[] = []
  listPhoneNumbers: Record<string, ICustomerProduct> | null = null

  currentPoint: iPointItem | null = null

  isLoadingPoints = true
  isLoadingProducts = true

  // Methods
  init () {
    this.getListLocation()
      .then(() => {
        if (this.listBPI.length !== 0) {
          this.getListPhoneNumbers()
        }
      })
  }

  getListLocation () {
    this.isLoadingPoints = true
    return new Promise((resolve, reject) => {
      this.$store.dispatch('productnservices/locationOfferInfo', {
        api: this.$api,
        productType: 'Телефония'
      })
        .then(response => {
          this.listPoint = transformListPoint(response)
          this.currentPoint = getFirstElement(this.listPoint)
          this.$nextTick(() => {
            if (this.currentPoint) {
              this.listBPI = [this.currentPoint.bpi as string]
            }
            this.isLoadingPoints = false
            resolve()
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  getListPhoneNumbers () {
    this.isLoadingProducts = true
    return new Promise((resolve, reject) => {
      this.$store.dispatch('productnservices/getAllSlo', {
        api: this.$api,
        parentIds: this.listBPI,
        code: PHONE_NUMBER_SLO_CODE
      })
        .then(response => {
          this.listPhoneNumbers = response
          this.isLoadingProducts = false
          resolve()
        })
        .catch(error => { reject(error) })
    })
  }

  // Hooks
  created () {
    if (!this.loadingBillingAccount) {
      this.init()
    }
  }

  render (h: CreateElement) {
    return h('div', {
      staticClass: 'telephony-template'
    }, [
      h('router-view', {
        attrs: {
          listPhoneNumbers: this.listPhoneNumbers,
          listPoint: this.listPoint,
          isLoadingPoints: this.isLoadingPoints,
          isLoadingProducts: this.isLoadingProducts
        },
        on: {
          'change-point': (e: iPointItem) => {
            this.currentPoint = e
            this.$nextTick(() => {
              this.listBPI = [this.currentPoint!.bpi as string]
              this.getListPhoneNumbers()
            })
          }
        }
      })
    ])
  }
}
