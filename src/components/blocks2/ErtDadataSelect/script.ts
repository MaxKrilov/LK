import Vue from 'vue'
import Component from 'vue-class-component'
import { apiDadata } from '@/functions/api'
import { IDadataAddressSuggestions } from '@/tbapi/address'
import { ErtAutocomplete } from '@/components/UI2'

@Component<InstanceType<typeof ErtDadataSelect>>({
  props: {
    ...ErtAutocomplete.options.props
  },
  watch: {
    search (val) {
      this.fetchDadata(val)

      // Hack
      if (!val) {
        this.internalValue = ''
      }
    }
  }
})
export default class ErtDadataSelect extends Vue {
  // Props
  readonly value!: any

  // Data
  isLoading: boolean = false
  search: string | null = null
  addressSuggestions: IDadataAddressSuggestions[] = []

  // Proxy
  get internalValue () {
    return this.value
  }

  set internalValue (val) {
    this.$emit('input', val)
  }

  // Methods
  fetchDadata (query: string | null) {
    if (query === null) return
    if (this.isLoading) return

    this.isLoading = true

    apiDadata({
      query,
      count: 5
    })
      .then(response => {
        this.addressSuggestions = (response as any).suggestions as IDadataAddressSuggestions[]
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
