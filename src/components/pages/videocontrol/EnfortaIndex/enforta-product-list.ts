import { Component, Vue } from 'vue-property-decorator'
import { IEnfortaVideocontrol } from '@/interfaces/videocontrol'
import EnfortaVideocontrol from './components/EnfortaVideocontrol/index.vue'
import { ILocationOfferInfo } from '@/tbapi'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'
import Promo from '../promo/index.vue'
import { PLUG_URL } from '@/constants/videocontrol'

const components = {
  EnfortaVideocontrol,
  ErPlugProduct,
  Promo
}

@Component({ components })
export default class VCEnfortaProductList extends Vue {
  isRequestModalVisible: boolean = false
  requestData: any = {}

  get pointList () {
    return this.$store.state.videocontrol.points
  }

  get videocontrolList () {
    return this.$store.getters['videocontrol/enfortaVideocontrolList']
  }

  get isLoaded () {
    return this.$store.state.videocontrol.isDomainRegistryLoaded
  }

  get isProductPlugged (): boolean {
    return this.videocontrolList.length
  }

  get totalPrice () {
    return this.videocontrolList.reduce((acc: number, item: any) => {
      return acc + +item.purchasedPrices?.recurrentTotal?.value
    }, 0)
  }

  get plugUrl () {
    return PLUG_URL
  }

  getPoint (locationId: string) {
    return this.pointList.find(({ id }: ILocationOfferInfo) => id === locationId)
  }

  getPointVideocontrol (id: string) {
    return this.videocontrolList
      .filter((el: IEnfortaVideocontrol) => el.locationId === id)
  }

  getPointVideocontrolByOfferId (id: string) {
    return this.videocontrolList
      .find((el: IEnfortaVideocontrol) => el?.offer?.id === id)
  }

  getBlankVideocontrolFromPoint (point: ILocationOfferInfo): IEnfortaVideocontrol {
    return {
      id: '-',
      chars: {},
      locationId: point.id.toString(),
      cameras: {},
      // @ts-ignore
      offer: { ...point.offer },
      purchasedPrices: {
        recurrentTotal: {
          value: point.amount.value
        }
      }
    }
  }

  onPlugEnforta () {
    // заявка на менеджера
    this.isRequestModalVisible = true

    this.requestData = {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      services: 'Подключение видеонаблюдения',
      type: 'change',
      addressId: this.pointList[0].address.id,
      fulladdress: ''
    }
  }

  onAddCamera (payload: any) {
    // заявка на менеджера
    this.isRequestModalVisible = true

    this.requestData = {
      descriptionModal: 'Для подключения камеры необходимо сформировать заявку',
      services: 'Подключение камеры',
      type: 'connect',
      ...payload
    }
  }

  onCloseSuccess () {
    // TODO: reload data
  }
}
