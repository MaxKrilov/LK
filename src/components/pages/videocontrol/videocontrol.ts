import { Component, Vue, Watch } from 'vue-property-decorator'
import { ILocationOfferInfo } from '@/tbapi'
import { PRODUCT_TYPES } from '@/constants/videocontrol'
import { mapGetters } from 'vuex'

@Component({
  props: {
    type: String
  },
  computed: {
    ...mapGetters({ billingAccountId: 'payments/getActiveBillingAccount' })
  }
})
export default class VCTemplate extends Vue {
  billingAccountId!: any

  get productType (): string {
    return PRODUCT_TYPES?.[this.$props.type]
  }

  pullPoints () {
    return this.$store.dispatch(
      'videocontrol/pullPoints',
      {
        api: this.$api,
        productType: this.productType || PRODUCT_TYPES.forpost
      }
    )
  }

  created () {
    this.$store.dispatch('videocontrol/setProductType', this.$props.type)

    if (this.billingAccountId) {
      this.fetchData()
    }
  }

  @Watch('productType')
  onProductTypeChanged () {
    this.$store.dispatch('videocontrol/setProductType', this.$props.type)
    this.fetchData()
  }

  @Watch('billingAccountId')
  onBillingAccountIdChange (value: any) {
    if (value) {
      this.fetchData()
    }
  }

  cleanupData () {
    this.$store.commit('videocontrol/SET_DOMAINS', {})
    this.$store.dispatch('videocontrol/setVCDataIsLoaded', false)
  }

  fetchData () {
    this.pullPoints()
      .then(data => {
        const parentIds = data.map(({ bpi }: ILocationOfferInfo) => bpi)

        this.cleanupData()

        if (parentIds.length) {
          if (this.$props.type === 'forpost') {
            this.$store.dispatch(
              'videocontrol/pullForpostDomainRegistry',
              { api: this.$api, parentIds }
            )
          } else if (this.$props.type === 'enforta') {
            this.$store.dispatch(
              'videocontrol/pullEnfortaRegistry',
              { api: this.$api, parentIds }
            )
          }
          this.$store.dispatch('videocontrol/setEnfortaDataIsLoaded')
        } else {
          this.$store.dispatch('videocontrol/setVCDataIsLoaded', true)
        }
      })
  }

  beforeDestroy () {
    this.$store.dispatch('videocontrol/cleanupPoints')
    this.$store.dispatch('videocontrol/setProductType', '')
  }
}
