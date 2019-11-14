import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class RequestItemComponent extends Vue {
  /**
   * Номер заявки
   */
  @Prop([String, Number]) ticketId
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
  @Prop(String) category
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
  /** @type {boolean} */
  isOpenDetail = false
  /** @type {boolean} */
  isOpenHistory = false

  /**
   * Получение метки-статуса
   * @return {{name: string, id: string}}
   */
  get getLabelStatus () {
    if (this.resolvedWhen) {
      return { id: 'resolved', name: 'Закрыта' }
    }
    if (this.solvedWhen) {
      return { id: 'solved', name: 'Решена' }
    }
    if (this.onHoldWhen) {
      return { id: 'hold', name: 'В ожидании' }
    }
    if (this.inProgressWhen) {
      return { id: 'progress', name: 'В работе' }
    }
    if (this.createdWhen) {
      return { id: 'created', name: 'Создана' }
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
      'hold': 'Для решения заявки требуется получить дополнительную информацию от Клиента.',
      'solved': 'Работы по заявке выполнены. Ожидается подтверждение от Клиента решения заявки.',
      'resolved': 'Спасибо за Ваше обращение. Работы по заявке выполнены.'
    }
  }
  get getHistoryArray () {
    return [
      this.resolvedWhen && { id: 'resolved', name: 'Закрыта', text: this.getTextStatus.resolved, time: this.resolvedWhen },
      this.solvedWhen && { id: 'solved', name: 'Решена', text: this.getTextStatus.solved, time: this.solvedWhen },
      this.onHoldWhen && { id: 'hold', name: 'В ожидании', text: this.getTextStatus.hold, time: this.onHoldWhen },
      this.inProgressWhen && { id: 'progress', name: 'В работе', text: this.getTextStatus.progress, time: this.inProgressWhen },
      this.createdWhen && { id: 'created', name: 'Создана', text: this.getTextStatus.created, time: this.createdWhen }
    ].filter(item => item)
  }
  get getDetailInfoMobile () {
    return [
      { caption: 'Тип заявки', value: this.ticketType },
      { caption: 'Тип проблемы', value: this.category },
      { caption: 'Продукт', value: this.affectedProduct },
      { caption: 'Статус', value: this.getTextStatus[this.getLabelStatus.id] }
    ]
  }
  get getDetailInfoDesktop () {
    return [
      { caption: 'Тип заявки', value: this.ticketType },
      { caption: 'Тип проблемы', value: this.category },
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
}
