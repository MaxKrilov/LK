import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { IBillingAccountGroupByContract } from '@/store/modules/payments'

@Component<InstanceType<typeof ErChangeBillingAccount>>({
  computed: {
    ...mapGetters({
      getActiveBillingAccount: 'payments/getActiveBillingAccount',
      getBillingAccountsGroupByContract: 'payments/getBillingAccountsGroupByContract'
    })
  }
})
export default class ErChangeBillingAccount extends Vue {
  /// Props
  @Prop({ type: String, default: 'menu', validator: (v: string) => ['menu', 'dialog'].includes(v) })
  readonly type!: 'menu' | 'dialog'

  @Prop({ type: Boolean })
  readonly value!: boolean

  /// Data
  activeStatus: boolean = true

  /// Vuex getters
  readonly getActiveBillingAccount!: string
  readonly getBillingAccountsGroupByContract!: Record<string, IBillingAccountGroupByContract[]>

  /// Computed
  get computedComponent () {
    return this.type === 'menu'
      ? 'ErtMenu'
      : 'ErtDialog'
  }

  get internalValue () {
    return this.value
  }

  set internalValue (val) {
    this.$emit('input', val)
  }

  /// Methods
  onChangeBillingAccount (billingAccount: IBillingAccountGroupByContract) {
    // Устанавливаем загрузку для отслеживания
    this.$store.commit('loading/rebootBillingAccount', true)
    this.$store.commit('payments/setActiveBillingAccount', billingAccount)

    this.$nextTick(() => {
      this.$store.commit('loading/rebootBillingAccount', false)
      localStorage.setItem('billingAccountId', billingAccount.billingAccountId)

      this.internalValue = false
    })
  }
}
