import Vue from 'vue'
import Component from 'vue-class-component'

import ErtBalanceComponent from './components/ErtBalanceComponent/index.vue'
import ErtManagerComponent from './components/ErtManagerComponent/index.vue'
import ErtProfileComponent from './components/ErtProfileComponent/index.vue'
import ErtBottomNavigation from './components/ErtBottomNavigation/index.vue'

import ErChangeBillingAccount from '@/components/blocks/ErChangeBillingAccount/index.vue'

import { mapGetters } from 'vuex'

@Component<InstanceType<typeof ErtNavigationComponent>>({
  components: {
    ErtBalanceComponent,
    ErtManagerComponent,
    ErtProfileComponent,
    ErtBottomNavigation,
    ErChangeBillingAccount
  },
  computed: {
    ...mapGetters({
      notificationCountPromise: 'campaign/getCount',
      activeBillingAccount: 'payments/getActiveBillingAccountNumber',
      isLoadingListBillingAccount: 'loading/menuComponentBillingAccount'
    })
  },
  watch: {
    notificationCountPromise (promise) {
      promise.then((data: number) => {
        this.notificationCount = data
      })
    }
  }
})
export default class ErtNavigationComponent extends Vue {
  /// Data
  notificationCount: number = 0
  isOpenBillingAccountChange: boolean = false

  /// Vuex Getters
  readonly notificationCountPromise!: Promise<number>
  readonly activeBillingAccount!: string
  readonly isLoadingListBillingAccount!: boolean

  /// Methods
  onClickNotificationHandler () {
    this.$emit('click-notifications')
  }
}
