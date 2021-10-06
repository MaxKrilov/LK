import Vue from 'vue'
import Component from 'vue-class-component'
import { ErtAutocomplete } from '@/components/UI2'

@Component<InstanceType<typeof ErtInstructionSelect>>({
  props: {
    ...ErtAutocomplete.options.props
  },
  watch: {
    search (val) {
      if (val.length >= 3) {
        this.fetchData(val)
      }

      // Hack
      if (!val) {
        this.internalValue = ''
      }
    }
  }
})
export default class ErtInstructionSelect extends Vue {
  // Props
  readonly value!: any

  // Data
  isLoading: boolean = false
  search: string | null = null
  addressSuggestions: string[] = []

  // Proxy
  get internalValue () {
    return this.value
  }

  set internalValue (val) {
    this.$emit('input', val)
  }

  // Methods
  fetchData (query: string | null) {
    if (query === null) return
    if (this.isLoading) return

    this.isLoading = true

    this.$store.dispatch('instructions/getSearchResultOfInstructions', query)
      .then((response) => {
        this.addressSuggestions = response
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
