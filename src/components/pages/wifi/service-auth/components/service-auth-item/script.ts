import Vue from 'vue'
import Component from 'vue-class-component'

import { LIST_SERVICE_AUTH_WITH_PARAMETERS, LIST_SERVICE_AUTH_WO_PARAMETERS } from '../../constants'
import { STATUS_TEXT, ServiceStatus, STATUS_ACTIVE } from '@/constants/status'

import { price as priceFormatted } from '@/functions/filters'
import { IVoucherManager, ManagerResult, Result as IVoucherManagerResult } from '@/tbapi/voucher_manager'
import { IWifiResourceInfo, WifiData } from '@/tbapi'

import { mapActions } from 'vuex'

import ErtForm from '@/components/UI2/ErtForm'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import ErtAuthVoucherComponent from './components/voucher-component/index.vue'

import { head } from 'lodash'
import moment from 'moment'

const filters = {
  priceFormatted,
  dateTimeFormatted: (val: string) => moment(val).format('DD.MM.YYYY HH:mm')
}

const generatePassword = require('password-generator')

const GUEST_AUTH = [
  { title: 'Вконтакте', name: 'vk', iconType: 'icon', iconName: 'vk', field: 'field_social_auth_vk' },
  { title: 'Одноклассники', name: 'ok', iconType: 'icon', iconName: 'odnoklassniki', field: 'field_social_auth_ok' },
  { title: 'Facebook', name: 'fb', iconType: 'icon', iconName: 'facebook', field: 'field_social_auth_fb' },
  { title: 'Instagram', name: 'instagram', iconType: 'icon', iconName: 'instagram', field: 'field_social_auth_in' }
  // { title: 'Twitter', name: 'twitter', iconType: 'icon', iconName: 'twitter', field: 'field_social_auth_tw' }
]

function defineSNParams (sn: string) {
  switch (sn) {
    case 'field_social_auth_vk':
      return 514
    case 'field_social_auth_ok':
      return 515
    case 'field_social_auth_fb':
      return 516
    case 'field_social_auth_in':
      return 517
    case 'field_social_auth_tw':
      return 518
  }
}

const props = {
  code: String,
  description: String,
  saName: String,
  status: String,
  price: String,
  chars: {
    type: [Object, String],
    default: () => ({})
  },
  bpi: String
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
const ssidNameRule = (v: string) => !!v.match(/^[a-zA-Z\d\w@[\].\s?,\\/!#$&%^*()\-="':;_]+$/g) ||
  'Название может содержать только латинские буквы, цифры и орфографические знаки'
const closedNetworkRule = (f: 'Пароль' | 'Название' | 'Пин-код') => (v: string) => !!v.match(/^[A-Za-z0-9]+$/g) ||
  `${f} вводится только латинскими буквами и цифрами`
const isNumberRule = (v: string) => !isNaN(parseInt(v)) || 'Поле должно быть числом'
const intervalRule = (v: string) => (parseInt(v) >= 1 && parseInt(v) <= 720) ||
  'Значение должно быть от 1 до 720'

const CHAR_WIFIREDIR_SITE = 'Адрес сайта для переадресации пользователей после авторизации в wi-fi сети'
const CHAR_WIFINAME_NAME = 'Название Гостевой сети'
const CHAR_WIFIACCCHANGE_PIN = 'Пин-код'
const CHAR_WIFIACCCHANGE_INTERVAL = 'Длительность авторизации (час)'
const CHAR_WIFIHSCLONET_NAME = 'Имя сети Wi-Fi (SSID)'
const CHAR_WIFIHSCLONET_PASSWORD = 'Пароль закрытой сети'
const CHAR_WIFIAVTVOUCH_PREFIX = 'Префикс логина'

@Component<InstanceType<typeof ErtWifiServiceAuthItem>>({
  components: {
    ErActivationModal,
    ErtAuthVoucherComponent
  },
  filters,
  props,
  watch: {
    status (val) {
      this.lazyStatus = val || ServiceStatus.STATUS_DISCONNECTED
    }
  },
  methods: {
    ...mapActions({
      voucherView: 'wifi/voucherView',
      getResource: 'wifi/getResource',
      managerCreate: 'wifi/managerCreate',
      managerDelete: 'wifi/managerDelete',
      managerUpdate: 'wifi/managerUpdate',
      managerRestore: 'wifi/managerRestore',
      getData: 'wifi/getData',
      hotspotUpdate: 'wifi/hotspotUpdate'
    })
  }
})
export default class ErtWifiServiceAuthItem extends Vue {
  // Options
  $refs!: {
    form: InstanceType<typeof ErtForm>,
    'manager-add': InstanceType<typeof ErtForm>
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

  readonly bpi!: string

  // Data
  lazyStatus: string = this.status || InternalServiceStatuses.STATUS_DISCONNECTED
  loadingServiceWithParams: boolean = false

  vModelList = {
    wifiRedirSite: '', // Адрес сайта для редиректа
    wifiName: '', // Собственное название сети
    wifiAccChangePIN: '', // PIN код заведения
    wifiAccChangeInterval: '', // Интервал авторизации
    wifiHSClosNetName: '', // Название закрытой сети
    wifiHSCloseNetPassword: '', // Пароль закрытой сети
    wifiVoucherPrefix: '',
    wifiVoucherManagerName: '',
    wifiVoucherManagerPassword: ''
  }

  vModelTypeList = {
    wifiAccChangePIN: 'password',
    wifiHSCloseNetPassword: 'password',
    wifiVoucherManagerPassword: 'password'
  }

  vModelRuleList = {
    wifiRedirSite: [],
    wifiName: [requiredRule, maxLengthRule(17), ssidNameRule],
    wifiAccChangePIN: [closedNetworkRule('Пин-код')],
    wifiAccChangeInterval: [requiredRule, isNumberRule, intervalRule],
    wifiHSClosNetName: [requiredRule, closedNetworkRule('Название')],
    wifiHSCloseNetPassword: [requiredRule, minLengthRule(8), closedNetworkRule('Пароль')],
    wifiVoucherPrefix: [requiredRule, (v: string) => /^[a-z0-9]+$/g.test(v) || 'Префикс может содержать только латинские буквы нижнего регистра и/или цифры'],
    wifiVoucherManagerName: [requiredRule],
    wifiVoucherManagerPassword: [requiredRule]
  }

  cityId: string = ''
  vlan: string = ''

  voucherManagerInfo: IVoucherManagerResult | null = null

  isAddingVoucherManager: boolean = false
  isAddingVoucherManagerRequest: boolean = false
  isRemovingVoucherManagerRequest: boolean = false
  isUpdatingVoucherManager: boolean = false
  isUpdatingVoucherManagerRequest: boolean = false
  isRestoringVoucherManagerRequest: boolean = false

  isSuccessVoucherManager: boolean = false
  isErrorVoucherManager: boolean = false

  managerIdAction: number = 0

  guestAuthList = GUEST_AUTH
  wifiData: WifiData | null = null

  socialNetworks: Record<string, { isConnect: number, isLoading: boolean, errorMessage: string }> = {
    field_social_auth_vk: { isConnect: 0, isLoading: false, errorMessage: '' },
    field_social_auth_ok: { isConnect: 0, isLoading: false, errorMessage: '' },
    field_social_auth_fb: { isConnect: 0, isLoading: false, errorMessage: '' },
    field_social_auth_in: { isConnect: 0, isLoading: false, errorMessage: '' },
    field_social_auth_tw: { isConnect: 0, isLoading: false, errorMessage: '' }
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
    } else if (this.code === 'WIFIHSCLONET') {
      return {
        [CHAR_WIFIHSCLONET_NAME]: this.vModelList.wifiHSClosNetName,
        [CHAR_WIFIHSCLONET_PASSWORD]: this.vModelList.wifiHSCloseNetPassword
      }
    } else if (this.code === 'WIFIAVTVOUCH') {
      return {
        [CHAR_WIFIAVTVOUCH_PREFIX]: this.vModelList.wifiVoucherPrefix
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

  onGeneratePassword (service: 'acc-change' | 'close-net' | 'voucher') {
    if (service === 'acc-change') {
      this.vModelList.wifiAccChangePIN = generatePassword(8, false, /[A-Za-z0-9]/)
      this.vModelTypeList.wifiAccChangePIN = 'text'
    } else if (service === 'close-net') {
      this.vModelList.wifiHSCloseNetPassword = generatePassword(8, false, /[A-Za-z0-9]/)
      this.vModelTypeList.wifiHSCloseNetPassword = 'text'
    } else {
      this.vModelList.wifiVoucherManagerPassword = generatePassword(8, false, /[A-Za-z0-9]/)
      this.vModelTypeList.wifiVoucherManagerPassword = 'text'
    }
  }

  onClick () {
    if (!this.$refs.form.validate()) return
    this.loadingServiceWithParams = true
    this.$emit('connect', this.getChars)
  }

  onCreateManager () {
    if (!this.$refs['manager-add'].validate()) return
    this.isAddingVoucherManagerRequest = true
    this.managerCreate({
      password: this.vModelList.wifiVoucherManagerPassword,
      fullName: this.vModelList.wifiVoucherManagerName,
      vlan: this.vlan,
      cityId: this.cityId
    })
      .then(response => {
        if (response.status === 'ok') {
          this.voucherManagerInfo?.managers.push({
            manager_id: response.result.manager_id,
            point_id: response.result.point_id,
            full_name: response.result.full_name,
            authorized_at: response.result.authorized_at,
            created_at: response.result.created_at,
            removed_at: response.result.removed_at,
            updated_at: response.result.updated_at
          })
          this.isSuccessVoucherManager = true
        } else {
          this.isErrorVoucherManager = true
        }
      })
      .catch(() => {
        this.isErrorVoucherManager = true
      })
      .finally(() => {
        this.isAddingVoucherManagerRequest = false
        this.isAddingVoucherManager = false
        this.vModelList.wifiVoucherManagerPassword = ''
        this.vModelList.wifiVoucherManagerName = ''
      })
  }

  onRemoveManager (managerId: number) {
    this.isRemovingVoucherManagerRequest = true
    this.managerIdAction = managerId
    this.managerDelete({
      vlan: this.vlan,
      cityId: this.cityId,
      managerId
    })
      .then(response => {
        if (response.status === 'ok' && response.result) {
          const index = this.voucherManagerInfo?.managers.findIndex(manager => manager.manager_id === managerId) as number
          if (index > -1) {
            this.voucherManagerInfo!.managers[index].removed_at = moment().format('YYYY-MM-DD HH:mm:ss')
            this.isSuccessVoucherManager = true
          }
        } else {
          this.isErrorVoucherManager = true
        }
      })
      .catch(() => {
        this.isErrorVoucherManager = true
      })
      .finally(() => {
        this.isRemovingVoucherManagerRequest = false
        this.managerIdAction = 0
      })
  }

  onManagerUpdate () {
    this.isUpdatingVoucherManagerRequest = true
    this.managerUpdate({
      vlan: this.vlan,
      cityId: this.cityId,
      managerId: this.managerIdAction,
      password: this.vModelList.wifiVoucherManagerPassword,
      fullName: this.vModelList.wifiVoucherManagerName
    })
      .then(response => {
        if (response.status === 'ok') {
          const index = this.voucherManagerInfo?.managers.findIndex(manager => manager.manager_id === this.managerIdAction) as number
          if (index > -1) {
            this.voucherManagerInfo!.managers[index] = {
              manager_id: response.result.manager_id,
              point_id: response.result.point_id,
              full_name: response.result.full_name,
              authorized_at: response.result.authorized_at,
              created_at: response.result.created_at,
              removed_at: response.result.removed_at,
              updated_at: response.result.updated_at
            }
            this.isSuccessVoucherManager = true
          }
        } else {
          this.isErrorVoucherManager = true
        }
      })
      .catch(() => {
        this.isErrorVoucherManager = true
      })
      .finally(() => {
        this.onCloseUpdateForm()
      })
  }

  onManagerRestore (managerId: number) {
    this.isRestoringVoucherManagerRequest = true
    this.managerIdAction = managerId
    this.managerRestore({
      vlan: this.vlan,
      cityId: this.cityId,
      managerId
    })
      .then(response => {
        if (response.status === 'ok') {
          const index = this.voucherManagerInfo?.managers.findIndex(manager => manager.manager_id === this.managerIdAction) as number
          if (index > -1) {
            this.voucherManagerInfo!.managers[index].removed_at = null
            this.isSuccessVoucherManager = true
          }
        } else {
          this.isErrorVoucherManager = true
        }
      })
      .catch(() => {
        this.isErrorVoucherManager = true
      })
      .finally(() => {
        this.isRestoringVoucherManagerRequest = false
        this.managerIdAction = 0
      })
  }

  onOpenUpdateForm (managerId: number) {
    this.managerIdAction = managerId
    const manager = this.voucherManagerInfo?.managers.find(manager => manager.manager_id === managerId)!
    this.vModelList.wifiVoucherManagerName = manager.full_name
    this.isUpdatingVoucherManager = true
  }

  onCloseUpdateForm () {
    this.isUpdatingVoucherManager = false
    this.managerIdAction = 0
    this.vModelList.wifiVoucherManagerName = ''
    this.vModelList.wifiVoucherManagerPassword = ''
    this.isUpdatingVoucherManagerRequest = false
  }

  defineSocialNetwork (wifiData: WifiData) {
    for (const key in this.socialNetworks) {
      if (this.socialNetworks.hasOwnProperty(key)) {
        this.socialNetworks[key].isConnect = wifiData.hasOwnProperty(key)
          ? (this.wifiData as any)[key]
          : 0
      }
    }
  }

  onChangeSocialNetwork (e: boolean, field: string, name: string) {
    this.socialNetworks[field].isLoading = true
    this.socialNetworks[field].errorMessage = ''

    const snData = new FormData()
    snData.append('vlan', this.vlan)
    snData.append('city_id', this.cityId)
    snData.append('params[param_id]', defineSNParams(field)!.toString())
    snData.append('params[value]', Number(e).toString())

    this.hotspotUpdate(snData)
      .then(response => {
        if (!response) {
          this.socialNetworks[field].errorMessage = 'Произошла неизвестная ошибка!';
          (this.$refs as any)[`social-network-${name}`][0].lazyValue = e ? 0 : 1
        }
      })
      .finally(() => {
        this.socialNetworks[field].isLoading = false
      })
  }

  /// Vuex actions
  getResource!: <
    P = { bpi: string },
    R = Promise<IWifiResourceInfo[]>
    >(args: P) => R

  voucherView!: <
    P = { vlan: string, cityId: string },
    R = Promise<IVoucherManager>
    >(args: P) => R

  managerCreate!: <
    P = { vlan: string, cityId: string, password: string, fullName: string },
    R = Promise<ManagerResult>
    >(args: P) => R

  managerDelete!: <
    P = { vlan: string, cityId: string, managerId: number },
    R = Promise<{ status: string, result: boolean }>
    >(args: P) => R

  managerUpdate!: <
    P = { vlan: string, cityId: string, password: string, fullName: string, managerId: number },
    R = Promise<ManagerResult>
    >(args: P) => R

  managerRestore!: <
    P = { vlan: string, cityId: string, managerId: number },
    R = Promise<ManagerResult>
    >(args: P) => R

  getData!: <T = { vlan: string }, R = Promise<WifiData>>(args: T) => R

  hotspotUpdate!: (formData: FormData) => Promise<any>

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
      } else if (this.code === 'WIFIHSCLONET') {
        this.vModelList.wifiHSClosNetName = this.chars[CHAR_WIFIHSCLONET_NAME] || ''
        this.vModelList.wifiHSCloseNetPassword = this.chars[CHAR_WIFIHSCLONET_PASSWORD] || ''
      } else if (this.code === 'WIFIAVTVOUCH') {
        this.vModelList.wifiVoucherPrefix = this.chars[CHAR_WIFIAVTVOUCH_PREFIX] || ''
      }
    }

    if (this.code === 'WIFIAUTCNHS' && this.lazyStatus === this.getStatuses.STATUS_ACTIVE) {
      this.getResource({ bpi: this.bpi })
        .then(response => {
          const vlan = head(response)!.vlan
          if (!vlan || typeof head(vlan) === 'undefined') return
          this.cityId = head(vlan)!.cityId
          this.vlan = head(vlan)!.number

          this.getData({ vlan: this.vlan, cityId: this.cityId })
            .then(_response => {
              this.wifiData = _response

              this.defineSocialNetwork(_response)
            })
        })
    }
  }
}
