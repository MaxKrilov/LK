import { Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { iContactListItem } from '@/components/pages/cabinet/SupportPages/blocks/CreateRequestComponent/script'
import { CREATE_REQUEST } from '@/store/actions/request'
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErPlugMixin from '@/mixins/ErPlugMixin'

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
export default class ErDisconnectProduct extends ErPlugMixin {
  @Prop({ type: Boolean, default: false }) readonly isSendManagerRequest!: boolean
  @Prop({ type: Boolean, default: false }) readonly isConnection!: boolean // v-modal внешний
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
    Как обращаться к клиенту: ${this.name},
    Контактный номер телефона: ${this.phoneNumber};`
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
      this.createDeleteOrder()
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
      type: '9154749993013188896',
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
    this.isShowSuccessRequestModal = false
    this.endConnection()
    this.$emit('changeStatusConnectionModal', true)
  }
  closeCreatingRequest () {
    this.isShowRequestModal = false
    this.$emit('onCloseCreatingRequestModal')
    this.endConnection()
  }
  closeDisconnectingOrder () {
    this.cancelOrder()
    this.endConnection()
    this.$emit('changeStatusConnectionModal', false)
  }

  onCloseErrorModal () {
    this.isShowErrorRequestModal = false
    this.$emit('onCloseErrorModal')
    this.endConnection()
  }
  endConnection () {
    this.$emit('changeStatusConnection', false)
  }
}
