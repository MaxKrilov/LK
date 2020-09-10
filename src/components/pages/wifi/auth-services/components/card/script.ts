import Component from 'vue-class-component'
import { VueTransitionFSM } from '@/mixins/FSMMixin'

import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'

import { price as priceFormatted } from '@/functions/filters'

import {
  WIFIAUTOECIA, // Дополнительная услуга Авторизации через Госуслуги (ЕСИА)
  WIFIAUTCNHS, // Авторизация через соц. cети (HS)
  WIFIADVCANCEL, // Отмена внешней рекламы
  WIFIHSCLONET, // Закрытая сеть (HS)
  WIFIACCCHANGE, // Изменение параметров доступа
  WIFIAVTVOUCH, // Авторизация по ваучеру
  WIFINAME, // Дополнительная услуга по изменению названия сети DOM.RU Wi-Fi
  WIFIREDIR // Переадресация пользователя
} from '@/components/pages/wifi/index/constants'
import { iPointItem } from '@/components/blocks/ErListPoints/script'
import { IWifiResourceInfo } from '@/tbapi'
import ErtSwitch from '@/components/UI2/ErtSwitch'

const generatePassword = require('password-generator')

const STATUS_IS_CONNECT = 'connect'
const STATUS_IS_CONNECTING = 'connecting'
const STATUS_IS_DISCONNECT = 'disconnect'
const STATUS_IS_DISCONNECTING = 'disconnecting'

const CHAR_WIFIREDIR_SITE = 'URL-адрес ресурса'
const CHAR_WIFINAME_NAME = 'Название Гостевой сети'
const CHAR_WIFIACCCHANGE_PIN = 'Пин-код'
const CHAR_WIFIACCCHANGE_INTERVAL = 'Длительность авторизации (час)'
const CHAR_WIFIHSCLONET_NAME = 'Имя сети Wi-Fi (SSID)'
const CHAR_WIFIHSCLONET_PASSWORD = 'Пароль закрытой сети'

@Component({
  components: {
    ErPlugProduct,
    ErDisconnectProduct,
    ErtSwitch
  },
  filters: {
    priceFormatted
  },
  props: {
    title: String,
    description: String,
    price: [Number, String],
    isConnect: Boolean,
    code: String,
    activePoint: Object,
    productId: String,
    chars: [Object, String],
    vlanInfo: Object
  }
})
export default class WifiAuthServiceCard extends VueTransitionFSM {
  // Options
  $refs!: {
    'switch': InstanceType<typeof ErtSwitch>
  }

  // Props
  readonly title!: string
  readonly description!: string
  readonly price!: number | string
  readonly isConnect!: boolean
  readonly code!: string
  readonly activePoint!: iPointItem | null
  readonly productId!: string
  readonly chars!: Record<string, string> | string
  readonly vlanInfo!: IWifiResourceInfo

  // Statuses
  readonly STATUS_IS_CONNECT = STATUS_IS_CONNECT
  readonly STATUS_IS_CONNECTING = STATUS_IS_CONNECTING
  readonly STATUS_IS_DISCONNECT = STATUS_IS_DISCONNECT
  readonly STATUS_IS_DISCONNECTING = STATUS_IS_DISCONNECTING

  // Services
  readonly WIFIAUTOECIA = WIFIAUTOECIA
  readonly WIFIAUTCNHS = WIFIAUTCNHS
  readonly WIFIADVCANCEL = WIFIADVCANCEL
  readonly WIFIHSCLONET = WIFIHSCLONET
  readonly WIFIACCCHANGE = WIFIACCCHANGE
  readonly WIFIAVTVOUCH = WIFIAVTVOUCH
  readonly WIFINAME = WIFINAME
  readonly WIFIREDIR = WIFIREDIR

  readonly stateList = [
    STATUS_IS_CONNECT,
    STATUS_IS_CONNECTING,
    STATUS_IS_DISCONNECT,
    STATUS_IS_DISCONNECTING
  ]

  isConnectingModal = false
  isDisconnectingModal = false

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

  requiredRule = (v: string) => !!v || 'Поле обязательно к заполению'
  minLengthRule = (l: number) => (v: string) => v.length >= l || `Длина должна быть не меньше ${l} символов`
  maxLengthRule = (l: number) => (v: string) => v.length <= l || `Длина должна быть не больше ${l} символов`
  ssidNameRule = (v: string) => v.match(/[a-zA-Z\d\w@[\].\s?,\\/!#$&%^*()\-="':;_]/g) ||
    'Название может содержать только латинские буквы, цифры и орфографические знаки'
  closedNetworkRule = (f: 'Пароль' | 'Название' | 'Пин-код') => (v: string) => v.match(/[A-Za-z0-9]/g) ||
    `${f} вводится только латинскими буквами и цифрами`
  isNumberRule = (v: string) => !isNaN(parseInt(v)) || 'Поле должно быть числом'
  intervalRule = (v: string) => (parseInt(v) >= 1 && parseInt(v) <= 720) ||
    'Значение должно быть от 1 до 720'

  vModelRuleList = {
    wifiRedirSite: [this.requiredRule],
    wifiName: [this.requiredRule, this.maxLengthRule(17), this.ssidNameRule],
    wifiAccChangePIN: [this.requiredRule, this.closedNetworkRule('Пин-код')],
    wifiAccChangeInterval: [this.requiredRule, this.isNumberRule, this.intervalRule],
    wifiHSClosNetName: [this.requiredRule, this.minLengthRule(8), this.closedNetworkRule('Название')],
    wifiHSCloseNetPassword: [this.requiredRule, this.minLengthRule(8), this.closedNetworkRule('Пароль')]
  }

  get buttonText () {
    return this.activeState === STATUS_IS_CONNECTING
      ? 'Подключить'
      : 'Изменить'
  }

  // Список сервисов, которые не требуют ввода доп. данных (без формы)
  get listAuthServiceWOForm () {
    return [
      WIFIADVCANCEL,
      WIFIAUTCNHS,
      WIFIAUTOECIA
    ].includes(this.code)
  }

  get listAuthServiceWithForm () {
    return [
      WIFIREDIR,
      WIFINAME,
      WIFIACCCHANGE,
      WIFIHSCLONET
    ].includes(this.code)
  }

  get defineChars () {
    if (WIFIREDIR === this.code) {
      return {
        [CHAR_WIFIREDIR_SITE]: this.vModelList.wifiRedirSite
      }
    } else if (WIFINAME === this.code) {
      return {
        [CHAR_WIFINAME_NAME]: this.vModelList.wifiName
      }
    } else if (WIFIACCCHANGE === this.code) {
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

  get orderData () {
    const result: Record<string, any> = {
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      productCode: this.code,
      offer: 'wifi',
      title: `Вы уверены, что хотите подключить «${this.title}»?`
    }
    if (this.listAuthServiceWithForm) {
      result.chars = this.defineChars
    }
    return result
  }

  get orderDataAuthServiceWOForm () {
    return {
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      productCode: this.code,
      offer: 'wifi',
      title: `Вы уверены, что хотите подключить «${this.title}»?`
    }
  }

  get disconnectOrderData () {
    return {
      locationId: this.activePoint?.id,
      bpi: this.activePoint?.bpi,
      productId: this.productId,
      title: `Вы уверены, что хотите отключить «${this.title}»?`
    }
  }

  changeToggle () {
    this.activeState === STATUS_IS_DISCONNECT
      ? this.setState(STATUS_IS_CONNECTING)
      : this.setState(STATUS_IS_DISCONNECTING)
    this.$nextTick(() => {
      if (this.activeState === STATUS_IS_DISCONNECTING) {
        this.isDisconnectingModal = true
      } else if (this.activeState === STATUS_IS_CONNECTING && this.listAuthServiceWOForm) {
        this.isConnectingModal = true
      }
    })
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

  onConnectClick () {
    if ((this.$refs as any).form.validate()) {
      this.isConnectingModal = true
    }
  }

  cancelRequest (payload: boolean) {
    if (payload) return

    if (this.activeState === STATUS_IS_CONNECTING) {
      this.setState(STATUS_IS_DISCONNECT)
      this.$refs.switch.lazyValue = false
    } else if (this.activeState === STATUS_IS_DISCONNECTING) {
      this.setState(STATUS_IS_CONNECT)
      this.$refs.switch.lazyValue = true
    }
  }

  mounted () {
    this.isConnect
      ? this.setState(STATUS_IS_CONNECT)
      : this.setState(STATUS_IS_DISCONNECT)

    if (this.isConnect && this.listAuthServiceWithForm && typeof this.chars !== 'string') {
      if (WIFIREDIR === this.code) {
        this.vModelList.wifiRedirSite = this.chars[CHAR_WIFIREDIR_SITE] || ''
      } else if (WIFINAME === this.code) {
        this.vModelList.wifiName = this.chars[CHAR_WIFINAME_NAME] || ''
      } else if (WIFIACCCHANGE === this.code) {
        this.vModelList.wifiAccChangePIN = this.chars[CHAR_WIFIACCCHANGE_PIN] || ''
        this.vModelList.wifiAccChangeInterval = this.chars[CHAR_WIFIACCCHANGE_INTERVAL] || ''
      } else {
        this.vModelList.wifiHSClosNetName = this.chars[CHAR_WIFIHSCLONET_NAME] || ''
        this.vModelList.wifiHSCloseNetPassword = this.chars[CHAR_WIFIHSCLONET_PASSWORD] || ''
      }
    }
  }
}
