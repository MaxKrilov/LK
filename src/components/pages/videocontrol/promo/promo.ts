import { Vue, Component } from 'vue-property-decorator'
import featureList from './featureList'
import ErPromo from '@/components/blocks/ErPromo/index.vue'
import { PLUG_URL } from '@/constants/videocontrol'

const components = { ErPromo }

@Component({ components })
export default class VCPromoPage extends Vue {
  featureList = featureList
  link = PLUG_URL
}
