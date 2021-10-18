import Vue from 'vue'
import Component from 'vue-class-component'
import { ErtForm, ErtTextField } from '@/components/UI2'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { IClientInfo } from '@/tbapi/user'

import { uniq, flattenDeep } from 'lodash'
import Inputmask from 'inputmask'
import { OFFER_LINKS } from '@/constants/url'
import { PATTERN_EMAIL } from '@/constants/regexp'

import PaymentCardComponent from './components/PaymentCardComponent/index.vue'

import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { IPaymentCard, INewCardPayment, IBindCardPayment } from '@/tbapi/payments'

import { roundUp, isFramed } from '@/functions/helper'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
import { BroadcastChannel as BroadcastChannelPolyfill } from 'broadcast-channel'
import { logInfo } from '@/functions/logging'

@Component<InstanceType<typeof CardPaymentPage>>({
  components: {
    PaymentCardComponent
  },
  computed: {
    ...mapState({
      clientInfo: (state: any) => state.user.clientInfo,
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH],
      cvv: (state: any) => state.payments.cvv
    }),
    ...mapGetters({
      activeBillingAccount: 'payments/getActiveBillingAccount',
      activeBillingAccountNumber: 'payments/getActiveBillingAccountNumber'
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
      if (this.swiperSlider != null) {
        this.swiperSlider.destroy()
      }
      this.$nextTick(() => {
        this.defineCardSlider()
      })
    }
  },
  methods: {
    ...mapActions({
      getListPaymentCard: 'payments/getListPaymentCard',
      newCardPayment: 'payments/newCardPayment',
      bindCardPayment: 'payments/bindCardPayment'
    }),
    ...mapMutations({
      setCVV: 'payments/setCVV',
      setValidCVV: 'payments/setValidCVV'
    })
  }
})
export default class CardPaymentPage extends Vue {
  // Options
  $refs!: Vue & {
    'amount-form': InstanceType<typeof ErtForm>,
    'amount-to-pay': InstanceType<typeof ErtTextField>
  }

  /// Vuex states
  readonly clientInfo!: IClientInfo
  readonly screenWidth!: number
  readonly cvv!: string

  // Vuex getters
  readonly activeBillingAccount!: string
  readonly activeBillingAccountNumber!: string

  // Vuex mutations
  readonly setCVV!: (cvv: string) => void
  readonly setValidCVV!: (isValid: boolean) => void

  // Vuex actions
  readonly getListPaymentCard!: () => Promise<IPaymentCard[]>
  readonly newCardPayment!: ({
    value,
    save,
    email,
    returnUrl
  }: {
    value: number
    save: 0 | 1
    email: string
    returnUrl: string
  }) => Promise<INewCardPayment>
  readonly bindCardPayment!: ({
    bindingId,
    value,
    email,
    cvv,
    returnUrl
  }: {
    bindingId: string,
    value: number,
    email: string,
    cvv: string,
    returnUrl: string
  }) => Promise<IBindCardPayment>

  // Data
  amountToPay: string = ''
  lazyListEmail: string[] = []
  email: string | null = null
  searchEmail: string | null = null
  amountPlaceholder: string = ''
  offerLink: string = OFFER_LINKS.payment
  swiperSlider: Swiper | null = null

  cardList: IPaymentCard[] = []

  activeCardIndex: number = 0
  isRememberCard: boolean = false

  isShowConfirmDialogNewCard: boolean = false
  isShowConfirmDialogBindCard: boolean = false

  isPayment: boolean = false

  errorText: string = ''

  isHideButton: boolean = false

  isPaymentRequest: boolean = false

  // Страница была открыта во фрейме
  isPopup: boolean = false

  // Computed
  /**
   * Список адресов эл. почты (для отправки чека)
   * @return {Array<string>}
   */
  get computedListEmail (): string[] {
    return uniq(flattenDeep(this.clientInfo?.contacts.map(contact => {
      return contact.contactMethods
        .filter(contactMethod => contactMethod['@type'].toLowerCase() === 'email')
        .map(contactMethod => contactMethod.value)
    }) || []))
  }

  /**
   * Правила валидации для суммы оплаты
   */
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

  /**
   * Правила валидации для адреса эл. почты
   */
  get validateRulesEmail () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => PATTERN_EMAIL.test(v) || 'Некоректный адрес эл. почты'
    ]
  }

  get amountHTML () {
    const [rouble, penny] = this.amountToPay.split(',')
    return `
      <span class="rouble">${rouble.trim()}</span>
      <span class="penny">,${penny}₽</span>`
  }

  get cardNumber () {
    return this.activeCardIndex === 0
      ? ''
      : this.cardList[this.activeCardIndex - 1].maskedPan
  }

  get isFramed () {
    return isFramed()
  }

  // Methods
  /**
   * Задаёт маску для поля ввода суммы оплаты
   */
  defineAmountMask () {
    if (!this.$refs['amount-to-pay']) return

    const im = new Inputmask(
      'currency',
      {
        groupSeparator: ' ',
        radixPoint: ',',
        digits: 2,
        prefix: '',
        suffix: '',
        rightAlign: false,
        jitMasking: false
      }
    )

    im.mask(this.$refs['amount-to-pay'].$refs.input)
  }

  defineCardSlider () {
    this.swiperSlider = new Swiper('.swiper-container', {
      direction: this.screenWidth >= BREAKPOINT_MD ? 'vertical' : 'horizontal',
      slidesPerView: 'auto',
      centeredSlides: true,
      autoHeight: true,
      spaceBetween: 24,
      on: {
        activeIndexChange: (_swiper) => {
          this.activeCardIndex = _swiper.activeIndex
        }
      }
    })
  }

  defineAmountPay () {
    const amountPay = this.$route.query.total_amount || this.$route.params.total_amount ||
      localStorage.getItem('ff_total_amount') || localStorage.getItem('ecommerce-popup__amount')

    if (amountPay) {
      this.amountToPay = String(
        Number(roundUp(amountPay, 2)).toFixed(2).replace('.', ',')
      )
      localStorage.removeItem('ff_total_amount')
      localStorage.removeItem('ecommerce-popup__amount')
    }
  }

  onPaymentNewCard () {
    const value = Number(this.amountToPay.replace(',', '.').replace(' ', ''))
    const save = Number(this.isRememberCard) as 0 | 1
    const email = this.email!
    const returnUrl = `${location.origin}/ecommerce/payment-result`

    localStorage.setItem('email', this.email!)

    this.isPayment = true

    window.parent.postMessage({ eventType: 'ertPayments', state: 'inProgress' }, '*')

    this.newCardPayment({ value, save, email, returnUrl })
      .then(response => {
        location.href = response.pay_url
      })
      .catch((error) => {
        console.error(error)
        this.errorText = 'Произошла ошибка! Повторите попытку позже'
        localStorage.removeItem('email')
        window.parent.postMessage({ eventType: 'ertPayments', state: 'error' }, '*')
      })
      .finally(() => {
        this.isPayment = false
      })
  }

  onPaymentBindCard () {
    const activeCard = this.cardList[this.activeCardIndex - 1]!
    const bindingId = String(activeCard.bindingId)
    const value = Number(this.amountToPay.replace(',', '.').replace(' ', ''))
    const email = this.email!
    const cvv = this.cvv
    const returnUrl = `${location.origin}/ecommerce/payment-result`

    this.isPayment = true

    window.parent.postMessage({ eventType: 'ertPayments', state: 'inProgress' }, '*')

    this.bindCardPayment({ bindingId, value, email, cvv, returnUrl })
      .then(response => {
        this.setPostRequest(response)
      })
      .catch((error) => {
        console.error(error)
        this.errorText = 'Произошла ошибка! Повторите попытку позже'
        window.parent.postMessage({ eventType: 'ertPayments', state: 'error' }, '*')
      })
      .finally(() => {
        this.isPayment = false
      })
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

  onPayment () {
    if (this.activeCardIndex === 0 && this.$refs['amount-form'].validate()) {
      this.isShowConfirmDialogNewCard = true
    } else {
      if (
        !this.$refs['amount-form'].validate() ||
        !this.cvv ||
        this.cvv.length !== 3
      ) {
        (!this.cvv || this.cvv.length !== 3) && this.setValidCVV(false)
        return
      }
      this.isShowConfirmDialogBindCard = true
    }
  }

  onChangeAutoPay (bindingId: string) {
    this.cardList.forEach(card => {
      card.autopay = card.bindingId === bindingId ? 1 : 0
    })
  }

  onRemoveCard (index: number) {
    setTimeout(() => {
      if (this.swiperSlider) {
        this.swiperSlider.slidePrev()
        this.swiperSlider.removeSlide(index)
      }
      this.$nextTick(() => {
        this.cardList = this.cardList.filter((_, _index) => index !== _index)
      })
    }, 5000)
  }

  // Hooks
  mounted () {
    if (isFramed() && !!location.href.match(/ecommerce/g)) {
      this.isPopup = true

      // Страница была открыта в Popup'e - открываем новое окно
      /// Получаем активный биллинг-аккаунт
      const activeBillingAccountNumber = this.activeBillingAccountNumber
      /// Получаем сумму к оплате
      const paymentAmount = this.$route.query.total_amount ||
        this.$route.params.total_amount ||
        localStorage.getItem('ff_total_amount')
      window.open(`${location.origin}/ecommerce/payment?total_amount=${paymentAmount}&billing_account=${activeBillingAccountNumber}`)

      localStorage.setItem('ecommerce-popup__billing-account-number', activeBillingAccountNumber)
      localStorage.setItem('ecommerce-popup__amount', String(paymentAmount))

      localStorage.removeItem('ff_total_amount')

      const broadcastChannel = window.BroadcastChannel
        ? new BroadcastChannel('erth-payment')
        : new BroadcastChannelPolyfill('erth-payment') as unknown as BroadcastChannel

      broadcastChannel.addEventListener('message', (e) => {
        if (e.data.eventType === 'ertPayments' && e.data.state === 'success') {
          logInfo('Success')
          window.parent.postMessage({ eventType: 'ertPayments', state: 'success', billingAccount: activeBillingAccountNumber }, '*')
        }
      })

      return
    }
    this.$nextTick(() => {
      this.defineAmountMask()
      this.defineCardSlider()
      this.defineAmountPay()

      this.lazyListEmail = this.computedListEmail

      this.activeBillingAccount && this.getListPaymentCard()
        .then(response => {
          this.cardList = response
        })

      this.$nextTick(() => {
        // "Костыль" по причине того, что из "коробки" не работает
        const swiperContainer = this.$el.querySelector('.swiper-container')
        let progress = false
        if (swiperContainer != null && this.screenWidth >= BREAKPOINT_MD) {
          swiperContainer.addEventListener('wheel', (e: Event) => {
            e.preventDefault()
            if (progress) return
            progress = true
            setTimeout(() => {
              if ((e as WheelEvent).deltaY > 0) {
                this.swiperSlider?.slideNext()
              } else if ((e as WheelEvent).deltaY <= 0) {
                this.swiperSlider?.slidePrev()
              }
              progress = false
            }, 200)
          })
        }
      })

      this.isHideButton = !!this.$route.query.is_hide_button || !!localStorage.getItem('ecommerce__is_hidden_button')
      this.$nextTick(() => {
        localStorage.removeItem('ecommerce__is_hidden_button')
      })
    })
    setTimeout(() => {
      // Костыль, для корректной установки <label> и ширины <legend>
      // Убрать после разбора некорректной работы ErtTextField
      this.amountPlaceholder = ' '
    }, 200)
    window.addEventListener('message', (e) => {
      if (e.data.eventType === 'e-commerce-payment' && e.data.action === 'payment') {
        this.onPayment()
      }
    })
  }
}
