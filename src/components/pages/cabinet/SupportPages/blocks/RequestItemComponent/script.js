import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CANCEL_REQUEST } from '../../../../../../store/actions/request'
import ErActivationModal from '../../../../../blocks/ErActivationModal/index'
import { REQUEST_STATUS } from '@/constants/request'
import { sortDesc } from '@/functions/helper'

const localisationTicketType = val => val.match(/Problem/ig)
  ? 'Инцидент'
  : val.match(/Complaint/ig)
    ? 'Претензия'
    : val.match(/Request/ig)
      ? 'Запрос на обслуживание'
      : 'Другое'

const STATUS_LABEL = {
  IN_PROGRESS: {
    id: 'progress',
    name: 'В работе',
    text: 'Специалисты занимаются решением Вашей заявки.'
  },
  HOLD: {
    id: 'hold',
    name: 'В работе',
    text: 'Специалисты занимаются решением Вашей заявки.' // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
  },
  NEW: {
    id: 'created',
    name: 'Новая',
    text: 'Спасибо за Ваше обращение. Заявка создана, в ближайшее время будет принята в работу.'
  },
  CANCEL: {
    id: 'cancel',
    name: 'Отменена',
    text: 'Заявка отменена по желанию Клиента.'
  },
  RESOLVED: {
    id: 'resolved',
    name: 'Закрыта',
    text: 'Спасибо за Ваше обращение. Работы по заявке выполнены.'
  },
  SOLVED: {
    id: 'solved',
    name: 'Решена',
    text: 'Работы по заявке выполнены. Ожидается подтверждение от Клиента решения заявки.'
  }
}

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
  @Prop([ String, Number ]) ticketId
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
  @Prop([ String, Number ]) modifiedWhen
  /**
   * Дата/время создания
   */
  @Prop([ String, Number ]) createdWhen
  /**
   * Дата/время взятия в работу
   */
  @Prop([ String, Number ]) inProgressWhen
  /**
   * Дата/время перевода в ожидание
   */
  @Prop([ String, Number ]) onHoldWhen
  /**
   * Дата/время закрытия
   */
  @Prop([ String, Number ]) closedWhen
  /**
   * Дата/время решения
   */
  @Prop([ String, Number ]) resolvedWhen
  /**
   * Дата/время отмены
   */
  @Prop([ String, Number ]) cancelledWhen
  /**
   * Список файлов
   */
  @Prop({ type: Array, default: () => ([]) }) listFile

  @Prop(String) status

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
    if (this.cancelledWhen) {
      return STATUS_LABEL.CANCEL
    }

    if (this.closedWhen) {
      return STATUS_LABEL.RESOLVED
    }

    if (this.resolvedWhen) {
      return STATUS_LABEL.SOLVED
    }

    if (this.onHoldWhen) {
      return STATUS_LABEL.HOLD
    }

    if (this.inProgressWhen) {
      return STATUS_LABEL.IN_PROGRESS
    }

    if (this.createdWhen && this.status !== REQUEST_STATUS.IN_WORK) {
      return STATUS_LABEL.NEW
    } else if (this.createdWhen && this.status === REQUEST_STATUS.IN_WORK) {
      return STATUS_LABEL.IN_PROGRESS
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
      'created': STATUS_LABEL.NEW.text,
      'progress': STATUS_LABEL.IN_PROGRESS.text,
      // 'hold': 'Для решения заявки требуются дополнительные работы.',
      // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
      'hold': STATUS_LABEL.HOLD.text,
      'solved': STATUS_LABEL.SOLVED.text,
      'resolved': STATUS_LABEL.RESOLVED.text,
      'cancel': STATUS_LABEL.CANCEL.text
    }
  }

  get getHistoryArray () {
    return [
      this.cancelledWhen && { ...STATUS_LABEL.CANCEL, time: this.cancelledWhen },
      this.closedWhen && { ...STATUS_LABEL.RESOLVED, time: this.closedWhen },
      this.resolvedWhen && { ...STATUS_LABEL.SOLVED, time: this.resolvedWhen },
      // this.onHoldWhen && { id: 'hold', name: 'В доработке', text: this.getTextStatus.hold, time: this.onHoldWhen },
      this.onHoldWhen && { // todo Переделать после того, как бизнес отойдёт после Новогодних праздников
        ...STATUS_LABEL.HOLD,
        time: this.onHoldWhen
      },
      this.inProgressWhen && { ...STATUS_LABEL.IN_PROGRESS, time: this.inProgressWhen },
      this.createdWhen && this.status === REQUEST_STATUS.IN_WORK && {
        ...STATUS_LABEL.IN_PROGRESS, time: this.modifiedWhen
      },
      this.createdWhen && { ...STATUS_LABEL.NEW, time: this.createdWhen }
    ].filter(item => item)
      .sort((a, b) => sortDesc(a.time, b.time))
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
        this.closeCancelDialog()
        this.isSuccessCancel = true
      })
      .catch(() => {
        this.resultDialogError = true
      })
      .finally(() => {
        this.loadingCancel = false
      })
  }

  @Watch('isSuccessCancel')
  onIsSuccessCancelChanged (val) {
    !val && this.$emit('cancel')
  }
}
