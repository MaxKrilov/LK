import PayCard from '../components/PayCard/index.vue'
import PaymentsOn from '../components/PaymentsOn/index.vue'
import PaymentsOff from '../components/PaymentsOff/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'add-funds',
  components: {
    PayCard,
    PaymentsOn,
    PaymentsOff
  },
  data: () => ({
    pre: 'add-funds',
    sumPay: '100500,00',
    screenW: '320',
    bottom: 'bottom',
    valSelect: 'Январь',
    visFilter: '__vis-filter',
    widthContainer: '108% !important',
    openConfirmPay: false,
    openConfirmAutoPay: false,
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
    textOnAutopay: '',
    visInfo: true,
    success: false,
    direct: 'row',
    selected: false,
    visButtConf: false,
    checkAutoPay: 'Подключить автоплатёж',
    ss: 'konstantinopolsky@company.ru',
    changeWidth () {
      this.direct = this[SCREEN_WIDTH] < 960 ? 'row' : 'column'
      this.visButtConf = this[SCREEN_WIDTH] < 1200
      if (this.selected) {
        this.textOnAutopay = 'При отключении автоплатежа вам необходимо самостоятельно пополнять баланс на сумму равной ежемесячной абонентской плате до 1 числа отчетного месяца. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      } else {
        this.textOnAutopay = 'При подключении автоплатежа вы соглашаетесь на автоматическое списание суммы равной ежемесячной абонентской плате. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      }
    }
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH])
  },
  mounted () {
    this.changeWidth()
  },
  watch: {
    SCREEN_WIDTH () {
      this.changeWidth()
    }
  },
  methods: {
    autopay () {
      this.checkAutoPay = this.selected ? 'Подключить автоплатёж' : 'Автоплатёж'
      if (this.selected) {
        this.textOnAutopay = 'При подключении автоплатежа вы соглашаетесь на автоматическое списание суммы равной ежемесячной абонентской плате. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      } else {
        this.textOnAutopay = 'При отключении автоплатежа вам необходимо самостоятельно пополнять баланс на сумму равной ежемесячной абонентской плате до 1 числа отчетного месяца. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      }
    },
    autopayButtRight () {
      this.checkAutoPay = 'Автоплатёж'
      this.selected = true
      this.openConfirmAutoPay = false
    },
    autopayButtLeft () {
      if (this.selected) {
        this.checkAutoPay = 'Подключить автоплатёж'
        this.selected = false
      }
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
    payAutoConfirm () {
      if (this.selected) {
        this.buttLeft = 'Отключить'
        this.buttRight = 'Не отключать'
        this.textOnAutopay = 'При отключении автоплатежа вам необходимо самостоятельно пополнять баланс на сумму равной ежемесячной абонентской плате до 1 числа отчетного месяца. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      } else {
        this.buttLeft = 'Нет, спасибо'
        this.buttRight = 'Подключить'
        this.textOnAutopay = 'При подключении автоплатежа вы соглашаетесь на автоматическое списание суммы равной ежемесячной абонентской плате. Денежные средства будут списаны с 20 по последнее число месяца, предшествующего отчетному (например авансовый платеж за апрель будет списан с 20 по 31 марта).'
      }
      this.openConfirmAutoPay = true
    },
    paymentConfirm () {
      this.openConfirmPay = true
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
      this.openConfirmPay = false
      this.visInfo = false
      this.success = true
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
    }
  }
}
