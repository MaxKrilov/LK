import { Vue, Component, Prop } from 'vue-property-decorator'
import { CANCEL_REQUEST } from '../../../../../../store/actions/request'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'

const localisationTicketType = val => val.match(/Problem/ig)
  ? 'Инцидент'
  : val.match(/Complaint/ig)
    ? 'Претензия'
    : val.match(/Request/ig)
      ? 'Запрос на обслуживание'
      : 'Другое'

@Component({
  components: {
    ErActivationModal
  },
  filters: {
    localisationTicketType,
    ticketName: val => val.split(' ').slice(0, 2).join(' ')
  }
})
export default class RequestItemComponent extends Vue {
  /**
   * Номер заявки
   */
  @Prop([String, Number]) ticketId
  /**
   * Имя заявки
   */
  @Prop(String) ticketName
  /**
   * Тип заявки
   */
  @Prop(String) ticketType
  /**
   * Продукт
   */
  @Prop(String) affectedProduct
  /**
   * Адрес точки
   */
  @Prop(String) location
  /**
   * Тип проблемы
   */
  @Prop(String) type
  /**
   * Дата/время изменения
   */
  @Prop([String, Number]) modifiedWhen
  /**
   * Дата/время создания
   */
  @Prop([String, Number]) createdWhen
  /**
   * Дата/время взятия в работу
   */
  @Prop([String, Number]) inProgressWhen
  /**
   * Дата/время перевода в ожидание
   */
  @Prop([String, Number]) onHoldWhen
  /**
   * Дата/время решения
   */
  @Prop([String, Number]) solvedWhen
  /**
   * Дата/время закрытия
   */
  @Prop([String, Number]) resolvedWhen
  /**
   * Дата/время отмены
   */
  @Prop([String, Number]) cancelledWhen
  /**
   * Список файлов
   */
  @Prop({ type: Array, default: () => ([]) }) listFile
  /** @type {boolean} */
  isOpenDetail = false
  /** @type {boolean} */
  isOpenHistory = false
  /** @type {boolean} */
  isOpenCancel = false
  /** @type {string} */
  reasonOfCancel = ''
  isSuccessCancel = false
  resultDialogError = false
  loadingCancel = false

  /**
   * Получение метки-статуса
   * @return {{name: string, id: string}}
   */
  get getLabelStatus () {
    if (this.cancelledWhen === this.modifiedWhen) {
      return { id: 'cancel', name: 'Отменена' }
    }
    if (this.resolvedWhen === this.modifiedWhen) {
      return { id: 'resolved', name: 'Закрыта' }
    }
    if (this.solvedWhen === this.modifiedWhen) {
      return { id: 'solved', name: 'Решена' }
    }
    if (this.onHoldWhen === this.modifiedWhen) {
      return { id: 'hold', name: 'В работе' } // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
    }
    if (this.inProgressWhen === this.modifiedWhen) {
      return { id: 'progress', name: 'В работе' }
    }
    if (this.createdWhen === this.modifiedWhen) {
      return { id: 'created', name: 'Новая' }
    }
    return { id: '', name: '' }
  }

  /**
   * Получает дату/время модификации в формате для работы с MomentJS
   * @return {moment.Moment}
   */
  get getModifiedWhen () {
    return this.$moment(this.modifiedWhen)
  }

  get getTextStatus () {
    return {
      'created': 'Спасибо за Ваше обращение. Заявка создана, в ближайшее время будет принята в работу.',
      'progress': 'Специалисты занимаются решением Вашей заявки.',
      // 'hold': 'Для решения заявки требуются дополнительные работы.',
      'hold': 'Специалисты занимаются решением Вашей заявки.', // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
      'solved': 'Работы по заявке выполнены. Ожидается подтверждение от Клиента решения заявки.',
      'resolved': 'Спасибо за Ваше обращение. Работы по заявке выполнены.',
      'cancel': 'Заявка отменена по желанию Клиента.'
    }
  }
  get getHistoryArray () {
    return [
      this.cancelledWhen && { id: 'cancel', name: 'Отменена', text: this.getTextStatus.cancel, time: this.cancelledWhen },
      this.resolvedWhen && { id: 'resolved', name: 'Закрыта', text: this.getTextStatus.resolved, time: this.resolvedWhen },
      this.solvedWhen && { id: 'solved', name: 'Решена', text: this.getTextStatus.solved, time: this.solvedWhen },
      // this.onHoldWhen && { id: 'hold', name: 'В доработке', text: this.getTextStatus.hold, time: this.onHoldWhen },
      this.onHoldWhen && { id: 'hold', name: 'В работе', text: this.getTextStatus.hold, time: this.onHoldWhen }, // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
      this.inProgressWhen && { id: 'progress', name: 'В работе', text: this.getTextStatus.progress, time: this.inProgressWhen },
      this.createdWhen && { id: 'created', name: 'Новая', text: this.getTextStatus.created, time: this.createdWhen }
    ].filter(item => item)
  }
  get getDetailInfoMobile () {
    return [
      { caption: 'Тип заявки', value: localisationTicketType(this.ticketType) },
      { caption: 'Тип проблемы', value: this.type },
      { caption: 'Продукт', value: this.affectedProduct },
      { caption: 'Статус', value: this.getTextStatus[this.getLabelStatus.id] }
    ]
  }
  get getDetailInfoDesktop () {
    return [
      { caption: 'Тип заявки', value: localisationTicketType(this.ticketType) },
      { caption: 'Тип проблемы', value: this.type },
      { caption: 'Продукт', value: this.affectedProduct },
      { caption: 'Адрес подключения', value: this.location }
    ]
  }

  /**
   * Открывает/закрывает детальную информацию о заявке
   */
  toggleDetail () {
    this.isOpenDetail = !this.isOpenDetail
  }
  toggleHistoryMobile () {
    this.isOpenHistory = !this.isOpenHistory
  }
  openCancelDialog () {
    this.isOpenCancel = true
  }
  closeCancelDialog () {
    this.isOpenCancel = false
  }
  closeSuccessCancel () {
    this.isSuccessCancel = false
  }
  async cancelRequest () {
    if (!this.$refs.cancel_form.validate()) {
      return false
    }
    this.loadingCancel = true
    this.$store.dispatch(`request/${CANCEL_REQUEST}`, {
      api: this.$api,
      requestId: this.ticketId,
      description: this.reasonOfCancel
    })
      .then(result => {
        if (result) {
          this.closeCancelDialog()
          this.isSuccessCancel = true
          this.$emit('cancel')
        } else {
          this.resultDialogError = true
        }
      })
      .catch(() => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCancel = false
      })
  }
}
