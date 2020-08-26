import { Component } from 'vue-property-decorator'

import AddressFolder from '../AddressFolder/index.vue'
import Camera from '../Camera/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import OfferDialog from '@/components/dialogs/OfferDialog/index.vue'

import { CODES, CHARS, ADDITION_USERS } from '@/constants/videocontrol'
import { IVideocontrol, IOffer } from '@/interfaces/videocontrol'
import { logInfo } from '@/functions/logging'
import { OFFER_LINKS } from '@/constants/url'
import { VueTransitionFSM } from '@/mixins/FSMMixin'

interface IAddressListItem {
  bpi: string
  address: any
  data: any
}

const HTTP_UNPROCESSABLE_ENTITY_CODE = 422
// требуется ли поле "Имя в счёте" при заказе услуг
const INVOICE_REQUIRED_IN_ORDER = true
// доп.характеристика заказа пользователей
const INVOICE_USERS = INVOICE_REQUIRED_IN_ORDER ? { [CHARS.NAME_IN_INVOICE]: ADDITION_USERS } : {}

const MESSAGES = {
  USER_MODIFY_ORDER_ERROR: 'При изменении количества пользователей возникла ошибка. Свяжитесь с вашим персональным менеджером.',
  USER_MODIFY_ORDER_SUCCESS: 'Услуга "Дополнительные пользователи" успешно изменена.'
}

const components = {
  AddressFolder,
  Camera,
  ErPlugProduct,
  OfferDialog
}

const computed = { }

const props = {
  dkey: String,
  domain: Object,
  userCount: Number,
  userCost: Number,
  userPrice: String,
  userProductId: String
}

@Component({
  name: 'vc-domain',
  props,
  components,
  computed
})
export default class VCDomain extends VueTransitionFSM {
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
      accept: () => {
        logInfo('принят заказ пользователей')
        this.sendOrder()
      },
      decline: () => {
        logInfo('отказ от заказа пользователей')
        this.cancelOrder()
      }
    },
    accept: {
      success: () => {}
    }
  }

  services: IOffer[] | [] = []

  isOrderModalVisible: boolean = false
  isManagerRequest: boolean = false
  isOrderCameraMode: boolean = false

  isUserCountOrdered: boolean = false
  isUserOrderMode: boolean = false

  isShowOfferDialog: boolean = false

  orderData: {} = {
    offer: 'cctv'
  }

  requestData = {
    descriptionModal: 'необходимо сформировать заявку',
    addressId: '',
    services: 'Подключение камеры',
    fulladdress: ''
  }

  domainUserCount: number = 1

  get offerLink () {
    return OFFER_LINKS['cctv']
  }

  get addressList (): IAddressListItem[] {
    let list: IAddressListItem[] = []
    let obj = this.$props.domain.videocontrols
    Object.keys(obj).forEach(el => {
      list.push({
        bpi: el,
        address: this.$store.getters['videocontrol/pointByBPI'](el),
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
      const price = this.domainUserCount * this.payPerUser
      return price.toString()
    }

    return this.$props.userPrice.toString()
  }

  get userCountOfferId () {
    // @ts-ignore
    return Object.values(this.$props.domain.services).find(
      (el: any) => el.offer.code === 'VIDCUSERS'
    ).id
  }

  mounted () {
    this.domainUserCount = this.$props.userCount
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

  onClickAddCamera () {
    this.isOrderCameraMode = true
    this.isOrderModalVisible = true
    this.isManagerRequest = true
    this.requestData = {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      addressId: this.addressList[0].address.id,
      services: 'Подключение камеры',
      fulladdress: '-'
    }

    this.orderData = {
      ...this.orderData,
      locationId: this.locationId,
      bpi: this.$props.domain.id,
      productCode: CODES.CAMERA,
      title: 'Вы уверены, что хотите подключить камеру?'
    }
  }

  onSaveUserCount () {
    const userDiff = this.domainUserCount - this.$props.userCount
    this.isUserOrderMode = true

    if (this.domainUserCount === 1) { // Отключение услуги
      logInfo('отмена услуги «Дополнительные пользователи»')
      const payload = {
        locationId: this.locationId,
        bpi: this.$props.domain.id,
        productId: this.$props.userProductId,
        disconnectDate: this.$moment().format()
      }

      // TODO: доработать когда починят отключение услуги в Netcracker
      this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
        .catch(data => {
          this.$emit('error', data.message)
          this.isUserOrderMode = false
        })
    } else if (this.$props.userCount === 1 && userDiff) { // Заказ пользователей
      this.onAddUser()
    } else { // Изменение количества
      const payload = {
        locationId: this.videocontrolList[0].locationId,
        bpi: this.userCountOfferId,
        chars: {
          [CHARS.USER_COUNT]: this.domainUserCount,
          ...INVOICE_USERS
        }
      }
      this.$store.dispatch('salesOrder/createModifyOrder', payload)
        .then(() => {
          // показываем принятие оферты
          this.setState('offer')
        })
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
          this.showError(MESSAGES.USER_MODIFY_ORDER_ERROR)
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
      })
  }

  showError (message: string) {
    this.$emit('error', message)
    this.setState('error')
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
      offer: 'cctv',
      title: `Вы уверены, что хотите добавить ${this.domainUserCount - 1} пользователей?`
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
}
