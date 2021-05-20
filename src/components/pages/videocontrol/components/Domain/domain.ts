import { Component, Mixins } from 'vue-property-decorator'

import AddressFolder from '../AddressFolder/index.vue'
import Camera from '../Camera/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import OfferDialog from '@/components/dialogs/OfferDialog/index.vue'

import {
  CODES,
  CHARS,
  ADDITION_USERS,
  MESSAGES,
  VC_DOMAIN_STATUSES,
  VC_TYPES
} from '@/constants/videocontrol'
import { IVideocontrol, IOffer, IDomainService, ICamera, ICameraRegistry } from '@/interfaces/videocontrol'
import { logInfo } from '@/functions/logging'
import { OFFER_LINKS } from '@/constants/url'
import { VueTransitionFSM } from '@/mixins/FSMMixin'
import { ILocationOfferInfo } from '@/tbapi'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { STATUS_DISCONNECTED } from '@/constants/status'
import { ErtFetchAvailableFundsMixin } from '@/mixins2/ErtFetchAvailableFundsMixin'
import ErAvailableFundsModal from '@/components/blocks/ErAvailableFundsModal/index.vue'

interface IAddressListItem {
  bpi: string
  location: any
  data: any
}

const HTTP_UNPROCESSABLE_ENTITY_CODE = 422
// требуется ли поле "Имя в счёте" при заказе услуг
const INVOICE_REQUIRED_IN_ORDER = true
// доп.характеристика заказа пользователей
const INVOICE_USERS = INVOICE_REQUIRED_IN_ORDER ? { [CHARS.NAME_IN_INVOICE]: ADDITION_USERS } : {}

const components = {
  AddressFolder,
  Camera,
  ErPlugProduct,
  OfferDialog,
  ErActivationModal,
  ErAvailableFundsModal
}

const computed = { }

const props = {
  dkey: String,
  domain: Object,
  userCount: Number,
  userCost: Number,
  userPrice: String
}
const RELOAD_DOMAIN_DATA_DELAY = 800
const MIN_USER_COUNT = 0
const USER_COST = '60'
const SEARCH_RESULT_DELAY = 1200

@Component({
  name: 'vc-domain',
  props,
  components,
  computed
})
export default class VCDomain extends Mixins(VueTransitionFSM, ErtFetchAvailableFundsMixin) {
  /* config */
  // TODO: Отключить когда починят механизм подключения/отключения доп.пользователей в TBAPI
  isDisableChangeUserCount: boolean = false

  stateList = [
    'ready', // готов к приключениям
    'order', // заказ пользователей
    'offer', // показ оферты
    'accept', // оферта принята
    'decline', // оферта отклонена
    'success', // заказ отправлен
    'error'
  ]

  stateTransitions = {
    ready: {
      order: () => {
        logInfo('заказ пользователей')
      }
    },
    offer: {
      accept: (vm: any) => {
        logInfo('принят заказ пользователей')
        vm.sendOrder()
      },
      decline: () => {
        logInfo('отказ от заказа пользователей')
        this.cancelOrder()
      }
    },
    accept: {
      success: (vm: any) => {
        vm.isShowSuccessOrderModal = true
      }
    }
  }

  services: IOffer[] | [] = []

  isOrderModalVisible: boolean = false
  isManagerRequest: boolean = false
  isOrderCameraMode: boolean = false

  isUserCountOrdered: boolean = false
  isUserOrderMode: boolean = false

  isShowOfferDialog: boolean = false

  isShowDisableUserCountModal: boolean = false

  isShowSuccessOrderModal: boolean = false

  orderData: {} = {
    offer: 'cctv'
  }

  requestData = {
    descriptionModal: 'необходимо сформировать заявку',
    addressId: '',
    services: 'Подключение камеры',
    fulladdress: '',
    type: ''
  }

  domainUserCount: number = MIN_USER_COUNT

  searchInputEnd: boolean = true
  searchInputTimer: any

  get marketId () {
    return this.$props.domain?.market?.id || ''
  }

  get isModificationInProgress () {
    return this.$props.domain.status === VC_DOMAIN_STATUSES.MODIFICATION
  }

  get offerLink () {
    return OFFER_LINKS['cctv']
  }

  get addressList (): IAddressListItem[] {
    let list: IAddressListItem[] = []
    let obj = this.$props.domain.videocontrols
    Object.keys(obj).forEach(el => {
      list.push({
        bpi: el,
        location: this.$store.getters['videocontrol/pointByBPI'](el),
        data: obj[el]
      })
    })

    return list
  }

  get videocontrolList (): IVideocontrol[] {
    return Object.keys(this.$props.domain.videocontrols)
      .map(key => {
        return { ...this.$props.domain.videocontrols[key] }
      })
  }

  get locationId (): string {
    return this.videocontrolList[0].locationId
  }

  get isUserCountChanged (): boolean {
    return this.domainUserCount !== this.$props.userCount
  }

  get payPerUser (): number {
    const userPrice = parseFloat(this.$props.userPrice)
    const userCount = parseFloat(this.$props.userCount)
    return userPrice / userCount
  }

  get computedUserPrice (): string {
    if (this.isUserCountChanged) {
      const price = this.domainUserCount * parseInt(USER_COST, 10)
      return price.toString()
    }

    return this.userCountProductPrice
  }

  get userCountProduct () {
    const services = this.$props.domain?.services

    const isUserType = (el: IDomainService) => el.offer.code === VC_TYPES.USERS
    const notDisconnectedStatus = ({ status }: IDomainService) => status !== STATUS_DISCONNECTED

    return services
      ? Object.values(services)
        // @ts-ignore
        .filter(notDisconnectedStatus)
        .find(isUserType)
      : null
  }

  get userCountProductPrice () {
    return this.userCountProduct?.purchasedPrices?.recurrentTotal?.value || '0'
  }

  get userCountProductOfferId () {
    return this.userCountProduct?.offer?.id
  }

  get userCountProductId () {
    return this.userCountProduct?.id
  }

  get location () {
    return this.addressList[0].location
  }

  get addressId () {
    return this.location.address.id
  }

  get searchCameraText () {
    return this.$store.state.videocontrol.searchCamera
  }

  mounted () {
    this.domainUserCount = this.$props.userCount
  }

  matchCameraSearchQuery (camera: ICamera): boolean {
    if (this.searchCameraText.length < 1) {
      return false
    }

    const searchQuery = new RegExp(this.searchCameraText, 'ig')
    const cameraModel = camera?.chars?.[CHARS.MODEL]
    const cameraDevName = camera?.chars?.[CHARS.DEVICE_NAME]
    const searchByModel = cameraModel?.search(searchQuery) >= 0
    const searchByName = cameraDevName?.search(searchQuery) >= 0
    return searchByModel || searchByName
  }

  filterCameraListBySearchText (cameraRegistry: ICameraRegistry) {
    return Object.values(cameraRegistry).filter(this.matchCameraSearchQuery)
  }

  /* === Event handlers === */
  onChangeUserCount (count: number) {
    this.$emit(
      'change', {
        id: this.$props.domain.id,
        userCount: count
      }
    )
  }

  onCloseSuccessOrderModal () {
    this.isShowSuccessOrderModal = false
    setTimeout(() => {
      this.pullDomainRegistry()
    }, RELOAD_DOMAIN_DATA_DELAY)
  }

  onClickAddCamera () {
    this.isOrderCameraMode = true
    this.isOrderModalVisible = true
    this.isManagerRequest = true
    this.requestData = {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      addressId: this.addressId,
      services: 'Подключение камеры',
      fulladdress: this.location.fulladdress,
      type: 'create'
    }

    this.orderData = {
      ...this.orderData,
      locationId: this.addressId,
      bpi: this.$props.domain.id,
      productCode: CODES.CAMERA,
      title: 'Вы уверены, что хотите подключить камеру?'
    }
  }

  onSaveUserCount () {
    if (this.isModificationInProgress) {
      this.showInfo('', MESSAGES.MIP_MESSAGE)
    } else {
      const userDiff = this.domainUserCount - this.$props.userCount
      this.isUserOrderMode = true

      if (this.domainUserCount === MIN_USER_COUNT) { // Отключение услуги
        const payload = {
          locationId: this.locationId,
          productId: this.userCountProductId,
          disconnectDate: this.$moment().format()
        }

        this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
          .catch(() => {
            this.$emit('error', { message: MESSAGES.ORDER_ERROR })
            this.isUserOrderMode = false
            throw new Error('')
          })
          .then(() => {
            this.isShowDisableUserCountModal = true
          })
      } else if (this.$props.userCount === MIN_USER_COUNT && userDiff) { // Заказ пользователей
        this.checkFunds(parseInt(this.computedUserPrice))
          .then(() => {
            this.onAddUser()
          })
      } else { // Изменение количества
        this.checkFunds(parseInt(this.computedUserPrice))
          .then(() => {
            const payload = {
              locationId: this.videocontrolList[0].locationId,
              bpi: this.userCountProductOfferId,
              chars: {
                [CHARS.USER_COUNT]: this.domainUserCount,
                ...INVOICE_USERS
              }
            }
            this.$store.dispatch('salesOrder/createModifyOrder', payload)
              .catch(() => {
                this.showError(MESSAGES.ORDER_ERROR)
                this.isUserOrderMode = false
                throw new Error('при заказе произошла ошибка')
              })
              .then(() => {
                // показываем принятие оферты
                this.setState('offer')
              })
          })
      }
    }
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
    this.isUserOrderMode = false
    this.setState('ready')
  }

  sendOrder () {
    this.$store.dispatch('salesOrder/send', {
      offerAcceptedOn: this.$moment().format()
    })
      .then(data => {
        if (data.code === HTTP_UNPROCESSABLE_ENTITY_CODE) {
          this.showError(MESSAGES.ORDER_ERROR)
        } else if (data.submit_statuses && data.submit_statuses[0].submitStatus === 'FAILED') {
          this.showError(data.submit_statuses[0].submitError)
        } else {
          this.$emit('success', MESSAGES.USER_MODIFY_ORDER_SUCCESS)
          this.setState('success')
        }

        this.isUserOrderMode = false
      })
      .catch(data => {
        this.isUserOrderMode = false
        this.setState('error')
        this.$emit('error', data.message)
        throw new Error('')
      })
  }

  showError (message: string) {
    this.$emit('error', { title: 'Ошибка', message })
    this.setState('error')
  }

  showInfo (title: string, message: string) {
    this.$emit('info', { title, message })
    this.setState('accept')
  }

  pullDomainRegistry () {
    const parentIds = this.$store.state.videocontrol.points
      .map(({ bpi }: ILocationOfferInfo) => bpi)

    this.$store.dispatch(
      'videocontrol/pullForpostDomainRegistry',
      {
        api: this.$api,
        parentIds
      })
  }

  onAcceptOffer () {
    this.setState('accept')
  }

  onDeclineOffer () {
    this.setState('decline')
  }

  onAddUser () {
    this.orderData = {
      locationId: this.locationId,
      bpi: this.$props.domain.id,
      productCode: CODES.USERS,
      chars: {
        [CHARS.USER_COUNT]: this.domainUserCount,
        ...INVOICE_USERS
      },
      marketId: this.marketId,
      offer: 'cctv',
      title: MESSAGES.USER_ADD_QUESTION
    }
    this.isOrderModalVisible = true
    this.isManagerRequest = false
  }

  onCancelOrder () {
    this.isUserOrderMode = false
  }

  onClosePlugProduct () {
    this.isOrderCameraMode = false
  }

  onClickPause () {
    // приостановка домена происходит через службу поддержки
    this.$router.push({
      name: 'support',
      query: { form: 'suspension_of_a_contract_or_service' }
    })
  }

  onCloseAvailableFundsModal () {
    this.setState('ready')
    this.isUserOrderMode = false
  }

  onInputSearchCamera (value: string) {
    this.searchInputEnd = false

    clearTimeout(this.searchInputTimer)

    this.searchInputTimer = setTimeout(() => {
      this.searchInputEnd = true
    }, SEARCH_RESULT_DELAY)

    this.$store.dispatch('videocontrol/setSearchCameraText', value)
  }
}
