import { Vue, Component } from 'vue-property-decorator'

const components = {}

const props = {
  cover: String,
  advantages: Array
}

@Component({ components, props })
export default class VCAddonDescription extends Vue {
}
