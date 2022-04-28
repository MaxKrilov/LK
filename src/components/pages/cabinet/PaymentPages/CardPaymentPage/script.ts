import Vue from 'vue'
import Component from 'vue-class-component'
import { TouchWrapper } from '@/types'

import Touch from '@/directives/touch'
import { OFFER_LINKS } from '@/constants/url'
import { mapActions, mapGetters, mapState } from 'vuex'
import { IClientInfo } from '@/tbapi/user'
import { ErtForm, ErtTextField } from '@/components/UI2'
import { flattenDeep, uniq } from 'lodash'
import { PATTERN_EMAIL } from '@/constants/regexp'
import { IBindCardPayment, INewCardPayment, IPaymentCard } from '@/tbapi/payments'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import ErtSwitch from '@/components/UI2/ErtSwitch'
import { typeClosedNotification } from '@/constants/closed_notification'

@Component<InstanceType<typeof ErtCardPaymentPage>>({
  components: {
    ErActivationModal
  },
  directives: {
    Touch
  },
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo
    }),
    ...mapGetters({
      activeBillingAccount: 'payments/getActiveBillingAccount',
      activeBillingAccountStatus: 'payments/getActiveBillingAccountStatus'
    })
  },
  watch: {
    computedListEmail (val) {
      this.lazyListEmail = val
    },
    email (val) {
      if (PATTERN_EMAIL.test(val)) {
        this.$nextTick(() => {
          this.lazyListEmail.push(val)
          this.email = val
        })
      } else {
        this.$nextTick(() => {
          this.email = null
        })
      }
    },
    activeBillingAccount (val) {
      val && this.getListPaymentCard()
        .then(response => {
          this.cardList = response
        })
    },
    cardList () {
      this.$nextTick(() => {
        this.onResizeHandler()
      })
    }
  },
  methods: {
    ...mapActions({
      getListPaymentCard: 'payments/getListPaymentCard',
      newCardPayment: 'payments/newCardPayment',
      bindCardPayment: 'payments/bindCardPayment',
      unbindCard: 'payments/unbindCard',
      activationDeactivationAutoPay: 'payments/activationDeactivationAutoPay',
      createClosedPayment: 'request2/createClosedRequest',
      createOpenedRequest: 'request2/createOpenedRequest'
    })
  }
})
export default class ErtCardPaymentPage extends Vue {
  /// Options
  $refs!: {
    'button-content': HTMLDivElement
    'button-slider': HTMLDivElement
    'amount-form': InstanceType<typeof ErtForm>
    'amount-to-pay': InstanceType<typeof ErtTextField>
    'autopay-switch': InstanceType<typeof ErtSwitch> | InstanceType<typeof ErtSwitch>[]
  }

  /// Vuex states
  readonly clientInfo!: IClientInfo

  /// Data
  isRememberNewCard: boolean = false
  isSliderLongerContent: boolean = false
  isEndScrollbar: boolean = false
  isStartScrollbar: boolean = true
  isShowDialogOfClosedBillingAccount: boolean = false

  isShowDialogConfirmNewCard: boolean = false
  isPaymentNewCardRequest: boolean = false

  isShowDialogConfirmBindCard: boolean = false
  isPaymentBindCardRequest: boolean = false

  isErrorOfPayment: boolean = false

  isShowDialogUnbindCard: boolean = false
  isDialogUnbindCardSuccess: boolean = false
  isDialogUnbindCardError: boolean = false
  isUnbindCardRequest: boolean = false

  isShowDialogSwitchAutoPay: boolean = false
  isShowDialogSwitchAutoPaySuccess: boolean = false
  isShowDialogSwitchAutoPayError: boolean = false
  isAutoPayRequest: boolean = false

  isCloseBillingAccount: boolean = false

  transformValue: number = 0

  amountToPay: string = ''
  amountPlaceholder: string = ''

  email: string | null = null
  searchEmail: string | null = null
  lazyListEmail: string[] = []

  offerLink: string = OFFER_LINKS.payment

  cardList: IPaymentCard[] = []
  activeCardNumber: number = 0
  unbindingCardNumber: number = 0
  autoPayCardNumber: number = 0

  cvc: string = ''

  /// Vuex getters
  readonly activeBillingAccount!: string
  readonly activeBillingAccountStatus!: { id: string, name: string }

  /// Computed
  get sliderStyle () {
    return {
      'transform': `translateX(${this.transformValue}px)`
    }
  }

  get validateRulesAmount () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => {
        const amount = Number(v.replace(',', '.').replace(/[\s]+/g, ''))
        return (amount >= 10 && amount <= 100000) ||
          `<span>Введенная сумма не соответствует&nbsp;</span>
            <a href="${OFFER_LINKS.payment}" target="_blank" rel="noopener">условиям оплаты и безопасности</a>`
      }
    ]
  }

  get validateRulesEmail () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => PATTERN_EMAIL.test(v) || 'Некоректный адрес эл. почты'
    ]
  }

  get computedListEmail (): string[] {
    return uniq(flattenDeep(this.clientInfo?.contacts.map(contact => {
      return contact.contactMethods
        .filter(contactMethod => contactMethod['@type'].toLowerCase() === 'email')
        .map(contactMethod => contactMethod.value)
    }) || []))
  }

  get isDisablePaymentButton () {
    return this.validateRulesAmount.some(rule => typeof rule(this.amountToPay) === 'string') ||
      this.validateRulesEmail.some(rule => typeof rule(this.email || '') === 'string')
  }

  get getPaymentCardSystemOfActiveCard () {
    return this.definePaymentCardSystem(this.getCardNumberOfActiveCard)?.toUpperCase() || ''
  }

  get getCardNumberOfActiveCard () {
    return this.cardList[this.activeCardNumber - 1]?.maskedPan || ''
  }

  get unbindingCard () {
    return this.cardList[this.unbindingCardNumber] || {}
  }

  get titleAutoPayDialog () {
    const card = this.cardList[this.autoPayCardNumber] || {}
    return `Вы уверены, что хотите ${card.autopay ? 'отключить' : 'подключить'} автоплатеж на карте
    ${this.definePaymentCardSystem(card.maskedPan).toUpperCase()} ${card.maskedPan}?
    `
  }

  /// Vuex actions
  readonly getListPaymentCard!: () => Promise<IPaymentCard[]>
  readonly newCardPayment!: (payload: { value: number, save: 0 | 1, email: string, returnUrl: string }) => Promise<INewCardPayment>
  readonly bindCardPayment!: (payload: {
    bindingId: string,
    value: number,
    email: string,
    cvv: string,
    returnUrl: string
  }) => Promise<IBindCardPayment>
  readonly unbindCard!: (payload: { bindingId: string }) => Promise<{ result: boolean }>
  readonly activationDeactivationAutoPay!: (payload: { bindingId: string, activate: 0 | 1 }) => Promise<{ result: number }>
  readonly createClosedPayment!: (type: typeClosedNotification) => Promise<string | false>
  readonly createOpenedRequest!: (type: typeClosedNotification) => Promise<string | false>

  /// Methods
  onResizeHandler () {
    this.isSliderLongerContent = this.$refs['button-content'].offsetWidth < this.$refs['button-slider'].scrollWidth
    this.transformValue = 0
  }

  onLeftHandler (e: TouchWrapper | number) {
    if (this.isEndScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.transformValue = this.$refs['button-slider'].scrollWidth > this.$refs['button-slider'].offsetWidth + Math.abs(this.transformValue) + Math.abs(offsetX)
      ? this.transformValue - Math.abs(offsetX)
      : -(this.$refs['button-slider'].scrollWidth - this.$refs['button-slider'].offsetWidth)
    this.isStartScrollbar = false
    this.isEndScrollbar = this.$refs['button-slider'].scrollWidth <=
      this.$refs['button-slider'].offsetWidth +
      Math.abs(this.transformValue)
  }

  onRightHandler (e: TouchWrapper | number) {
    if (this.isStartScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.transformValue = Math.abs(this.transformValue) < Math.abs(offsetX)
      ? 0
      : this.transformValue + Math.abs(offsetX)
    this.isEndScrollbar = false
    this.isStartScrollbar = this.transformValue === 0
  }

  onScrollEvent (e: WheelEvent) {
    e.preventDefault()

    if (e.deltaY < 0) {
      // Прокрутка вверх - листаем вправо
      this.onRightHandler(50)
    } else if (e.deltaY > 0) {
      this.onLeftHandler(50)
    }
  }

  onClickPaymentHandler () {
    if (this.activeBillingAccountStatus.name === 'Закрытый') {
      this.isCloseBillingAccount = true
      return
    }

    if (this.activeCardNumber === 0) {
      this.isShowDialogConfirmNewCard = true
    } else {
      this.isShowDialogConfirmBindCard = true
    }
  }

  async onPaymentNewCardHandler () {
    this.isPaymentNewCardRequest = true

    try {
      const value = Number(this.amountToPay.replace(',', '.').replace(' ', ''))
      const save = Number(this.isRememberNewCard) as 0 | 1
      const email = this.email!
      const returnUrl = `${location.origin}/lk/payments/result`

      localStorage.setItem('email', this.email!)

      const newCardPaymentResponse = await this.newCardPayment({ value, save, email, returnUrl })

      if ('pay_url' in newCardPaymentResponse) {
        location.href = newCardPaymentResponse.pay_url
      } else {
        // Выводим ошибку
      }
    } catch (ex) {
      console.error(ex)
      // Выводим ошибку
    } finally {
      this.isPaymentNewCardRequest = false
    }
  }

  async onPaymentBindCardHandler () {
    this.isPaymentBindCardRequest = true

    try {
      const activeCard = this.cardList[this.activeCardNumber - 1]!
      const bindingId = activeCard.bindingId
      const value = Number(this.amountToPay.replace(',', '.').replace(' ', ''))
      const email = this.email!
      const cvv = this.cvc
      const returnUrl = `${location.origin}/lk/payments/result`

      const bindCardPaymentResponse = await this.bindCardPayment({ bindingId, value, email, cvv, returnUrl })
      this.setPostRequest(bindCardPaymentResponse)
    } catch (ex) {
      console.error(ex)
      // Выводим ошибку
    } finally {
      this.isPaymentBindCardRequest = false
    }
  }

  setPostRequest (payload: IBindCardPayment) {
    localStorage.setItem('email', this.email!)
    if (!payload.acsUrl && payload.transactionId) {
      this.$router.push(`/lk/payments/result?transaction=${payload.transactionId}`)
      return
    }
    let form = document.createElement('form')
    form.setAttribute('action', payload.acsUrl)
    form.setAttribute('method', 'POST')
    form.style.display = 'none'
    // MD
    const mdInput = document.createElement('input')
    mdInput.setAttribute('type', 'hidden')
    mdInput.setAttribute('name', 'MD')
    mdInput.setAttribute('value', payload.MD)
    form.appendChild(mdInput)
    // PaReq
    const paReqInput = document.createElement('input')
    paReqInput.setAttribute('type', 'hidden')
    paReqInput.setAttribute('name', 'PaReq')
    paReqInput.setAttribute('value', payload.PaReq)
    form.appendChild(paReqInput)
    // TermUrl
    const termUrlInput = document.createElement('input')
    termUrlInput.setAttribute('type', 'hidden')
    termUrlInput.setAttribute('name', 'TermUrl')
    termUrlInput.setAttribute('value', payload.TermUrl)
    form.appendChild(termUrlInput)

    form = document.body.appendChild(form)
    form.submit()
  }

  definePaymentCardSystem (maskedPan: string) {
    if (!maskedPan) return ''
    const firstSymbol = maskedPan.slice(0, 1)
    const secondSymbol = maskedPan.slice(1, 2) || ''
    switch (firstSymbol) {
      case '2':
        return /^220[0-4]\s?\d\d/.test(maskedPan) ? 'mir' : ''
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

  removeCardHandler (unbindingCardNumber: number) {
    this.unbindingCardNumber = unbindingCardNumber
    this.isShowDialogUnbindCard = true
  }

  autoPayCardHandler (autoPayCardNumber: number) {
    if (this.activeBillingAccountStatus.name === 'Закрытый') {
      this.isCloseBillingAccount = true
      this.onCloseAutoPayDialogHandler()
      return
    }

    this.autoPayCardNumber = autoPayCardNumber
    this.isShowDialogSwitchAutoPay = true
  }

  onCloseAutoPayDialogHandler () {
    if (Array.isArray(this.$refs['autopay-switch'])) {
      this.$refs['autopay-switch'][this.autoPayCardNumber].lazyValue = !!this.cardList[this.autoPayCardNumber].autopay
    } else {
      this.$refs['autopay-switch'].lazyValue = !!this.cardList[this.autoPayCardNumber].autopay
    }
  }

  async onAutoPayHandler () {
    this.isAutoPayRequest = true

    try {
      const card = this.cardList[this.autoPayCardNumber]!
      const bindingId = card.bindingId
      const activate = card.autopay === 0 ? 1 : 0

      const activationDeactivationAutoPayResponse =
        await this.activationDeactivationAutoPay({ bindingId, activate })

      if ('result' in activationDeactivationAutoPayResponse) {
        if (activate) {
          this.cardList[this.autoPayCardNumber]!.autopay = 1
          this.cardList.forEach((cardItem, idx) => {
            if (idx !== this.autoPayCardNumber) {
              cardItem.autopay = 0
            }
          })
        } else {
          this.cardList[this.autoPayCardNumber]!.autopay = 0
        }

        this.$nextTick(() => {
          this.isShowDialogSwitchAutoPaySuccess = true
          this.createClosedPayment('CN_AUTO_PAY')
        })
      } else {
        this.isShowDialogSwitchAutoPayError = true
        this.onCloseAutoPayDialogHandler()
      }
    } catch (ex) {
      console.error(ex)
      this.isShowDialogSwitchAutoPayError = true
      this.onCloseAutoPayDialogHandler()
    } finally {
      this.isShowDialogSwitchAutoPay = false
      this.isAutoPayRequest = true
    }
  }

  async removeCardRequestHandler () {
    this.isUnbindCardRequest = true

    try {
      const unbindCardResponse = await this.unbindCard({ bindingId: this.unbindingCard.bindingId! })

      if (unbindCardResponse.result) {
        this.isDialogUnbindCardSuccess = true
        this.cardList = this.cardList.filter((_, idx) => idx !== this.unbindingCardNumber)
      } else {
        this.isDialogUnbindCardError = true
      }
    } catch (ex) {
      console.error(ex)
      this.isDialogUnbindCardError = true
    } finally {
      this.isUnbindCardRequest = false
      this.isShowDialogUnbindCard = false
    }
  }

  /// Hooks
  async mounted () {
    window.addEventListener('resize', this.onResizeHandler)

    this.$nextTick(() => {
      this.onResizeHandler()
    })

    setTimeout(() => {
      // Костыль, для корректной установки <label> и ширины <legend>
      // Убрать после разбора некорректной работы ErtTextField
      this.amountPlaceholder = ' '
    }, 200)

    try {
      if (this.activeBillingAccount) {
        this.cardList = await this.getListPaymentCard()
      }
    } catch (ex) {
      console.error(ex)
      this.cardList = []
    }
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeHandler)
  }
}
