import { mapState, mapGetters } from 'vuex'
import { formatPhone, price as priceFormatted } from '../../../../../functions/filters'
import { SET_ACTIVE_BILLING_ACCOUNT, SET_ACTIVE_BILLING_ACCOUNT_NUMBER } from '../../../../../store/actions/user'
import { Cookie } from '../../../../../functions/storage'

const IS_ENABLED_AUTOPAY = '9149184122213604836'

export default {
  name: 'right-info-panel-component',
  data: () => ({
    pre: 'right-info-panel-component',
    isOpenPersonalAccountDetail: false
  }),
  props: {
    value: null
  },
  filters: {
    formatPhone,
    priceFormatted
  },
  computed: {
    ...mapGetters({
      getManagerInfo: 'user/getManagerInfo',
      getBillingAccountsGroupByContract: 'payments/getBillingAccountsGroupByContract',
      activeBillingAccountId: 'payments/getActiveBillingAccount',
      activeBillingAccountNumber: 'payments/getActiveBillingAccountNumber'
    }),
    ...mapState({
      legalName: state => state.user.clientInfo.legalName,
      balanceInfo: state => state.payments.billingInfo
    }),
    isAutopay () {
      return this.balanceInfo?.paymentMethod?.id === IS_ENABLED_AUTOPAY
    },
    balance () {
      return this.balanceInfo.hasOwnProperty('balance')
        ? 0 - Number(this.balanceInfo.balance)
        : 0
    }
  },
  methods: {
    closeRightPanel () {
      this.$emit('input', false)
    },
    openPersonalAccountDetail () {
      this.isOpenPersonalAccountDetail = true
    },
    selectPersonalAccount (billingAccountId, accountNumber) {
      this.isOpenPersonalAccountDetail = false
      // Устанавливаем загрузку для отслеживания
      this.$store.commit('loading/rebootBillingAccount', true)
      this.$store.commit(`user/${SET_ACTIVE_BILLING_ACCOUNT}`, billingAccountId)
      this.$store.commit(`user/${SET_ACTIVE_BILLING_ACCOUNT_NUMBER}`, accountNumber)
      this.$nextTick(() => {
        this.$store.commit('loading/rebootBillingAccount', false)
        Cookie.set('billingAccountId', billingAccountId, {})
      })
    },
    onChangeOrg () {
      this.$emit('change-org')
    },
    signOut () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    }
  }
}
