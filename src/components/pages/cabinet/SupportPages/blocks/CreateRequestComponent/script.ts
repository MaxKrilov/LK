import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState, mapGetters } from 'vuex'
import {
  LIST_CLAIM_THEME,
  LIST_COMPLAINT_THEME,
  LIST_REQUEST_THEME,
  LIST_TECHNICAL_REQUEST_THEME
} from '@/store/actions/dictionary'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErTimePickerRange from '@/components/blocks/ErTimePickerRange'
import ErtTextareaWithFile from '@/components/blocks2/ErtTextareaWithFile/index'
import ErDadataSelect from '@/components/blocks/ErDadataSelect'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import { getFirstElement } from '@/functions/helper'
import { CREATE_REQUEST, GET_REQUEST, GET_SERVICES_BY_LOCATION } from '@/store/actions/request'
/* eslint-disable no-used-vars */
import { API } from '@/functions/api'

import moment from 'moment'
import { ICustomerProduct } from '@/tbapi'

interface standardSelectItem {
  id?: string | number,
  value?: string
}

interface iListContactMethodsItem extends standardSelectItem {}

interface iListAddressItem extends standardSelectItem {
  locationId?: string | number
}

interface iItemService extends standardSelectItem {
  typeAuth?: string
  offerCode?: string
}

export interface iContactListItem {
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

interface iErForm extends HTMLFormElement {
  validate: () => boolean
}

// @ts-ignore
@Component({
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo,
      listRequestTheme: (state: any) => state.dictionary[LIST_REQUEST_THEME],
      listTechnicalRequestTheme: (state: any) => state.dictionary[LIST_TECHNICAL_REQUEST_THEME],
      listComplaintRequestTheme: (state: any) => state.dictionary[LIST_COMPLAINT_THEME],
      listClaimTheme: (state: any) => state.dictionary[LIST_CLAIM_THEME],
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH],
      listBillingAccount: (state: any) => state.user.listBillingAccount.map((item: any) => item.accountNumber)
    }),
    ...mapGetters('user', ['getAddressList', 'getListContact', 'agreementNumber'])
  },
  components: {
    ErPhoneSelect,
    ErTimePickerRange,
    ErtTextareaWithFile,
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
  requestTheme: iRequestTheme | undefined = { id: '9154749993013188903', value: 'Общие вопросы', form: 'general_issues', requestName: 'request' }
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
  street: any = ''
  // Suspension of a contract or service
  stoppedFrom = new Date()
  // Erroneous payment
  payer = ''
  paymentOrderNumber = ''
  datePayment = new Date()
  sumPayment = ''
  // Change of Internet Protocol
  service: iItemService = {}
  internetProtocol = ''
  // Termination of a contract or service
  terminateFrom = new Date()
  // Technocal issues
  technicalRequestTheme: iRequestTechnicalTheme | any = {}
  // complaint
  complaintTheme: string = '9156211043213279417'

  claimTheme: { id: string, value: string } | any = {}

  email: string = ''
  post: string = ''
  // ===== LISTS =====
  listRequestTheme!: iRequestTheme[]
  listTechnicalRequestTheme!: iRequestTechnicalTheme[]
  listComplaintRequestTheme!: iRequestTechnicalTheme[]
  listClaimTheme!: { id: string, value: string }
  getAddressList!: iListAddressItem[]
  getListContact!: iContactListItem[]
  listBillingAccount!: string[]

  loadingService: boolean = false

  listService: iItemService[] = []
  clientInfo!: any

  ticketName = ''

  resultDialogSuccess = false
  resultDialogError = false

  loadingCreating = false

  file: File[] = []
  fileMessage: string[] = []

  isHardwareRestarted: boolean = false
  isHasPowerSupply: boolean = false

  listPhoneNumberByTelephone: string[] = []
  listSelectedPhoneNumberByTelephone: string[] = []
  isAllPhoneNumberByTelephone: boolean = false

  get isReadonlyName () {
    return this.getPhoneList.includes(this.phoneNumber.replace(/[\D]+/g, ''))
  }

  get getLinkDeclaration () {
    switch (this.requestTheme?.form) {
      case 'renewal_of_the_contract':
        return `${this.publicPath}documents/zayavlenie_na_pereoformlenie.docx`
    }
  }

  get getPhoneList () {
    return this.getListContact.map((item: iContactListItem) => item.phone?.value).filter(item => !!item)
  }

  get getEmailList () {
    return this.getListContact.map((item: iContactListItem) => item.email?.value).filter(item => !!item)
  }

  requiredRule = [
    (v: any) => !!v || 'Поле обязательно к заполнению'
  ]

  requiredRuleArray = [
    (v: any[]) => (Array.isArray(v) && v.length) !== 0 || 'Поле обязательно к заполнению'
  ]

  get listServiceComputed () {
    return this.listService.filter((item: iItemService) => !!item.typeAuth)
  }

  get computedTicketName () {
    return this.ticketName.split(' ').slice(0, 2).join(' ')
  }

  get isShowListPhoneNumber () {
    return this.requestTheme?.form === 'technical_issues' &&
      (['9154786970013205620', '9154741760013186141'].includes(this.technicalRequestTheme?.id as string)) &&
      (['VIRTNUMB', 'UNLIMCOMPL', 'TRUNK', 'UNLIMFLE1'].includes(this.service?.offerCode || ''))
  }

  @Watch('requestTheme')
  onRequestThemeChange () {
    this.reset()
    if (this.$route.params.addressId) {
      this.address = this.getAddressList.find((item: iListAddressItem) => item.id === this.$route.params.addressId)
    }
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
      this.name = findingValue.name
    }
  }

  @Watch('address')
  onAddressChange (val: iListAddressItem) {
    if (!val.locationId) return
    this.loadingService = true
    this.services = []
    this.service = {}
    this.$store.dispatch(`request/${GET_SERVICES_BY_LOCATION}`, {
      api: this.$api,
      locationId: val.locationId
    })
      .then(response => {
        this.listService = response.filter((item: any) => item?.offer?.isRoot).map((item: any) => ({
          id: item.id,
          value: item.chars && item.chars['Имя в счете'] ? item.chars['Имя в счете'] : item.name,
          typeAuth: item.chars && item.chars['Тип авторизации'] ? item.chars['Тип авторизации'] : undefined,
          offerCode: item.offer?.code || ''
        }))
        if (this.$route.params.bpi) {
          this.service = this.listService.find((item: any) => item.id === this.$route.params.bpi) || {}
        }
        this.loadingService = false
      })
  }

  @Watch('isWholeContract')
  onIsWholeContract (val: boolean) {
    if (val) {
      this.services = []
      this.address = {}
    }
  }

  @Watch('service')
  onServiceChange (val: iItemService) {
    if (this.isShowListPhoneNumber) {
      this.$store.dispatch('productnservices/getAllSlo', {
        api: this.$api,
        parentIds: [val.id]
      })
        .then((response: Record<string, ICustomerProduct>) => {
          this.listPhoneNumberByTelephone = Object.values(response)[0].slo
            .filter(sloItem => sloItem.chars.hasOwnProperty('Номер телефона'))
            .map(sloItem => sloItem.chars['Номер телефона'])
        })
    }
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
    if (!(this.$refs[this.requestTheme?.form || 'form'] as iErForm).validate()) return
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
    let customerContactId, phoneId, complainantPhone
    if (customerContact !== undefined) {
      customerContactId = customerContact.id
      phoneId = customerContact.phone.id
    } else {
      customerContact = this.getListContact.find((item: iContactListItem) => item.isLPR) || getFirstElement(this.getListContact)
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
        complainantPhone = this.phoneNumber.replace(/[\D]+/g, '')
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
      file: this.file,
      complaintTheme: this.claimTheme.id,
      complainantPhone,
      complainantContactName: complainantPhone ? this.name : undefined
      // emailAddress
    })
      .then((answer: boolean | string) => {
        if (typeof answer === 'string' && answer !== '') {
          this.ticketName = answer
          this.resultDialogSuccess = true
          this.closeForm()
          this.reset()
          setTimeout(() => {
            this.$store.dispatch(`request/${GET_REQUEST}`, { api: this.$api })
          })
        } else {
          this.resultDialogError = true
        }
      })
      .catch(() => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCreating = false
        this.$scrollTo('.support-page')
      })
  }

  getDescriptionText () {
    const comment = `Заявка сформирована из ЛК B2B: ${this.comment}`
    const phone = `Контактный номер телефона: ${this.phoneNumber}`
    const name = `Как обращаться к клиенту: ${this.name}`
    const agreementOrServices = this.isWholeContract
      ? `Номер договора: ${this.agreementNumber}`
      : `Услуги: ${this.services.map((item: standardSelectItem) => item.value)};
        Адрес: ${this.address.value}`
    const address = `Адрес: ${this.address.value}`
    const services = `Услуги: ${this.services.map((item: standardSelectItem) => item.value)}`
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
          Восстановить с: ${moment(this.recoverFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'transfer_point_or_service':
        return `
          ${comment};
          ${address};
          ${services};
          Адрес куда перенести: ${this.street.value};
          ${phone};
          ${name}.`
      case 'change_of_internet_protocol':
        return `
          ${comment};
          Смена Интернет-протокола: ${this.service.typeAuth} на ${this.service.typeAuth === 'PPPoE' ? 'IPoE' : 'PPPoE'}
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
          Приостановить с ${moment(this.stoppedFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'termination_of_a_contract_or_service':
        return `
          ${comment};
          Расторгнуть с ${moment(this.terminateFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'erroneous_payment':
        return `
          ${comment};
          Плательщик: ${this.payer};
          Номер платежного поручения: ${this.paymentOrderNumber};
          Дата платежа: ${moment(this.datePayment).format('LL')};
          Сумма платежа: ${this.sumPayment.replace('₽', 'руб.')};
          ${phone};
          ${name}.`
      case 'money_transfer':
        return `
          ${comment};
          Перевести с л/с ${this.firstPersonalAccount} на л/с ${this.secondPersonalAccount};
          Сумма перевода: ${this.sumTransfer.replace('₽', 'руб.')};
          ${phone};
          ${name}.`
      case 'renewal_of_the_contract':
        return `
          ${comment};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case `technical_issues`:
        let text = `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name};
          Доп. информация:
          * Оборудование было перезагружено: ${this.isHardwareRestarted ? 'Да' : 'Нет/Неизвестно'};
          * На адресе имеется электропитание: ${this.isHasPowerSupply ? 'Да' : 'Нет/Неизвестно'};
          `
        if (this.isShowListPhoneNumber) {
          text += `
          Список номеров телефонов, где наблюдается проблема: ${this.isAllPhoneNumberByTelephone ? 'Все номера' : String(this.listSelectedPhoneNumberByTelephone)}
          `
        }
        return text
      case 'complaint':
        return `
          ${comment};
          ${address};
          ${phone};
          Адрес электронной почты: ${this.email};
          ${name};
          Должность: ${this.post}
        `
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
    this.terminateFrom = new Date()
    this.technicalRequestTheme = ''
  }

  mounted () {
    if (this.$route.query && this.$route.query.form) {
      (this as any)[this.screenWidth <= BREAKPOINT_XL ? 'isOpenForm' : 'isOpenFormDesktop'] = true
      this.requestTheme = this.listRequestTheme.find((item: iRequestTheme) => item.form === this.$route.query.form)!
      this.$nextTick(() => {
        this.screenWidth >= BREAKPOINT_XL && this.$scrollTo('.create-request-component')
      })
    }
  }
}
