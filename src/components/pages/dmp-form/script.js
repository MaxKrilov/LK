/**
 * Страница создания клиента для DMP
 */
import { validateINN } from '../../../functions/helper'
import { apiDadata } from '../../../functions/api'
import { CyrName } from '../../../functions/declination'
import { ERROR_MODAL } from '../../../store/actions/variables'
import ErErrorModal from '../../blocks/ErErrorModal'
import { GET_CLIENT_INFO, UPDATE_CLIENT_INFO } from '../../../store/actions/user'
import { mapGetters, mapState } from 'vuex'
import { logInfo } from '../../../functions/logging'
import ErDadataSelect from '../../blocks/ErDadataSelect/index'
// import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '../../../store/actions/documents'
import ErActivationModal from '../../blocks/ErActivationModal/index'

const EXTENDED_MAP_INN = '9148328342013670726'

// Серия паспорта
const EXTENDED_MAP_ID_SERIAL_NUMBER = '9154125818313164681'
// Номер паспорта
const EXTENDED_MAP_ID_NUMBER = '9154125827913164774'
// Дата выдачи
const EXTENDED_MAP_ISSUED_DATE = '9154125838013164887'
// Кем выдан
const EXTENDED_MAP_ISSUED_BY = '9154125853213165060'

export default {
  name: 'dmp-form-page',
  components: {
    ErErrorModal,
    ErDadataSelect,
    ErActivationModal
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
    isFiasError: false,
    isDisabledInn: false,
    modelData: {
      nameCompany: '',
      addressCompany: null,
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
      type: '',
      addressCompanyId: ''
    },
    rules: {
      isRequired: value => !!value || 'Поле обязательно к заполнению'
    },
    loadingInn: false,
    loadingInnScreen: false,
    readonly: {
      nameCompany: false,
      registrationReasonCode: false,
      addressCompany: false,
      passport: false
    },
    fiasId: ''
  }),
  watch: {
    INN (val) {
      if (val) {
        this.modelINN = val
        this.loadingInnScreen = true
        this.$nextTick(() => {
          this.submitInn()
        })
      }
    }
  },
  computed: {
    issetFile () {
      return !!this.modelData.file
    },
    getFileName () {
      return this.issetFile ? this.modelData.file.name : false
    },
    ...mapGetters('auth', ['user']),
    ...mapState({
      clientInfo: state => state.user.clientInfo,
      loadingClientInfo: state => state.loading.clientInfo
    }),
    INN () {
      return this.clientInfo.extendedMap && this.clientInfo.extendedMap[EXTENDED_MAP_INN] &&
        this.clientInfo.extendedMap[EXTENDED_MAP_INN].singleValue
        ? this.clientInfo.extendedMap[EXTENDED_MAP_INN].singleValue.attributeValue
        : false
    }
  },
  methods: {
    submitInn (e) {
      e && e.preventDefault()
      // Если ИНН установлен в системе
      if (this.INN) {
        this.isEntity = this.modelINN.length === 10

        if (this.isEntity) {
          this.modelData.nameCompany = this.clientInfo.name
          this.modelData.registrationReasonCode = this.clientInfo.kpp
          this.modelData.addressCompany = this.clientInfo.fullLegalAddress
          this.modelData.addressCompanyId = {
            name: this.clientInfo.fullLegalAddress,
            description: '',
            id: this.clientInfo.legalAddress.id
          }

          this.readonly.nameCompany = true
          this.readonly.registrationReasonCode = true
          this.readonly.addressCompany = true
        } else {
          this.modelData.nameCompany = this.clientInfo.name
          this.modelData.addressCompany = this.clientInfo.fullLegalAddress
          this.modelData.passport = `${this.clientInfo.extendedMap[EXTENDED_MAP_ID_SERIAL_NUMBER].singleValue.attributeValue}-${this.clientInfo.extendedMap[EXTENDED_MAP_ID_NUMBER].singleValue.attributeValue}`
          this.modelData.dateOfPassport = this.clientInfo.extendedMap[EXTENDED_MAP_ISSUED_DATE].singleValue.attributeValue
          this.modelData.passportIssuedBy = this.clientInfo.extendedMap[EXTENDED_MAP_ISSUED_BY].singleValue.attributeValue
          this.modelData.addressCompanyId = {
            name: this.clientInfo.fullLegalAddress,
            description: '',
            id: this.clientInfo.legalAddress.id
          }

          this.readonly.nameCompany = true
          this.readonly.addressCompany = true
          this.readonly.passport = true
        }
        this.isInputInn = false
        this.loadingInn = false
        this.loadingInnScreen = false
        return true
      }
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
            if (response.orgname) {
              this.readonly.nameCompany = true
            }

            this.modelData.registrationReasonCode = response.kpp
            // if (response.kpp) {
            //   this.readonly.registrationReasonCode = true
            // }

            this.modelData.addressCompany = response.legalAddressText
            if (response.legalAddressText) {
              this.readonly.addressCompany = true
            }
          } else {
            if (response.fio.surName || response.fio.name || response.fio.lastName) {
              this.modelData.nameCompany = `ИП ${response.fio.surName} ${response.fio.name} ${response.fio.lastName}`
              this.readonly.nameCompany = true
            }
          }
          this.modelData.type = response.type
          if (!response.legalAddressText) {
            this.isInputInn = false
            return
          }
          apiDadata({
            count: 1,
            query: response.legalAddressText
          })
            .then(dadataResponse => {
              // eslint-disable-next-line camelcase
              const fiasId = dadataResponse?.suggestions?.[0]?.data?.fias_id
              if (!fiasId) {
                this.isInputInn = false
                return
              }
              this.$store.dispatch('address/getAddressByFiasId', {
                fiasId
              })
                .then(addressResponse => {
                  this.modelData.addressCompanyId = {
                    name: addressResponse.name,
                    description: '',
                    id: addressResponse.id
                  }
                  this.isInputInn = false
                })
                .catch(() => {
                  this.$store.commit(ERROR_MODAL, false)
                  this.$nextTick(() => {
                    this.isFiasError = true
                    if (this.INN) {
                      this.isDisabledInn = true
                    }
                  })
                })
            })
        })
        .catch(() => {
          this.$store.commit(ERROR_MODAL, true)
        })
        .finally(() => {
          this.loadingInn = false
          this.loadingInnScreen = false
        })
    },
    onBlurDepartmentCode () {
      if (this.readonly.passport) return
      apiDadata({
        type: 'fms_unit',
        query: this.modelData.departmentCode
      })
        .then(response => {
          this.modelData.passportIssuedBy = this._.head(response.suggestions)?.value
        })
    },
    async __actionSubmit () {
      logInfo('Before Validate')
      if (!this.$refs.form.validate()) return
      logInfo('Validate has been successed')
      let addressId
      if (!this.modelData.addressCompanyId) {
        try {
          addressId = await this.$store.dispatch('address/getAddressByFiasId', {
            fiasId: this.modelData.addressCompany.data.fias_id
          })
          addressId = {
            name: addressId.name,
            description: '',
            id: addressId.id
          }
        } catch (er) {
          this.isFiasError = true
        }
      }
      // const fileValid = this.modelData.file !== null
      // if (!fileValid) {
      //   this.isValidFile = false
      //   return false
      // }
      // if (!formValid) return false
      // Изменяем данные клиента
      const editData = {
        inn: this.modelINN,
        name: this.modelData.nameCompany,
        legalAddress: this.modelData.addressCompanyId || addressId,
        type: this.modelData.type
      }
      if (this.isEntity) {
        editData['kpp'] = this.modelData.registrationReasonCode
      } else {
        const [serialNumber, number] = this.modelData.passport.split('-')
        editData['idSerialNumber'] = serialNumber
        editData['idNumber'] = number
        editData['issuedDate'] = this.modelData.dateOfPassport
        editData['issuedBy'] = this.modelData.passportIssuedBy
      }
      const responseClient = await this.$store.dispatch(`user/${UPDATE_CLIENT_INFO}`, { api: this.$api, formData: editData })
      if (!responseClient) {
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
      logInfo('ListenMessage', e)
      if (e.data.action !== 'saveForm') return
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
    document.querySelector('.app__content').classList.add('app__content__height-auto')
    document.querySelector('html').classList.add('auto')
    document.querySelector('body').classList.add('auto')
  },
  beforeDestroy () {
    window.removeEventListener('message', this.listenersDMP)
    document.querySelector('.app__content').classList.remove('app__content__height-auto')
    document.querySelector('html').classList.remove('auto')
    document.querySelector('body').classList.remove('auto')
  }
}
