import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState, mapGetters } from 'vuex'
import { LIST_REQUEST_THEME, LIST_TECHNICAL_REQUEST_THEME } from '@/store/actions/dictionary'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErTimePickerRange from '@/components/blocks/ErTimePickerRange'
import ErTextareaWithFile from '@/components/blocks/ErTextareaWithFile'
import ErDadataSelect from '@/components/blocks/ErDadataSelect'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { SCREEN_WIDTH } from "@/store/actions/variables"
import { BREAKPOINT_XL } from "@/constants/breakpoint"
import { getFirstElement } from '@/functions/helper'
import { CREATE_REQUEST, GET_SERVICES_BY_LOCATION } from '@/store/actions/request'
import { API } from '@/functions/api'
import { GET_LIST_SERVICE_BY_ADDRESS } from '@/store/actions/user'

interface standardSelectItem {
  id?: string | number,
  value?: string
}

interface iListContactMethodsItem extends standardSelectItem {}

interface iListAddressItem extends standardSelectItem {}

interface iContactListItem {
  id?: string | number,
  firstName?: string,
  name?: string,
  phone: iListContactMethodsItem,
  email: iListContactMethodsItem,
  isLPR: boolean
}

interface iRequestTheme {
  id: string,
  value: string,
  form: string,
  requestName: string
}

interface iRequestTechnicalTheme {
  id: string,
  value: string,
  requestName: string
}

// @ts-ignore
@Component({
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo,
      listRequestTheme: (state: any) => state.dictionary[LIST_REQUEST_THEME],
      listTechnicalRequestTheme: (state: any) => state.dictionary[LIST_TECHNICAL_REQUEST_THEME],
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    }),
    ...mapGetters('user', ['getAddressList', 'getListContact', 'agreementNumber'])
  },
  components: {
    ErPhoneSelect,
    ErTimePickerRange,
    ErTextareaWithFile,
    ErDadataSelect,
    ErActivationModal
  }
})
export default class CreateRequestComponent extends Vue {
  publicPath = process.env.BASE_URL
  $api!: API
  agreementNumber!: string | number
  isOpenForm = false
  isOpenFormDesktop = false
  screenWidth!: number
  // ===== DATA =====
  // ===== MODELS =====
  // Global
  requestTheme: iRequestTheme | undefined = { id: '9154749993013188894', value: 'Общие вопросы', form: 'general_issues', requestName: 'request' }
  phoneNumber = ''
  address: iListAddressItem | any = {}
  name = ''
  comment = ''
  time = []
  // Restoring a contract or services
  services = []
  recoverFrom = new Date()
  isWholeContract = false
  // Money transfer
  firstPersonalAccount = ''
  secondPersonalAccount = ''
  sumTransfer = ''
  // Transfer point or service
  street = ''
  // Suspension of a contract or service
  stoppedFrom = new Date()
  // Erroneous payment
  payer = ''
  paymentOrderNumber = ''
  datePayment = new Date()
  sumPayment = ''
  // Change of Internet Protocol
  service: standardSelectItem = {}
  internetProtocol = ''
  // Termination of a contract or service
  terminateFrom = ''
  // Technocal issues
  technicalRequestTheme: iRequestTechnicalTheme | any = {}
  // ===== LISTS =====
  listRequestTheme!: iRequestTheme[]
  listTechnicalRequestTheme!: iRequestTechnicalTheme[]
  getAddressList!: iListAddressItem[]
  getListContact!: iContactListItem[]

  loadingService: boolean = false

  listService: standardSelectItem[] = []
  clientInfo!: any

  ticketName = ''

  resultDialogSuccess = false
  resultDialogError = false

  loadingCreating = false

  file = ''

  get getLinkDeclaration () {
    switch (this.requestTheme?.form) {
      case 'renewal_of_the_contract':
        return `${this.publicPath}documents/zayavlenie_na_pereoformlenie.docx`
      case 'suspension_of_a_contract_or_service':
        return `${this.publicPath}documents/zayavlenie_na_priostanovlenie.docx`
      case 'termination_of_a_contract_or_service':
        return `${this.publicPath}documents/zayavlenie_na_rastorzhenie_dogovora.docx`
      case 'restoring_a_contract_or_service':
        return `${this.publicPath}documents/zayavlenie_na_vozobnovlenie_dogovora_uslugi.docx`
      default:
        return ''
    }
  }

  get getPhoneList () {
    return this.getListContact.map((item: iContactListItem) => item.phone?.value)
  }

  requiredRule = [
    (v: any) => !!v || 'Поле обязательно к заполнению'
  ]

  requiredRuleArray = [
    (v: any[]) => Array.isArray(v) && v.length !== 0 || 'Поле обязательно к заполнению'
  ]

  @Watch('requestTheme')
  onRequestThemeChange () {
    this.reset()
  }

  @Watch('firstPersonalAccount')
  onFirstPersonalAccountChange () {
    this.secondPersonalAccount = ''
  }

  @Watch('screenWidth')
  onScreenWidthChange (val: number) {
    if (val > BREAKPOINT_XL && this.isOpenForm) {
      this.isOpenForm = false
      this.isOpenFormDesktop = true
    } else if (val < BREAKPOINT_XL && this.isOpenFormDesktop) {
      this.isOpenForm = true
      this.isOpenFormDesktop = false
    }
  }

  @Watch('phoneNumber')
  onPhoneNumberChange (val: string) {
    const _val = val.replace(/[\D]+/, '')
    const findingValue = this.getListContact.find((item: iContactListItem) => item.phone?.value === _val)
    if (findingValue !== undefined && findingValue.firstName && findingValue.name) {
      this.name = `${findingValue.firstName} ${findingValue.name}`
    }
  }

  @Watch('address')
  onAddressChange (val: iListAddressItem) {
    this.loadingService = true
    console.log(val)
    this.$store.dispatch(`request/${GET_SERVICES_BY_LOCATION}`, {
      api: this.$api,
      locationId: val.id
    })
      .then(response => {
        this.listService = response.map((item: any) => ({
          id: item.id,
          value: item.name
        }))
        this.loadingService = false
      })
  }

  closeForm () {
    if (this.screenWidth < BREAKPOINT_XL) {
      this.isOpenForm = false
    } else {
      this.isOpenFormDesktop = false
    }
  }

  openDesktopForm () {
    this.isOpenFormDesktop = true
  }

  toggleSlideUpDown () {
    this.isOpenFormDesktop = !this.isOpenFormDesktop
  }

  createRequest () {
    // @ts-ignore
    if (!this.$refs.form.validate()) return
    this.loadingCreating = true
    // Наименование проблемы
    const requestName = this.requestTheme?.requestName
    // Идентификатор адреса
    const location = this.address?.id || getFirstElement(this.getAddressList)?.id
    // Описание проблемы
    const description = this.getDescriptionText()
    // Идентификатор типа заявки
    const type = this.requestTheme?.id
    // Идентификатор контакта кастомера
    let customerContact = this.getListContact.find((item: iContactListItem) => item.phone?.value === this.phoneNumber.replace(/[\D]+/g, ''))
    let customerContactId, phoneId
    if (customerContact !== undefined) {
      customerContactId = customerContact.id
      phoneId = customerContact.phone.id
    } else {
      customerContact = this.getListContact.find((item: iContactListItem) => item.isLPR)
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
      }
    }

    this.$store.dispatch(`request/${CREATE_REQUEST}`, {
      requestName,
      location,
      description,
      type,
      customerContact: customerContactId,
      phoneNumber: phoneId,
      api: this.$api,
      problemTheme: this.technicalRequestTheme.id,
      service: this.service.id,
      file: this.file
    })
      .then((answer: boolean | string) => {
        if (typeof answer === 'string' && answer !== '') {
          this.ticketName = answer
          this.resultDialogSuccess = true
          this.closeForm()
          this.reset()
        } else {
          this.resultDialogError = true
        }
      })
      .catch((e: any) => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCreating = false
      })
  }

  getDescriptionText () {
    const comment = `Заявка сформирована из ЛК B2B: ${this.comment}`
    const phone = `Контактный номер телефона: ${this.phoneNumber}`
    const name = `Как обращаться к клиенту: ${this.name}`
    const agreementOrServices = this.isWholeContract
      ? `Номер договора: ${this.agreementNumber}`
      : `
        Услуги: ${this.services};
        Адрес: ${this.address.value};
      `
    const address = `Адрес: ${this.address.value}`
    const services = `Услуги: ${this.services}`
    // @ts-ignore
    const service = `Услуга: ${this.service.value}`
    switch (this.requestTheme?.form) {
      case 'general_issues':
      case 'order_a_document':
      case 'change_of_details':
        return `
          ${comment};
          ${phone};
          ${name}.`
      case 'restoring_a_contract_or_service':
        return `
          ${comment};
          Восстановить с: ${this.recoverFrom};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'transfer_point_or_service':
        return `
          ${comment};
          ${address};
          ${services};
          Адрес куда перенести: ${this.street};
          ${phone};
          ${name}.`
      case 'change_of_internet_protocol':
        return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`
      case 'change_of_tariff':
        return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`
      case 'suspension_of_a_contract_or_service':
        return `
          ${comment};
          Приостановить с ${this.stoppedFrom};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'termination_of_a_contract_or_service':
        return `
          ${comment};
          Расторгнуть с ${this.terminateFrom};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'erroneous_payment':
        return `
          ${comment};
          Плательщик: ${this.payer};
          Номер платежного поручения: ${this.paymentOrderNumber};
          Дата платежа: ${this.datePayment};
          Сумма платежа: ${this.sumPayment};
          ${phone};
          ${name}.`
      case 'money_transfer':
        return `
          ${comment};
          Перевести с л/с ${this.firstPersonalAccount} на л/с ${this.secondPersonalAccount};
          Сумма перевода: ${this.sumTransfer};
          ${phone};
          ${name}.`
      case 'renewal_of_the_contract':
        return `
          ${comment};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case `technical_issues`:
        return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`
    }
  }

  reset () {
    this.phoneNumber = ''
    this.address = {}
    this.name = ''
    this.comment = ''
    this.time = []
    this.services = []
    this.recoverFrom = new Date()
    this.isWholeContract = false
    this.firstPersonalAccount = ''
    this.secondPersonalAccount = ''
    this.sumTransfer = ''
    this.street = ''
    this.stoppedFrom = new Date()
    this.payer = ''
    this.paymentOrderNumber = ''
    this.datePayment = new Date()
    this.sumPayment = ''
    this.service = {}
    this.internetProtocol = ''
    this.terminateFrom = ''
    this.technicalRequestTheme = ''
  }
}
