import { Vue, Component } from 'vue-property-decorator'
import featureList from './featureList'
import ErPromo from '@/components/blocks/ErPromo/index.vue'
import { PLUG_URL } from '@/constants/videocontrol'
import { VS_LOGIN_DEMO } from '@/constants/url'
import IPromoFeatureItem from '@/interfaces/promo-feature-item'

const components = { ErPromo }

@Component({ components })
export default class VCPromoPage extends Vue {
  featureList: IPromoFeatureItem[] = featureList
  link = PLUG_URL

  onClickDemo () {
    window.open(VS_LOGIN_DEMO)
  }
}
