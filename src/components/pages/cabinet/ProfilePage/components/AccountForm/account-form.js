import { mapActions, mapGetters, mapState } from 'vuex'
import EditLprSection from './components/EditLprSection'
import EditSection from './components/EditSection'
import EditContactSection from './components/EditContactSection'
import AccessSection from './components/AccessSection'
import EditConfirm from './components/EditConfirm'
import RemoveAccount from '../RemoveAccount'
import { copyObject, eachArray, toDefaultPhoneNumber } from '@/functions/helper'
import {
  USER_EXISTS_WITH_EMAIL,
  USER_FOUND_BY_PHONE,
  USER_EXISTS_WITH_PHONE_UPDATE,
  USER_EXISTS_WITH_EMAIL_UPDATE
} from '@/constants/status_response'
import Responsive from '@/mixins/ResponsiveMixin'
import { SYSTEM_NAMES } from '@/constants/profile'

export default {
  name: 'account-form',
  components: {
    EditLprSection,
    EditSection,
    EditContactSection,
    AccessSection,
    RemoveAccount,
    EditConfirm
  },
  mixins: [ Responsive ],
  data: () => ({
    pre: 'account-form',
    isSuccess: false,
    isLoading: false,
    snapshot: {},
    forpostUsersSnapshot: [],
    OATSUsersSnapshot: [],
    createdSuccessText: 'Учетная запись сотрудника создана.',
    createdFailText: 'Не удалось создать учетную запись сотрудника',
    updatedSuccessText: 'Учетная запись сотрудника изменена',
    updatedYourselfSuccessText: 'Данные профиля успешно изменены',
    updatedFailText: `При создании/обновлении учетной записи произошла ошибка.`,
    removeAccountSuccessText: 'Учетная запись сотрудника удалена.',
    removeAccountFailText: 'При удалении учетной записи произошла ошибка. Попробуйте удалить еще раз',
    emailAlreadyExistsText: 'E-mail уже используется',
    phoneAlreadyExistsText: 'Телефон уже используется',
    contactsEmptyErrorText: 'В Контактных данных необходимо указать телефон или электронную почту',
    sectionLprData: {
      lastName: '',
      firstName: '',
      middleName: '',
      phoneNumber: '',
      email: '',
      role: null,
      roles: []
    },
    sectionAccessRightsData: {},
    dialogRemoveAccount: {
      visible: false,
      fetching: false
    },
    isPhoneExistsError: false,
    isEmailExistsError: false,
    isContactsEmptyError: false
  }),
  props: {
    userId: { type: String, default: '' },
    userPostId: { type: String, default: '' },
    lastName: { type: String, default: '' },
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    role: { type: Object, default: () => ({}) },
    roles: { type: Array, default: () => ([]) },
    systems: { type: Object, default: () => ({}) },
    isUpdate: { type: Boolean, default: false },
    isLPR: { type: Boolean, default: false },
    isConfirm: { type: Boolean, default: false },
    currentClientContacts: { type: Object, default: () => ({}) }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
      // поля в Контактные данные надо проверять при добавлении номера/адреса,
      // но не надо при отправки формы
      // если в атрибутах поля есть 'data-skip-validate' - исключить из валидации
      const { accountForm } = this.$refs
      accountForm.inputs.map((input) => {
        if (Object.keys(input.$attrs).includes('data-skip-validate')) {
          accountForm.unregister(input)
        }
      })
    })

    this.sectionLprData.roles = copyObject(this.roles)
    this.sectionAccessRightsData = copyObject(this.filterAccess())

    // Forpost users
    if (this.sectionAccessRightsData[SYSTEM_NAMES.FORPOST]) {
      this.sectionAccessRightsData[SYSTEM_NAMES.FORPOST].users = this.bindedForpostUserList
        .filter(el => el.ExternalID === this.userId)
        .reduce((acc, el) => ({ ...acc, [el.ID]: el }), {})
    }

    // OATS users
    if (this.sectionAccessRightsData[SYSTEM_NAMES.OATS]) {
      this.sectionAccessRightsData[SYSTEM_NAMES.OATS].users = this.linkedOATSUserList
        .filter(el => el.sso_id === this.userId)
        .reduce((acc, el) => ({ ...acc, [`${el.domain}-${el.login}`]: el }), {})
    }

    if (this.isUpdate) {
      this.sectionLprData.lastName = this.lastName
      this.sectionLprData.firstName = this.firstName
      this.sectionLprData.middleName = this.middleName
      this.sectionLprData.phoneNumber = this.phoneNumber.substring(1)
      this.sectionLprData.email = this.email
      this.sectionLprData.role = this.role
    }

    this.forpostUsersSnapshot = this.generateForpostUsersSnapshot()
    this.OATSUsersSnapshot = this.generateOATSUsersSnapshot()
    this.snapshot = this.generateSnapshot()
  },
  watch: {
    systems (val) {
      this.sectionAccessRightsData = copyObject(val)

      if (this.sectionAccessRightsData[SYSTEM_NAMES.OATS]) {
        this.sectionAccessRightsData[SYSTEM_NAMES.OATS].users = this.linkedOATSUserList
          .filter(el => el.sso_id === this.userId)
          .reduce((acc, el) => ({ ...acc, [`${el.domain}-${el.login}`]: el }), {})
      }
    },
    loadingClientInfo (val) {
      if (!val) {
        this.snapshot.contacts = copyObject(this.currentClientContacts)
      }
    }
  },
  destroy () {
    this.reset()
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions('auth', [
      'updateUserInfo'
    ]),
    ...mapActions('accounts', [
      'createUserLpr',
      'removeProfileAccount'
    ]),
    ...mapActions('contacts', [
      'contacts'
    ]),
    ...mapActions('accountForm', [
      'createUserPosition',
      'createUserRoles',
      'changePosition',
      'changeAttributes',
      'removeUserRoles',
      'updateUser',
      'updateContacts',
      'getPost',
      'setConfirmModalVisibility'
    ]),
    ...mapActions('modal', [
      'changeMessage'
    ]),
    ...mapActions('profile', [
      'pullOATSUsers'
    ]),
    // Helpers
    getPhoneNumberWithoutCode (phone) {
      if (phone && phone.startsWith('+')) return toDefaultPhoneNumber(phone).substring(1)
      else return phone
    },
    getCorrectedPhoneNumber (phone) {
      return phone.length < 11 ? '7' + phone : phone
    },
    generateSnapshot () {
      const formData = { ...this.sectionLprData }
      return {
        user: formData,
        accessRights: this.getSelectedAccessRights(this.sectionAccessRightsData),
        contacts: copyObject(this.currentClientContacts)
      }
    },
    generateForpostUsersSnapshot () {
      const forpostRights = this.sectionAccessRightsData?.[SYSTEM_NAMES.FORPOST]

      return forpostRights ? Object.keys(forpostRights.users || {}) : []
    },
    generateOATSUsersSnapshot () {
      const OATSRights = this.sectionAccessRightsData?.[SYSTEM_NAMES.OATS]

      return OATSRights ? Object.keys(OATSRights.users) : []
    },
    getFormData () {
      const formData = this.sectionLprData
      const formAccessRightsData = this.isLPR
        ? this.getSelectedAccessRights(this.sectionAccessRightsData)
        : []
      const formContactsData = this.currentClientContacts
      return { formData, formAccessRightsData, formContactsData }
    },
    getSelectedAccessRights () {
      return Object.values(this.sectionAccessRightsData)
        .filter(item => item.content[0].access)
        .map(item => item.id)
    },
    async reset () {
      this.setConfirmModalVisibility({ isOpen: false, isFetching: false, message: '' })
      this.isPhoneExistsError = false
      this.isEmailExistsError = false
      this.isSuccess = false
      this.isLoading = false
      this.snapshot = {}
      this.sectionLprData = {}
      this.sectionAccessRightsData = {}
    },
    validateContactsData () {
      let isValid = true
      this.isContactsEmptyError = false
      const { emails, phones } = this.currentClientContacts
      if (!emails.length && !phones.length) {
        isValid = false
        this.isContactsEmptyError = true
      }
      return isValid
    },
    validForm () {
      // TODO: рефакторить - возвращать значение вместо изменения isSuccess
      if (!this.isLPR && this.isUpdate) {
        this.isSuccess = this.$refs.accountForm.validate()
      } else {
        this.isSuccess = this.$refs.accountForm.validate() && this.sectionLprData.role
      }
    },
    filterAccess () {
      const shownAccesses = this.$store.getters['profile/availableSystems']
      let filtered = {}
      Object.entries(this.systems).forEach(([key, value]) => {
        if (shownAccesses.includes(key)) {
          filtered[key] = value
        }
      })
      return filtered
    },
    // Api
    async createAccount (formData, formAccessRightsData) {
      try {
        const formatedPhone = toDefaultPhoneNumber(formData.phoneNumber)
        const formatedFormData = {
          name: `${formData.lastName} ${formData.firstName} ${formData.middleName}`,
          email: formData.email,
          phone: formatedPhone
        }

        await this.createUserLpr({ api: this.$api, ...formatedFormData })
        if (this.createdUserLprInfo.error) {
          throw new Error(this.createdUserLprInfo.error)
        }

        const userId = this.createdUserLprInfo.content.userId
        const roleId = formData.role.id

        await this.createUserPosition({ api: this.$api, userId, roleId })
        const postId = this.createdUserPositionInfo.content.id
        if (this.createdUserPositionInfo.error) {
          throw new Error(this.createdUserPositionInfo.error)
        }

        if (formAccessRightsData.length > 0) {
          const userPostId = this.createdUserPositionInfo.content.id

          eachArray(formAccessRightsData, async systemRoleId => {
            await this.createUserRoles({ api: this.$api, userPostId, systemRoleId })
            if (this.createdUserRolesInfo.error) {
              throw new Error(this.createdUserRolesInfo.error)
            }
          })
        }

        return { userId, postId }
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateAccount (formData, formAccessRightsData) {
      // обновление контактных данных
      let contactsData = null
      if (this.isContactsChanged) {
        const { currentClientContacts } = this
        const { id, firstName, lastName, preferredContactMethodId, emails, phones } = currentClientContacts
        contactsData = {
          id,
          firstName,
          lastName,
          preferredContactMethodId,
          emails,
          phones
        }
        await this.updateContacts({ api: this.$api, data: contactsData })
      }

      let userData = null

      if (this.snapshot.user.firstName !== formData.firstName ||
        this.snapshot.user.lastName !== formData.lastName ||
        this.snapshot.user.middleName !== formData.middleName ||
        this.snapshot.user.email !== formData.email) {
        userData = {
          userId: this.userId,
          fio: `${formData.lastName} ${formData.firstName} ${formData.middleName}`,
          email: formData.email
        }

        await this.updateUser({ api: this.$api, ...userData })
        if (this.updatedUserInfo.error) {
          throw this.updatedUserInfo.error
        }
      }

      if (this.snapshot.user.phoneNumber !== formData.phoneNumber) {
        const userId = this.userId
        const formatedPhone = toDefaultPhoneNumber(formData.phoneNumber)
        const params = {
          'params[phone]': formatedPhone
        }

        await this.changeAttributes({ api: this.$api, userId, params })
        if (this.changedAttributes.error) {
          throw this.changedAttributes.error
        }
      }

      if (this.snapshot.user.role !== formData.role) {
        const postId = this.userPostId
        const roleId = formData.role.id

        await this.changePosition({ api: this.$api, postId, roleId })
        if (this.changedPositionInfo.error) {
          throw new Error(this.changedPositionInfo.error)
        }
      }

      if (
        this.snapshot.accessRights.sort().toString() !== formAccessRightsData.sort().toString() &&
        this.isLPR
      ) {
        const userPostId = this.userPostId
        const snapAccessRights = this.snapshot.accessRights
        const toDelete = snapAccessRights.filter(item => !formAccessRightsData.includes(item))
        const toCreate = formAccessRightsData.filter(item => !snapAccessRights.includes(item))

        eachArray(toDelete, async systemRoleId => {
          await this.removeUserRoles({ api: this.$api, userPostId, systemRoleId })
          if (this.removedUserRolesInfo.error) {
            throw new Error(this.removedUserRolesInfo.error)
          }
        })
        eachArray(toCreate, async systemRoleId => {
          await this.createUserRoles({ api: this.$api, userPostId, systemRoleId })
          if (this.createdUserRolesInfo.error) {
            throw new Error(this.createdUserRolesInfo.error)
          }
        })
      }

      this.syncForpostUsers(this.userId)
    },
    // Events
    async onSuccess (msg = '', id, type = 'success') {
      this.$emit('success', { id: id, type: type, msg: msg })
    },
    bindForpostUsers (userId, forpostUserList) {
      forpostUserList.forEach(el => {
        const user = this.allForpostUserList.find(item => item.ID === parseInt(el, 10))

        const payload = {
          id: user.ID,
          accountId: user.AccountID,
          externalId: userId
        }
        this.$store.dispatch('profile/addForpostToSSO', payload)
          .then(() => {
            this.$store.dispatch('profile/pullAllForpostUsers')
          })
      })
    },
    bindOatsUsers (userId, userList) {
      userList.forEach(el => {
        const [domain, login] = el.split('-')
        const user = this.allOatsUserList.find(
          item => item.login === login && item.domain === domain
        )

        if (user) {
          const payload = {
            domain: user.domain,
            login: user.login,
            ssoId: userId
          }

          this.$store.dispatch('profile/addOatsUser', payload)
            .then(() => {
              this.pullOATSUsers(user.domain)
            })
        }
      })
    },
    unbindForpostUsers (userId, forpostUserList) {
      forpostUserList.forEach(el => {
        const user = this.allForpostUserList.find(item => item.ID === parseInt(el, 10))
        const payload = {
          id: user.ID,
          accountId: user.AccountID,
          externalId: userId
        }
        this.$store.dispatch('profile/deleteForpostFromSSO', payload)
          .then(() => {
            this.$store.dispatch('profile/pullAllForpostUsers')
          })
      })
    },
    unbindOatsUsers (userId, userList) {
      userList.forEach(el => {
        const [domain, login] = el.split('-')
        const user = this.allOatsUserList
          .find(item => item.login === login && item.domain === domain && item.sso_id === this.userId)
        if (user) {
          const payload = {
            userDomain: user.domain,
            login: user.login,
            sso_id: user.sso_id
          }
          this.$store.dispatch('profile/deleteOatsUser', payload)
            .then(() => {
              this.pullOATSUsers(user.domain)
            })
        }
      })
    },
    syncForpostUsers (userId) {
      const ForpostAccess = this.sectionAccessRightsData?.[SYSTEM_NAMES.FORPOST]
      if (ForpostAccess) {
        const userList = Object.keys(ForpostAccess.users || {})
        // 1 to delete
        const toDelete = this._.difference(this.forpostUsersSnapshot, userList)
        this.unbindForpostUsers(userId, toDelete)

        // 2 to add
        const toAdd = this._.difference(userList, this.forpostUsersSnapshot)
        this.bindForpostUsers(userId, toAdd)
      }
    },
    syncOatsUsers (userId) {
      const OatsAccess = this.sectionAccessRightsData?.[SYSTEM_NAMES.OATS]
      if (OatsAccess) {
        const userList = Object.keys(OatsAccess.users)
        // 1 to delete
        const toDelete = this._.difference(this.OATSUsersSnapshot, userList)
        this.unbindOatsUsers(userId, toDelete)

        // 2 to add
        const toAdd = this._.difference(userList, this.OATSUsersSnapshot)
        this.bindOatsUsers(userId, toAdd)
      }
    },
    onFail (msg = '', id) { this.$emit('fail', { id: id, msg: msg }) },
    onCancel () { this.$emit('cancel') },
    // Handlers
    async handleConfirmSaveClick () {
      this.isLoading = true
      this.setConfirmModalVisibility({ isFetching: true })
      try {
        const { formData, formAccessRightsData } = this.getFormData()
        await this.updateAccount(formData, formAccessRightsData)
        this.syncOatsUsers(this.userId)

        if (!this.isLPR) {
          const correctedPhoneNumber = this.getCorrectedPhoneNumber(formData.phoneNumber)
          this.updateUserInfo({ ...formData, phone: toDefaultPhoneNumber(correctedPhoneNumber) })
          this.changeMessage({ text: this.updatedYourselfSuccessText })
          this.reset()
          this.onSuccess('', this.userPostId)
        } else {
          this.reset()
          this.onSuccess(this.updatedSuccessText, this.userPostId)
        }
      } catch (error) {
        if (~error.indexOf(USER_EXISTS_WITH_EMAIL_UPDATE)) {
          this.isEmailExistsError = true
          if (!this.isLPR) {
            this.$refs.editSec.$refs.email.messages.push(this.emailAlreadyExistsText)
          } else {
            this.$refs.editLprSec.$refs.email.messages.push(this.emailAlreadyExistsText)
          }
          this.isLoading = false
          this.setConfirmModalVisibility({ isOpen: false, isFetching: false })
        } else if (~error.indexOf(USER_EXISTS_WITH_PHONE_UPDATE)) {
          this.isPhoneExistsError = true
          if (!this.isLPR) {
            this.$refs.editSec.$refs.phone.messages.push(this.phoneAlreadyExistsText)
          } else {
            this.$refs.editLprSec.$refs.phone.messages.push(this.phoneAlreadyExistsText)
          }
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
    async handleSaveClick () {
      this.validForm()

      if (this.isSuccess) {
        this.isLoading = true
        try {
          const { formData, formAccessRightsData } = this.getFormData()
          if (this.isUpdate && !this.isLPR) {
            if (this.snapshot.user.email !== formData.email ||
              this.snapshot.user.phoneNumber !== formData.phoneNumber) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Вы действительно хотите изменить логин для входа в личный кабинет?' })
            } else {
              const correctedPhoneNumber = this.getCorrectedPhoneNumber(formData.phoneNumber)
              await this.updateAccount(formData, formAccessRightsData)
              this.updateUserInfo({ ...formData, phone: toDefaultPhoneNumber(correctedPhoneNumber) })
              this.changeMessage({ text: this.updatedYourselfSuccessText })
              this.syncOatsUsers(this.userId)
              this.reset()
              this.onSuccess(this.updatedSuccessText, this.userPostId)
            }
          } else if (this.isUpdate && this.isLPR) {
            const loginChanged = this.snapshot.user.email !== formData.email || this.snapshot.user.phoneNumber !== formData.phoneNumber
            const accessRemoved = formAccessRightsData.length === 0
            if (accessRemoved && loginChanged) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Вы действительно хотите изменить логин для доступа в личный кабинет и убрать права доступа к порталам?' })
            } else if (accessRemoved) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Для данной учетной записи не установлены права доступа. Продолжить сохранение?' })
            } else if (loginChanged) {
              this.setConfirmModalVisibility({ isOpen: true, message: 'Вы действительно хотите изменить логин для входа в личный кабинет?' })
            } else {
              this.syncOatsUsers(this.userId)
              await this.updateAccount(formData, formAccessRightsData)
              this.updateUserInfo({ ...formData, phone: toDefaultPhoneNumber(formData.phoneNumber) })
              this.reset()
              this.onSuccess(this.updatedSuccessText, this.userPostId)
            }
          } else if (!this.isUpdate && this.isLPR) {
            const { userId, postId } = await this.createAccount(formData, formAccessRightsData)

            this.syncForpostUsers(userId)
            this.syncOatsUsers(userId)
            this.reset()
            this.onSuccess(this.createdSuccessText, postId)
          } else {
            this.reset()
            this.onFail(this.createdFailText, this.userPostId)
          }
        } catch (error) {
          console.error(error)
          if (~this.createdUserLprInfo?.error?.indexOf(USER_EXISTS_WITH_EMAIL)) {
            this.isEmailExistsError = true
            this.$refs.editLprSec.$refs.email.messages.push(this.emailAlreadyExistsText)
            this.isLoading = false
          } else if (~this.createdUserLprInfo?.error?.indexOf(USER_FOUND_BY_PHONE)) {
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
    handleShowRemoveAccountClick () {
      this.dialogRemoveAccount.visible = true
    },
    async handleRemoveAccountClick () {
      this.isLoading = true
      this.dialogRemoveAccount.fetching = true
      try {
        await this.removeProfileAccount({ api: this.$api, userPostId: this.userPostId })
        if (this.removedAccountInfo.error) {
          this.dialogRemoveAccount.error = this.removeAccountFailText
          this.isLoading = false
          this.dialogRemoveAccount.fetching = false
        } else {
          await this.hideDialogRemoveAccount()

          const ForpostAccess = this.sectionAccessRightsData?.[SYSTEM_NAMES.FORPOST]
          if (ForpostAccess) {
            const userList = Object.keys(ForpostAccess.users)
            this.unbindForpostUsers(this.userId, userList)
          }

          const OATSAccess = this.sectionAccessRightsData?.[SYSTEM_NAMES.OATS]
          if (OATSAccess) {
            const userList = Object.keys(OATSAccess.users)
            this.unbindOatsUsers(this.userId, userList)
          }

          this.onSuccess(this.removeAccountSuccessText, this.userPostId, 'error')
        }
      } catch (error) {
        this.onFail(this.removeAccountFailText, this.userPostId)
      }
    },
    async hideDialogRemoveAccount () {
      this.isLoading = false
      this.dialogRemoveAccount.visible = false
      this.dialogRemoveAccount.error = null
      this.dialogRemoveAccount.fetching = false
    },
    handleRemoveAccountCancelClick () {
      this.hideDialogRemoveAccount()
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapGetters('profile', [
      'allForpostUserList',
      'bindedForpostUserList',
      'unbindedForpostUserList',
      'linkedOATSUserList',
      'notLinkedOATSUserList',
      'allOatsUserList'
    ]),
    ...mapState('accounts', [
      'createdUserLprInfo',
      'removedAccountInfo'
    ]),
    ...mapState('accountForm', [
      'createdUserPositionInfo',
      'createdUserRolesInfo',
      'changedPositionInfo',
      'changedAttributes',
      'removedUserRolesInfo',
      'updatedUserInfo',
      'gotPost'
    ]),
    ...mapState({
      loadingClientInfo: state => state.loading.clientInfo
    }),
    isAccessRightsChanged () {
      const { formAccessRightsData } = this.getFormData()
      return JSON.stringify(this.snapshot.accessRights) !== JSON.stringify(formAccessRightsData)
    },
    isLPRAccount () {
      return this.userId === this.user?.userId
    },
    isFilled () {
      const { formData } = this.getFormData()
      const data = Object.keys(formData)
        .map(key => key !== 'roles' ? (formData[key]) : undefined)
        .filter(item => item !== undefined)
        .filter(item => !item)
      const isFullPhone = (this.getPhoneNumberWithoutCode(formData.phoneNumber)?.length || 0) === 10

      return data.length === 0 && isFullPhone
    },
    isChanged () {
      const { formData, formAccessRightsData, formContactsData } = this.getFormData()
      const data = {
        user: {
          ...formData,
          phoneNumber: this.getPhoneNumberWithoutCode(formData.phoneNumber)
        },
        accessRights: formAccessRightsData,
        contacts: formContactsData
      }
      if (data.user.role && data.user.role.id) data.user.role.id = data.user.role.id.toString()
      const isDiffSnapshot = JSON.stringify(this.snapshot) !== JSON.stringify(data)
      return isDiffSnapshot || this.isForpostUsersChanged || this.isOATSUsersChanged
    },
    isForpostUsersChanged () {
      const oldData = JSON.stringify(this.forpostUsersSnapshot)
      const newData = JSON.stringify(this.generateForpostUsersSnapshot())
      return oldData !== newData
    },
    isOATSUsersChanged () {
      const oldData = JSON.stringify(this.OATSUsersSnapshot)
      const newData = JSON.stringify(this.generateOATSUsersSnapshot())
      return oldData !== newData
    },
    isLastNameChanged () {
      const { formData } = this.getFormData()
      return this.snapshot.user && (formData.lastName !== this.snapshot.user.lastName)
    },
    isFirstNameChanged () {
      const { formData } = this.getFormData()
      return this.snapshot.user && (formData.firstName !== this.snapshot.user.firstName)
    },
    isMiddleNameChanged () {
      const { formData } = this.getFormData()
      return this.snapshot.user && (formData.middleName !== this.snapshot.user.middleName)
    },
    isPhoneChanged () {
      const { formData } = this.getFormData()
      const formatedPhone = this.getPhoneNumberWithoutCode(formData.phoneNumber)
      return this.snapshot.user && (formatedPhone !== this.snapshot.user.phoneNumber)
    },
    isEmailChanged () {
      const { formData } = this.getFormData()
      return this.snapshot.user && (formData.email !== this.snapshot.user.email)
    },
    isRoleChanged () {
      const { formData } = this.getFormData()
      return this.snapshot.user && this.snapshot.user.role ? formData.role.code !== this.snapshot.user.role.code : Boolean(formData.role)
    },
    isContactsChanged () {
      const { formContactsData } = this.getFormData()
      return this.snapshot.contacts && JSON.stringify(this.snapshot.contacts) !== JSON.stringify(formContactsData)
    }
  }
}
