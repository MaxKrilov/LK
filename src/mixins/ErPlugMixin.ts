import { Vue, Component, Prop } from 'vue-property-decorator'
import { IRequestData, IOrderData, IDeleteOrderData } from '@/constants/er-plug'
import { mapGetters } from 'vuex'
import moment from 'moment'
const methodGenerateParamsOfPST = (
  { bpi: productId }
    :{ bpi: string }) => {
  const initObjProductId = {
    productId
  }
  return (beginDays: any, endDays: any) => {
    return Object.assign({ chars: {
      'Дата активации': beginDays,
      'Дата отключения': endDays
    } }, initObjProductId)
  }
}

interface IResponseActionParams {
  answer: any
}

@Component({
  computed: {
    ...mapGetters({ managerId: 'user/getManagerId' }),
    ...mapGetters({ getActiveBillingAccountNumber: 'payments/getActiveBillingAccountNumber' }),
    ...mapGetters({ clientInfo: 'user/getClientInfo' })
  } })
export default class ErPlugMixin extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isSendManagerRequest!: boolean
  @Prop({ type: Boolean, default: false }) readonly isSendOrder!: boolean
  @Prop({ type: Boolean, default: false }) readonly isResetPeriod!: boolean
  @Prop({ type: Boolean, default: false }) readonly isThereActivationDate!: boolean
  @Prop({ type: Boolean, default: false }) readonly isAtLeastThreeDays!: boolean
  @Prop({ type: Object, default: () => { return {} } }) readonly requestData!: IRequestData
  @Prop({ type: Object, default: () => { return {} } }) readonly orderData!: IOrderData
  @Prop({ type: Object, default: () => { return {} } }) readonly deleteOrderData!: IDeleteOrderData
  @Prop({ type: Boolean, default: false }) readonly isConnection!: boolean // v-modal внешний
  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean
  @Prop({ type: String, default: 'Подключить' }) readonly plugButtonName!: string
  @Prop({ type: Array }) readonly internalPeriod!: Date[]
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
  get computingDiff () {
    return (start: Date, end: Date) => Math.abs(this.$moment(end).diff(start, 'days'))
  }
  get calculationInternalPeriod () {
    const [start, end] = this.internalPeriod
    const diff = this.computingDiff(start, end)

    if (diff === 2) {
      const daysAdd = end
      return [
        start,
        new Date(
          daysAdd
            .setDate(daysAdd
              .getDate() + 1)
        )
      ]
    }
    return [start, end]
  }
  generateOrderData (orderData: IOrderData) {
    const {
      locationId,
      bpi,
      marketId,
      productCode,
      chars,
      tomsId,
      offer
    } : IOrderData = orderData
    return {
      locationId,
      bpi,
      marketId,
      productCode,
      chars,
      tomsId,
      offer
    }
  }
  async divisionCreateOrder () {
    const productCode: unknown = this.orderData?.productCode
      .split(' ')
      .join('')
      .split(',')
      .find((code: string) => code)
    const {
      marketId,
      bpi: productId,
      locationId
    } : { marketId: string, bpi: string, locationId: string } = this.generateOrderData(this.orderData)
    const offer = 'tv'
    this.isCreatingOrder = true
    try {
      await this.$store.dispatch('salesOrder/create',
        {
          locationId,
          marketId
        })
      await this.$store.dispatch('salesOrder/addElement',
        {
          productCode,
          productId,
          offer
        })

      this.isShowOrderModal = true
    } catch (e) {
      console.error(e)
      this.isShowErrorOrderModal = true
      this.errorEmit()
    } finally {
      this.isCreatingOrder = false
    }
  }

  async createOrder () {
    this.isCreatingOrder = true
    const url = this.isUpdate
      ? 'salesOrder/createModifyOrder'
      : 'salesOrder/createSaleOrder'
    const errCatch = () => {
      this.isShowErrorOrderModal = true
      this.errorEmit()
    }
    const modalShowOrder = () => {
      this.isShowOrderModal = true
    }
    const orderCreating = () => {
      this.isCreatingOrder = false
    }
    this.$store.dispatch(url,
      this.generateOrderData(this.orderData))
      .then(modalShowOrder)
      .catch(errCatch)
      .finally(orderCreating)
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
  async appointModelPeriodPicker (calculationInternalPeriod: Date[]) {
    const [start, end] = calculationInternalPeriod
    const beginPeriodPicker = moment(start).format('YYYY-MM-DDT00:00+03:00')
    const endPeriodPicker = `${moment(end).format('YYYY-MM-DDT')}00:00+03:00`
    const setActionParams = (beginPeriodPicker: any, endPeriodPicker: any, internalPeriod: Date[]) => {
      const xPeriod: any = methodGenerateParamsOfPST(this.orderData)
      return internalPeriod ? xPeriod(beginPeriodPicker, endPeriodPicker) : xPeriod
    }
    const responseAction = (answer: any) => answer
    const responseErrorAction = (error: any) => {
      if (error['status'] === 500 || error['status'] === 402) {
        this.isShowErrorOrderModal = true
        this.errorEmit()
      }
    }
    await this.$store.dispatch('salesOrder/updateNewElement',
      setActionParams(beginPeriodPicker, endPeriodPicker, this.internalPeriod))
      .then(responseAction)
      .catch(responseErrorAction)
  }
  async sendOrder () { // отправка заказа в работу
    this.sendingOrder = true
    const data: {offerAcceptedOn?: string} = {}
    if (this.orderData?.offer) data.offerAcceptedOn = this.$moment().toISOString()
    if (this.isResetPeriod) {
      await this.appointModelPeriodPicker(this.calculationInternalPeriod)
    }
    await this.$store.dispatch('salesOrder/save',
      {})
    await this.$store.dispatch('salesOrder/send', data)
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
        this.resetPeriod()
      })
  }
  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
    this.$emit('cancelOrder')
    this.resetPeriod()
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
  resetPeriod () {
    this.$emit('resetPeriodAction', false)
  }
}
