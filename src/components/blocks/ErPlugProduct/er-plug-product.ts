import { Component, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { iContactListItem } from '@/components/pages/cabinet/SupportPages/blocks/CreateRequestComponent/script'
import { CREATE_REQUEST } from '@/store/actions/request'
import { REQUEST_TYPES } from '@/constants/orders'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErPlugMixin from '@/mixins/ErPlugMixin'

// Данный компонент позволяет создавать простые заказы, состоящие из одного элемента
// и отправлять заявки на менеджера
// v-model="isConnection" при установке true начинается работа компонета, после завершения, компонент возвращает  false
// isSendOrder этот параметр отвечает за выбор по умолчанию, что делать создавать заявку или заказ
//
// orderData=
//    locationId - location id
//    bpi - id продукта,
//    productCode - код продукта,
//    chars,
//    offer: есть или нет оферты,
//    title: заголвок модалки
//
// requestData=
//   descriptionModal: описание модалки,
//   addressId: addressId,
//   type: тип заявки
//   services: описание действия для менедера пр. подключение номера,
//   fulladdress: полный адрес

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
export default class ErPlugProduct extends ErPlugMixin {
  name: string = ''
  requestId: string = ''
  phoneNumber: string = ''
  getListContact!: iContactListItem[]
  requiredRule = [
    (v: any) => !!v || 'Пожалуйста, заполните поле'
  ]

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

  @Watch('isShowRequestModal')
  onShowRequestModalChanged (value: boolean) {
    value ? this.$emit('open') : this.$emit('close')
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
    if (this.isSendManagerRequest) {
      this.isShowRequestModal = true
    }
    if (this.isSendOrder) {
      this.createOrder()
    }
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
      customerContact = this.getListContact.find(
        (item: iContactListItem) => item.isLPR && item?.phone?.id
      ) || this.getListContact.find(
        (item: iContactListItem) => item?.phone?.id
      )
      if (customerContact !== undefined) {
        customerContactId = customerContact.id
        phoneId = customerContact.phone.id
        complainantPhone = this.phoneNumber.replace(/[\D]+/g, '')
      } else {
        this.isShowRequestModal = false
        this.isShowErrorRequestModal = true
        this.isCreatingRequest = false
        this.phoneNumber = ''
        this.name = ''
        return
      }
    }

    this.$store.dispatch(`request/${CREATE_REQUEST}`, {
      requestName: 'request',
      location: this.requestData.addressId,
      description: this.descriptionRequestText,
      type: (REQUEST_TYPES as any)[this.requestData?.type || 'connect'] || REQUEST_TYPES.connect,
      customerContact: customerContactId,
      phoneNumber: phoneId,
      api: this.$api,
      complainantPhone,
      complainantContactName: complainantPhone ? this.name : undefined
    })
      .then((answer) => {
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
    this.$emit('closeSuccessRequest')
    this.isShowSuccessRequestModal = false
    this.endConnection()
    this.successEmit()
  }

  closeCreatingRequest () {
    this.$emit('cancelRequest')
    this.isShowRequestModal = false
    this.endConnection()
    this.$emit('cancelOrder')
  }

  onCloseErrorModal () {
    this.$emit('closeError')
    this.isShowErrorRequestModal = false
    this.endConnection()
    this.errorEmit()
  }
}
