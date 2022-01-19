import { Vue, Component, Prop } from 'vue-property-decorator'
import { IRequestData, IOrderData, IDeleteOrderData } from '@/constants/er-plug'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({ managerId: 'user/getManagerId' }),
    ...mapGetters({ getActiveBillingAccountNumber: 'payments/getActiveBillingAccountNumber' }),
    ...mapGetters({ clientInfo: 'user/getClientInfo' })
  } })
export default class ErPlugMixin extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isSendManagerRequest!: boolean
  @Prop({ type: Boolean, default: false }) readonly isSendOrder!: boolean
  @Prop({ type: Object, default: () => { return {} } }) readonly requestData!: IRequestData
  @Prop({ type: Object, default: () => { return {} } }) readonly orderData!: IOrderData
  @Prop({ type: Object, default: () => { return {} } }) readonly deleteOrderData!: IDeleteOrderData
  @Prop({ type: Boolean, default: false }) readonly isConnection!: boolean // v-modal внешний
  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean
  @Prop({ type: String, default: 'Подключить' }) readonly plugButtonName!: string

  @Prop({ type: String })
  readonly analyticConfirmCategory!: string

  @Prop({ type: String })
  readonly analyticConfirmLabel!: string

  @Prop({ type: String })
  readonly analyticCancelCategory!: string

  @Prop({ type: String })
  readonly analyticCancelLabel!: string

  @Prop({ type: String })
  readonly analyticCloseCategory!: string

  @Prop({ type: String })
  readonly analyticCloseLabel!: string

  @Prop({ type: String })
  readonly analyticSuccessConfirmCategory!: string

  @Prop({ type: String })
  readonly analyticSuccessConfirmLabel!: string

  @Prop({ type: String })
  readonly analyticSuccessCancelCategory!: string

  @Prop({ type: String })
  readonly analyticSuccessCancelLabel!: string

  @Prop({ type: String })
  readonly analyticSuccessCloseCategory!: string

  @Prop({ type: String })
  readonly analyticSuccessCloseLabel!: string

  @Prop({ type: String })
  readonly analyticErrorConfirmCategory!: string

  @Prop({ type: String })
  readonly analyticErrorConfirmLabel!: string

  @Prop({ type: String })
  readonly analyticErrorCancelCategory!: string

  @Prop({ type: String })
  readonly analyticErrorCancelLabel!: string

  @Prop({ type: String })
  readonly analyticErrorCloseCategory!: string

  @Prop({ type: String })
  readonly analyticErrorCloseLabel!: string

  isShowRequestModal: boolean = false
  isShowSuccessRequestModal: boolean = false
  isShowErrorRequestModal: boolean = false
  isCreatingRequest: boolean = false

  isShowOrderModal: boolean = false
  isShowErrorOrderModal: boolean = false
  isCreatingOrder: boolean = false
  isShowSuccessOrderModal: boolean = false
  managerId!: string | number
  getActiveBillingAccountNumber!: string | number
  clientInfo!: any

  isShowDeleteOrderModal: boolean = false

  sendingOrder: boolean = false
  createOrder () {
    this.isCreatingOrder = true
    const url = this.isUpdate
      ? 'salesOrder/createModifyOrder'
      : 'salesOrder/createSaleOrder'

    this.$store.dispatch(url,
      {
        locationId: this.orderData?.locationId,
        bpi: this.orderData?.bpi,
        marketId: this.orderData.marketId,
        productCode: this.orderData?.productCode,
        chars: this.orderData?.chars,
        tomsId: this.orderData?.tomsId
      })
      .then(() => {
        this.isShowOrderModal = true
      })
      .catch(() => {
        this.isShowErrorOrderModal = true
        this.errorEmit()
      })
      .finally(() => {
        this.isCreatingOrder = false
      })
  }
  createDeleteOrder () { // создание заказа на удаление услуги
    this.$store.dispatch('salesOrder/createDisconnectOrder',
      {
        locationId: this.deleteOrderData.locationId,
        bpi: this.deleteOrderData.bpi,
        marketId: this.deleteOrderData.marketId,
        productId: this.deleteOrderData.productId,
        disconnectDate: this.$moment().format()
      })
      .then(() => {
        this.isShowDeleteOrderModal = true
      })
      .catch(() => {
        this.isShowErrorOrderModal = true
        this.errorEmit()
      })
  }
  sendOrder () { // отправка заказа в раоту
    this.sendingOrder = true
    const data: {offerAcceptedOn?: string} = {}
    if (this.orderData?.offer) data.offerAcceptedOn = this.$moment().toISOString()

    this.$store.dispatch('salesOrder/send', data)
      .then((answer: any) => {
        this.sendingOrder = false

        if (answer?.submit_statuses?.[0]?.submitStatus === 'FAILED') {
          this.isShowErrorOrderModal = true
          this.errorEmit()
        } else {
          if (answer?.id && this.deleteOrderData?.bpi) {
            this.$store.dispatch(`orders/CREATE_TASK`, {
              owner: this.managerId,
              orderId: answer.id,
              name: 'Отключение сервиса из ЛК',
              type: 'Phone Call Outbound',
              api: this.$api,
              dateFrom: this.$moment().format('DD.MM.YYYY HH:mm'),
              dateTo: `${this.$moment().format('DD.MM.YYYY')} 23:59`,
              description: `${answer?.name} Имя Клиента: ${this?.clientInfo?.name} Л/С: ${this?.getActiveBillingAccountNumber}`
            })
          }
          this.isShowSuccessOrderModal = true
          this.successEmit()
        }
        this.isShowOrderModal = false
        this.isShowDeleteOrderModal = false
      })
      .catch(() => {
        this.sendingOrder = false
        this.isShowOrderModal = false
        this.isShowDeleteOrderModal = false
        this.isShowErrorOrderModal = true
        this.errorEmit()
      })
      .finally(() => {
        this.sendingOrder = false
      })
  }
  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
    this.$emit('cancelOrder')
  }

  closeSuccessOrderModal () {
    this.$emit('closeSuccess')
    this.isShowSuccessOrderModal = false
    this.endConnection()
  }
  closeErrorOrderModal () {
    this.$emit('closeError')
    this.isShowErrorOrderModal = false
    this.cancelOrder()
    this.endConnection()
  }
  closeOrderModal () {
    this.$emit('cancelOrder')
    this.cancelOrder()
    this.endConnection()
  }
  endConnection () {
    this.$emit('changeStatusConnection', false)
  }

  errorEmit () {
    this.$emit('errorOrder')
  }

  successEmit () {
    this.$emit('successOrder')
  }
}
