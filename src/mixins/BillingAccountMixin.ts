import { Vue, Component, Watch } from 'vue-property-decorator'
import { StoreGetter } from '@/functions/store'

@Component({})
export default class BillingAccountMixin extends Vue {
  /*
    Миксин вызывает метод fetchData() при каждом обновлении billingAccountId
  */

  @StoreGetter('payments/getActiveBillingAccount')
  billingAccountId!: string

  @Watch('billingAccountId')
  onBillingAccountIdChanged (value: string, oldValue: string) {
    if (value !== oldValue) {
      this.fetchData()
    }
  }

  fetchData () {
    throw new Error(`Method 'BillingAccountMixin.fetchData()' not implemented`)
  }

  created () {
    if (this.billingAccountId) {
      this.fetchData()
    }
  }
}
