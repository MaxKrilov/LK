import { Component, Vue } from 'vue-property-decorator'
import { IEnfortaCamera } from '@/interfaces/videocontrol'
import { getNoun } from '@/functions/helper'

const props = {
  id: String,
  chars: {},
  locationId: String,
  cameras: {},
  purchasedPrices: {},
  offer: {},
  point: {}
}

@Component({ props })
export default class EnfortaVideocontrol extends Vue {
  cameraSearchQuery: string = ''
  isVisibleSearchField: boolean = false

  get tariffName () {
    return this.$props?.offer?.name || ''
  }

  get tariffPrice () {
    return this.$props.purchasedPrices?.recurrentTotal?.value
  }

  get cameraList () {
    return Object.values(this.$props?.cameras || {})
  }

  get linkToEnfortaPortal () {
    return 'https://video.enforta.ru/'
  }

  getCameraServiceCount (camera: IEnfortaCamera) {
    return Object.keys(camera?.services || {}).length
  }

  getServicePlural (count: number) {
    return getNoun(count, '', 'а', 'ов')
  }

  linkToEdit (id: string) {
    return `/lk/videocontrol/enforta/camera/${id}`
  }

  onClickPause () {
    // приостановка происходит через службу поддержки
    this.$router.push({
      name: 'support',
      query: { form: 'suspension_of_a_contract_or_service' }
    })
  }

  onAddCamera () {
    const { address, fulladdress } = this.$props.point

    this.$emit('addCamera', {
      addressId: address.id,
      fulladdress
    })
  }
}
