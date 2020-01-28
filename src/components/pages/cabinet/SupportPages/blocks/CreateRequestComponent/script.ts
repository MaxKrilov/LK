import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState, mapGetters } from 'vuex'
import { LIST_REQUEST_THEME, LIST_TECHNICAL_REQUEST_THEME } from '@/store/actions/dictionary'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErTimePickerRange from '@/components/blocks/ErTimePickerRange'
import ErTextareaWithFile from '@/components/blocks/ErTextareaWithFile'
import ErDadataSelect from '@/components/blocks/ErDadataSelect'
import { SCREEN_WIDTH } from "@/store/actions/variables"
import { BREAKPOINT_XL } from "@/constants/breakpoint"
import { getFirstElement } from '@/functions/helper'
import { CREATE_REQUEST } from '@/store/actions/request'
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
  email: iListContactMethodsItem
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
    ErDadataSelect
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
  requestTheme: iRequestTheme = { id: '9154749993013188894', value: 'Общие вопросы', form: 'general_issues', requestName: 'request' }
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
  house = ''
  office = ''
  // Suspension of a contract or service
  stoppedFrom = new Date()
  // Erroneous payment
  payer = ''
  paymentOrderNumber = ''
  datePayment = new Date()
  sumPayment = ''
  // Change of Internet Protocol
  service = ''
  internetProtocol = ''
  // Termination of a contract or service
  terminateFrom = ''
  // Technocal issues
  technicalRequestTheme = ''
  // ===== LISTS =====
  listRequestTheme!: iRequestTheme[]
  listTechnicalRequestTheme!: iRequestTechnicalTheme[]
  getAddressList!: iListAddressItem[]
  getListContact!: iContactListItem[]

  loadingService: boolean = false

  listService = [] // todo Из хранилища
  listFirstPersonalAccount = ['8800900654328', '8800900654329', '8800900654330'] // todo Из хранилища
  listInternetProtocol = ['IPoE']
  clientInfo!: any

  resultDialog = false

  get listSecondPersonalAccount () {
    return this.listFirstPersonalAccount.filter(item => item !== this.firstPersonalAccount)
  }

  get getLinkDeclaration () {
    switch (this.requestTheme.form) {
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
    this.$store.dispatch(`user/${GET_LIST_SERVICE_BY_ADDRESS}`, {
      api: this.$api,
      address: val.id
    })
      .then(response => {
        this.listService = response.map((item: any) => item.offeringCategory.originalName)
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
    // Наименование проблемы
    const requestName = this.requestTheme.requestName
    // Идентификатор адреса
    const location = this.address?.id || getFirstElement(this.getAddressList)?.id
    // Описание проблемы
    const description = 'Test'
    // Идентификатор типа заявки
    const type = this.requestTheme.id
    // Идентификатор контакта кастомера
    const customerContact = this.getListContact.find((item: iContactListItem) => item.phone?.value === this.phoneNumber.replace(/[\D]+/g, ''))
    if (customerContact !== undefined) {
      const {
        id: customerContactId,
        phone: {
          id: phoneId
        }
      } = customerContact
      this.$store.dispatch(`request/${CREATE_REQUEST}`, {
        requestName,
        location,
        description,
        type,
        customerContact: customerContactId,
        phoneNumber: phoneId,
        api: this.$api
      })
        .then((answer: boolean) => {
          this.closeForm()
        })
    }
  }

  getDescriptionText () {
    const comment = `Заявка сформирована из ЛК B2B: ${this.comment}`
    const phone = `Контактный номер телефона: ${this.phoneNumber}`
    const name = `Как обращаться к клиенту: ${this.name}`
    const agreementOrServices = this.isWholeContract
      ? `Номер договора: ${this.agreementNumber}`
      : `
        Услуг(а/и): ${this.services};
        Адрес: ${this.address.value};
      `
    const address = `Адрес: ${this.address.value}`
    const services = `Услуг(а/и): ${this.services}`
    switch (this.requestTheme.form) {
      case 'general_issues':
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

        `
    }
  }
}
