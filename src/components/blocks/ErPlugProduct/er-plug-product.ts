import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { IRequestData } from '@/components/blocks/ErPlugProduct/interfaces'
import { iContactListItem } from '@/components/pages/cabinet/SupportPages/blocks/CreateRequestComponent/script'
import { CREATE_REQUEST } from '@/store/actions/request'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const components = {
  ErActivationModal,
  ErPhoneSelect
}
@Component({
  // @ts-ignore
  components,
  model: {
    prop: 'isConnection',
    event: 'changeStatusConnection'
  },
  computed: {
    ...mapGetters('user', ['getListContact'])
  }
})
export default class ErPlugProduct extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isSendManagerRequest!: boolean
  @Prop({ type: Boolean, default: false }) readonly isConnection!: boolean // v-modal внешний
  @Prop({ type: Object, default: () => { return {} } }) readonly requestData!: IRequestData
  isShowModal: boolean = false
  isShowRequestModal: boolean = false
  isShowSuccessRequestModal: boolean = false
  isShowErrorRequestModal: boolean = false
  isCreatingRequest: boolean = false
  name: string = ''
  requestId: string = ''
  phoneNumber: string = ''
  getListContact!: iContactListItem[]
  requiredRule = [
    (v: any) => !!v || 'Пожалуйста, заполните поле'
  ]

  @Watch('isShowModal')
  onIsShowModalChange (val: boolean) {
    !val && this.endConnection()
  }
  @Watch('isConnection')
  onIsConnectionChange (val: boolean) {
    val && this.startConnection()
  }
  @Watch('phoneNumber')
  onPhoneNumberChange (val: string) {
    const _val = val.replace(/[\D]+/, '')
    const findingValue = this.getListContact.find((item: iContactListItem) => item.phone?.value === _val)
    if (findingValue !== undefined && findingValue.firstName && findingValue.name) {
      this.name = findingValue.name
    }
  }

  get requestModalDescrition () {
    return this.requestData?.descriptionModal || ''
  }
  get descriptionRequestText () {
    return `Заявка сформирована из ЛК B2B:
    Услуги: ${this.requestData.services}; 
    Адрес: ${this.requestData.fulladdress}, 
    Контактный номер телефона: ${this.phoneNumber};
    Как обращаться к клиенту: ${this.name}.`
  }

  get isReadonlyName () {
    return this.getPhoneList.includes(this.phoneNumber.replace(/[\D]+/g, ''))
  }

  get getPhoneList () {
    return this.getListContact.map((item: iContactListItem) => item.phone?.value).filter((item: any) => item)
  }
  get isValidateRequestForm () {
    return !(this.phoneNumber && this.name)
  }
  startConnection () {
    this.isShowRequestModal = true
  }
  sendRequest () {
    this.isCreatingRequest = true
    let customerContact = this.getListContact.find(
      (item: iContactListItem) => item.phone?.value === this.phoneNumber.replace(/[\D]+/g, '')
    )
    let customerContactId, phoneId, complainantPhone
    if (customerContact !== undefined) {
      customerContactId = customerContact.id
      phoneId = customerContact.phone.id
    } else {
      customerContact = this.getListContact.find((item: iContactListItem) => item.isLPR) || this.getListContact?.[0]
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
        complainantPhone = this.phoneNumber.replace(/[\D]+/g, '')
      }
    }

    this.$store.dispatch(`request/${CREATE_REQUEST}`, {
      requestName: 'request',
      location: this.requestData.addressId,
      description: this.descriptionRequestText,
      type: '9157238575013921100',
      customerContact: customerContactId,
      phoneNumber: phoneId,
      api: this.$api,
      complainantPhone,
      complainantContactName: complainantPhone ? this.name : undefined
    })
      .then((answer) => {
        console.log(answer)
        this.isShowRequestModal = false
        if (answer) {
          if (typeof answer === 'string') {
            this.requestId = answer.split(' ').slice(0, 2).join(' ')
          }
          this.isShowSuccessRequestModal = true
        } else {
          this.isShowErrorRequestModal = true
        }
      })
      .catch(() => {
        this.isShowRequestModal = false
        this.isShowErrorRequestModal = true
      })
      .finally(() => {
        this.isCreatingRequest = false
        this.phoneNumber = ''
        this.name = ''
      })
  }
  closeSuccessRequestModal () {
    this.isShowSuccessRequestModal = false
    this.endConnection()
  }
  closeCreatingRequest () {
    this.isShowRequestModal = false
    this.endConnection()
  }

  onCloseErrorModal () {
    this.isShowErrorRequestModal = false
    this.endConnection()
  }
  endConnection () {
    this.$emit('changeStatusConnection', false)
  }
}
