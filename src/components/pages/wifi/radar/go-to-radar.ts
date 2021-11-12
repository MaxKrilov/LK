import { Component, Vue, Watch } from 'vue-property-decorator'
import BillingInfoMixin from '@/mixins/BillingInfoMixin'

const RADAR_FIELDS_ORDER = [
  'clientId',
  'INN',
  'dmpCustomerId',
  'brand',
  'billingAccountId',
  'market',
  'clientName',
  /* TODO: менеджерские поля
  'cityId',
  'email',
   */
  'role'
]

@Component({})
export default class GoToRadar extends BillingInfoMixin {
  isLoading: boolean = true

  data = {}
  radarLink: string = ''
  fieldsOrder: string[] = RADAR_FIELDS_ORDER

  get isDataNotEmpty (): boolean {
    return !!Object.keys(this.data || {}).length
  }

  radarForm!: HTMLFormElement | null

  mounted () {
    // ref не работает
    this.radarForm = document.querySelector('#radar-form')
  }

  @Watch('data')
  onDataChanged () {
    if (this.isDataNotEmpty) {
      this.$nextTick(() => {
        if (this.radarForm) {
          this.radarForm.submit()
        }
      })
    }
  }

  onBillingInfoChanged () {
    return this.$store.dispatch('wifi/getRadarLink')
      .then(response => {
        location.href = response.data
        // this.radarLink = response.data
        this.isLoading = false

        Vue.set(this, 'data', response.payload)
        Vue.set(this, 'radarLink', response.data)
      })
  }
}
