import { mapActions, mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import Validators from '@/mixins/ValidatorsMixin'
import { compareObject, formatPhoneNumber, toDefaultPhoneNumber } from '@/functions/helper'
import { CyrName } from '@/functions/declination'
import ContactMethodsList from './components/ContactMethodsList'
import UploadFileDialog from './components/UploadFileDialog'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'

const CAN_SIGN_ROLE = {
  id: '9142343507913277484',
  name: 'Лицо, имеющее право подписи'
}

export default {
  name: 'lpr-contact-form',
  components: {
    ContactMethodsList,
    UploadFileDialog,
    ErActivationModal
  },
  mixins: [ResponsiveMixin, Validators],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    primaryContactId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      pre: 'contact-form',
      preSection: 'contact-form-section',
      preInput: 'contact-form-input',
      canSign: false,
      isCanSignRoleAdd: false,
      formData: {},
      isFormValid: false,
      formErrors: {
        contacts: 'В Контактных данных необходимо указать телефон или электронную почту',
        save: 'При создании контакта произошла ошибка. Попробуйте сохранить позже.',
        current: null
      },
      formState: {},
      cyrNameObj: new CyrName(),
      showUploadDialog: false,
      currentValue: {
        emails: '',
        phones: ''
      },
      changedFields: [],
      fetchedContactRoles: [],
      contactRolesList: [],
      signDocumentsList: ['Доверенность', 'Устав', 'Другое'],
      isShowDialogDeleteContact: false,
      isBillingContact: false,
      listBillingAccountByContact: []
    }
  },
  mounted () {
    this.$store.dispatch('contacts/getRolesDictionary', { api: this.$api }).then((result) => {
      this.fetchedContactRoles = result || []
    })
  },
  updated () {
    // поля в Контактные данные надо проверять при добавлении номера/адреса,
    // но не надо при отправки формы
    // если в атрибутах поля есть 'data-skip-validate' - исключить из валидации
    // TODO: нужно условие чтобы не на каждый update
    const { LPRContactForm } = this.$refs
    if (this.isOpen && LPRContactForm) {
      LPRContactForm.inputs.map((input) => {
        if (Object.keys(input.$attrs).includes('data-skip-validate')) {
          LPRContactForm.unregister(input)
        }
      })
    }
  },
  computed: {
    ...mapState('contacts', ['currentClientContacts', 'createContactState', 'deleteContactState']),
    ...mapState({
      listContactType: state => state.dictionary.listContactType
    }),
    isNewContact () {
      return !this.currentClientContacts.content?.id
    },
    isMobile () {
      return this.isXS || this.isSM
    },
    hasContactsMethods () {
      const phones = this.formData.phones.length
      const emails = this.formData.emails.length
      return {
        phones: phones,
        emails: emails,
        filled: phones || emails
      }
    },
    formTitle () {
      return 'Новый контакт'
    }
  },
  methods: {
    ...mapActions('contacts', ['getRolesDictionary', 'createContact', 'deleteContact']),
    handleClickClose () {
      this.$emit('addContactClose')
      this.formErrors.current = null
      this.isCanSignRoleAdd = false
    },
    handleUploadDialog (e) {
      this.canSign = e === 'ok'
      this.isCanSignRoleAdd = e === 'ok'
      this.showUploadDialog = false
    },
    handleRemoveCanSignRole (e) {
      this.isCanSignRoleAdd = false
    },
    handleBlurFIO (field) {
      if (!this.canSign) {
        return false
      }

      const { formData, cyrNameObj } = this
      if (formData[field].length) {
        let genetive = []
        switch (field) {
          case 'firstName':
            genetive = cyrNameObj.Decline(
              '',
              formData[field],
              '',
              2
            )
            break
          case 'secondName':
            genetive = cyrNameObj.Decline(
              '',
              '',
              formData[field],
              2
            )
            break
          case 'lastName':
            genetive = cyrNameObj.Decline(
              formData[field],
              '',
              '',
              2
            )
            break
          default:
        }
        formData[field + 'Genitive'] = genetive.split(' ')[0]
      }
    },
    validateForm () {
      const { formErrors } = this
      formErrors.current = null
      let checkContactMethods = false
      let checkCanSignRole = false
      let checkForm = false
      const { LPRContactForm, contactRoles } = this.$refs

      if (!this.hasContactsMethods.filled) {
        formErrors.current = formErrors.contacts
      } else {
        checkContactMethods = true
      }
      // поле Роль контакта надо проверять
      // только если не включено Право подписи
      if (this.canSign) {
        contactRoles.reset()
        checkCanSignRole = true
      } else {
        checkCanSignRole = contactRoles.validate()
      }

      checkForm = LPRContactForm.validate()
      this.isFormValid = checkContactMethods && checkCanSignRole && checkForm

      return this.isFormValid
    },
    erSelectValidate (value) {
      return !!value.length || 'Выберите вариант из списка'
    },
    handleSaveForm () {
      let formValid = this.validateForm()
      let currentValueCheck = []

      if (this.currentValue.phones.length) {
        currentValueCheck.push(this.addContactMethod(this.currentValue.phones, 'phones'))
      }

      if (this.currentValue.emails.length) {
        currentValueCheck.push(this.addContactMethod(this.currentValue.emails, 'emails'))
      }

      if (currentValueCheck.length) {
        formValid = this.validateForm()
        this.isFormValid = !currentValueCheck.includes(false) && formValid
      }

      if (this.isFormValid) {
        let data = cloneDeep(this.formData)

        if (this.canSign) {
          data.roles.push(CAN_SIGN_ROLE)
        }

        this.createContact({ api: this.$api, data: data }).then((result) => {
          if (result) {
            this.handleClickClose()
          }
        })
      }
    },
    showDialogDeleteContact () {
      this.isShowDialogDeleteContact = true
    },
    handleDeleteContact () {
      this.isShowDialogDeleteContact = false
      this.deleteContact({ api: this.$api })
        .then(response => {
          if (response && Array.isArray(response) && response.length > 0) {
            this.listBillingAccountByContact = response
            this.isBillingContact = true
          }
        })
    },
    addContactMethod (val, type) {
      const isValid = this.$refs[type] && this.$refs[type].validate()

      if (val && isValid) {
        if (type === 'phones') {
          val = formatPhoneNumber(toDefaultPhoneNumber(val))
        }
        this.formData[type].push({ value: val })
        this.currentValue[type] = ''
      }

      return isValid
    },
    removeContactMethod (arrayIdx, type) {
      this.formData[type].splice(arrayIdx, 1)
    },
    setPrefer (id) {
      this.formData.preferredContactMethodId = id
    }
  },
  watch: {
    currentClientContacts: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val) {
          let clone = cloneDeep(val)
          this.formData = clone.content

          /* Фикс. При создании контакта поле 'contactType' отсутствует */
          if (!('contactType' in this.formData)) {
            this.formData.contactType = null
          }

          this.canSign = this.formData?.canSign || false
          delete clone.content
          this.formState = clone
        }
      }
    },
    formData: {
      deep: true,
      immediate: true,
      handler (val) {
        const { changedFields, currentClientContacts } = this
        // проверка состояния - поле изменило значение
        Object.keys(val).map((item) => {
          let isChanged = null
          if (typeof val[item] === 'string') {
            isChanged = val[item] !== currentClientContacts.content[item]
          }

          if (typeof val[item] === 'object') {
            isChanged = !compareObject(val[item], currentClientContacts.content[item])
          }

          if (isChanged && !changedFields.includes(item)) {
            changedFields.push(item)
          } else if (!isChanged && changedFields.includes(item)) {
            changedFields.splice(changedFields.indexOf(item), 1)
          }
        })
      }
    }
  }
}
