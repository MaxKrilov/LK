import { mapActions, mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import Validators from '@/mixins/ValidatorsMixin'
import { compareObject, formatPhoneNumber, toDefaultPhoneNumber } from '@/functions/helper'
import { CyrName } from '@/functions/declination'
import ContactMethodsList from './components/ContactMethodsList'
import UploadFileDialog from './components/UploadFileDialog'

export default {
  name: 'lpr-contact-form',
  components: {
    ContactMethodsList,
    UploadFileDialog
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
      formData: {},
      isFormValid: false,
      formErrors: {
        contacts: 'В Контактных данных необходимо указать телефон или электронную почту',
        save: 'При создании контакта произошла ошибка. Попробуйте сохранить позже.',
        current: null
      },
      cyrNameObj: new CyrName(),
      showUploadDialog: false,
      currentValue: {
        emails: '',
        phones: ''
      },
      changedFields: [],
      fetchedContactRoles: [],
      contactRolesList: [],
      signDocumentsList: ['Доверенность', 'Устав', 'Другое']
    }
  },
  mounted () {
    this.$store.dispatch('contacts/getRolesDictionary', { api: this.$api }).then((result) => {
      this.fetchedContactRoles = result
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
    ...mapState('contacts', ['currentClientContacts']),
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
        filled: phones && emails
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
    },
    handleUploadDialog (e) {
      // закрыли не загрузив файл e === 'cancel'
      // файл загружен
      this.canSign = e === 'ok'
      this.showUploadDialog = false
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
      const { formData, formErrors } = this
      formErrors.current = null
      const { LPRContactForm, contactRoles } = this.$refs
      this.isFormValid = LPRContactForm.validate()
      if (!formData.phones.length && !formData.emails.length) {
        formErrors.current = formErrors.contacts
        this.isFormValid = false
      }
      // поле Роль контакта надо проверять
      // только если не включено Право подписи
      if (this.canSign) {
        contactRoles.reset()
      } else {
        this.isFormValid = contactRoles.validate()
      }

      return this.isFormValid
    },
    erSelectValidate (value) {
      return !!value.length || 'Выберите вариант из списка'
    },
    handleSaveForm () {
      this.validateForm()
      if (this.isFormValid) {
        this.createContact({ api: this.$api, data: cloneDeep(this.formData) }).then((result) => {
          if (result) {
            console.log('reset form')
            this.handleClickClose()
          }
        })
      }
      console.log('save', this.isFormValid)
    },
    handleDeleteContact () {
      this.deleteContact({ api: this.$api })
    },
    addContactMethod (val, type) {
      const isValid = this.$refs[type] && this.$refs[type].validate()
      const { formData } = this

      if (val && isValid) {
        if (type === 'phones') {
          val = formatPhoneNumber(toDefaultPhoneNumber(val))
        }
        formData[type].push({ value: val })
        this.currentValue[type] = ''
      }
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
          this.formData = cloneDeep(val.content)
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
