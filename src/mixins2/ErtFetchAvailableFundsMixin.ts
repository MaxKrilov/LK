import { Vue, Component } from 'vue-property-decorator'
import ErAvailableFundsModal from '@/components/blocks/ErAvailableFundsModal/index.vue'
import MESSAGES from '@/constants/messages'

class NotEnoughFundsException {
  // Исключение при недостатке денежных средств
  name = 'NoAvailableFundException'
  message = MESSAGES.NOT_ENOUGH_FUNDS
}

@Component({
  components: {
    ErAvailableFundsModal
  }
})
export class ErtFetchAvailableFundsMixin extends Vue {
  /*
    Миксин добавляет метод проверки доступных денежных средств checkFunds(необходимаяСумма)

    Работает совместно с компонентом ErAvailableFundsModal

    Как использовать:

    1) добавь миксин к компоненту твоей страницы
    export default class MyPage extends ErtFetchAvailableFundsMixin {}

    2) добавь компонент ErAvailableFundsModal в шаблон страницы
    При этом, параметры isFundsModalVisible и availableFunds берутся из миксина
    А в cost нужно подставить своё значение (например стоимость подключаемой услуги)

      er-available-funds-modal(
        v-model="isFundsModalVisible"
        :available="availableFunds"
        :cost="1337"
      )

     3) где-то в логике твоей страницы вызови метод
        this.checkFunds(необходимоеКоличествоСредств)
          .then(() => {
            // Логика подключение платной услуги
          })
          .catch(() => { // необязательная логика при нехватке денежных средств
          })

     4) метод сам получит доступные средства и выведет окно с сообщением,
     что нехватает денежных средств или вернёт true чтобы ты мог выполнить свою логику
  */
  private isFundsModalVisible: boolean = false
  availableFunds: number = 0

  fetchAvailableFunds (): Promise<number> {
    return this.$store.dispatch('salesOrder/getAvailableFunds')
      .then(({ availableFundsAmt }) => {
        return Number(availableFundsAmt)
      })
  }

  checkFunds (needFunds: number) {
    return this.fetchAvailableFunds()
      .then(availableFunds => {
        this.availableFunds = availableFunds
        if (availableFunds < needFunds) {
          // ДС нехватает, показываем модалку
          this.isFundsModalVisible = true
          throw new NotEnoughFundsException()
        } else {
          // всё ок
          return true
        }
      })
  }
}
