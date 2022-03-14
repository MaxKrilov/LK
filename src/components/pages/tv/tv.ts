import { Vue, Component, Watch } from 'vue-property-decorator'
import TvSlider from '@/components/pages/tv/components/slider-content/index.vue'
import { mapGetters } from 'vuex'
import { IPointItem } from '@/components/pages/tv/tv.d.ts'
import { price } from '@/functions/filters'

const components = { TvSlider }

@Component({
  components,
  filters: {
    price
  },
  computed: {
    ...mapGetters({ billingAccountId: 'payments/getActiveBillingAccount' })
  } })
export default class TVMainPage extends Vue {
  billingAccountId!: string | number
  addressList: IPointItem[] = []
  isLoading: boolean = true
  suspendedStatusesList: string[] = ['Suspension passed PONR', 'Suspended']
  @Watch('billingAccountId')
  onBillingAccountIdChange (val: boolean) {
    if (val) {
      this.getPoints()
    }
  }
  get amountPrice () {
    return this.addressList.reduce((acc: number, el: IPointItem) => acc + Number(el.amount), 0)
  }
  getPoints () {
    this.isLoading = true
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'ТВ'
    }).then(answer => {
      if (answer.length) {
        this.addressList = answer.map((el: { id: string; fulladdress: string; bpi: string; status: string; amount: {value: string}, address: {id: string} }) => {
          return {
            fulladdress: el?.fulladdress,
            addressId: el?.address.id,
            bpi: el?.bpi,
            status: el?.status,
            amount: el?.amount?.value
          }
        })
      } else {
        this.$router.push('/lk/tv/promo')
      }
    })
      .finally(() => {
        this.isLoading = false
      })
  }

  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
