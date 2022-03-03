/**
 * Запланирована
 * Начальный технический статус Услуги. Система создаёт объект Услуги для хранения всей информации о приобретённом
 * Продукте. Переход в статус "В процессе активации" происходит автоматически
 * @type {string}
 */
export const STATUS_PLANNED = 'Planned'
/**
 * В процессе активации
 * Услуга проходит процесс активации
 * @type {string}
 */
export const STATUS_ACTIVATION_IN_PROGRESS = 'Activation in Progress'
/**
 * Отмена активации
 * Система отменяет процесс активации
 * @type {string}
 */
export const STATUS_CANCELING_OF_ACTIVATION = 'Canceling of activation'
/**
 * Активация отменена
 * Система отменила активацию Услуги
 */
export const STATUS_ACTIVATION_CANCELLED = 'Activation Cancelled'
/**
 * Активация прошла точку невозврата
 * В процессе активации Услуга достигла точку невозврата
 */
export const STATUS_ACTIVATION_PASSED_PONR = 'Activation passed PONR'
/**
 * Активна
 * Услуга активна. Процесс активации в Модуле управления заказами завершился Успешно. Услуга доступна для использования Клиентом.
 */
export const STATUS_ACTIVE = 'Active'
/**
 * Выполнена
 * Статус доступен только для одноразовых Услуг и означает, что Услуга полностью оплачена
 */
export const STATUS_COMPLETED = 'Completed'
/**
 * В процессе изменения
 * Услуга проходит процесс модификации
 */
export const STATUS_MODIFICATION = 'Modification in progress'
/**
 * Отмена изменения
 * Система отменяет процесс модификации
 */
export const STATUS_CANCELING_OF_MODIFICATION = 'Canceling of modification'
/**
 * Изменение прошло точку невозврата
 * В процессе изменения Услуга достигла точки невозврата
 */
export const STATUS_MODIFICATION_PASSED_PONR = 'Modification passed PONR'
/**
 * В процессе приостановки
 * Услуга проходит через процесс приостановки
 */
export const STATUS_SUSPENSION_IN_PROGRESS = 'Suspension in progress'
/**
 * Отмена приостановки
 * Система отменяет процесс установки
 */
export const STATUS_CANCELING_OF_SUSPENSION = 'Canceling of suspension'
/**
 * Приостановка прошла точку невозврата
 * В процессе приостановки Услуга достигла точку невозврата
 */
export const STATUS_SUSPENSION_PASSED_PONR = 'Suspension passed PONR'
/**
 * Приостановлена
 * Услуга приостановлена
 */
export const STATUS_SUSPENDED = 'Suspended'
/**
 * В процессе возобновления
 * Услуга проходит процесс возобновления
 */
export const STATUS_RESUMING_IN_PROGRESS = 'Resuming in progress'
/**
 * Отмена возобновления
 * Система отменяет процесс возобновления
 */
export const STATUS_CANCELING_OF_RESUMING = 'Canceling of resuming'
/**
 * Возобновление прошло точку невозврата
 * В процессе возобновления Услуга достигла точку невозврата
 */
export const STATUS_RESUMING_PASSED_PONR = 'Resuming passed PONR'
/**
 * В процессе отключения
 * Услуга проходит процесс отключения
 */
export const STATUS_DISCONNECTION_IN_PROGRESS = 'Disconnection in progress'
/**
 * Отмена отключения
 * Система отменяет процесс отключения
 */
export const STATUS_CANCELLING_OF_DISCONNECTION = 'Canceling of disconnection'
/**
 * Отключение прошло точку невозврата
 * В процессе отключения Услуга достигла точку невозврата
 */
export const STATUS_DISCONNECTION_PASSED_PONR = 'Disconnection passed PONR'
/**
 * Отключена
 * Предоставление Услуги закончилось. Услуга отключена
 */
export const STATUS_DISCONNECTED = 'Disconnected'

export const ARRAY_STATUS_SHOWN = [STATUS_ACTIVE, STATUS_SUSPENDED, STATUS_MODIFICATION]

export const STATUS_TEXT: Record<string, string> = {
  [STATUS_PLANNED]: 'Запланирована',
  [STATUS_ACTIVATION_IN_PROGRESS]: 'В процессе активации',
  [STATUS_CANCELING_OF_ACTIVATION]: 'Отмена активации',
  [STATUS_ACTIVATION_CANCELLED]: 'Активация отменена',
  [STATUS_ACTIVATION_PASSED_PONR]: 'Активация прошла точку невозврата',
  [STATUS_ACTIVE]: 'Активна',
  [STATUS_COMPLETED]: 'Выполнена',
  [STATUS_MODIFICATION]: 'В процессе изменения',
  [STATUS_CANCELING_OF_MODIFICATION]: 'Отмена изменения',
  [STATUS_MODIFICATION_PASSED_PONR]: 'Изменение прошло точку невозврата',
  [STATUS_SUSPENSION_IN_PROGRESS]: 'В процессе приостановки',
  [STATUS_CANCELING_OF_SUSPENSION]: 'Отмена приостановки',
  [STATUS_SUSPENSION_PASSED_PONR]: 'Приостановка прошла точку невозврата',
  [STATUS_SUSPENDED]: 'Приостановлена',
  [STATUS_RESUMING_IN_PROGRESS]: 'В процессе возобновления',
  [STATUS_CANCELING_OF_RESUMING]: 'Отмена возобновления',
  [STATUS_RESUMING_PASSED_PONR]: 'Возобновление прошло точку невозврата',
  [STATUS_DISCONNECTION_IN_PROGRESS]: 'В процессе отключения',
  [STATUS_CANCELLING_OF_DISCONNECTION]: 'Отмена отключения',
  [STATUS_DISCONNECTION_PASSED_PONR]: 'Отключение прошло точку невозврата',
  [STATUS_DISCONNECTED]: 'Отключена'
}

export class ServiceStatus {
  static STATUS_PLANNED = STATUS_PLANNED
  static STATUS_ACTIVATION_IN_PROGRESS = STATUS_ACTIVATION_IN_PROGRESS
  static STATUS_CANCELING_OF_ACTIVATION = STATUS_CANCELING_OF_ACTIVATION
  static STATUS_ACTIVATION_CANCELLED = STATUS_ACTIVATION_CANCELLED
  static STATUS_ACTIVATION_PASSED_PONR = STATUS_ACTIVATION_PASSED_PONR
  static STATUS_ACTIVE = STATUS_ACTIVE
  static STATUS_COMPLETED = STATUS_COMPLETED
  static STATUS_MODIFICATION = STATUS_MODIFICATION
  static STATUS_CANCELING_OF_MODIFICATION = STATUS_CANCELING_OF_MODIFICATION
  static STATUS_MODIFICATION_PASSED_PONR = STATUS_MODIFICATION_PASSED_PONR
  static STATUS_SUSPENSION_IN_PROGRESS = STATUS_SUSPENSION_IN_PROGRESS
  static STATUS_CANCELING_OF_SUSPENSION = STATUS_CANCELING_OF_SUSPENSION
  static STATUS_SUSPENSION_PASSED_PONR = STATUS_SUSPENSION_PASSED_PONR
  static STATUS_SUSPENDED = STATUS_SUSPENDED
  static STATUS_RESUMING_IN_PROGRESS = STATUS_RESUMING_IN_PROGRESS
  static STATUS_CANCELING_OF_RESUMING = STATUS_CANCELING_OF_RESUMING
  static STATUS_RESUMING_PASSED_PONR = STATUS_RESUMING_PASSED_PONR
  static STATUS_DISCONNECTION_IN_PROGRESS = STATUS_DISCONNECTION_IN_PROGRESS
  static STATUS_CANCELLING_OF_DISCONNECTION = STATUS_CANCELLING_OF_DISCONNECTION
  static STATUS_DISCONNECTION_PASSED_PONR = STATUS_DISCONNECTION_PASSED_PONR
  static STATUS_DISCONNECTED = STATUS_DISCONNECTED
}
