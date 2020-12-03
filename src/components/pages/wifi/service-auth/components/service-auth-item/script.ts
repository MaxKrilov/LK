import Vue from 'vue'
import Component from 'vue-class-component'

import { LIST_SERVICE_AUTH_WITH_PARAMETERS, LIST_SERVICE_AUTH_WO_PARAMETERS } from '../../constants'
import { STATUS_TEXT, ServiceStatus, STATUS_ACTIVE } from '@/constants/status'

import { price as priceFormatted } from '@/functions/filters'
import ErtForm from '@/components/UI2/ErtForm'

const filters = { priceFormatted }

const generatePassword = require('password-generator')

const props = {
  code: String,
  description: String,
  saName: String,
  status: String,
  price: String,
  chars: {
    type: [Object, String],
    default: () => ({})
  }
}

const INTERNAL_STATUS_CONNECTING = 'Connecting'
const INTERNAL_STATUS_DISCONNECTING = 'Disconnecting'

class InternalServiceStatuses extends ServiceStatus {
  static INTERNAL_STATUS_CONNECTING = INTERNAL_STATUS_CONNECTING
  static INTERNAL_STATUS_DISCONNECTING = INTERNAL_STATUS_DISCONNECTING
}

const requiredRule = (v: string) => !!v || 'Поле обязательно к заполению'
const minLengthRule = (l: number) => (v: string) => v.length >= l || `Длина должна быть не меньше ${l} символов`
const maxLengthRule = (l: number) => (v: string) => v.length <= l || `Длина должна быть не больше ${l} символов`
const ssidNameRule = (v: string) => !!v.match(/[a-zA-Z\d\w@[\].\s?,\\/!#$&%^*()\-="':;_]/g) ||
  'Название может содержать только латинские буквы, цифры и орфографические знаки'
const closedNetworkRule = (f: 'Пароль' | 'Название' | 'Пин-код') => (v: string) => !!v.match(/[A-Za-z0-9]/g) ||
  `${f} вводится только латинскими буквами и цифрами`
const isNumberRule = (v: string) => !isNaN(parseInt(v)) || 'Поле должно быть числом'
const intervalRule = (v: string) => (parseInt(v) >= 1 && parseInt(v) <= 720) ||
  'Значение должно быть от 1 до 720'

const CHAR_WIFIREDIR_SITE = 'URL-адрес ресурса'
const CHAR_WIFINAME_NAME = 'Название Гостевой сети'
const CHAR_WIFIACCCHANGE_PIN = 'Пин-код'
const CHAR_WIFIACCCHANGE_INTERVAL = 'Длительность авторизации (час)'
const CHAR_WIFIHSCLONET_NAME = 'Имя сети Wi-Fi (SSID)'
const CHAR_WIFIHSCLONET_PASSWORD = 'Пароль закрытой сети'

@Component<InstanceType<typeof ErtWifiServiceAuthItem>>({
  filters,
  props,
  watch: {
    status (val) {
      this.lazyStatus = val || ServiceStatus.STATUS_DISCONNECTED
    }
  }
})
export default class ErtWifiServiceAuthItem extends Vue {
  // Options
  $refs!: {
    form: InstanceType<typeof ErtForm>
  }
  // Props
  /**
   * Код SLO
   * @type {String}
   */
  readonly code!: string
  /**
   * Описание сервиса
   * @type {String}
   */
  readonly description!: string
  /**
   * Название сервиса
   * @type {String}
   */
  readonly saName!: string
  /**
   * Статус сервиса авторизации
   * @type {string}
   */
  readonly status!: string
  /**
   * Цена сервиса авторизации
   */
  readonly price!: string
  /**
   * Характеристики сервиса
   */
  readonly chars!: Record<string, string> | string

  // Data
  lazyStatus: string = this.status || InternalServiceStatuses.STATUS_DISCONNECTED
  loadingServiceWithParams: boolean = false

  vModelList = {
    wifiRedirSite: '', // Адрес сайта для редиректа
    wifiName: '', // Собственное название сети
    wifiAccChangePIN: '', // PIN код заведения
    wifiAccChangeInterval: '', // Интервал авторизации
    wifiHSClosNetName: '', // Название закрытой сети
    wifiHSCloseNetPassword: '' // Пароль закрытой сети
  }

  vModelTypeList = {
    wifiAccChangePIN: 'password',
    wifiHSCloseNetPassword: 'password'
  }

  vModelRuleList = {
    wifiRedirSite: [requiredRule],
    wifiName: [requiredRule, maxLengthRule(17), ssidNameRule],
    wifiAccChangePIN: [closedNetworkRule('Пин-код')],
    wifiAccChangeInterval: [requiredRule, isNumberRule, intervalRule],
    wifiHSClosNetName: [requiredRule, minLengthRule(8), closedNetworkRule('Название')],
    wifiHSCloseNetPassword: [requiredRule, minLengthRule(8), closedNetworkRule('Пароль')]
  }

  // Computed
  /**
   * Список сервисов авторизации с доп. параметрами
   * @type {Array<String>}
   */
  get getListServiceAuthWithParameters () {
    return LIST_SERVICE_AUTH_WITH_PARAMETERS
  }

  /**
   * Список сервисов авторизации без доп. параметров
   * @type {Array<String>}
   */
  get getListServiceAuthWOParameters () {
    return LIST_SERVICE_AUTH_WO_PARAMETERS
  }

  /**
   * Является ли сервис авторизации сервисом авторизации с параметрами
   * @type {boolean}
   */
  get isServiceAuthWithParameters () {
    return this.getListServiceAuthWithParameters.includes(this.code)
  }

  /**
   * Является ли сервис авторизации сервисом авторизации без параметров
   * @type {boolean}
   */
  get isServiceAuthWOParameters () {
    return this.getListServiceAuthWOParameters.includes(this.code)
  }

  /**
   * Получает список статусов
   */
  get getStatuses () {
    return InternalServiceStatuses
  }

  /**
   * Список статусов, при которых переключатель переведён в режим "включён"
   */
  get isOnSwitch () {
    return [
      InternalServiceStatuses.STATUS_ACTIVE,
      InternalServiceStatuses.INTERNAL_STATUS_CONNECTING,
      InternalServiceStatuses.STATUS_MODIFICATION
    ].includes(this.lazyStatus)
  }

  /**
   * Условия, при которых переключатель переходит в режим "загрузки"
   */
  get isLoadingSwitch () {
    return (this.isServiceAuthWOParameters && this.lazyStatus === InternalServiceStatuses.INTERNAL_STATUS_CONNECTING) ||
      this.lazyStatus === InternalServiceStatuses.INTERNAL_STATUS_DISCONNECTING
  }

  get isInProgress () {
    return [
      InternalServiceStatuses.STATUS_ACTIVATION_IN_PROGRESS,
      InternalServiceStatuses.STATUS_DISCONNECTION_IN_PROGRESS,
      InternalServiceStatuses.STATUS_RESUMING_IN_PROGRESS,
      InternalServiceStatuses.STATUS_SUSPENSION_IN_PROGRESS,
      InternalServiceStatuses.STATUS_MODIFICATION
    ].includes(this.status)
  }

  get isDisabledSwitch () {
    return this.isLoadingSwitch || this.isInProgress
  }

  get getButtonText () {
    return this.lazyStatus === STATUS_ACTIVE
      ? 'Изменить'
      : 'Подключить'
  }

  get getChars () {
    if (this.code === 'WIFIREDIR') {
      return {
        [CHAR_WIFIREDIR_SITE]: this.vModelList.wifiRedirSite
      }
    } else if (this.code === 'WIFINAME') {
      return {
        [CHAR_WIFINAME_NAME]: this.vModelList.wifiName
      }
    } else if (this.code === 'WIFIACCCHANGE') {
      return {
        [CHAR_WIFIACCCHANGE_PIN]: this.vModelList.wifiAccChangePIN,
        [CHAR_WIFIACCCHANGE_INTERVAL]: this.vModelList.wifiAccChangeInterval
      }
    } else {
      return {
        [CHAR_WIFIHSCLONET_NAME]: this.vModelList.wifiHSClosNetName,
        [CHAR_WIFIHSCLONET_PASSWORD]: this.vModelList.wifiHSCloseNetPassword
      }
    }
  }

  get getStatusText () {
    return STATUS_TEXT[this.status]
  }

  // Methods
  /**
   * Обработчик события переключения переключателя
   * @param {boolean} e
   */
  onChange (e: boolean) {
    if (e && this.lazyStatus === InternalServiceStatuses.STATUS_DISCONNECTED) {
      // Переводим в статус "Connecting"
      this.lazyStatus = InternalServiceStatuses.INTERNAL_STATUS_CONNECTING
      if (this.isServiceAuthWOParameters) {
        // Если сервис авторизации без параметров, то просто сообщаем родительскому компоненту, что хотим подключить
        this.$emit('connect')
      }
      // В противном случае ничего не делаем - будет показана форма для доп. параметров
    } else if (this.lazyStatus === InternalServiceStatuses.STATUS_ACTIVE) {
      // Отключение происходит по-одинаковому сценарию для всех
      this.lazyStatus = InternalServiceStatuses.INTERNAL_STATUS_DISCONNECTING
      this.$emit('disconnect')
    } else if (!e && this.lazyStatus === InternalServiceStatuses.INTERNAL_STATUS_CONNECTING) {
      this.lazyStatus = InternalServiceStatuses.STATUS_DISCONNECTED
    }
  }

  onGeneratePassword (service: 'acc-change' | 'close-net') {
    if (service === 'acc-change') {
      this.vModelList.wifiAccChangePIN = generatePassword(8, false, /[A-Za-z0-9]/)
      this.vModelTypeList.wifiAccChangePIN = 'text'
    } else {
      this.vModelList.wifiHSCloseNetPassword = generatePassword(8, false, /[A-Za-z0-9]/)
      this.vModelTypeList.wifiHSCloseNetPassword = 'text'
    }
  }

  onClick () {
    if (!this.$refs.form.validate()) return
    this.loadingServiceWithParams = true
    this.$emit('connect', this.getChars)
  }

  // Hooks
  mounted () {
    if (
      // this.lazyStatus === InternalServiceStatuses.STATUS_ACTIVE &&
      this.isServiceAuthWithParameters &&
      typeof this.chars !== 'string'
    ) {
      if (this.code === 'WIFIREDIR') {
        this.vModelList.wifiRedirSite = this.chars[CHAR_WIFIREDIR_SITE] || ''
      } else if (this.code === 'WIFINAME') {
        this.vModelList.wifiName = this.chars[CHAR_WIFINAME_NAME] || ''
      } else if (this.code === 'WIFIACCCHANGE') {
        this.vModelList.wifiAccChangePIN = this.chars[CHAR_WIFIACCCHANGE_PIN] || ''
        this.vModelList.wifiAccChangeInterval = this.chars[CHAR_WIFIACCCHANGE_INTERVAL] || ''
      } else {
        this.vModelList.wifiHSClosNetName = this.chars[CHAR_WIFIHSCLONET_NAME] || ''
        this.vModelList.wifiHSCloseNetPassword = this.chars[CHAR_WIFIHSCLONET_PASSWORD] || ''
      }
    }
  }
}