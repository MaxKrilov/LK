import Vue from 'vue'
import Component from 'vue-class-component'
import { IOrderContractBill, ISigningDocument } from '@/tbapi/fileinfo'
import { mapActions, mapState } from 'vuex'
import { IAvailableFunds } from '@/tbapi'
// import { price as priceFormatted } from '@/functions/filters'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'
import { IBillingAccount, IBillingInfo } from '@/tbapi/payments'
import { API } from '@/functions/api'

@Component<InstanceType<typeof Payment>>({
  components: {
    ErDocumentViewer
  },
  filters: {
    priceFormatted (val: number) {
      return val.toFixed(2).replace('.', ',')
    }
  },
  props: {
    bill: {
      type: Object,
      default: () => ({})
    },
    isAllSignedDocument: Boolean
  },
  computed: {
    ...mapState({
      listBillingAccount: (state: any) => state.payments.listBillingAccount
    })
  },
  watch: {
    listBillingAccount (val) {
      val.length > 0 && this.getAvailableFundsNBalance()
    }
  },
  methods: mapActions({
    getAvailableFunds: 'salesOrder/getAvailableFunds',
    getBillingInfo: 'payments/getBillingInfo',
    downloadFile: 'fileinfo/downloadFile'
  })
})
export default class Payment extends Vue {
  // Options
  $refs!: Vue & {
    'payment_frame': InstanceType<typeof HTMLFrameElement>
  }
  // Props
  readonly bill!: ({ contractNumber: string, contractType: string } & IOrderContractBill)

  // Data
  availableFunds: number = 0
  balance: number = 0
  isOpenViewer: boolean = false
  isOpenPaymentDialog: boolean = false

  isPaymentRequest: boolean = false
  isPaymentSuccess: boolean = false

  /// Vuex state
  listBillingAccount!: IBillingAccount[]

  // Computed
  get numberAmount () {
    return Number(this.bill.document.billAmount)
  }

  get getIframeSrc () {
    return `/ecommerce/payment?total_amount=${Math.abs(this.numberAmount)}&billing_account=${this.bill.billingAccount}&is_hide_button=1`
  }

  get getAmountToPay () {
    return this.availableFunds >= 0
      ? this.numberAmount
      : Math.abs(this.availableFunds) + this.numberAmount
  }

  get getDeliveryMethod () {
    return this.listBillingAccount.find(item => item.accountNumber === this.bill.billingAccount)?.deliveryMethod ||
      'Unknown'
  }

  /// Vuex methods
  readonly getAvailableFunds!: ({ billingAccountNumber }: { billingAccountNumber?: string }) => Promise<IAvailableFunds>
  readonly getBillingInfo!: ({ billingAccount }: { billingAccount: string }) => Promise<IBillingInfo>
  readonly downloadFile!: ({
    api,
    bucket,
    key,
    ext
  }: {
    api: API,
    bucket: string,
    key: string,
    ext: string
  }) => Promise<Blob | boolean>

  onPaymentHandler () {
    this.$refs.payment_frame.contentWindow?.postMessage({
      eventType: 'e-commerce-payment',
      action: 'payment'
    }, '*')
  }

  async getAvailableFundsNBalance () {
    try {
      const billingAccount = this.listBillingAccount.find(item => item.accountNumber === this.bill.billingAccount)
      if (typeof billingAccount === 'undefined') {
        throw new Error(`Для лицевого счёта ${this.bill.billingAccount} не найден идентификатор`)
      }
      const result = await Promise.all([
        this.getAvailableFunds({ billingAccountNumber: this.bill.billingAccount }),
        this.getBillingInfo({ billingAccount: billingAccount.billingAccountId })
      ])
      const [availableFundsResult, billingInfoResult] = result
      this.availableFunds = Number(availableFundsResult.availableFundsAmt)
      this.balance = 0 - Number(billingInfoResult.balance)

      if (this.availableFunds >= this.numberAmount) {
        this.$emit('payment', 1)
      }
    } catch (e) {
      console.error(e)
    }
  }

  getInternalAvailableFunds () {
    this.getAvailableFunds({ billingAccountNumber: this.bill.billingAccount })
      .then(response => {
        this.availableFunds = Number(response.availableFundsAmt)

        if (this.availableFunds >= this.numberAmount) {
          this.$emit('payment', 1)
        }
      })
  }

  async onDownloadDocumentHandler (document: ISigningDocument) {
    this.isOpenViewer = true

    const file = await this.downloadFile({
      api: this.$api,
      bucket: document.bucket,
      key: document.filePath,
      ext: document.fileName.split('.').pop()!
    })

    const link = window.document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = document.fileName

    window.document.body.append(link)
    link.click()
    link.remove()

    this.isOpenViewer = false

    setTimeout(() => URL.revokeObjectURL(link.href), 7000)
  }

  mounted () {
    this.listBillingAccount.length > 0 && this.getAvailableFundsNBalance()
    window.addEventListener('message', (e) => {
      if (e.data.eventType !== 'ertPayments') return

      if (e.data.state === 'success') {
        // this.getInternalAvailableFunds()
        this.getAvailableFundsNBalance()
        this.isPaymentSuccess = true
        this.isPaymentRequest = false
      }

      if (e.data.state === 'inProgress') {
        this.isPaymentRequest = true
      }

      if (e.data.state === 'error') {
        this.isPaymentRequest = false
      }
    })
  }
}
