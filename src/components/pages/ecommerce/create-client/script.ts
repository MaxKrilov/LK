import Vue from 'vue'
import Component from 'vue-class-component'

import { validateINN } from '@/functions/helper2'
import { ErtForm, ErtTextField, ErtSelect } from '@/components/UI2'
import { mapActions } from 'vuex'
import { GET_ORGANISATION_INFO } from '@/store/actions/address'
import {
  IOrganisationInfo,
  IAddressUnitByFias,
  IFMSUnit
} from '@/tbapi/address'
import { apiDadata, API } from '@/functions/api'

import { head, cloneDeep } from 'lodash'
import { mask } from 'vue-the-mask'

import ErtDadataSelect from '@/components/blocks2/ErtDadataSelect/index.vue'
import moment from 'moment'
import { GET_CLIENT_INFO, UPDATE_CLIENT_INFO } from '@/store/actions/user'
import { DadataRequest } from '@/functions/dadata'
import { logError } from '@/functions/logging'
import { DaDataSuggestion, DaDataAddress } from '@/dadata_interfaces/dadata_interfaces'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

@Component<InstanceType<typeof ErtEcommerceCreateClient>>({
  components: {
    ErtDadataSelect,
    ErActivationModal
  },
  directives: { mask },
  watch: {
    'listClientData.passport' (val: string) {
      if (val.match(/([0-9]{4})-([0-9]{6})/)) {
        this.$refs['date-of-passport-input'] && this.$refs['date-of-passport-input'].focus()
      }
    },
    'listClientData.dateOfPassport' (val: string) {
      if (val.match(/([0-9]{2}).([0-9]{2}).([0-9]{4})/)) {
        this.$refs['department-code-of-passport'] && this.$refs['department-code-of-passport'].focus()
      }
    },
    'listClientData.departmentCodeOfPassport' (val: string) {
      if (val.match(/([0-9]{3})-([0-9]{3})/)) {
        if (this.$refs['passport-issued-by']) {
          this.$refs['passport-issued-by'].focus()
          this.$refs['passport-issued-by'].isMenuActive = true
        }
      }
    },
    isFilled (val) {
      if (val) {
        window.parent.postMessage({ eventType: 'ertUserForm', state: 'allowContinue' }, '*')
      }
    }
  },
  methods: {
    ...mapActions({
      getOrganisationInfo: `address/${GET_ORGANISATION_INFO}`,
      getAddressByFiasID: 'address/getAddressByFiasId',
      updateClientInfo: `user/${UPDATE_CLIENT_INFO}`,
      getClientInfo: `user/${GET_CLIENT_INFO}`
    })
  }
})
export default class ErtEcommerceCreateClient extends Vue {
  // Options
  $refs!: Vue & {
    'inn-form': InstanceType<typeof ErtForm>,
    'card-form': InstanceType<typeof ErtForm>
    'date-of-passport-input': InstanceType<typeof ErtTextField>,
    'department-code-of-passport': InstanceType<typeof ErtTextField>,
    'passport-issued-by': InstanceType<typeof ErtSelect>
  }
  // Data
  isINNPage = true
  inn: string = ''
  innDescription = 'ИНН вашей организации вы можете узнать на <a href="https://www.nalog.ru" target="_blank" class="link link--solid--black" rel="noopener">сайте ФНС</a>'
  isLoadingINN: boolean = false

  isErrorAddress: boolean = false

  errorMessages: string[] = []

  listReadonlyFlag = {
    companyName: false,
    companyAddress: false,
    registrationReasonCode: false,
    passport: false,
    dateOfPassport: false,
    departmentCodeOfPassport: false,
    passportIssuedBy: false
  }

  listClientData = {
    companyName: '',
    companyAddress: '' as string | DaDataSuggestion<DaDataAddress>,
    registrationReasonCode: '',
    passport: '',
    dateOfPassport: '',
    departmentCodeOfPassport: '',
    passportIssuedBy: '',
    addressCompanyId: {
      name: '',
      description: '',
      id: ''
    },
    type: ''
  }

  isCorporation: boolean = false

  listFMSUnit: IFMSUnit[] = []

  isUpdateError: boolean = false

  // Computed
  get getINNRules () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => !v.match(/[\D]+/) || 'Поле должно содержать только цифры',
      (v: string) => validateINN(v) || 'Невалидный ИНН'
    ]
  }

  get isFilled () {
    const generalCheck = this.inn &&
      this.listClientData.companyName &&
      (this.listClientData.addressCompanyId.id ||
        !!(this.listClientData.companyAddress as any)?.data?.fias_id) &&
      this.listClientData.type
    if (this.isCorporation) {
      return generalCheck && this.listClientData.registrationReasonCode
    } else {
      return generalCheck &&
        this.listClientData.passport &&
        this.listClientData.dateOfPassport &&
        this.listClientData.passportIssuedBy
    }
  }

  /// Vuex Actions
  getOrganisationInfo!: ({ inn }: { inn: string }) => Promise<IOrganisationInfo>
  getAddressByFiasID!: ({ fiasId }: { fiasId: string }) => Promise<IAddressUnitByFias>
  updateClientInfo!: ({ api, formData }: { api: API, formData: any }) => Promise<boolean>
  getClientInfo!: ({ api }: { api: API }) => Promise<void>

  // Methods
  clearFieldsNFlags () {
    this.listClientData = cloneDeep({
      companyName: '',
      companyAddress: '',
      registrationReasonCode: '',
      passport: '',
      dateOfPassport: '',
      departmentCodeOfPassport: '',
      passportIssuedBy: '',
      addressCompanyId: {
        name: '',
        description: '',
        id: ''
      },
      type: ''
    })
    this.listReadonlyFlag = cloneDeep({
      companyName: false,
      companyAddress: false,
      registrationReasonCode: false,
      passport: false,
      dateOfPassport: false,
      departmentCodeOfPassport: false,
      passportIssuedBy: false
    })
  }

  async onSubmitINN () {
    if ((this.$refs['inn-form'] && !this.$refs['inn-form'].validate()) || this.isLoadingINN) return
    this.errorMessages = []
    this.isLoadingINN = true

    let fiasID

    try {
      const organisationInfoResponse = await this.getOrganisationInfo({ inn: this.inn })
      this.clearFieldsNFlags()

      if (organisationInfoResponse.type === 'corporation') {
        this.isCorporation = true

        if (organisationInfoResponse.orgname) {
          this.listClientData.companyName = organisationInfoResponse.orgname
          this.listReadonlyFlag.companyName = true
        }

        if (organisationInfoResponse.kpp) {
          this.listClientData.registrationReasonCode = organisationInfoResponse.kpp
          this.listReadonlyFlag.registrationReasonCode = true
        }

        if (organisationInfoResponse.legalAddressText) {
          this.listClientData.companyAddress = organisationInfoResponse.legalAddressText
          this.listReadonlyFlag.companyAddress = true
        }
      } else {
        this.isCorporation = false
        if (
          organisationInfoResponse.fio.surName ||
          organisationInfoResponse.fio.name ||
          organisationInfoResponse.fio.lastName
        ) {
          this.listClientData.companyName = `ИП ${organisationInfoResponse.fio.surName} ${organisationInfoResponse.fio.name} ${organisationInfoResponse.fio.lastName}`
          this.listReadonlyFlag.companyName = true
        }
      }

      this.listClientData.type = organisationInfoResponse.type

      if (!this.listClientData.companyAddress) {
        this.isINNPage = false
        this.isLoadingINN = false
        return
      }

      const addressInfoResponse = await DadataRequest.getAddressInfo({
        query: this.listClientData.companyAddress as string,
        count: 1
      })

      fiasID = head(addressInfoResponse?.suggestions || [])?.data.fias_id

      if (!fiasID) {
        const companyInfoResponse = await DadataRequest.getCompanyInfo({
          query: this.inn,
          count: 1
        })

        fiasID = head(companyInfoResponse?.suggestions || [])?.data.address.data.fias_id
      }

      if (!fiasID) {
        this.listClientData.companyAddress = ''
        this.listReadonlyFlag.companyAddress = false
        this.isINNPage = false

        return
      }

      this.isINNPage = false
    } catch (e) {
      logError(e)
      this.errorMessages.push('Произошла ошибка при получении данных об организации')
      this.isLoadingINN = false
    } finally {
      // this.isLoadingINN = false
    }

    try {
      const addressByFiasIDResponse = await this.getAddressByFiasID({ fiasId: fiasID as string })
      this.listClientData.addressCompanyId = cloneDeep({
        name: addressByFiasIDResponse.name,
        description: '',
        id: addressByFiasIDResponse.id
      })
    } catch (e) {
      logError(e)

      this.listClientData.companyAddress = ''
      this.listReadonlyFlag.companyAddress = false
    } finally {
      this.isINNPage = false
      this.isLoadingINN = false
    }
  }

  onSubmitCard () {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.$refs['card-form'].validate()) {
          reject()
          return
        }

        if (!this.listClientData.addressCompanyId.id && typeof this.listClientData.companyAddress !== 'string') {
          let addressByFiasIDResponse
          try {
            addressByFiasIDResponse = await this.getAddressByFiasID({
              fiasId: this.listClientData.companyAddress.data.fias_id
            })
            this.listClientData.addressCompanyId = cloneDeep({
              name: addressByFiasIDResponse.name,
              description: '',
              id: addressByFiasIDResponse.id
            })
          } catch (e) {
            logError(e)
            this.isErrorAddress = true

            reject()
            return
          }
        }

        const requestData: Record<string, any> = {
          inn: this.inn,
          name: this.listClientData.companyName,
          legalAddress: this.listClientData.addressCompanyId,
          type: this.listClientData.type
        }

        if (this.isCorporation) {
          requestData.kpp = this.listClientData.registrationReasonCode
        } else {
          [requestData.idSerialNumber, requestData.idNumber] = this.listClientData.passport.split('-')
          requestData.issuedDate = this.listClientData.dateOfPassport
          requestData.issuedBy = this.listClientData.passportIssuedBy
        }

        const updateClientInfoResponse = await this.updateClientInfo({ api: new API(), formData: requestData })
        if (updateClientInfoResponse) {
          await this.getClientInfo({ api: new API() })
          resolve()
        } else {
          reject()
        }
      } catch (e) {
        logError(e)
        reject(e)
      }
    })
  }

  isValidDate (val: string) {
    return moment(val, 'DD.MM.YYYY').isValid()
  }

  onBlurDepartmentCode () {
    if (this.listReadonlyFlag.departmentCodeOfPassport) return

    apiDadata({
      type: 'fms_unit',
      query: this.listClientData.departmentCodeOfPassport
    })
      .then((response) => {
        this.listFMSUnit = (response as any).suggestions as IFMSUnit[]
      })
  }

  listenersDMP (e: MessageEvent) {
    if (e.data.action !== 'saveForm') return
    this.onSubmitCard()
      .then(() => {
        window.top.postMessage({ eventType: 'ertUserForm', state: 'registered' }, '*')
      })
      .catch(() => {
        window.top.postMessage({ eventType: 'ertUserForm', state: 'error' }, '*')
        this.isUpdateError = true
      })
  }

  // Hooks
  mounted () {
    window.addEventListener('message', this.listenersDMP)
    document.querySelector('.app__content')!.classList.add('app__content__height-auto')
    document.querySelector('html')!.classList.add('auto')
    document.querySelector('body')!.classList.add('auto')
  }

  beforeDestroy () {
    window.removeEventListener('message', this.listenersDMP)
    document.querySelector('.app__content')!.classList.remove('app__content__height-auto')
    document.querySelector('html')!.classList.remove('auto')
    document.querySelector('body')!.classList.remove('auto')
  }
}
