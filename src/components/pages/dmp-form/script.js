/**
 * Страница создания клиента для DMP
 */
import { validateINN } from '../../../functions/helper'
import { apiDadata } from '../../../functions/api'
import { CyrName } from '../../../functions/declination'
import { ERROR_MODAL } from '../../../store/actions/variables'
import ErErrorModal from '../../blocks/ErErrorModal'

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
      cyrNameObj: null
    },
    rules: {
      isRequired: value => !!value || 'Поле обязательно к заполнению'
    }
  }),
  methods: {
    submitInn (e) {
      e.preventDefault()
      if (!this.$refs.inn_form.validate()) {
        return false
      }
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
            // todo address
          }
          this.isInputInn = false
        })
        .catch(() => {
          this.$store.commit(ERROR_MODAL, true)
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
    __actionSubmit (e) {
      if (!this.$refs.form.validate()) {
        return false
      }
      return true
    },
    submitFormCreate (e) {
      e.preventDefault()
      this.__actionSubmit()
    },
    listenersDMP (e) {
      if (!this.isInputInn && this.__actionSubmit()) {
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
