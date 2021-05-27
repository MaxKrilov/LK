import { Component } from 'vue-property-decorator'

import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import IpTransitPromo from './components/promo.vue'
import BlockWithIcon from './components/block-with-icon.vue'

import BillingAccountMixin from '@/mixins/BillingAccountMixin'
import { StoreGetter } from '@/functions/store'
import { CHARS, PRODUCT_CODE } from '@/constants/ip-transit'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

interface ISimplePoint {
  id: string
  bpi: string
  fulladdress: string
  offerName: string
  addressId: string
}

const STATUSES = {
  SUSPENSION_PONR: 'Suspension passed PONR',
  SUSPENDED: 'Suspended'
}

@Component({
  components: {
    ErListPoints,
    IpTransitPromo,
    BlockWithIcon,
    ErPlugProduct
  }
})
export default class IpTransitPage extends BillingAccountMixin {
  showIpPrefix: boolean = false
  isPointsLoaded: boolean = false
  isRequestModalVisible: boolean = false

  currentPoint: ISimplePoint | Record<string, any> = {}
  requestData: Record<string, any> = {}

  @StoreGetter('ipTransit/mappedPointList')
  pointList!: ISimplePoint[]

  get productTlo () {
    return this.$store.state.ipTransit.product?.tlo
  }

  get productSlo () {
    return this.$store.state.ipTransit.product?.slo?.find((el: Record<string, any>) => el.code === PRODUCT_CODE)
  }

  get tariffName (): string {
    return this.productTlo?.offer?.name
  }

  get clientASNumber (): string {
    return this.productSlo?.chars[CHARS.CLIENT_AS_NUMBER]
  }

  get accessSpeed (): string {
    return this.productTlo?.chars[CHARS.ACCESS_SPEED]
  }

  get tariffDate (): string {
    return this.productTlo?.actualStartDate
      ? this.$moment(this.productTlo.actualStartDate).format('DD.MM.YY')
      : ''
  }

  get tariffPrice (): string {
    return this.productTlo?.purchasedPrices?.recurrentTotal?.value
  }

  onChangeBillingAccountId () {
    this.$store.dispatch('ipTransit/pullPoints')
      .then(data => {
        this.isPointsLoaded = true
        this.$set(this, 'currentPoint', data[0])
        this.$store.dispatch('ipTransit/pullProduct', {
          parentIds: data.map((el: Record<string, any>) => el.bpi)
        })
      })
  }

  isSuspendedStatus (status: string) {
    const result = Object.values(STATUSES).includes(status)
    console.log(result, Object.values(STATUSES))
    return result
  }

  onIncreaseSpeed () {
    // заявка на менеджера
    this.isRequestModalVisible = true

    this.requestData = {
      descriptionModal: 'Для подключения услуги IP-Транзит необходимо сформировать заявку',
      services: 'Подключение IP-Транзит',
      type: 'create',
      addressId: this.currentPoint?.addressId || '',
      fulladdress: ''
    }
  }

  onSuspend () {
    // приостановка домена происходит через службу поддержки
    this.$router.push({
      name: 'support',
      query: { form: 'suspension_of_a_contract_or_service' }
    })
  }

  onCloseSuccess () {

  }
}
