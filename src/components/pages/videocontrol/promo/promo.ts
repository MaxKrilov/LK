import { Vue, Component } from 'vue-property-decorator'
import featureList from './featureList'
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const components = { ErPromo }

@Component({ components })
export default class VCPromoPage extends Vue {
  featureList = featureList
  link = 'https://b2b.domru.ru/products/videonablyudenie'
}
