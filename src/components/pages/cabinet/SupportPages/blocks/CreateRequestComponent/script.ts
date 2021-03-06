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

import { dataLayerPush } from '@/functions/analytics'

interface standardSelectItem {
  id?: string | number,
  value?: string
}

interface iListContactMethodsItem extends standardSelectItem {}

interface iListAddressItem extends standardSelectItem {
  locationId?: string | number
  value?: string
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

interface iCheckboxSelectionHardwarePowerSupply {
  yes: string,
  no: string
}

// @ts-ignore
@Component({
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo,
      listTechnicalRequestTheme: (state: any) => state.dictionary[LIST_TECHNICAL_REQUEST_THEME],
      listComplaintRequestTheme: (state: any) => state.dictionary[LIST_COMPLAINT_THEME],
      listClaimTheme: (state: any) => state.dictionary[LIST_CLAIM_THEME],
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH],
      listBillingAccount: (state: any) => state.payments.listBillingAccount.map((item: any) => item.accountNumber)
    }),
    ...mapGetters({ listRequestTheme: LIST_REQUEST_THEME }),
    ...mapGetters('user', ['getAddressList', 'getListContact']),
    ...mapGetters('payments', ['getActiveBillingAccountNumber', 'getActiveBillingAccountContractNumber', 'getListBillingAccount'])
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
  getActiveBillingAccountNumber!: string | number
  getActiveBillingAccountContractNumber!: string | number
  getListBillingAccount!: string[]
  isOpenForm = false
  isOpenFormDesktop = false
  screenWidth!: number
  // ===== DATA =====
  // ===== MODELS =====
  // Global
  requestTheme: iRequestTheme | undefined = { id: '', value: '', form: 'default', requestName: '' }
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
  searchFirstPersonalAccount: string | null = null
  searchSecondPersonalAccount: string | null = null
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

  firstLazyBillingAccount: string[] = []
  secondLazyBillingAccount: string[] = []

  loadingService: boolean = false

  listService: iItemService[] = []
  clientInfo!: any

  ticketName = ''

  resultDialogSuccess = false
  resultDialogError = false

  loadingCreating = false

  file: File[] = []
  fileMessage: string[] = []
  listPhoneNumberByTelephone: string[] = []
  listSelectedPhoneNumberByTelephone: string[] = []
  isAllPhoneNumberByTelephone: boolean = false
  modelHardware: string = 'yes'
  modelSupply: string = 'no'
  radioBoxHardwarePowerSupply: iCheckboxSelectionHardwarePowerSupply = {
    yes: '????',
    no: '??????'
  }
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
    (v: any) => !!v || '???????? ?????????????????????? ?? ????????????????????'
  ]

  requiredRuleArray = [
    (v: any[]) => (Array.isArray(v) && v.length) !== 0 || '???????? ?????????????????????? ?? ????????????????????'
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

  get isThemeChosen () {
    return !!this.requestTheme?.id
  }

  defineListBillingAccount (val: string[]) {
    if (val.length === 0) return
    this.firstLazyBillingAccount = val
    this.secondLazyBillingAccount = val
  }

  @Watch('requestTheme')
  onRequestThemeChange () {
    this.reset()
    if (this.$route.params.addressId) {
      this.address = this.getAddressList.find((item: iListAddressItem) => item.id === this.$route.params.addressId)
    }
  }

  @Watch('firstPersonalAccount')
  onFirstPersonalAccountChange (val:string) {
    if (val === null || val === '') return
    this.firstLazyBillingAccount.push(val)
    this.secondPersonalAccount = ''
  }

  @Watch('secondPersonalAccount')
  onSecondPersonalAccountChange (val:string) {
    if (val === null || val === '') return
    this.secondLazyBillingAccount.push(val)
  }

  @Watch('getActiveBillingAccountNumber')
  onGetActiveBillingAccountNumber () {
    this.firstPersonalAccount = this.getActiveBillingAccountNumber as string
  }

  @Watch('listBillingAccount')
  onlistBillingAccount (val:string[]) {
    this.defineListBillingAccount(val)
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
          value: item.chars && item.chars['?????? ?? ??????????'] ? item.chars['?????? ?? ??????????'] : item.name,
          typeAuth: item.chars && item.chars['?????? ??????????????????????'] ? item.chars['?????? ??????????????????????'] : undefined,
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
            .filter(sloItem => sloItem.chars.hasOwnProperty('?????????? ????????????????'))
            .map(sloItem => sloItem.chars['?????????? ????????????????'])
        })
    }
  }

  get sortedAddressList (): iListAddressItem[] {
    // @ts-ignore
    return this.getAddressList.sort((a:iListAddressItem, b:iListAddressItem) => {
      return a?.value?.trim()?.localeCompare(<string>b?.value?.trim())
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

  closeRequestCreation () {
    this.isOpenFormDesktop = false
    this.requestTheme = { id: '', value: '', form: 'default', requestName: '' }
  }

  createRequest () {
    if (!(this.$refs[this.requestTheme?.form || 'form'] as iErForm).validate()) return
    this.loadingCreating = true
    // ???????????????????????? ????????????????
    const requestName = this.requestTheme?.requestName
    // ?????????????????????????? ????????????
    const location = this.address?.id || getFirstElement(this.getAddressList)?.id
    // ???????????????? ????????????????
    const description = this.getDescriptionText()
    // ?????????????????????????? ???????? ????????????
    const type = this.requestTheme?.id
    // ?????????????????????????? ???????????????? ??????????????????
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
  sendParamRadioButton (model: string): string {
    return `
      ${model === 'yes' ? '????' : '??????/????????????????????'}
    `
  }
  getDescriptionText () {
    const comment = `???????????? ???????????????????????? ???? ???? B2B: ${this.comment}`
    const phone = `???????????????????? ?????????? ????????????????: ${this.phoneNumber}`
    const name = `?????? ???????????????????? ?? ??????????????: ${this.name}`
    const agreementOrServices = this.isWholeContract
      ? `?????????? ????????????????: ${this.getActiveBillingAccountNumber}`
      : `????????????: ${this.services.map((item: standardSelectItem) => item.value)};
        ??????????: ${this.address.value}`
    const address = `??????????: ${this.address.value}`
    const services = `????????????: ${this.services.map((item: standardSelectItem) => item.value)}`
    // @ts-ignore
    const service = `????????????: ${this.service.value}`
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
          ???????????????????????? ??: ${moment(this.recoverFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'transfer_point_or_service':
        return `
          ${comment};
          ${address};
          ${services};
          ?????????? ???????? ??????????????????: ${this.street.value};
          ${phone};
          ${name}.`
      case 'change_of_internet_protocol':
        return `
          ${comment};
          ?????????? ????????????????-??????????????????: ${this.service.typeAuth} ???? ${this.service.typeAuth === 'PPPoE' ? 'IPoE' : 'PPPoE'}
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
          ?????????????????????????? ?? ${moment(this.stoppedFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'termination_of_a_contract_or_service':
        return `
          ${comment};
          ?????????????????????? ?? ${moment(this.terminateFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case 'erroneous_payment':
        return `
          ${comment};
          ????????????????????: ${this.payer};
          ?????????? ???????????????????? ??????????????????: ${this.paymentOrderNumber};
          ???????? ??????????????: ${moment(this.datePayment).format('LL')};
          ?????????? ??????????????: ${this.sumPayment.replace('???', '??????.')};
          ${phone};
          ${name}.`
      case 'money_transfer':
        return `
          ${comment};
          ?????????????????? ?? ??/?? ${this.firstPersonalAccount} ???? ??/?? ${this.secondPersonalAccount};
          ?????????? ????????????????: ${this.sumTransfer.replace('???', '??????.')};
          ${phone};
          ${name}.`
      case 'renewal_of_the_contract':
        return `
          ${comment};
          ${agreementOrServices};
          ${phone};
          ${name}.`
      case `technical_issues`:
        let hardware = this.modelHardware
        let supply = this.modelSupply
        let text = `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name};
          ??????. ????????????????????:
          * ???????????????????????? ???????? ??????????????????????????: ${this.sendParamRadioButton(hardware)};
          * ???? ???????????? ?????????????? ????????????????????????????: ${this.sendParamRadioButton(supply)};
          `
        if (this.isShowListPhoneNumber) {
          text += `
          ???????????? ?????????????? ??????????????????, ?????? ?????????????????????? ????????????????: ${this.isAllPhoneNumberByTelephone ? '?????? ????????????' : String(this.listSelectedPhoneNumberByTelephone)}
          `
        }
        return text
      case 'complaint':
        return `
          ${comment};
          ${address};
          ${phone};
          ?????????? ?????????????????????? ??????????: ${this.email};
          ${name};
          ??????????????????: ${this.post}
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
    this.file = []
  }

  dataLayerPush = dataLayerPush

  mounted () {
    if (this.getActiveBillingAccountNumber) this.firstPersonalAccount = this.getActiveBillingAccountNumber as string

    this.defineListBillingAccount(this.listBillingAccount)

    if (this.$route.query && this.$route.query.form) {
      (this as any)[this.screenWidth <= BREAKPOINT_XL ? 'isOpenForm' : 'isOpenFormDesktop'] = true
      this.requestTheme = this.listRequestTheme.find((item: iRequestTheme) => item.form === this.$route.query.form)!
      this.$nextTick(() => {
        this.screenWidth >= BREAKPOINT_XL && this.$scrollTo('.create-request-component')
      })
    }
  }
}
