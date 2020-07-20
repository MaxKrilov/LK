import { Vue, Component } from 'vue-property-decorator'

import AddressFolder from '../AddressFolder/index.vue'
import Camera from '../Camera/index.vue'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import { CODES, CHARS, ADDITION_USERS } from '@/constants/videocontrol'
import { IVideocontrol, IOffer, IBaseFunctionality } from '@/interfaces/videocontrol'
import {
  IOfferingRelationship,
  IProductOffering
} from '@/interfaces/offering'
import { logInfo } from '@/functions/logging'

const BASE_CATEGORY_ID = 187
const VIDEOANAL_CATEGORY_ID = 228
const VC_BASE = CODES.BASE

interface IAddressListItem {
  bpi: string
  address: any
  data: any
}

const components = {
  AddressFolder,
  Camera,
  ErPlugProduct
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
export default class VCDomain extends Vue {
  services: IOffer[] | [] = []
  baseServices: IOffer[] | [] = []
  searchText: string = ''
  isOrderModalVisible: boolean = false
  isManagerRequest: boolean = false
  isOrderCameraMode: boolean = false

  orderData = {}
  requestData = {
    descriptionModal: 'необходимо сформировать заявку',
    addressId: '',
    services: 'Подключение камеры',
    fulladdress: ''
  }

  domainUserCount: number = 1

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

  get inSearchMode (): boolean {
    return !!this.searchText.length
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

  getBFList (videocontrol: IVideocontrol): IBaseFunctionality[] {
    const bfKeyList = Object.keys(videocontrol.bf)

    return bfKeyList.map(el => {
      return {
        ...videocontrol.bf[el]
      }
    })
  }

  getBFListById (id: string): IBaseFunctionality {
    return this.$props.domain.videocontrol[id].bf
  }

  getOfferingRelationships (data: IProductOffering): IOfferingRelationship[] {
    return data.offeringRelationships
  }

  fetchAllowedOfferList () {
    const offerId = this.$props.domain.offer.id

    const payload = {
      api: this.$api,
      id: offerId
    }

    return this.$store.dispatch(
      'videocontrol/pullAllowedOffers',
      payload
    )
  }

  mounted () {
    this.domainUserCount = this.$props.userCount

    this.fetchAllowedOfferList().then(data => {
      const firstData = data.find(
        (el: IProductOffering) => el.code === VC_BASE
      )

      this.baseServices = this.getOfferingRelationships(firstData)
        .find(el => {
          return el.categoryId === BASE_CATEGORY_ID
        })?.offerings || []

      this.services = this.getOfferingRelationships(firstData)
        .find(
          (el: IOfferingRelationship) => el.categoryId === VIDEOANAL_CATEGORY_ID
        )?.offerings || []
    })
  }

  /* === Event handlers === */
  onChangeUserCount (count: number) {
    this.$emit(
      'change', {
        id: this.$props.domain.id,
        userCount: parseInt(count, 10)
      }
    )
  }

  onClickAdd () {
    this.isOrderCameraMode = true
    this.isOrderModalVisible = true
    this.isManagerRequest = true
    this.requestData = {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      addressId: this.addressList[0].address.id,
      services: 'Подключение камеры',
      fulladdress: 'fulladdress'
    }

    this.orderData = {
      locationId: this.videocontrolList[0].locationId,
      bpi: this.$props.domain.id,
      productCode: CODES.CAMERA,
      title: 'Вы уверены, что хотите подключить камеру?'
    }
  }

  onSaveUserCount () {
    const userDiff = this.domainUserCount - this.$props.userCount

    if (this.domainUserCount === 1) {
      logInfo('отмена услуги «Дополнительные пользователи»')
      const payload = {
        locationId: this.videocontrolList[0].locationId,
        bpi: this.$props.domain.id,
        productId: this.$props.userProductId,
        disconnectDate: this.$moment().format()
      }
      this.$store.dispatch('salesOrder/createDisconnectOrder', payload)
    } else {
      if (userDiff > 0) {
        logInfo(`добавилось ${userDiff} пользователей`)
      } else {
        logInfo(`пользователей меньше на ${Math.abs(userDiff)} (всего ${this.domainUserCount})`)
      }

      const payload = {
        locationId: this.videocontrolList[0].locationId,
        bpi: this.$props.domain.id,
        chars: {
          [CHARS.USER_COUNT]: this.domainUserCount,
          [CHARS.NAME_IN_INVOICE]: ADDITION_USERS
        }
      }
      this.$store.dispatch('salesOrder/createModifyOrder', payload)
    }
  }

  onAddUser () {
    const firstVideocontrol = this.videocontrolList[0]

    this.orderData = {
      locationId: firstVideocontrol.locationId,
      bpi: this.$props.domain.id,
      productCode: CODES.USERS,
      chars: {
        [CHARS.USER_COUNT]: this.domainUserCount
      },
      offer: true,
      title: `Вы уверены, что хотите добавить ${this.domainUserCount - 1} пользователей?`
    }
    this.isOrderModalVisible = true
    this.isManagerRequest = false
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
