import { Vue, Component } from 'vue-property-decorator'
import featureList from './featureList'
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const components = { ErPromo }

@Component({ components })
export default class ErTimePickerRange extends Vue {
  featureList = featureList
}
