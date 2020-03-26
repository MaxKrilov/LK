import { Vue, Component, Prop } from 'vue-property-decorator'
import TariffComponent from '@/components/pages/internet/blocks/TariffComponent/index.vue'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import ServicesComponent from '@/components/pages/internet/blocks/ServicesComponent/index.vue'
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue'
// eslint-disable-next-line no-unused-vars
import { API } from '@/functions/api'
import { ICustomerProduct } from '@/tbapi'

export interface iPointItem {
  id: string | number,
  fulladdress: string,
  bpi: string | number,
  offerName: string
}

@Component({
  components: {
    TariffComponent,
    SpeedComponent,
    ServicesComponent,
    PriceServicesComponent
  }
})
export default class IndexPage extends Vue {
  $api!: API

  @Prop(Object) readonly customerProduct!: null | ICustomerProduct

  tariffPrice: string | number = 0
  tariffCurrency: string = ''
  tariffSpeed: string | number = 0
}
