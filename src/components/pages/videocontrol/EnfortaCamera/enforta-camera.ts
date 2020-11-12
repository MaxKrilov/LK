import { Component } from 'vue-property-decorator'
import ProductItem from '@/components/pages/videocontrol/components/ProductItem/index.vue'

import { PAKETS, SERVICES } from '@/constants/enforta'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { ErtPageWithDialogsMixin } from '@/mixins2/ErtPageWithDialogsMixin'

const components = {
  ProductItem,
  ErPlugProduct
}

const props = {
  id: String
}

function getRandomInt () {
  return parseInt(Math.random() * 999, 10)
}

interface ICameraServiceState {
  key: string
  enabled: boolean
  loading: boolean
  code?: string
}

const MESSAGES = {
  ON_DISABLE_SERVICE: `Отключить пакет невозможно<br> Должен быть выбран хотя бы один пакет. Выберите пакет для подключения`,
  ON_DISABLE_BASE: `Не получится отключить Пакет «Базовый», так как это базовый пакет.<br>Вы можете отключать любые другие пакеты сервисов`
}

@Component({ components, props })
export default class VCEnfortaCamera extends ErtPageWithDialogsMixin {
  isRentPayVisible: boolean = false

  isRequestModalVisible: boolean = false
  requestData: Record<string, any> = {}

  currentServiceCode: string = ''
  currentPaketCode: string = ''

  SERVICE_STATE: Record<string, ICameraServiceState> = {
    VIDEO_QUALITY: {
      enabled: false,
      key: 'VIDEO_QUALITY',
      loading: false,
      code: 'VIDNQUAL'
    },
    PTZ: {
      enabled: false,
      key: 'PTZ',
      loading: false,
      code: 'VIDNPTZ'
    },
    SOUND_RECORD: {
      enabled: false,
      key: 'SOUND_RECORD',
      loading: false,
      code: 'VIDNSOUND'
    },
    BASE: {
      enabled: false,
      loading: false,
      key: 'BASE',
      code: 'VIDNPBASE'
    },
    DETECTOR: {
      enabled: false,
      loading: false,
      key: 'DETECTOR',
      code: 'VIDNPDO'
    },
    CLOUD_ARCHIVE: {
      enabled: false,
      loading: false,
      key: 'CLOUD_ARCHIVE',
      code: 'VIDNPOA'
    },
    DETECTOR_CLOUD_ARCHIVE: {
      enabled: false,
      loading: false,
      key: 'DETECTOR_CLOUD_ARCHIVE',
      code: 'VIDNPDOOA'
    }
  }

  get camera () {
    return this.$store.getters['videocontrol/enfortaCameraRegistry']?.[this.$props.id]
  }

  get pakets () {
    return Object.values(this.camera?.pakets || {})
  }

  get services () {
    return Object.values(this.camera?.services || {})
  }

  get enabledServiceCodes (): string[] {
    return this.services.map((el: any) => el.offer.code)
  }

  get enabledPaketCodes (): string[] {
    return this.pakets.map((el: any) => el.offer.code)
  }

  get point () {
    return this.$store.getters['videocontrol/pointById'](this.camera.locationId)
  }

  get cameraNumber () {
    return this?.camera?.name
      ? this.camera.name.split('#')[1]
      : ''
  }

  get location () {
    return this.$store.getters['videocontrol/pointById'](this?.camera?.locationId)
  }

  get serviceList () {
    return SERVICES
  }

  get packetList () {
    return PAKETS
  }

  get isLoaded () {
    return this.$store.state.videocontrol.isEnfortaDataLoaded
  }

  onServiceToggle (value: boolean, serviceCode: string) {
    this.currentServiceCode = serviceCode
    this.$set(this.SERVICE_STATE[serviceCode], 'loading', true)

    const payload = {
      name: '',
      type: !value ? 'disconnect' : 'connect'
    }

    payload.name = value
      ? `подключить ${this.getServiceInfo(serviceCode).title}`
      : `отключить ${this.getServiceInfo(serviceCode).title}`

    this.onRequest(payload)
  }

  onUnplugCamera () {
    this.onRequest({
      name: 'отключить Камеру',
      type: 'disconnect'
    })
  }

  onRequest (payload: {name: string, description?: string, type?: string}) {
    // заявка на менеджера
    this.isRequestModalVisible = true
    const { address, fulladdress } = this.point

    const descriptionModal = payload?.description || 'Для подключения сервиса необходимо сформировать заявку'

    this.requestData = {
      descriptionModal,
      services: payload.name,
      type: payload?.type || 'change',
      fulladdress,
      addressId: address.id
    }
  }

  onCloseRequest () {
    let code = ''
    if (this.currentServiceCode) {
      code = this.currentServiceCode
    } else if (this.currentPaketCode) {
      code = this.currentPaketCode
    }

    this.updateServiceKey(code)
    this.$set(this.SERVICE_STATE[code], 'loading', false)
    this.currentServiceCode = ''
    this.currentPaketCode = ''
  }

  onCloseSuccess () {
    let code = ''
    if (this.currentServiceCode) {
      code = this.currentServiceCode
    } else if (this.currentPaketCode) {
      code = this.currentPaketCode
    }

    this.updateServiceKey(code)
    this.$set(this.SERVICE_STATE[code], 'loading', false)
    this.$set(this.SERVICE_STATE[code], 'loading', false)
    this.currentServiceCode = ''
    this.currentPaketCode = ''
    this.reloadData()
  }

  onCloseError () {
    // TODO: refresh info
  }

  onInputPaket (value: boolean, code: string): void {
    this.currentPaketCode = code
    if (!value) {
      this.onInfo({ message: MESSAGES.ON_DISABLE_SERVICE })
      this.$set(this.SERVICE_STATE[code], 'key', getRandomInt())
    } else {
      this.$set(this.SERVICE_STATE[code], 'key', code + getRandomInt())
      this.$set(this.SERVICE_STATE[code], 'loading', true)

      const payload = {
        name: '',
        type: value ? 'connect' : 'disconnect'
      }

      payload.name = value
        ? `подключить ${this.getPaketInfo(code).title}`
        : `отключить ${this.getPaketInfo(code).title}`

      this.onRequest(payload)
    }
  }

  updateServiceKey (code: string) {
    const newKey = code + '-' + getRandomInt()
    this.$set(this.SERVICE_STATE[code], 'key', newKey)
  }

  getServiceInfo (code: string) {
    return SERVICES[code]
  }

  getPaketInfo (code: string): any {
    return PAKETS[code]
  }

  reloadData () {
    // TODO: pullEnfortaData
  }
}
