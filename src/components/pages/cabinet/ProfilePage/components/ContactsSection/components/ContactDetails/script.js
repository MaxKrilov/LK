import { mapState, mapActions, mapGetters } from 'vuex'
import { copyObject } from '@/functions/helper'
import ContactForm from '../../../ContactForm'
import AccessSection from '../../../ContactForm/components/AccessSection'
import RemoveContact from '../../../RemoveContact'

export default {
  name: 'contact-details',
  components: {
    ContactForm,
    RemoveContact,
    AccessSection
  },
  data: () => ({
    pre: 'contact-details',
    isShowContactForm: false,
    removeContactSuccessText: 'Контакт сотрудника удален.',
    removeContactFailText: 'При удалении контакта произошла ошибка. Попробуйте удалить еще раз',
    dialogRemoveContact: {
      visible: false,
      fetching: false
    },
    sectionAccessRightsData: {}
  }),
  props: {
    contactId: { type: String, default: '' },
    phones: { type: Array, default: [] },
    emails: { type: Array, default: [] },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    roles: { type: Array, default: () => ({}) },
    rolesList: { type: Array, default: () => ([]) },
    isDeletable: { type: Boolean, default: true },
    isDesktop: { type: Boolean, default: false }
  },
  mounted () {
    this.sectionAccessRightsData = copyObject(this.systems)
  },
  methods: {
    ...mapActions('contacts', [
      'removeProfileContact',
      'setRemoveContactModalVisibility'
    ]),
    handleShowRemoveContactClick () {
      this.dialogRemoveContact.visible = true
    },
    async handleRemoveContactClick () {
      this.dialogRemoveContact.fetching = true
      try {
        await this.removeProfileContact({ api: this.$api, userPostId: this.userPostId })
        if (this.removedContactInfo.error) {
          this.dialogRemoveContact.error = this.removeContactFailText
          this.dialogRemoveContact.fetching = false
        } else {
          await this.hideDialogRemoveContact()
          this.onSuccessForm({ id: this.userPostId, type: 'error', msg: this.removeContactSuccessText })
        }
      } catch (error) {
        this.onFailForm({ id: this.userId, msg: this.removeContactFailText })
      }
    },
    async hideDialogRemoveContact () {
      this.dialogRemoveContact.visible = false
      this.dialogRemoveContact.error = null
      this.dialogRemoveContact.fetching = false
    },
    handleRemoveContactCancelClick () {
      this.hideDialogRemoveContact()
    },
    handleUpdateClick () {
      this.isShowContactForm = true
    },
    onSuccessForm (val) {
      this.isShowContactForm = false
      this.$emit('success', { ...val })
    },
    onFailForm (val) {
      this.isShowContactForm = false
      this.$emit('fail', { ...val })
    },
    onCancelForm () {
      this.isShowContactForm = false
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapState('accounts', [
      'removedContactInfo'
    ]),
    isLPRContact () {
      return this.userId === this.user?.userId
    }
  }
}
