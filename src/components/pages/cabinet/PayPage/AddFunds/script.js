import PayCard from '../components/PayCard/index.vue'
import PaymentsOn from '../components/PaymentsOn/index.vue'
import PaymentsOff from '../components/PaymentsOff/index.vue'
import { mapGetters, mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { PATTERN_EMAIL } from '@/constants/regexp'

export default {
  name: 'add-funds',
  components: {
    PayCard,
    PaymentsOn,
    PaymentsOff,
  },
  data: () => ({
    pre: 'add-funds',
    // visAutoPay: 0,
    empty: true,
    sumPay: '100',
    screenW: '320',
    bottom: 'bottom',
    valSelect: 'Январь',
    visFilter: '__vis-filter',
    widthContainer: '108% !important',
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
    autopayOn: 'При подключении автоплатежа вы соглашаетесь на автоматическое списание суммы равной ежемесячной абонентской плате. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).',
    textOnAutopay: '',
    visInfo: true,
    success: false,
    direct: 'row',
    selected: false,
    visButtConf: false,
    borderSum: '',
    borderCheck: '',
    selected2: '',
    visEmptySum: false,
    visEmptyEmail: false,
    valEmail: PATTERN_EMAIL,
    checkAutoPay: 'Подключить автоплатёж',
    emails: [
      'konstantinopolsky@company.ru',
      'konstantinopolsky1@company.ru',
      'konstant'
    ],
    currentEmail: 'konstantinopolsky@company.ru',
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] < 960 ? 'row' : 'column'
      this.visButtConf = this[SCREEN_WIDTH] < 1200
      if (this.selected) {
        this.textOnAutopay = this.autopayOff
      } else {
        this.textOnAutopay = this.autopayOn
      }
    }
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
    ...mapGetters({
      getCurrentNumCard: 'payments/getCurrentNumCard',
      cvc: 'payments/getCVC'
    }),
    ...mapState({
      activeBillingAccountId: state => state.user.activeBillingAccount,
      bindingId: state => state.payments.bindingId,
      visAutoPay: state => state.payments.visAutoPay
    }),
  },
  created ()  {
/*
    const payload = {
      billingAccount: this.activeBillingAccountId,
      card_img: this.card_img
    }
*/
    // const billingAccount = this.$store.getters('user/getActiveBillingAccount')
    // alert(activeBillingAccountId)
    // this.$store.dispatch('payments/listCard', { api: this.$api, billingAccount: billingAccount })

/*
    ...mapState({
        cards: state => state.payments.listCard,
    })
*/
    // ...mapState({
    //   activeBillingAccountId: state => state.user.activeBillingAccount,
    // })

  },
  mounted () {
    // alert(this.activeBillingAccountId)
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    },
/*
    empty () {
      console.log(1)
      return this.empty
    }
*/
  },
  methods: {
    selectEmail (item) {
      this.currentEmail = item
      if (this.currentEmail === '' || !this.currentEmail.match(this.valEmail)) {
        this.visEmptyEmail = true
        this.borderCheck = '__border'
      } else {
        this.visEmptyEmail = false
        this.borderCheck = ''
      }
    },

    autopay () {
      this.payAutoTextConfirm()
      /*
          // this.over = 'n'
     /*
           this.checkAutoPay = this.selected ? 'Подключить автоплатёж' : 'Автоплатёж'
           if (this.selected) {
             this.textOnAutopay = this.autopayOn
           } else {
             this.textOnAutopay = this.autopayOff
           }
     */
    },
    payAuto () {
/*
      // const activate = this.selected ? 1 : 0
      const payload = {
        billingAccount: this.activeBillingAccountId,
        bindingId: this.bindingId,
        activate: this.selected ? 1 : 0, //activate,
      }
      this.$store.dispatch('payments/autoPay', { api: this.$api, payload: payload })
*/
      if (this.selected) {
        this.buttLeft = 'Отключить'
        this.buttRight = 'Отменить'
        this.textOnAutopay = this.autopayOff
      } else {
        this.buttLeft = 'Отменить'
        this.buttRight = 'Подключить'
        this.textOnAutopay = this.autopayOn
      }
    },
    payAutoTextConfirm () {
      this.openConfirmAutoPay = true
      this.payAuto()
      this.visConfirmAutoPay = true
    },
    payAutoConfirm () {
      this.openConfirmAutoPay = true
      this.payAuto()
      this.visConfirmAutoPay = false
    },

    payAutoRequest (act) {
      // const activate = this.selected ? 1 : 0
      const payload = {
        billingAccount: this.activeBillingAccountId,
        bindingId: this.bindingId,
        activate: act //this.selected ? 1 : 0, //activate,
      }
      this.$store.dispatch('payments/autoPay', { api: this.$api, payload: payload })
    },

    autopayButtRight () {
      this.checkAutoPay = 'Автоплатёж'
      this.payAutoRequest (this.getCurrentNumCard)
      this.selected = true
      // this.visAutoPay = this.getCurrentNumCard
      this.openConfirmAutoPay = false
    },
    autopayButtLeft () {
      this.payAutoRequest (0)
      if (this.selected) {
        this.checkAutoPay = 'Подключить автоплатёж'
        this.selected = false
      }
      // this.visAutoPay = 0
      this.openConfirmAutoPay = false
    },

    paypage () {
      this.$router.push('/lk/payments')
    },
    typeFind (select) {
      if (select === 'По услуге') {
        this.valSelect = 'Январь'
      } else {
        this.valSelect = 'Адрес'
      }
    },
    topOperation (payload) {
      this.visFilter = payload ? '__vis-filter' : ''
    },
    clearEmpty () {
      this.empty = true
    },
    paymentConfirm () {
      if (this.sumPay === '') {
        this.visEmptySum = true
        this.borderSum = '__border'
      } else {
        this.visEmptySum = false
        this.borderSum = ''
      }
      if (this.currentEmail === '' || !this.currentEmail.match(this.valEmail)) {
        this.visEmptyEmail = true
        this.borderCheck = '__border'
      } else {
        this.visEmptyEmail = false
        this.borderCheck = ''
      }
      // alert(this.cvc)
      console.log('this.cvc ->',this.cvc)
      console.log(' ->',this.cvc[this.getCurrentNumCard],this.getCurrentNumCard)
      if (this.currentEmail !== '' &&
        this.sumPay !== '' &&
        this.currentEmail.match(this.valEmail)
      ) {
        if (this.getCurrentNumCard === 0){
          this.openConfirmPay = true
        } else {
          this.openConfirmPay = this.cvc[this.getCurrentNumCard - 1].length === 3
          this.empty = (this.cvc[this.getCurrentNumCard - 1].length === 3)
        }
      }
    },
    checkConfirm () {
      this.openConfirmCheck = true
    },
    openDelConfirm () {
      this.openConfirmDel = true
    },
    openRemcard () {
      this.openConfirmDataCard = true
    },
    closeConfirm () {
      this.openConfirmPay = false
      this.openConfirmDel = false
      this.openConfirmAutoPay = false
      this.openConfirmDataCard = false
      this.openConfirmCheck = false
    },
    delCard () {
      this.openConfirmDel = false
      this.$emit('update')
    },
    paymentsOn () {
      alert(this.getCurrentNumCard)
      if (this.getCurrentNumCard === 0) {
        var payload = {
          value: '10000',
          billingAccount: this.activeBillingAccountId,
          save: '1',
          email: 'konstantinopolsky@company.ru',
          returnUrl: location.href + '/payments-on'
        }
          // this.$store.dispatch('payments/payment', { api: this.$api, payload: payload })
      // }
      } else {
        var payload = {
          value: '10000',
          billingAccount: this.activeBillingAccountId,
          save: '1',
          email: 'konstantinopolsky@company.ru',
          returnUrl: location.href + '/payments-on'
        }
      }
      alert(2)
      console.log('!!!->', payload)
      this.$store.dispatch('payments/payment', { api: this.$api, payload: payload })
      // location.href = 'https://3dsec.sberbank.ru/payment/merchants/domru/payment_ru.html?mdOrder=bcf91834-67e4-7a82-ba85-85d300000590'
      // this.$store.dispatch('payments/payment', { api: this.$api, billingAccount: this.activeBillingAccountId })
      this.openConfirmPay = false
      this.visInfo = false
      this.success = true
      this.$router.push({ path: '/payments-on' })
    },
    paymentsOff () {
      this.openConfirmPay = false
      this.visInfo = false
      this.success = false
    },
    tryAgain () {
      this.visInfo = true
    },
    remcardButtLeft () {
      this.openConfirmDataCard = false
      this.$emit('update1')
    },
    remcardButtRight () {
      this.openConfirmDataCard = false
      this.$emit('update2')
    },
/*
    aa () {
      // this.empty = (this.cvc.length === 3)
      // alert(this.cvc[this.getCurrentNumCard])
      // console.log(this.cvc[this.getCurrentNumCard].length)
      console.log('activeBillingAccountId -> ', this.activeBillingAccountId)
      this.$store.dispatch('payments/listCard', { api: this.$api, billingAccount: this.activeBillingAccountId })
    }
*/
  }
}
