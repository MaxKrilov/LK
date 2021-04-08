import { Vue, Component, Watch } from 'vue-property-decorator'

@Component({})
export default class BillingInfoMixin extends Vue {
  /*
    Миксин вызывает метод onBillingInfoChanged() при каждом обновлении billingInfo
  */

  get billingInfo () {
    return this.$store.state.payments.billingInfo
  }

  get isBillingInfoFilled (): boolean {
    return !!Object.keys(this?.billingInfo || {}).length
  }

  @Watch('billingInfo')
  _onBillingInfoChanged (value: string) {
    if (value) {
      this.onBillingInfoChanged()
    }
  }

  onBillingInfoChanged () {
    throw new Error(`Method 'BillingInfoMixin.onBillingInfoChanged()' not implemented`)
  }

  created () {
    if (this.isBillingInfoFilled) {
      this.onBillingInfoChanged()
    }
  }
}
