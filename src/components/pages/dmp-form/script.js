/**
 * Страница создания клиента для DMP
 */
import { validateINN } from '../../../functions/helper'
import { apiDadata } from '../../../functions/api'
import { CyrName } from '../../../functions/declination'
import { ERROR_MODAL } from '../../../store/actions/variables'
import ErErrorModal from '../../blocks/ErErrorModal'
import { GET_CLIENT_INFO, UPDATE_CLIENT_INFO } from '../../../store/actions/user'
import { mapGetters } from 'vuex'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '../../../store/actions/documents'

export default {
  name: 'dmp-form-page',
  components: {
    ErErrorModal
  },
  data: () => ({
    pre: 'dmp-form-page',
    modelINN: '',
    validateInn: [
      value => !!value || 'Поле обязательно к заполнению',
      value => (value.length === 10 || value.length === 12) || validateINN(value) || 'Неверный ИНН'
    ],
    isInputInn: true,
    isEntity: false,
    isValidFile: true,
    modelData: {
      nameCompany: '',
      addressCompany: '',
      registrationReasonCode: '',
      passport: '',
      dateOfPassport: '',
      departmentCode: '',
      passportIssuedBy: '',
      post: '',
      gPost: '',
      surname: '',
      gSurname: '',
      name: '',
      gName: '',
      patronymic: '',
      gPatronymic: '',
      cyrNameObj: null,
      phoneNumber: '',
      file: null,
      type: ''
    },
    rules: {
      isRequired: value => !!value || 'Поле обязательно к заполнению'
    },
    loadingInn: false
  }),
  computed: {
    issetFile () {
      return !!this.modelData.file
    },
    getFileName () {
      return this.issetFile ? this.modelData.file.name : false
    },
    ...mapGetters('auth', ['user'])
  },
  methods: {
    submitInn (e) {
      e.preventDefault()
      if (!this.$refs.inn_form.validate()) {
        return false
      }
      this.loadingInn = true
      this.$api
        .setData({ inn: this.modelINN })
        .query('/customer/account/get-organization-info')
        .then(response => {
          this.isEntity = this.modelINN.length === 10
          if (this.isEntity) {
            this.modelData.nameCompany = response.orgname
            this.modelData.registrationReasonCode = response.kpp
            this.modelData.addressCompany = response.legalAddressText
          } else {
            this.modelData.nameCompany = `ИП ${response.fio.surName} ${response.fio.name} ${response.fio.lastName}`
          }
          this.modelData.type = response.type
          this.isInputInn = false
        })
        .catch(() => {
          this.$store.commit(ERROR_MODAL, true)
        })
        .finally(() => {
          this.loadingInn = false
        })
    },
    onBlurDepartmentCode () {
      apiDadata({
        type: 'fms_unit',
        query: this.modelData.departmentCode
      })
        .then(response => {
          this.modelData.passportIssuedBy = this._.head(response.suggestions)?.value
        })
    },
    async __actionSubmit () {
      const formValid = this.$refs.form.validate()
      const fileValid = this.modelData.file !== null
      if (!fileValid) {
        this.isValidFile = false
        return false
      }
      if (!formValid) return false
      // Изменяем данные клиента
      const editData = {
        inn: this.modelINN,
        name: this.modelData.nameCompany,
        legalAddress: this.modelData.addressCompany,
        type: this.modelData.type
      }
      if (this.isEntity) {
        editData['kpp'] = this.modelData.registrationReasonCode
      } else {
        editData['idSerialNumber'] = this.modelData.passport
        editData['issuedDate'] = this.modelData.dateOfPassport
        editData['issuedBy'] = this.modelData.passportIssuedBy
      }
      const responseClient = await this.$store.dispatch(`user/${UPDATE_CLIENT_INFO}`, { api: this.$api, formData: editData })
      console.log(responseClient)
      if (!responseClient) {
        this.$store.commit(ERROR_MODAL, true)
        return false
      }
      // Создаём контакт с ролью "Лицо, имеющее право подписи"
      const contactData = {
        position: this.modelData.post,
        gPosition: this.modelData.gPost,
        name: this.modelData.name,
        gName: this.modelData.gName,
        surname: this.modelData.surname,
        gSurname: this.modelData.gSurname,
        patronymic: this.modelData.patronymic,
        gPatronymic: this.modelData.gPatronymic,
        phone: this.modelData.phoneNumber
      }
      const responseContact = await this.$store.dispatch('contacts/createSignContact', { api: this.$api, data: contactData })
      console.log(responseContact)
      if (!responseContact) {
        this.$store.commit(ERROR_MODAL, true)
        return false
      }
      const responseRole = await this.$store.dispatch('contacts/createContactRole', { api: this.$api })
      console.log(responseRole)
      if (!responseRole) {
        this.$store.commit(ERROR_MODAL, true)
        return false
      }
      const fileBlob = await (await fetch(this.modelData.file)).blob()
      const filePath = this.$moment.utc().format('YYYY-MM-DD_HH:mm') + '/' + this.user.toms
      const fileData = {
        api: this.$api,
        bucket: 'customer-docs',
        file: fileBlob,
        fileName: this.getFileName,
        filePath,
        type: '9154452676313182650',
        relatedTo: this.user.toms
      }
      const sendFile = await this.$store.dispatch('documents/' + UPLOAD_FILE, fileData)
      if (!sendFile) {
        this.$store.commit(ERROR_MODAL, true)
        return false
      }
      const connectFileToClient = await this.$store.dispatch('documents/' + ATTACH_SIGNED_DOCUMENT, fileData)
      if (!connectFileToClient) {
        this.$store.commit(ERROR_MODAL, true)
        return false
      }
      this.$store.dispatch(`user/${GET_CLIENT_INFO}`, { api: this.$api })
      return true
    },
    submitFormCreate (e) {
      e.preventDefault()
      this.__actionSubmit()
    },
    async listenersDMP (e) {
      const resultSubmit = await this.__actionSubmit()
      if (!this.isInputInn && resultSubmit) {
        window.top.postMessage({ eventType: 'ertUserForm', state: 'registered' }, '*')
      }
    },
    onBlurFIO () {
      if (this.modelData.surname !== '' && this.modelData.name !== '' && this.modelData.patronymic !== '') {
        const gFio = this.cyrNameObj.Decline(
          this.modelData.surname,
          this.modelData.name,
          this.modelData.patronymic,
          2
        )
        const gFioParse = gFio.split(' ')
        if (gFioParse?.length === 3) {
          this.modelData.gSurname = gFioParse[0]
          this.modelData.gName = gFioParse[1]
          this.modelData.gPatronymic = gFioParse[2]
        }
      }
    },
    async onChangeFile (e) {
      this.modelData.file = e.target.files[0]
      this.isValidFile = true
    }
  },
  mounted () {
    window.addEventListener('message', this.listenersDMP)
    this.cyrNameObj = new CyrName()
  },
  beforeDestroy () {
    window.removeEventListener('message', this.listenersDMP)
  }
}
