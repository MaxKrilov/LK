import { Vue, Component, Prop } from 'vue-property-decorator'
import { IRequestData, IOrderData, IDeleteOrderData } from '@/constants/er-plug'

@Component({
})
export default class ErPlugMixin extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isSendManagerRequest!: boolean
  @Prop({ type: Boolean, default: false }) readonly isSendOrder!: boolean
  @Prop({ type: Object, default: () => { return {} } }) readonly requestData!: IRequestData
  @Prop({ type: Object, default: () => { return {} } }) readonly orderData!: IOrderData
  @Prop({ type: Object, default: () => { return {} } }) readonly deleteOrderData!: IDeleteOrderData
  @Prop({ type: Boolean, default: false }) readonly isConnection!: boolean // v-modal внешний
  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean

  isShowRequestModal: boolean = false
  isShowSuccessRequestModal: boolean = false
  isShowErrorRequestModal: boolean = false
  isCreatingRequest: boolean = false

  isShowOrderModal: boolean = false
  isShowErrorOrderModal: boolean = false
  isCreatingOrder: boolean = false
  isShowSuccessOrderModal: boolean = false

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
        productCode: this.orderData?.productCode,
        chars: this.orderData?.chars
      })
      .then(() => {
        this.isShowOrderModal = true
      })
      .catch(() => {
        this.isShowErrorOrderModal = true
      })
      .finally(() => {
        this.isCreatingOrder = false
      })
  }
  createDeleteOrder () { // создание заказа на удаление услуги черный список
    this.$store.dispatch('salesOrder/createDisconnectOrder',
      {
        locationId: this.deleteOrderData.locationId,
        bpi: this.deleteOrderData.bpi,
        productId: this.deleteOrderData.productId,
        disconnectDate: this.$moment().format()
      })
      .then(() => {
        this.isShowDeleteOrderModal = true
      })
      .catch(() => {
        this.isShowErrorOrderModal = true
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
        } else {
          this.isShowSuccessOrderModal = true
        }
        this.isShowOrderModal = false
        this.isShowDeleteOrderModal = false
      })
      .catch(() => {
        this.sendingOrder = false
        this.isShowOrderModal = false
        this.isShowDeleteOrderModal = false
        this.isShowErrorOrderModal = true
      })
      .finally(() => {
        this.sendingOrder = false
      })
  }
  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  closeSuccessOrderModal () {
    this.isShowSuccessOrderModal = false
    this.endConnection()
  }
  closeErrorOrderModal () {
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
}
