import Vue from 'vue'
import Component from 'vue-class-component'

import ECommerceFileUpload from '../components/file-upload/index.vue'
import Signatory from './blocks/Signatory/index.vue'
import StatutoryDocuments from './blocks/StatutoryDocuments/index.vue'
import SigningWithScans from './blocks/SigningWithScans/index.vue'
import DigitalSigning from './blocks/DigitalSigning/index.vue'
import Payment from './blocks/Payment/index.vue'
import { mapActions, mapGetters } from 'vuex'
import { ICustomerContract, IOrderContract, IOrderContractContractSignee, IOrderContractContractDocument, IOrderContractBill } from '@/tbapi/fileinfo'

import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import { logError } from '@/functions/logging'

@Component<InstanceType<typeof ECommerceSigningOfDocuments>>({
  components: {
    ECommerceFileUpload,
    Signatory,
    StatutoryDocuments,
    SigningWithScans,
    DigitalSigning,
    Payment
  },
  computed: {
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    })
  },
  methods: {
    ...mapActions({
      getContract: 'fileinfo/getContract',
      getOrderContract: 'fileinfo/getOrderContract'
    })
  },
  watch: {
    isComplete (val) {
      val && window.parent.postMessage({ eventType: 'ertClientContracts', state: 'success' }, '*')
    },
    billingAccountId (val) {
      val && this.getData()
    }
  }
})
export default class ECommerceSigningOfDocuments extends Vue {
  // Data
  authorityToSignFile: File | string | null = null
  isActiveClient: boolean = false

  listContractSignee: IOrderContractContractSignee[] = []
  /**
   * Тип подписи (Ручная или ЭЦП)
   */
  signatureType: string = 'Ручная'
  /**
   * Находится ли документ (-ы) на проверке у менеджера
   */
  isVerifying: boolean = false
  /**
   * Подписаны ли все документы
   */
  isAllSignedDocument: boolean = false
  /**
   * Список оплаченных счетов
   */
  isSuccessListInvoice: Record<string, boolean> = {}

  listContractDocument: Record<string, IOrderContractContractDocument & {
    contractId: string,
    contractSignee: IOrderContractContractSignee,
    contractStatus: string
  }> | null = null

  listBills: ({ contractNumber: string, contractType: string } & IOrderContractBill)[] = []

  listInvoiceTracker: number = 1

  isLoading: boolean = true
  isError: boolean = false

  registrationDocument: string = ''

  readonly billingAccountId!: string

  listHintWithScans = [
    'Скачайте  каждый приложенный документ.',
    'Распечатайте и подпишите.',
    'Отсканируйте.',
    'Загрузите сканы подписанных документов в соответствующие разделы.',
    'Готово! Можно оплачивать.',
    'Передайте оригинал подписанного документа нашему специалисту во время подключения.'
  ]

  listHintDigital = [
    'Запустите приложение цифровой подписи',
    'Нажмите «Подписать»',
    'Обратите внимание на ФИО подписанта',
    'Выберите свой сертификат для подписи и подпишите',
    'Готово! Можно оплачивать'
  ]

  // Computed
  get authorityToSignFileName () {
    if (typeof this.authorityToSignFile === 'string') return this.authorityToSignFile
    if (this.authorityToSignFile == null) return ''
    if (this.authorityToSignFile instanceof File) return this.authorityToSignFile.name

    return ''
  }

  get isComplete () {
    return this.isAllSignedDocument &&
      this.listInvoiceTracker &&
      this.isEverythingPaid
  }

  get isCharter () {
    return this.registrationDocument === 'Устава'
  }

  get isEverythingPaid () {
    return this.listInvoiceTracker && Object.keys(this.isSuccessListInvoice).length === this.listBills.length &&
      Object.values(this.isSuccessListInvoice).every(item => item)
  }

  // Vuex actions
  getContract!: () => Promise<ICustomerContract[]>
  getOrderContract!: ({ salesOrderId }: { salesOrderId: string }) => Promise<IOrderContract[]>

  // Methods
  onPaymentHandler (billingAccount: string) {
    this.isSuccessListInvoice[billingAccount] = true
    this.listInvoiceTracker++
  }

  async getData () {
    const salesOrderId = (this.$route.query.orderId || localStorage.getItem('ecommerce__order_id') || '').toString()
    if (!salesOrderId) {
      this.isError = true

      return
    }
    this.isLoading = true

    try {
      const getContractResult = await this.getContract()
      this.isActiveClient = getContractResult
        .some(item => ['Активный', 'Истёк', 'Расторгнут'].includes(item.contractStatus))

      const getOrderContractResult = await this.getOrderContract({ salesOrderId })

      // Получаем всех подписантов
      this.listContractSignee = Object.values(
        getOrderContractResult
          .map(item => item.contractSignee)
          .reduce((acc, item) => {
            acc[item.id] = item
            return acc
          }, {} as Record<string, IOrderContractContractSignee>)
      )
      // Получаем тип подписи (ручгая или ЭЦП). Берём по первому элементу
      this.signatureType = head(getOrderContractResult)!.signatureType

      this.registrationDocument = head(getOrderContractResult)!.contractSignee?.registrationDocument || ''

      this.listContractDocument = cloneDeep(getOrderContractResult.reduce((acc, item) => {
        acc[item.contractNumber] = cloneDeep({
          contractId: item.contractId,
          contractSignee: item.contractSignee,
          contractStatus: item.contractStatus,
          ...item.documents.contractDocument
        })
        return acc
      }, {} as Record<string, IOrderContractContractDocument & {
        contractId: string,
        contractSignee: IOrderContractContractSignee,
        contractStatus: string
      }>))

      this.listBills = getOrderContractResult.reduce((acc, item) => {
        if (item.documents.hasOwnProperty('bills')) {
          acc.push(...item.documents.bills.map(bill => ({
            contractNumber: item.contractNumber,
            contractType: item.contractType,
            ...bill
          })))
        }

        return acc
      }, [] as ({ contractNumber: string, contractType: string } & IOrderContractBill)[])

      if (this.isComplete) {
        window.parent.postMessage({ eventType: 'ertClientContracts', state: 'success' }, '*')
      }
    } catch (e) {
      logError(e)
      this.isError = true
    } finally {
      this.isLoading = false

      localStorage.removeItem('ecommerce__order_id')
      localStorage.removeItem('ecommerce__market_id')
    }
  }

  async mounted () {
    this.billingAccountId && this.getData()
  }
}
