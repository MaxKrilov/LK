import { Vue, Component, Watch } from 'vue-property-decorator'
import { StoreGetter } from '@/functions/store'

@Component({})
export default class BillingAccountMixin extends Vue {
  /*
    Миксин вызывает метод onChangeBillingAccountId() при каждом обновлении billingAccountId
  */

  @StoreGetter('payments/getActiveBillingAccount')
  billingAccountId!: string

  @Watch('billingAccountId')
  private iAmJustExecuteBillingAccountIdWhenItChanged (value: string, oldValue: string) {
    if (value !== oldValue) {
      this.onChangeBillingAccountId()
    }
  }

  onChangeBillingAccountId () {
    throw new Error(`Method 'BillingAccountMixin.onChangeBillingAccountId()' not implemented`)
  }

  created () {
    if (this.billingAccountId) {
      this.onChangeBillingAccountId()
    }
  }
}
