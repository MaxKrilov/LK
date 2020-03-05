import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import TariffComponent from '@/components/pages/internet/blocks/TariffComponent/index.vue'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import ServicesComponent from '@/components/pages/internet/blocks/ServicesComponent/index.vue'
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue'
import { GET_DATA_FOR_INTERNET } from '@/store/actions/internet'
// eslint-disable-next-line no-unused-vars
import { API } from '@/functions/api'

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

  @Prop(String) readonly activePoint!: string

  tariffPrice: string | number = 0
  tariffCurrency: string = ''
  tariffSpeed: string | number = 0
  // tariffListAvailableSpeed: iTariffListAvailableSpeed = []

  @Watch('activePoint')
  onActivePointChange () {
    this.getInfoAbountProduct()
  }

  async getInfoAbountProduct () {
    await this.$store.dispatch(`internet/${GET_DATA_FOR_INTERNET}`, { api: this.$api, parentId: this.activePoint })
  }
}
