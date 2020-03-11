import PayCard from '../components/PayCard/index.vue'
import PaymentsOn from '../components/PaymentsOn/index.vue'
import Confirm from '../components/Confirm/index.vue'
import Hint from '../components/Hint/index.vue'
import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { PATTERN_EMAIL } from '@/constants/regexp'

export default {
  name: 'add-funds',
  components: {
    PayCard,
    PaymentsOn,
    Confirm,
    Hint
  },
  data: () => ({
    pre: 'add-funds',
    nameCard: '',
    empty: true,
    sumPay: '4444,23',
    sumPayInteger: '',
    sumPayDecimal: '',
    openConfirmPay: false,
    openConfirmAutoPay: false,
    visConfirmAutoPay: false,
    openConfirmCheck: false,
    openConfirmDel: false,
    openConfirmDataCard: false,
    textRemcard: `Данные карты вы заполняете 
    на следующем шаге. 
    В целях вашей безопасности 
    мы не храним все данные карты.
    Данные карты хранит банк, 
    мы храним только ссылку на данные карты. 
    Если вы запомните карту, в следующий раз 
    можно будет ввести только CVC`,
    textCheck: `Мы обязаны отправить вам чек 
    об оплате услуг. Для получения чека 
    введите электронную почту.`,
    autopayOff: 'При отключении автоплатежа вам необходимо самостоятельно пополнять баланс на сумму равной ежемесячной абонентской плате до 1 числа отчетного месяца. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).',
    autopayOn: 'Автоплатеж может быть активирован только на одной карте. Если вы активируете на этой карте он будет снят с другой. При подключении автоплатежа вы соглашаетесь на автоматическое списание суммы равной ежемесячной абонентской плате. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).',
    textAutopay: '',
    direct: 'row',
    borderSum: '',
    borderCheck: '',
    isEmptySum: false,
    isEmptyEmail: false,
    valEmail: PATTERN_EMAIL,
    checkAutoPay: 'Подключить автоплатёж',
    selEmail: '',
    emails: [],
    currentEmail: 'epic@mail.com'
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccount,
      bindingId: state => state.payments.bindingId,
      visAutoPay: state => state.payments.visAutoPay,
      listCard: state => state.payments.listCard,
      errDelCard: state => state.payments.errDelCard,
      errDelAutoPay: state => state.payments.errAutoPay,
      selSave: state => state.payments.save,
      cvc: state => state.payments.cvc,
      numCard: state => state.payments.numCard,
      clientInfo: state => state.user.clientInfo
    })
  },
  mounted () {
    this.changeWidth()
    this.listEmail()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
    visAutoPay () {
      if (this.visAutoPay) {
        this.openConfirmAutoPay = this.errDelAutoPay
        this.visConfirmAutoPay = this.errDelAutoPay
        if (!this.errDelAutoPay && this.visAutoPay === 0) {
          this.checkAutoPay = 'Подключить автоплатёж'
          this.visAutoPay = false
        }
      } else {
        this.openConfirmAutoPay = this.errDelAutoPay
        this.visConfirmAutoPay = this.errDelAutoPay
        if (!this.errDelAutoPay && this.visAutoPay !== 0) {
          this.checkAutoPay = 'Автоплатёж'
          this.visAutoPay = true
        }
      }
    },
    clientInfo () {
      this.listEmail()
    }
  },
  methods: {
    listEmail () {
      let emailList = this.clientInfo?.contactMethods?.filter(
        _item => _item['@type'].match(/email/ig)
      )
      if (emailList) {
        this.emails = emailList.map(
          item => item.name.split(', ')[0]
        ) || []
      }
    },
    changeWidth () {
      // todo-er перенести в css
      this.direct = this[SCREEN_WIDTH] < 960 ? 'row' : 'column'

      if (this.visAutoPay) {
        this.textAutopay = this.autopayOff
      } else {
        this.textAutopay = this.autopayOn
      }
    },
    selectEmail (item) {
      this.currentEmail = item
      if (this.currentEmail === '' || !this.currentEmail.match(this.valEmail)) {
        this.isEmptyEmail = true
        this.borderCheck = '__border'
      } else {
        this.isEmptyEmail = false
        this.borderCheck = ''
      }
    },
    autoPay () {
      this.payAutoTextConfirm()
    },
    payAuto () {
      if (this.visAutoPay) {
        this.buttLeft = 'Отключить'
        this.buttRight = 'Отменить'
        this.textAutopay = this.autopayOff
      } else {
        this.buttLeft = 'Отменить'
        this.buttRight = 'Подключить'
        this.textAutopay = this.autopayOn
      }
      this.nameCards()
    },
    payAutoTextConfirm () {
      this.openConfirmAutoPay = true
      this.payAuto()
    },
    payAutoConfirm () {
      this.payAuto()
      this.visConfirmAutoPay = true
    },
    payAutoRequest (act) {
      const payload = {
        billingAccount: this.activeBillingAccountId,
        bindingId: this.listCard[this.numCard - 1].bindingId,
        activate: act,
        load: 0
      }
      this.$store.dispatch('payments/autoPay', { api: this.$api, payload: payload })
    },
    autopayButtRight () {
      this.payAutoRequest(1)
    },
    autopayButtLeft () {
      this.payAutoRequest(0)
    },
    payAutoTextConfHint () {
      this.closeConfirm()
      this.payAutoTextConfirm()
    },
    paypage () {
      this.$router.push('/lk/payments')
    },
    clearEmpty () {
      this.empty = true
    },
    paymentConfirm () {
      if (this.sumPay === '') {
        this.isEmptySum = true
        this.borderSum = '__border'
      } else {
        this.isEmptySum = false
        this.borderSum = ''
        this.sumPayInteger = this.sumPay.substr(0, this.sumPay.indexOf(','))
        this.sumPayDecimal = this.sumPay.slice(-2)
      }
      if (this.currentEmail === '' || !this.currentEmail.match(this.valEmail)) {
        this.isEmptyEmail = true
        this.borderCheck = '__border'
      } else {
        this.isEmptyEmail = false
        this.borderCheck = ''
      }
      if (this.currentEmail !== '' &&
        this.sumPay !== '' &&
        this.currentEmail.match(this.valEmail)
      ) {
        if (this.numCard === 0) {
          this.openConfirmPay = true
        } else {
          this.openConfirmPay = this.cvc[this.numCard - 1].length === 3
          this.empty = (this.cvc[this.numCard - 1].length === 3)
        }
      }
      this.nameCards()
    },
    nameCards () {
      if (this.numCard > 0) {
        const num = this.listCard[this.numCard - 1].maskedPan
        const name = this.listCard[this.numCard - 1].nameRU
        const num1 = num.slice(0, 4)
        const num2 = num.slice(4, 6)
        const num3 = num.slice(8, 12)
        this.nameCard = `${name}, ${num1} ${num2} ** **** ${num3}`
      }
    },
    checkConfirm () {
      this.openConfirmCheck = true
    },
    openRemcard () {
      this.openConfirmDataCard = true
    },
    closeConfirm () {
      this.openConfirmPay = false
      this.openConfirmDel = false
      this.openConfirmAutoPay = false
      this.openConfirmDataCard = false
      this.visConfirmAutoPay = false
      this.openConfirmCheck = false
    },
    openDelConfirm () {
      this.openConfirmDel = true
      this.nameCards()
    },
    delCard () {
      this.$emit('updateCardDel')
      if (!this.errDelCard) {
        this.openConfirmDel = false
      }
    },
    paymentsOn () {
      let sumPay = this.sumPay.replace(/\s/g, '')
      sumPay = sumPay.replace(',', '.')
      let selSave = Number(this.selSave)
      let payload
      if (this.numCard === 0) {
        payload = {
          value: sumPay,
          billingAccount: this.activeBillingAccountId,
          save: selSave,
          email: this.currentEmail,
          returnUrl: location.href + '/payments-on'
        }
        this.$store.dispatch('payments/payment', { api: this.$api, payload: payload })
      } else {
        const cvv = this.numCard === 0 ? this.cvc[0] : this.cvc[this.numCard - 1]
        payload = {
          billingAccount: this.activeBillingAccountId,
          bindingId: this.listCard[this.numCard - 1].bindingId,
          value: sumPay,
          email: this.currentEmail,
          cvv: cvv,
          returnUrl: location.href + '/payments-on'
        }
        this.$store.dispatch('payments/bindpay', { api: this.$api, payload: payload })
      }
      this.openConfirmPay = false
    },
    paymentsOff () {
      this.openConfirmPay = false
    },
    remcardButtLeft () {
      this.openConfirmDataCard = false
      this.$emit('updateButtLeft')
    },
    remcardButtRight () {
      this.openConfirmDataCard = false
      this.$emit('updateButtRight')
    }
  }
}
