import { Vue, Component } from 'vue-property-decorator'

const props = {
  value: String,
  label: String,
  name: String,
  hasFilter: Boolean
}

@Component({ props })
export default class AddressCheckbox extends Vue {
  onInput (event: boolean) {
    this.$emit('input', event)
  }
}
