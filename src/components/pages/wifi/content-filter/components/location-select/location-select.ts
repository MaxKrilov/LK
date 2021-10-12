import { Vue, Component } from 'vue-property-decorator'
import AddressCheckbox from '../address-checkbox/index.vue'

const props = {
  list: Array,
  multiple: Boolean
}
const components = {
  AddressCheckbox
}

@Component({ props, components })
export default class LocationSelect extends Vue {
  onInput (event: any) {
    this.$emit('input', event)
  }
}
