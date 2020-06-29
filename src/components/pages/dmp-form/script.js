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
      addressCompany: false
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
            if (response.kpp) {
              this.readonly.registrationReasonCode = true
            }

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
      apiDadata({
        type: 'fms_unit',
        query: this.modelData.departmentCode
      })
        .then(response => {
          this.modelData.passportIssuedBy = this._.head(response.suggestions)?.value
        })
    },
    __actionSubmit () {
      return new Promise((resolve, reject) => {
        logInfo('Начало отправки формы')
        if (!this.$refs.form.validate()) {
          logInfo('Ошибка при валидации формы')
          reject()
        }
        logInfo('Валидация успешно выполнена')

        const getAddressId = () => new Promise((resolve, reject) => {
          if (this.modelData.addressCompanyId) {
            logInfo('Адрес был получен ранее')
            const { name, description, id } = this.modelData.addressCompanyId
            resolve({ name, description, id })
          } else {
            logInfo('Получение адреса...')
            this.$store.dispatch('address/getAddressByFiasId', {
              fiasId: this.modelData.addressCompany.data.fias_id
            })
              .then(address => {
                logInfo('Адрес получен успешно')
                resolve({
                  name: address.name,
                  description: '',
                  id: address.id
                })
              })
              .catch(() => {
                logInfo('Ошибка при получении адреса')
                this.isFiasError = true
                reject()
              })
          }
        })

        getAddressId()
          .then(address => {
            const editData = {
              inn: this.modelINN,
              name: this.modelData.nameCompany,
              legalAddress: address,
              type: this.modelData.type
            }

            if (this.isEntity) {
              editData['kpp'] = this.modelData.registrationReasonCode
            } else {
              editData['idSerialNumber'] = this.modelData.passport
              editData['issuedDate'] = this.modelData.dateOfPassport
              editData['issuedBy'] = this.modelData.passportIssuedBy
            }

            logInfo('Изменение данных о клиенте: отправка запроса')

            this.$store.dispatch(`user/${UPDATE_CLIENT_INFO}`, { api: this.$api, formData: editData })
              .then(() => {
                logInfo('Данные были успешно изменены')
                this.$store.dispatch(`user/${GET_CLIENT_INFO}`, { api: this.$api })
                resolve()
              })
              .catch(() => {
                logInfo('Ошибка при изменении данных о клиенте')
                reject()
              })
          })
          .catch(() => {
            reject()
          })
      })
    },
    submitFormCreate (e) {
      e.preventDefault()
      this.__actionSubmit()
    },
    listenersDMP (e) {
      if (e.data.action !== 'saveForm') return
      logInfo('Слушаем событие')
      this.__actionSubmit()
        .then(() => {
          logInfo('Всё выполнено успешно - сообщаем порталу')
          !this.isInputInn && window.top.postMessage({ eventType: 'ertUserForm', state: 'registered' }, '*')
        })
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
