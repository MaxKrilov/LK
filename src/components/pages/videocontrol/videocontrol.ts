import { Component, Vue, Watch } from 'vue-property-decorator'
import { ILocationOfferInfo } from '@/tbapi'
import { PRODUCT_TYPES } from '@/constants/videocontrol'
import { mapGetters } from 'vuex'

@Component({
  props: {
    type: String
  },
  computed: {
    ...mapGetters({ billingAccountId: 'user/getActiveBillingAccount' })
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
    if (this.billingAccountId) {
      this.fetchData()
    }
  }

  @Watch('billingAccountId')
  onBillingAccountIdChange (value: any) {
    if (value) {
      this.fetchData()
    }
  }

  cleanupData () {
    this.$store.commit('videocontrol/SET_DOMAINS', {})
    this.$store.commit('videocontrol/SET_DOMAINS_IS_LOADED', false)
  }

  fetchData () {
    this.pullPoints()
      .then(data => {
        const parentIds = data.map((el: ILocationOfferInfo) => el.bpi)

        this.cleanupData()

        if (parentIds.length) {
          this.$store.dispatch(
            'videocontrol/pullForpostDomainRegistry',
            { api: this.$api, parentIds }
          )
        } else {
          this.$store.commit('videocontrol/SET_DOMAINS_IS_LOADED', true)
        }
      })
  }

  beforeDestroy () {
    this.$store.dispatch('videocontrol/cleanupPoints')
  }
}
