import Vue from 'vue'
import Component from 'vue-class-component'

import { mapGetters, mapState } from 'vuex'
import { price as priceFormatted } from '@/functions/filters'

import { IBillingInfo } from '@/tbapi/payments'
import ErtMenu from '@/components/UI2/ErtMenu'

const IS_ENABLED_AUTOPAY = '9149184122213604836'

@Component<InstanceType<typeof ErtBalanceComponent>>({
  filters: {
    priceFormatted
  },
  computed: {
    ...mapGetters({
      isLoadingBalanceInfo: 'loading/menuComponentBalance'
    }),
    ...mapState({
      balanceInfo: (state: any) => state.payments.billingInfo
    })
  }
})
export default class ErtBalanceComponent extends Vue {
  /// Refs
  $refs!: {
    'button-activator': HTMLButtonElement,
    menu: InstanceType<typeof ErtMenu>
  }
  /// Data
  isOpenMenu: boolean = false

  readonly isLoadingBalanceInfo!: boolean
  readonly balanceInfo!: IBillingInfo

  get isEnabledAutoPay () {
    return ('paymentMethod' in this.balanceInfo) && this.balanceInfo.paymentMethod.id === IS_ENABLED_AUTOPAY
  }

  get balance () {
    return (('balance' in this.balanceInfo) && 0 - Number(this.balanceInfo.balance)) || 0
  }

  get buttonActivatorWidth () {
    return (this.$refs['button-activator'] && this.$refs['button-activator'].clientWidth) || 0
  }

  get menuWidth () {
    return (this.$refs.menu && this.$refs.menu.$refs.content && this.$refs.menu.$refs.content.clientWidth) || 303
  }

  get nudgeLeft () {
    return (this.menuWidth - this.buttonActivatorWidth) / 2
  }

  mounted () {
  }
}
