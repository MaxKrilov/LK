import { mapState, mapActions, mapGetters } from 'vuex'
import { copyObject } from '@/functions/helper'
import AccountForm from '../../../AccountForm'
import AccessSection from '../../../AccountForm/components/AccessSection'
import RemoveAccount from '../../../RemoveAccount'

export default {
  name: 'account-details',
  components: {
    AccountForm,
    RemoveAccount,
    AccessSection
  },
  data: () => ({
    pre: 'account-details',
    isShowAccountForm: false,
    removeAccountSuccessText: 'Учетная запись сотрудника удалена.',
    removeAccountFailText: 'При удалении учетной записи произошла ошибка. Попробуйте удалить еще раз',
    dialogRemoveAccount: {
      visible: false,
      fetching: false
    },
    sectionAccessRightsData: {}
  }),
  props: {
    userId: { type: String, default: '' },
    userPostId: { type: String, default: '' },
    phone: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    role: { type: Object, default: () => ({}) },
    roles: { type: Array, default: () => ([]) },
    systems: { type: Object, default: () => ({}) },
    email: { type: String, default: '' },
    systemName: { type: String, default: '' },
    systemRoleName: { type: String, default: '' },
    isDeletable: { type: Boolean, default: true },
    isDesktop: { type: Boolean, default: false }
  },
  mounted () {
    this.sectionAccessRightsData = copyObject(this.systems)
  },
  methods: {
    ...mapActions('accounts', [
      'removeProfileAccount',
      'setRemoveAccountModalVisibility'
    ]),
    handleShowRemoveAccountClick () {
      this.dialogRemoveAccount.visible = true
    },
    async handleRemoveAccountClick () {
      this.dialogRemoveAccount.fetching = true
      try {
        await this.removeProfileAccount({ api: this.$api, userPostId: this.userPostId })
        if (this.removedAccountInfo.error) {
          this.dialogRemoveAccount.error = this.removeAccountFailText
          this.dialogRemoveAccount.fetching = false
        } else {
          await this.hideDialogRemoveAccount()
          this.onSuccessForm({ id: this.userPostId, type: 'error', msg: this.removeAccountSuccessText })
        }
      } catch (error) {
        this.onFailForm({ id: this.userId, msg: this.removeAccountFailText })
      }
    },
    async hideDialogRemoveAccount () {
      this.dialogRemoveAccount.visible = false
      this.dialogRemoveAccount.error = null
      this.dialogRemoveAccount.fetching = false
    },
    handleRemoveAccountCancelClick () {
      this.hideDialogRemoveAccount()
    },
    handleUpdateClick () {
      this.isShowAccountForm = true
    },
    onSuccessForm (val) {
      this.isShowAccountForm = false
      this.$emit('success', { ...val })
    },
    onFailForm (val) {
      this.isShowAccountForm = false
      this.$emit('fail', { ...val })
    },
    onCancelForm () {
      this.isShowAccountForm = false
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapState('accounts', [
      'removedAccountInfo'
    ]),
    isLPRAccount () {
      return this.userId === this.user?.sub
    }
  }
}
