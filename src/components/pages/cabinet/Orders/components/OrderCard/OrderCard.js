import { mapState, mapGetters } from 'vuex'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { CREATE_TASK } from '@/store/actions/orders'
import ErActivationModal from '@/components/blocks/ErActivationModal/index'
import { Skeleton } from 'vue-loading-skeleton'
import { IN_PROGRESS, CANCELLED, ACCEPTED, WAIT, COMPLITED } from '@/constants/orders'

export default {
  name: 'order-card',
  components: {
    ErActivationModal,
    Skeleton
  },
  props: {
    card: {
      default: () => {
        return {
          status: '',
          orderItems: ['']
        }
      }
    }
  },
  data () {
    return {
      pre: 'order-card',
      resultDialogError: false,
      resultDialogSuccess: false,
      isShowModal: false,
      isShowHistoryModal: false,
      isShowOrder: false,
      isMobileShow: false,
      isDesktopShow: true
    }
  },
  computed: {
    ...mapState({
      screenWidth: (state) => state.variables[SCREEN_WIDTH]
    }),
    ...mapGetters('user', ['getClientInfo']),
    ...mapGetters({
      loadingOrders: 'loading/loadingOrders',
      getActiveBillingAccountNumber: 'payments/getActiveBillingAccountNumber'
    }),
    status () {
      if (!this.card || !this.card?.status) {
        return {
          name: IN_PROGRESS,
          type: this.card.status,
          style: 'processing',
          description: ''
        }
      }
      switch (this.card.status) {
        case 'Ввод данных':
          return {
            name: ACCEPTED,
            description: 'Ваш заказ принят! Для Вас готовится персональное предложение',
            style: 'processing',
            type: this.card.status
          }
        case 'Согласование с Клиентом':
          return {
            name: WAIT,
            type: this.card.status,
            style: 'wait',
            description: 'Коммерческое предложение готово. Ожидем вашего решения'
          }
        case 'Согласовано с Клиентом':
          return {
            style: 'wait',
            type: this.card.status,
            name: WAIT,
            description: 'Договор/доп.соглашение и счет готов. Ожидаем подписания и оплаты'
          }
        case 'Договор подписан':
          return {
            type: this.card.status,
            name: WAIT,
            style: 'wait',
            description: 'Договор/доп.соглашение и счет готов. Ожидаем подписания и оплаты'
          }
        case 'В исполнении':
          return {
            name: IN_PROGRESS,
            type: this.card.status,
            style: 'processing',
            description: 'Ваш заказ принят в работу'
          }
        case 'В процессе согласования':
          return {
            name: IN_PROGRESS,
            type: this.card.status,
            style: 'processing',
            description: 'Ваш заказ принят в работу'
          }
        case 'Точка невозврата пройдена':
          return {
            name: IN_PROGRESS,
            type: this.card.status,
            style: 'processing',
            description: 'Ваш заказ принят в работу'
          }
        case 'Отменено':
        case 'Заменено':
          return {
            name: CANCELLED,
            type: this.card.status,
            style: 'cancelled',
            description: 'Заказ отменен. Если у вас возникнут дополнительные вопросы, напишите Онлайн – консультанту.'
          }
        case 'Завершен':
          return {
            name: COMPLITED,
            type: this.card.status,
            style: 'complete',
            description: 'Заказ выполнен! Если у вас возникнут дополнительные вопросы, напишите Онлайн – консультанту.'
          }
        case 'Ошибка':
          return {
            name: IN_PROGRESS,
            type: this.card.status,
            style: 'processing',
            description: 'При выполнении заказа произошла ошибка'
          }
        default:
          return {
            name: IN_PROGRESS,
            type: this.card.status,
            style: 'processing',
            description: ''
          }
      }
    },
    price () {
      return +this.card.price || 0
    }
  },
  methods: {
    canShowMoreServices (item) {
      if (this.screenWidth > BREAKPOINT_MD) {
        return this.getListSpecs(item).length > 40
      }
      return this.getListSpecs(item).length > 20
    },
    getAddress (item) {
      if (item?.locationId) {
        if (this.addresses.hasOwnProperty(item.locationId) && this.addresses[item.locationId]?.value) {
          return this.addresses[item.locationId].value
        }
      }
      return ''
    },
    getListSpecs (item) {
      return item?.listSpecs ? item?.listSpecs : ''
    },
    cancelOrder () {
      this.$store.dispatch(`orders/${CREATE_TASK}`, {
        owner: this.card.salesOrderOwner,
        orderId: this.card.id,
        name: 'Запрос на отмену Заказа',
        type: 'Phone Call Outbound',
        api: this.$api,
        dateFrom: this.$moment().format('DD.MM.YYYY HH:mm'),
        dateTo: `${this.$moment().format('DD.MM.YYYY')} 23:59`,
        description: `Номер заказ: ${this?.card?.id} Имя Клиента: ${this?.getClientInfo?.name} Л/С: ${this?.getActiveBillingAccountNumber}`
      })
        .then(result => {
          if (result) {
            this.resultDialogSuccess = true
          } else {
            this.resultDialogError = true
          }
        })
        .catch(e => {
          this.resultDialogError = true
        })
        .finally(() => {
          this.isShowModal = false
        })
    }
  }
}
