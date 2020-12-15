import { mapActions, mapState, mapGetters } from 'vuex'
import EditSection from './components/EditSection'
import EditConfirm from './components/EditConfirm'
import RemoveContact from '../RemoveContact'
import { toDefaultPhoneNumber } from '@/functions/helper'
import { USER_FOUND_BY_PHONE, USER_EXISTS_WITH_EMAIL } from '@/constants/status_response'
import Responsive from '@/mixins/ResponsiveMixin'

export default {
  name: 'contact-form',
  components: {
    EditSection,
    RemoveContact,
    EditConfirm
  },
  mixins: [ Responsive ],
  data: () => ({
    pre: 'contact-form',
    isSuccess: false,
    isLoading: false,
    snapshot: {},
    createdSuccessText: 'Контакт сотрудника создана.',
    createdFailText: 'Не удалось создать контакт сотрудника',
    updatedSuccessText: 'Контакт сотрудника изменена',
    updatedYourselfSuccessText: 'Данные профиля успешно изменены',
    updatedFailText: 'При обновлении контакта произошла ошибка. Попробуйте обновить позже.',
    removeContactSuccessText: 'Контакт сотрудника удален.',
    removeContactFailText: 'При удалении контакта произошла ошибка. Попробуйте удалить еще раз',
    emailAlreadyExistsText: 'E-mail уже используется',
    phoneAlreadyExistsText: 'Телефон уже используется',
    sectionContactData: {
      canSign: false,
      lastName: '',
      firstName: '',
      middleName: '',
      phones: '',
      emails: [],
      roles: [],
      rolesList: []
    },
    dialogRemoveContact: {
      visible: false,
      fetching: false
    },
    isPhoneExistsError: false,
    isEmailExistsError: false
  }),
  props: {
    contactId: { type: String, default: '' },
    userPostId: { type: String, default: '' },
    lastName: { type: String, default: '' },
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    phones: { type: Array, default: [] },
    emails: { type: Array, default: [] },
    roles: { type: Array, default: [] },
    rolesList: { type: Array, default: [] },
    isUpdate: { type: Boolean, default: false },
    canSign: { type: Boolean, default: false }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })

    if (this.isUpdate) {
      this.sectionContactData.lastName = this.lastName
      this.sectionContactData.firstName = this.firstName
      this.sectionContactData.middleName = this.middleName
      this.sectionContactData.phones = this.phones
      this.sectionContactData.emails = this.emails
      this.sectionContactData.roles = this.roles
      this.sectionContactData.canSign = this.canSign
    }

    this.snapshot = { ...this.sectionContactData }
  },
  destroy () {
    this.reset()
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions('auth', [
      'updateUserInfo'
    ]),
    ...mapActions('contacts', [
      'createContact',
      'removeProfileContact'
    ]),
    ...mapActions('contactForm', [
      'createUserPosition',
      'createUserRoles',
      'changePosition',
      'changeAttributes',
      'removeContactRoles',
      'updateUser',
      'getPost',
      'setConfirmModalVisibility'
    ]),
    ...mapActions('modal', [
      'changeMessage'
    ]),
    // Helpers
    getCorrectedPhoneNumber (phone) {
      return phone.length < 11 ? '7' + phone : phone
    },
    reset () {
      this.setConfirmModalVisibility({ isOpen: false, isFetching: false })
      this.isPhoneExistsError = false
      this.isEmailExistsError = false
      this.isSuccess = false
      this.isLoading = false
      this.snapshot = {}
      this.sectionContactData = {}
    },
    validForm () {
      if (this.isUpdate) {
        this.isSuccess = this.$refs.contactForm.validate()
      }
    },
    // Api
    async createContact (formData) {
      try {
        const formatedFormData = {
          name: `${formData.lastName} ${formData.firstName} ${formData.middleName}`,
          emails: formData.emails,
          phones: formData.phones
        }

        await this.createUserLpr({ api: this.$api, ...formatedFormData })
        if (this.createdUserLprInfo.error) {
          throw new Error(this.createdUserLprInfo.error)
        }

        // TODO сохранение ролей
        // const roleId
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateContact (formData) {
      if (this.snapshot.firstName !== formData.firstName ||
        this.snapshot.lastName !== formData.lastName ||
        this.snapshot.middleName !== formData.middleName ||
        this.snapshot.emails !== formData.emails) {
        const userData = {
          userId: this.userId,
          fio: `${formData.lastName} ${formData.firstName} ${formData.middleName}`,
          emails: formData.emails
        }

        await this.updateUser({ api: this.$api, ...userData })
        if (this.updatedUserInfo.error) {
          throw this.updatedUserInfo.error
        }
      }
    },
    // Events
    async onSuccess (msg = '', id, type = 'success') {
      this.$emit('success', { id: id, type: type, msg: msg })
    },
    onFail (msg = '', id) { this.$emit('fail', { id: id, msg: msg }) },
    onCancel () { this.$emit('cancel') },
    // Handlers
    async handleConfirmSaveClick () {
      this.isLoading = true
      this.setConfirmModalVisibility({ isFetching: true })
      try {
        const formData = this.getFormData()

        await this.updateContact(formData)

        const correctedPhoneNumber = this.getCorrectedPhoneNumber(formData.phones)
        this.updateUserInfo({ ...formData, phone: toDefaultPhoneNumber(correctedPhoneNumber) })
        this.changeMessage({ text: this.updatedYourselfSuccessText })
        this.reset()
        this.onSuccess('', this.userPostId)
      } catch (error) {
        if (error.includes(USER_EXISTS_WITH_EMAIL)) {
          this.isEmailExistsError = true

          this.$refs.editSec.$refs.email.messages.push(this.emailAlreadyExistsText)

          this.isLoading = false
          this.setConfirmModalVisibility({ isOpen: false, isFetching: false })
        } else if (error.includes(USER_FOUND_BY_PHONE)) {
          this.isPhoneExistsError = true

          this.$refs.editSec.$refs.phone.messages.push(this.phoneAlreadyExistsText)

          this.isLoading = false
          this.setConfirmModalVisibility({ isOpen: false, isFetching: false })
        } else {
          this.reset()
          this.onFail('', this.userPostId)
        }
      }
    },
    handleConfirmCancelClick () {
      this.isLoading = false
      this.setConfirmModalVisibility({ isOpen: false, isFetching: false })
    },
    handleCancelClick () {
      this.reset()
      this.onCancel()
    },
    async handleSaveClick ({ commit }, data) {
      this.validForm()

      if (this.isSuccess) {
        this.isLoading = true
        try {
          const formData = this.sectionContactData
          if (this.isUpdate) {
            if (this.snapshot.emails !== formData.emails ||
              this.snapshot.phones !== formData.phones) {
              this.setConfirmModalVisibility({ isOpen: true })
            } else {
              const correctedPhoneNumber = this.getCorrectedPhoneNumber(formData.phones)
              await this.updateContact(formData)
              this.updateUserInfo({ ...formData, phone: toDefaultPhoneNumber(correctedPhoneNumber) })
              this.changeMessage({ text: this.updatedYourselfSuccessText })
              this.reset()
              this.onSuccess(this.updatedSuccessText, this.userPostId)
            }
          } else if (this.isUpdate) {
            const loginChanged = this.snapshot.emails !== formData.emails || this.snapshot.phones !== formData.phones
            if (loginChanged) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Вы действительно хотите изменить логин для доступа в личный кабинет и убрать права доступа к порталам?' })
            } else if (loginChanged) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Вы действительно хотите изменить логин для входа в личный кабинет?' })
            } else {
              await this.updateContact(formData)
              this.reset()
              this.onSuccess(this.updatedSuccessText, this.userPostId)
            }
          } else {
            this.reset()
            this.onFail(this.createdFailText, this.userPostId)
          }
        } catch (error) {
          if (error.includes(USER_EXISTS_WITH_EMAIL)) {
            this.isEmailExistsError = true
            this.$refs.editLprSec.$refs.email.messages.push(this.emailAlreadyExistsText)
            this.isLoading = false
          } else if (error.includes(USER_FOUND_BY_PHONE)) {
            this.isPhoneExistsError = true
            this.$refs.editLprSec.$refs.phone.messages.push(this.phoneAlreadyExistsText)
            this.isLoading = false
          } else {
            this.reset()
            this.onFail(this.updatedFailText, this.userPostId)
          }
        }
      }
    },
    handleShowRemoveContactClick () {
      this.dialogRemoveContact.visible = true
    },
    async handleRemoveContactClick () {
      this.isLoading = true
      this.dialogRemoveContact.fetching = true
      try {
        await this.removeProfileContact({ api: this.$api, userPostId: this.userPostId })
        if (this.removedContactInfo.error) {
          this.dialogRemoveContact.error = this.removeContactFailText
          this.isLoading = false
          this.dialogRemoveContact.fetching = false
        } else {
          await this.hideDialogRemoveContact()
          this.onSuccess(this.removeContactSuccessText, this.userPostId, 'error')
        }
      } catch (error) {
        this.onFail(this.removeContactFailText, this.userPostId)
      }
    },
    async hideDialogRemoveContact () {
      this.isLoading = false
      this.dialogRemoveContact.visible = false
      this.dialogRemoveContact.error = null
      this.dialogRemoveContact.fetching = false
    },
    handleRemoveContactCancelClick () {
      this.hideDialogRemoveContact()
    },
    handleRemoveEmail (email) {
      // TODO
    },
    handlePreferEmail (email) {
      // TODO
    },
    handleRemovePhone (phone) {
      // TODO
    },
    handlePreferPhone (phone) {
      // TODO
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapState('contacts', [
      'createdUserLprInfo',
      'removedContactInfo'
    ]),
    ...mapState('contactForm', [
      'createdUserPositionInfo',
      'createdUserRolesInfo',
      'changedPositionInfo',
      'changedAttributes',
      'removedUserRolesInfo',
      'updatedUserInfo',
      'gotPost'
    ]),
    isFilled () {
      const formData = this.sectionContactData
      const data = Object.keys(formData)
        .map(key => key !== 'roles' ? (formData[key]) : undefined)
        .filter(item => !item)
      return data.length === 0
    },
    isChanged () {
      return JSON.stringify(this.snapshot) !== JSON.stringify(this.sectionContactData)
    },
    isLastNameChanged () {
      return this.snapshot && (this.sectionContactData.lastName !== this.snapshot.lastName)
    },
    isFirstNameChanged () {
      return this.snapshot && (this.sectionContactData.firstName !== this.snapshot.firstName)
    },
    isMiddleNameChanged () {
      return this.snapshot && (this.sectionContactData.middleName !== this.snapshot.middleName)
    },
    isPhonesChanged () {
      return this.snapshot && (this.sectionContactData.phones !== this.snapshot.phones)
    },
    isEmailsChanged () {
      return this.snapshot && (this.sectionContactData.emails !== this.snapshot.emails)
    },
    isRolesChanged () {
      return this.snapshot && (this.sectionContactData.roles !== this.snapshot.roles)
    }
  }
}
