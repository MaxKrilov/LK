import Vue from 'vue'
import Component from 'vue-class-component'

import { mapActions, mapGetters } from 'vuex'
import { ErtTextField, ErtCheckbox } from '@/components/UI2'
import { IPaymentCard } from '@/tbapi/payments'

import Inputmask from 'inputmask'

const rememberCardHTML = `
<div class="payment-card-component__hint-title">Данные карты</div>
<div class="payment-card-component__hint-description">
  Данные карты вы заполняете на следующем шаге. В целях вашей безопасности мы не храним все данные карты.
  Данные карты хранит банк, мы храним только ссылку на данные карты.
  Если вы запомните карту, в следующий раз можно будет ввести только CVC
</div>
`

const autoPayHTML = `
<div class="payment-card-component__hint-title mb-0">Автоплатёж</div>
<div class="payment-card-component__hint-description">
  <div class="mb-16">— это бесплатный сервис.</div>
  <div>
    При отключении автоплатежа вам необходимо самостоятельно пополнять баланс на сумму равной ежемесячной
    абонентской плате до 1 числа отчетного месяца. Денежные средства будут списаны с 20 по последнее число месяца,
    предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).
  </div>
</div>
`

@Component<InstanceType<typeof PaymentCardComponent>>({
  props: {
    isNew: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    isRememberNewCard (val) {
      this.$emit('change:remember-card', val)
    }
  },
  computed: {
    ...mapGetters({
      activeBillingAccountStatus: 'payments/getActiveBillingAccountStatus'
    })
  },
  methods: {
    ...mapActions({
      activationDeactivationAutoPay: 'payments/activationDeactivationAutoPay',
      unbindCard: 'payments/unbindCard'
    })
  }
})
export default class PaymentCardComponent extends Vue {
  // Options
  $refs!: {
    cvc: InstanceType<typeof ErtTextField>,
    'autopay-checkbox': InstanceType<typeof ErtCheckbox>
  }

  // Vuex actions
  readonly activationDeactivationAutoPay!: ({ bindingId, activate }: { bindingId: string, activate: 0 | 1 }) => Promise<{ result: number }>
  readonly unbindCard!: ({ bindingId }: { bindingId: string }) => Promise<{ result: boolean }>

  // Vuex getters
  readonly activeBillingAccountStatus!: { id: string, name: string }

  // Props
  isNew!: boolean
  readonly card!: IPaymentCard

  // Data
  isRememberNewCard: boolean = false

  rememberCardHTML = rememberCardHTML
  autoPayHTML = autoPayHTML

  internalIsAutoPay: boolean = false
  isChangedAutoPay: boolean = false
  isShowDialogAutoPay: boolean = false
  isChangingAutoPay: boolean = false

  isShowDialogRemoveCard: boolean = false
  isRemovingCard: boolean = false
  isRemovedCard: boolean = false

  isShowErrorDialogOnAutoPay: boolean = false

  errorText: string = ''

  // Computed
  get getLastDigitsCardNumber () {
    return this.card?.maskedPan?.slice(-4) || ''
  }

  get getFirstDigitsCardNumber () {
    return this.card?.maskedPan?.slice(0, 4) || ''
  }

  get getSecondDigitsCardNumber () {
    return this.card?.maskedPan?.slice(4, 6)
  }

  get isValidCVV () {
    return this.$store.state.payments.isValidCVV
  }

  get isAutoPay () {
    return this.isChangedAutoPay
      ? this.internalIsAutoPay
      : Boolean(this.card?.autopay)
  }

  get definePaymentSystem () {
    if (!this.card.maskedPan) return ''
    const firstSymbol = this.card.maskedPan.slice(0, 1)
    const secondSymbol = this.card.maskedPan.slice(1, 2) || ''
    switch (firstSymbol) {
      case '2':
        return /^220[0-4]\s?\d\d/.test(this.card.maskedPan) ? 'mir' : ''
      case '3':
        return secondSymbol === '7'
          ? 'americanexpress'
          : secondSymbol === '5'
            ? 'jcb'
            : 'dinnersclub'
      case '4':
        return 'visa'
      case '5':
        return secondSymbol === '0' || Number(secondSymbol) > 5
          ? 'maestro'
          : 'mastercard'
      case '6':
        return 'maestro'
      default:
        return ''
    }
  }

  // Proxy
  get cvv () {
    return this.$store.state.payments.cvv
  }
  set cvv (val: string) {
    this.$store.commit('payments/setCVV', val)
  }

  // Methods
  onChangeAutoPay () {
    if (this.activeBillingAccountStatus.name === 'Закрытый') {
      this.$refs['autopay-checkbox'].lazyValue = this.isAutoPay
      this.isShowErrorDialogOnAutoPay = true
    } else {
      this.isShowDialogAutoPay = true
    }
  }

  onCancelAutoPay () {
    this.isShowDialogAutoPay = false
    this.errorText = ''
    this.$refs['autopay-checkbox'].lazyValue = this.isAutoPay
  }

  changeAutoPay () {
    this.isChangingAutoPay = true
    this.activationDeactivationAutoPay({
      bindingId: this.card?.bindingId,
      activate: Number(!this.isAutoPay) as 0 | 1
    })
      .then(response => {
        if (
          (response.result === 0 && Number(!this.isAutoPay) === 0) ||
          (response.result === 1 && Number(!this.isAutoPay) === 1)
        ) {
          this.internalIsAutoPay = !this.isAutoPay
          this.isChangedAutoPay = true
          this.isShowDialogAutoPay = false
          this.$nextTick(() => {
            this.internalIsAutoPay && this.$emit('change:autopay', this.card?.bindingId)
          })
        } else {
          this.errorText = 'Произошла ошибка! Повторите попытку позже'
        }
      })
      .catch((error) => {
        console.error(error)
        this.errorText = 'Произошла ошибка! Повторите попытку позже'
      })
      .finally(() => {
        this.isChangingAutoPay = false
      })
  }

  onUnbindCard () {
    this.isRemovingCard = true
    this.unbindCard({ bindingId: this.card?.bindingId })
      .then(response => {
        if (response.result) {
          this.isRemovedCard = true
          this.isShowDialogRemoveCard = false
          this.$emit('change:remove')
        } else {
          this.errorText = 'Произошла ошибка! Повторите попытку позже'
        }
      })
      .catch((error) => {
        console.error(error)
        this.errorText = 'Произошла ошибка! Повторите попытку позже'
      })
      .finally(() => {
        this.isRemovingCard = false
      })
  }

  mounted () {
    if (this.$refs.cvc) {
      const inputMask = new Inputmask('999', { jitMasking: true })
      inputMask.mask(this.$refs['cvc'].$refs.input)
    }
  }
}
